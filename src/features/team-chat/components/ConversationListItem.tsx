import { cn } from '@/lib/utils'
import type { Conversation } from '@/types'
import { userList } from '@/data/users'
import {
  getConversationAvatarSeed,
  getConversationTitle,
  isUserOnline,
} from '../utils/conversationHelpers'
import { Users as UsersIcon } from 'lucide-react'

interface ConversationListItemProps {
  conv: Conversation
  currentUserId: string | undefined
  active: boolean
  unread: number
  onSelect: (id: string) => void
}

function formatTimeShort(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) {
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000))
    if (diffDays < 7) {
      return d.toLocaleDateString('id-ID', { weekday: 'short' })
    }
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

export function ConversationListItem({
  conv,
  currentUserId,
  active,
  unread,
  onSelect,
}: ConversationListItemProps) {
  const title = getConversationTitle(conv, currentUserId, userList)
  const seed = getConversationAvatarSeed(conv, currentUserId, userList)
  const isGroup = conv.kind === 'group'

  const otherUser = !isGroup
    ? userList.find((u) => u.id === conv.participantIds.find((id) => id !== currentUserId))
    : undefined
  const online = isUserOnline(otherUser)

  return (
    <button
      type="button"
      onClick={() => onSelect(conv.id)}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all',
        active
          ? 'bg-primary/10 text-foreground ring-primary/20 font-semibold shadow-2xs ring-1'
          : 'hover:bg-muted/60 text-foreground/90',
      )}
    >
      {/* Active Left Indicator Pill */}
      {active && <span className="bg-primary absolute top-2 bottom-2 left-0 w-1 rounded-r-full" />}

      {/* Avatar with Status Dot or Group Icon */}
      <div className="relative shrink-0">
        <span
          className={cn(
            'flex size-10 items-center justify-center rounded-xl text-xs font-bold shadow-2xs',
            isGroup
              ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
              : 'bg-primary/15 text-primary',
          )}
        >
          {seed}
        </span>
        {isGroup ? (
          <span className="ring-card absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs ring-2">
            <UsersIcon className="size-2.5" />
          </span>
        ) : (
          <span
            className={cn(
              'ring-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2',
              online ? 'bg-safe' : 'bg-muted-foreground/40',
            )}
          />
        )}
      </div>

      {/* Conversation Preview */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={cn(
              'truncate text-xs',
              unread > 0 || active ? 'text-foreground font-bold' : 'text-foreground/90 font-medium',
            )}
          >
            {title}
          </span>
          <span className="text-muted-foreground/80 shrink-0 text-[10px] tabular-nums">
            {formatTimeShort(conv.lastActivityAt)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-1.5">
          <p
            className={cn(
              'line-clamp-1 flex-1 text-[11px] leading-tight',
              unread > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground',
            )}
          >
            {conv.lastMessagePreview ?? '\u2014'}
          </p>
          {unread > 0 && (
            <span className="bg-primary text-primary-foreground shadow-primary/20 inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold tabular-nums shadow-sm">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
