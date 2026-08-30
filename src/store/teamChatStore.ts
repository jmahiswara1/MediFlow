import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AttachedCard,
  ChatMention,
  Conversation,
  ConversationKind,
  TeamChatMessage,
} from '@/types'
import { conversationSeed, messageSeed } from '@/data/teamChatSeed'
import { broadcastTeamChat } from '@/features/team-chat/utils/broadcast'

const MAX_MESSAGES_PER_CONV = 500
const MAX_CONVERSATIONS_PER_USER = 30

function genId(prefix: string): string {
  return `${prefix}-${String(Date.now()).slice(-6)}-${Math.floor(Math.random() * 1000)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function trimPreview(text?: string): string {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > 90 ? `${t.slice(0, 87)}\u2026` : t
}

interface SendMessageParams {
  conversationId: string
  senderId: string
  text?: string
  mentions?: ChatMention[]
  attachments?: AttachedCard[]
}

interface CreateGroupParams {
  name: string
  description?: string
  memberIds: string[]
  createdBy: string
}

interface TeamChatState {
  conversations: Conversation[]
  messages: TeamChatMessage[]

  // Conversation ops
  getOrCreateDm: (otherUserId: string, currentUserId: string) => string
  createGroup: (params: CreateGroupParams) => string
  leaveConversation: (conversationId: string, userId: string) => void
  renameGroup: (conversationId: string, name: string) => void

  // Message ops
  sendMessage: (params: SendMessageParams) => string
  editMessage: (id: string, text: string) => void
  deleteMessage: (id: string) => void

  // Read state
  markRead: (conversationId: string, userId: string) => void
}

function applyNewMessage(
  state: TeamChatState,
  params: SendMessageParams,
): {
  message: TeamChatMessage
  nextConversations: Conversation[]
  nextMessages: TeamChatMessage[]
} {
  const message: TeamChatMessage = {
    id: genId('msg'),
    conversationId: params.conversationId,
    senderId: params.senderId,
    text: params.text?.trim() || undefined,
    mentions: params.mentions,
    attachments: params.attachments,
    createdAt: nowIso(),
  }

  const nextMessages = [...state.messages, message]

  // Trim per conversation FIFO
  const trimmedMessages = (() => {
    const byConv = new Map<string, TeamChatMessage[]>()
    for (const m of nextMessages) {
      const list = byConv.get(m.conversationId) ?? []
      list.push(m)
      byConv.set(m.conversationId, list)
    }
    const flat: TeamChatMessage[] = []
    for (const [, list] of byConv) {
      if (list.length > MAX_MESSAGES_PER_CONV) {
        flat.push(...list.slice(-MAX_MESSAGES_PER_CONV))
      } else {
        flat.push(...list)
      }
    }
    return flat.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  })()

  const nextConversations = state.conversations.map((c) =>
    c.id === params.conversationId
      ? {
          ...c,
          lastActivityAt: message.createdAt,
          lastMessagePreview: trimPreview(message.text ?? message.attachments?.[0]?.type),
        }
      : c,
  )

  return { message, nextConversations, nextMessages: trimmedMessages }
}

export const useTeamChatStore = create<TeamChatState>()(
  persist(
    (set, get) => ({
      conversations: conversationSeed,
      messages: messageSeed,

      getOrCreateDm: (otherUserId, currentUserId) => {
        const existing = get().conversations.find(
          (c) =>
            c.kind === ('dm' as ConversationKind) &&
            c.participantIds.length === 2 &&
            c.participantIds.includes(otherUserId) &&
            c.participantIds.includes(currentUserId),
        )
        if (existing) return existing.id

        const id = genId('conv')
        const now = nowIso()
        const newConv: Conversation = {
          id,
          kind: 'dm',
          participantIds: [currentUserId, otherUserId],
          createdBy: currentUserId,
          createdAt: now,
          lastActivityAt: now,
          members: [
            { userId: currentUserId, joinedAt: now, lastReadAt: now },
            { userId: otherUserId, joinedAt: now, lastReadAt: now },
          ],
        }
        set((state) => ({
          conversations: [newConv, ...state.conversations].slice(0, 500),
        }))
        broadcastTeamChat({ type: 'conversation:new', payload: { conversationId: id } })
        return id
      },

      createGroup: (params) => {
        const id = genId('conv')
        const now = nowIso()
        const participants = Array.from(new Set([params.createdBy, ...params.memberIds]))
        const avatarSeed =
          params.name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0]?.toUpperCase() ?? '')
            .join('') || 'GR'
        const newConv: Conversation = {
          id,
          kind: 'group',
          participantIds: participants,
          name: params.name.trim(),
          description: params.description?.trim() || undefined,
          avatarSeed,
          createdBy: params.createdBy,
          createdAt: now,
          lastActivityAt: now,
          members: participants.map((uid) => ({ userId: uid, joinedAt: now, lastReadAt: now })),
        }
        set((state) => ({
          conversations: [newConv, ...state.conversations].slice(0, 500),
        }))
        broadcastTeamChat({ type: 'conversation:new', payload: { conversationId: id } })
        return id
      },

      leaveConversation: (conversationId, userId) => {
        set((state) => ({
          conversations: state.conversations
            .map((c) => {
              if (c.id !== conversationId) return c
              if (c.kind !== 'group') return c // DM cannot be left, must be deleted
              return {
                ...c,
                participantIds: c.participantIds.filter((id) => id !== userId),
                members: c.members.filter((m) => m.userId !== userId),
              }
            })
            .filter((c) => !(c.kind === 'group' && c.participantIds.length === 0)),
        }))
        broadcastTeamChat({ type: 'conversation:leave', payload: { conversationId, userId } })
      },

      renameGroup: (conversationId, name) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId && c.kind === 'group' ? { ...c, name: name.trim() } : c,
          ),
        }))
        broadcastTeamChat({ type: 'conversation:update', payload: { conversationId } })
      },

      sendMessage: (params) => {
        const { message, nextConversations, nextMessages } = applyNewMessage(get(), params)
        set({ conversations: nextConversations, messages: nextMessages })
        broadcastTeamChat({
          type: 'message:new',
          payload: { conversationId: message.conversationId, messageId: message.id },
        })
        return message.id
      },

      editMessage: (id, text) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, text: text.trim(), editedAt: nowIso() } : m,
          ),
        }))
        broadcastTeamChat({ type: 'message:edit', payload: { messageId: id } })
      },

      deleteMessage: (id) => {
        let convId: string | undefined
        set((state) => {
          const target = state.messages.find((m) => m.id === id)
          convId = target?.conversationId
          const remaining = state.messages.filter((m) => m.id !== id)
          // Update last preview if this was the latest message
          const nextConversations = convId
            ? state.conversations.map((c) => {
                if (c.id !== convId) return c
                const last = [...remaining]
                  .filter((m) => m.conversationId === convId)
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
                return {
                  ...c,
                  lastActivityAt: last?.createdAt ?? c.lastActivityAt,
                  lastMessagePreview: trimPreview(last?.text),
                }
              })
            : state.conversations
          return { messages: remaining, conversations: nextConversations }
        })
        if (convId) {
          broadcastTeamChat({
            type: 'message:delete',
            payload: { messageId: id, conversationId: convId },
          })
        }
      },

      markRead: (conversationId, userId) => {
        const now = nowIso()
        let didUpdate = false
        set((state) => {
          const conv = state.conversations.find((c) => c.id === conversationId)
          if (!conv) return state

          const convMessages = state.messages.filter((m) => m.conversationId === conversationId)
          let latestTime = now
          for (const m of convMessages) {
            if (m.createdAt > latestTime) {
              latestTime = m.createdAt
            }
          }

          const member = conv.members.find((m) => m.userId === userId)
          if (member && member.lastReadAt && member.lastReadAt >= latestTime) {
            return state
          }

          didUpdate = true
          return {
            conversations: state.conversations.map((c) => {
              if (c.id !== conversationId) return c
              return {
                ...c,
                members: c.members.map((m) =>
                  m.userId === userId ? { ...m, lastReadAt: latestTime } : m,
                ),
              }
            }),
          }
        })
        if (didUpdate) {
          broadcastTeamChat({ type: 'read:update', payload: { conversationId, userId } })
        }
      },
    }),
    {
      name: 'mediflow-team-chat',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure seed messages present if persisted state has none
          if (state.messages.length === 0) {
            state.messages = messageSeed
          }
          if (state.conversations.length === 0) {
            state.conversations = conversationSeed
          }
        }
      },
    },
  ),
)

// === Selector helpers ===

export const useConversationsForUser = (userId: string | undefined) => {
  const conversations = useTeamChatStore((s) => s.conversations)
  return useMemo(
    () =>
      userId
        ? conversations
            .filter((c) => c.participantIds.includes(userId))
            .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
        : [],
    [conversations, userId],
  )
}

export const useMessagesForConversation = (conversationId: string | undefined) => {
  const messages = useTeamChatStore((s) => s.messages)
  return useMemo(
    () => (conversationId ? messages.filter((m) => m.conversationId === conversationId) : []),
    [messages, conversationId],
  )
}

export const useUnreadByConversation = (userId: string | undefined) => {
  const conversations = useTeamChatStore((s) => s.conversations)
  const messages = useTeamChatStore((s) => s.messages)
  return useMemo(() => {
    if (!userId) return {} as Record<string, number>
    const result: Record<string, number> = {}
    for (const c of conversations) {
      if (!c.participantIds.includes(userId)) continue
      const member = c.members.find((m) => m.userId === userId)
      const lastRead = member?.lastReadAt ?? c.createdAt
      const unread = messages.filter(
        (m) => m.conversationId === c.id && m.createdAt > lastRead && m.senderId !== userId,
      ).length
      result[c.id] = unread
    }
    return result
  }, [conversations, messages, userId])
}

export const useTotalUnreadForUser = (userId: string | undefined) => {
  const conversations = useTeamChatStore((s) => s.conversations)
  const messages = useTeamChatStore((s) => s.messages)
  return useMemo(() => {
    if (!userId) return 0
    let total = 0
    for (const c of conversations) {
      if (!c.participantIds.includes(userId)) continue
      const member = c.members.find((m) => m.userId === userId)
      const lastRead = member?.lastReadAt ?? c.createdAt
      total += messages.filter(
        (m) => m.conversationId === c.id && m.createdAt > lastRead && m.senderId !== userId,
      ).length
    }
    return total
  }, [conversations, messages, userId])
}

// Cap total conversations in store (FIFO by lastActivityAt) - exposed for future pruning hook.
export const TEAM_CHAT_LIMITS = {
  maxMessagesPerConv: MAX_MESSAGES_PER_CONV,
  maxConversationsPerUser: MAX_CONVERSATIONS_PER_USER,
} as const
