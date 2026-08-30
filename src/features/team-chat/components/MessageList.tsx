import { useEffect, useRef } from 'react'
import { MessageSquare } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { userList } from '@/data/users'
import type { TeamChatMessage } from '@/types'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: TeamChatMessage[]
  currentUserId: string | undefined
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

function formatDateSeparator(
  iso: string,
  todayLabel: string,
  yesterdayLabel: string,
  lang: string,
): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ''
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return todayLabel

    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return yesterdayLabel

    return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function MessageList({ messages, currentUserId, onEdit, onDelete }: MessageListProps) {
  const { t, locale } = useI18n()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-xs">
        <MessageSquare className="size-10 opacity-20" />
        <p className="font-semibold">{t('teamChat.noMessages')}</p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 scrollbar-thin flex-col gap-2.5 overflow-y-auto px-3 py-4 sm:px-5">
      {messages.map((m, idx) => {
        const prev = idx > 0 ? messages[idx - 1] : null
        const currDate = new Date(m.createdAt).toDateString()
        const prevDate = prev ? new Date(prev.createdAt).toDateString() : null
        const isNewDay = currDate !== prevDate

        const isConsecutive =
          !isNewDay &&
          prev !== null &&
          prev.senderId === m.senderId &&
          new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000

        const sender = userList.find((u) => u.id === m.senderId)
        const isMine = currentUserId === m.senderId

        return (
          <div key={m.id} className="flex flex-col gap-2.5">
            {/* Date Group Divider Pill */}
            {isNewDay && (
              <div className="my-2 flex items-center justify-center">
                <span className="bg-muted/80 text-muted-foreground border-border/60 inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide shadow-2xs">
                  {formatDateSeparator(
                    m.createdAt,
                    t('teamChat.today'),
                    t('teamChat.yesterday'),
                    locale,
                  )}
                </span>
              </div>
            )}

            <MessageBubble
              message={m}
              sender={sender}
              isMine={isMine}
              isConsecutive={isConsecutive}
              onEdit={isMine ? onEdit : undefined}
              onDelete={isMine ? onDelete : undefined}
            />
          </div>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
