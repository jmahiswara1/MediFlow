import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import {
  useConversationsForUser,
  useCurrentUser,
  useMessagesForConversation,
  useTeamChatStore,
} from '@/store'
import { useNotificationStore } from '@/store/notificationStore'
import type { AttachedCard, ChatMention, Conversation, TeamChatMessage } from '@/types'
import { ConversationList } from './components/ConversationList'
import { ConversationHeader } from './components/ConversationHeader'
import { ProfileCard } from './components/ProfileCard'
import { MessageList } from './components/MessageList'
import { MessageComposer } from './components/MessageComposer'
import { ParticipantsList } from './components/ParticipantsList'
import { NewChatDialog } from './components/NewChatDialog'
import { NewGroupDialog } from './components/NewGroupDialog'
import { EmptyChatState } from './components/EmptyChatState'

export function TeamChatPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useCurrentUser()
  const conversations = useConversationsForUser(user?.id)
  const sendMessage = useTeamChatStore((s) => s.sendMessage)
  const editMessage = useTeamChatStore((s) => s.editMessage)
  const deleteMessage = useTeamChatStore((s) => s.deleteMessage)
  const markRead = useTeamChatStore((s) => s.markRead)
  const addNotification = useNotificationStore((s) => s.addNotification)

  const [newChatOpen, setNewChatOpen] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)

  const activeConversation: Conversation | undefined = useMemo(() => {
    const urlId = searchParams.get('c')
    if (urlId) return conversations.find((c) => c.id === urlId)
    return conversations[0]
  }, [conversations, searchParams])

  const messages: TeamChatMessage[] = useMessagesForConversation(activeConversation?.id)

  const activeConvId = activeConversation?.id
  const userId = user?.id

  // Mark as read when active conversation opens
  useEffect(() => {
    if (activeConvId && userId) {
      markRead(activeConvId, userId)
    }
  }, [activeConvId, userId, markRead])

  // Auto-write first conversation to URL when none is set (mount-only, no cascade)
  useEffect(() => {
    if (!searchParams.get('c') && conversations[0]) {
      const next = new URLSearchParams(searchParams)
      next.set('c', conversations[0].id)
      setSearchParams(next, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelect = (id: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('c', id)
    setSearchParams(next, { replace: true })
    if (user) markRead(id, user.id)
  }

  const handleSend = (params: {
    text?: string
    mentions?: ChatMention[]
    attachments?: AttachedCard[]
  }) => {
    if (!user || !activeConversation) return
    sendMessage({
      conversationId: activeConversation.id,
      senderId: user.id,
      text: params.text,
      mentions: params.mentions,
      attachments: params.attachments,
    })
    if (params.mentions) {
      for (const m of params.mentions) {
        if (m.kind !== 'user') continue
        if (m.refId === user.id) continue
        addNotification({
          userId: m.refId,
          type: 'chat-mention',
          title: `${user.name} menyebut Anda`,
          snippet: params.text?.slice(0, 80) ?? '',
          link: `/chat?c=${activeConversation.id}`,
        })
      }
    }
  }

  const handleEdit = (id: string, text: string) => {
    editMessage(id, text)
  }

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm(t('teamChat.deleteConfirmTitle'))) {
      return
    }
    deleteMessage(id)
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">
        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden lg:col-span-3">
          <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-xs">
            <ProfileCard />
          </div>
          <div className="min-h-0 flex-1">
            <ConversationList
              activeId={activeConversation?.id ?? null}
              onSelect={handleSelect}
              onNewChat={() => setNewChatOpen(true)}
              onNewGroup={() => setNewGroupOpen(true)}
            />
          </div>
        </div>

        <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden lg:col-span-6">
          {activeConversation ? (
            <>
              <ConversationHeader
                conv={activeConversation}
                currentUserId={user?.id}
                onBack={() => navigate('/chat')}
              />
              <div className="bg-card border-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-xs">
                <div className="min-h-0 flex-1">
                  <MessageList
                    messages={messages}
                    currentUserId={user?.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
                <div className="shrink-0 p-2 sm:p-3">
                  <MessageComposer
                    conversation={activeConversation}
                    currentUserId={user?.id}
                    onSend={handleSend}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card border-border flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-xs">
              <EmptyChatState />
            </div>
          )}
        </div>

        {/* Right Column: Split Info (Upper: Summary & Action, Lower: Participants) */}
        <div className="hidden h-full min-h-0 flex-col gap-3 overflow-hidden lg:col-span-3 lg:flex">
          <div className="bg-card border-border/80 flex min-h-0 flex-1 scrollbar-thin flex-col gap-4 overflow-y-auto rounded-2xl border p-3.5 shadow-xs">
            {activeConversation ? (
              <>
                {/* 1. Upper: Conversation Summary & Integrated Action */}
                <div className="flex flex-col gap-3">
                  <div className="bg-muted/40 border-border/60 space-y-2 rounded-xl border p-3">
                    <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      {t('teamChat.summaryTitle')}
                    </p>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t('teamChat.chatType')}:</span>
                        <span className="font-bold">
                          {activeConversation.kind === 'group'
                            ? t('teamChat.groupMultiHospital')
                            : t('teamChat.directMessage')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {t('teamChat.totalMessages')}:
                        </span>
                        <span className="font-bold tabular-nums">{messages.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{t('teamChat.members')}:</span>
                        <span className="font-bold tabular-nums">
                          {activeConversation.participantIds.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Integrated Medical Transfer Shortcut for 1-on-1 */}
                  {activeConversation.kind === 'dm' && (
                    <div className="bg-primary/5 border-primary/20 space-y-2 rounded-xl border p-3">
                      <p className="text-primary text-[10px] font-bold tracking-wider uppercase">
                        {t('teamChat.integratedAction')}
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {t('teamChat.integratedActionDesc')}
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/network')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold shadow-xs transition-colors"
                      >
                        <span>{t('teamChat.openNetworkMap')}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-border/60 border-t" />

                {/* 2. Lower: Team Participants List */}
                <div className="min-h-0 flex-1">
                  <ParticipantsList conversation={activeConversation} />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground px-1 text-xs">{t('teamChat.empty')}</p>
            )}
          </div>
        </div>
      </div>

      <NewChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} onCreated={handleSelect} />
      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} onCreated={handleSelect} />
    </div>
  )
}
