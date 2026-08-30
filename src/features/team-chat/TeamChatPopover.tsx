import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Maximize2, MessageSquare, Plus, X } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import {
  useConversationsForUser,
  useCurrentUser,
  useMessagesForConversation,
  useTeamChatStore,
} from '@/store'
import { useNotificationStore } from '@/store/notificationStore'
import type { ChatMention, Conversation } from '@/types'
import { ConversationList } from './components/ConversationList'
import { MessageComposer } from './components/MessageComposer'
import { MessageList } from './components/MessageList'
import { NewChatDialog } from './components/NewChatDialog'
import { NewGroupDialog } from './components/NewGroupDialog'
import { EmptyChatState } from './components/EmptyChatState'
import { userList } from '@/data/users'
import { getConversationTitle, isUserOnline } from './utils/conversationHelpers'

interface TeamChatPopoverProps {
  open: boolean
  onClose: () => void
}

export function TeamChatPopover({ open, onClose }: TeamChatPopoverProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)
  const user = useCurrentUser()
  const conversations = useConversationsForUser(user?.id)
  const sendMessage = useTeamChatStore((s) => s.sendMessage)
  const markRead = useTeamChatStore((s) => s.markRead)
  const addNotification = useNotificationStore((s) => s.addNotification)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<'chat' | 'list'>('chat')
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [newGroupOpen, setNewGroupOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement
        if (target.closest('[data-fab-chat]')) return
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, onClose])

  const activeConversation: Conversation | undefined = useMemo(
    () => (activeId ? conversations.find((c) => c.id === activeId) : conversations[0]),
    [conversations, activeId],
  )

  const activeConvId = activeConversation?.id
  const userId = user?.id
  const messages = useMessagesForConversation(activeConvId)

  useEffect(() => {
    if (open && activeConvId && userId) {
      markRead(activeConvId, userId)
    }
  }, [open, activeConvId, userId, markRead])

  const handleSelect = (id: string) => {
    setActiveId(id)
    setView('chat')
    if (user) markRead(id, user.id)
  }

  const handleSend = (params: { text?: string; mentions?: ChatMention[] }) => {
    if (!user || !activeConversation) return
    sendMessage({
      conversationId: activeConversation.id,
      senderId: user.id,
      text: params.text,
      mentions: params.mentions,
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

  const handleExpand = () => {
    onClose()
    if (activeConversation) {
      navigate(`/chat?c=${activeConversation.id}`)
    } else {
      navigate('/chat')
    }
  }

  if (!open) return null

  const isGroup = activeConversation?.kind === 'group'
  const otherUser =
    activeConversation && !isGroup
      ? userList.find((u) => u.id === activeConversation.participantIds.find((id) => id !== userId))
      : undefined
  const online = isUserOnline(otherUser)
  const chatTitle = activeConversation
    ? getConversationTitle(activeConversation, userId, userList)
    : t('teamChat.title')

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={t('teamChat.title')}
      className="bg-card border-border/80 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 fixed right-4 bottom-19 z-50 flex h-[min(600px,calc(100vh-6.5rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-xl md:right-6 md:bottom-22"
    >
      {/* Header Bar */}
      <div className="border-border/70 bg-card/90 flex h-13 shrink-0 items-center justify-between border-b px-3 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-2">
          {view === 'chat' && (
            <button
              type="button"
              onClick={() => setView('list')}
              className="hover:bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg transition-colors"
              aria-label="Daftar obrolan"
              title="Daftar obrolan"
            >
              <ChevronLeft className="size-4.5" />
            </button>
          )}
          {view === 'list' && (
            <span className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg shadow-2xs">
              <MessageSquare className="size-3.5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-foreground truncate text-xs leading-tight font-bold">
              {view === 'chat' ? chatTitle : t('teamChat.title')}
            </p>
            {view === 'chat' && (
              <p className="text-muted-foreground truncate text-[10px]">
                {isGroup ? (
                  `${activeConversation?.participantIds.length} ${t('teamChat.members')}`
                ) : online ? (
                  <span className="text-safe font-medium">{t('teamChat.online')}</span>
                ) : (
                  <span>{t('teamChat.offline')}</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {view === 'list' && (
            <button
              type="button"
              onClick={() => setNewChatOpen(true)}
              className="hover:bg-muted text-muted-foreground flex size-7.5 items-center justify-center rounded-lg transition-colors"
              aria-label={t('teamChat.newChat')}
              title={t('teamChat.newChat')}
            >
              <Plus className="size-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleExpand}
            className="hover:bg-muted text-muted-foreground flex size-7.5 items-center justify-center rounded-lg transition-colors"
            aria-label={t('teamChat.openFullChat')}
            title={t('teamChat.openFullChat')}
          >
            <Maximize2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="hover:bg-muted text-muted-foreground flex size-7.5 items-center justify-center rounded-lg transition-colors"
            aria-label={t('topBar.closeMenu')}
            title={t('topBar.closeMenu')}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {view === 'list' ? (
          <div className="min-h-0 flex-1 overflow-hidden p-2">
            <ConversationList
              activeId={activeId}
              onSelect={handleSelect}
              onNewChat={() => setNewChatOpen(true)}
              onNewGroup={() => setNewGroupOpen(true)}
            />
          </div>
        ) : activeConversation ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1">
              <MessageList
                messages={messages}
                currentUserId={user?.id}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
            <div className="shrink-0 p-2">
              <MessageComposer
                conversation={activeConversation}
                currentUserId={user?.id}
                onSend={handleSend}
                compact
              />
            </div>
          </div>
        ) : (
          <EmptyChatState compact />
        )}
      </div>

      <NewChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} onCreated={handleSelect} />
      <NewGroupDialog open={newGroupOpen} onOpenChange={setNewGroupOpen} onCreated={handleSelect} />
    </div>
  )
}
