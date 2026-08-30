import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { useStockStore, useTransferStore } from '@/store'
import { userList } from '@/data/users'
import type { Hospital, Medicine, TeamChatMessage, TransferRequest, User } from '@/types'
import { parseMentions } from '../utils/mentionParser'
import { AttachmentCard } from './AttachmentCard'

interface MessageBubbleProps {
  message: TeamChatMessage
  sender: User | undefined
  isMine: boolean
  isConsecutive: boolean
  onEdit?: (id: string, text: string) => void
  onDelete?: (id: string) => void
}

function MentionChip({ kind, label, href }: { kind: string; label: string; href?: string }) {
  const Wrapper: keyof React.JSX.IntrinsicElements = href ? 'a' : 'span'

  const toneClass = (() => {
    switch (kind) {
      case 'user':
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/25 hover:bg-sky-500/25'
      case 'medicine':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/25'
      case 'hospital':
        return 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/25 hover:bg-violet-500/25'
      case 'transfer':
      default:
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25 hover:bg-amber-500/25'
    }
  })()

  return (
    <Wrapper
      href={href}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border px-1.5 py-0.5 text-[11px] font-bold transition-colors select-none',
        toneClass,
        href && 'cursor-pointer hover:underline',
      )}
    >
      <span className="opacity-60">@</span>
      <span className="truncate">{label}</span>
    </Wrapper>
  )
}

function renderMessageText(
  text: string,
  context: {
    users: User[]
    hospitals: Hospital[]
    medicines: Medicine[]
    transfers: TransferRequest[]
  },
) {
  const tokens = parseMentions(text, context)
  return tokens.map((tok, i) => {
    if (tok.mention) {
      return (
        <MentionChip
          key={i}
          kind={tok.mention.kind}
          label={tok.mention.label}
          href={tok.mention.href}
        />
      )
    }
    return (
      <span key={i} className="break-words whitespace-pre-wrap">
        {tok.raw}
      </span>
    )
  })
}

export function MessageBubble({
  message,
  sender,
  isMine,
  isConsecutive,
  onEdit,
  onDelete,
}: MessageBubbleProps) {
  const { t } = useI18n()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)
  const transfers = useTransferStore((s) => s.requests)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.text ?? '')

  const initials = sender?.avatarSeed ?? sender?.name.slice(0, 2).toUpperCase() ?? '??'

  const formattedTime = (() => {
    try {
      const d = new Date(message.createdAt)
      if (isNaN(d.getTime())) return ''
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  })()

  const senderName = sender?.name ?? 'Unknown'
  const showAvatar = !isConsecutive

  const submitEdit = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== message.text && onEdit) {
      onEdit(message.id, draft.trim())
    }
  }

  return (
    <div
      className={cn(
        'group flex w-full items-start gap-2',
        isMine ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center">
        {showAvatar && !isMine ? (
          <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-xl text-[11px] font-bold">
            {initials}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          'flex max-w-[78%] min-w-0 flex-col gap-1',
          isMine ? 'items-end' : 'items-start',
        )}
      >
        {showAvatar && !isMine && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-foreground text-xs font-bold">{senderName}</span>
            <span className="text-muted-foreground text-[10px]">{formattedTime}</span>
          </div>
        )}

        <div className={cn('flex items-end gap-1.5', isMine ? 'flex-row-reverse' : 'flex-row')}>
          <div
            className={cn(
              'rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-2xs',
              isMine
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-card text-card-foreground border-border/80 rounded-tl-sm border',
            )}
          >
            {editing ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={submitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    submitEdit()
                  } else if (e.key === 'Escape') {
                    setEditing(false)
                    setDraft(message.text ?? '')
                  }
                }}
                autoFocus
                rows={2}
                className={cn(
                  'w-full resize-none bg-transparent text-sm outline-none',
                  isMine
                    ? 'text-primary-foreground placeholder:text-primary-foreground/60'
                    : 'text-foreground',
                )}
              />
            ) : message.text ? (
              <div className="flex flex-wrap items-baseline gap-1.5">
                {renderMessageText(message.text, {
                  users: userList,
                  hospitals,
                  medicines,
                  transfers,
                })}
              </div>
            ) : null}

            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {message.attachments.map((card, idx) => (
                  <AttachmentCard key={idx} card={card} />
                ))}
              </div>
            )}
          </div>

          {isMine && onEdit && onDelete && !editing && (
            <div className="relative opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Message actions"
                className="hover:bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-full transition-colors"
              >
                <MoreHorizontal className="size-3.5" />
              </button>
              {menuOpen && (
                <div
                  className="bg-popover border-border absolute right-0 z-20 mt-1 w-32 overflow-hidden rounded-xl border shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true)
                      setMenuOpen(false)
                    }}
                    className="hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium"
                  >
                    <Pencil className="size-3.5" />
                    <span>{t('teamChat.edit')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(message.id)
                      setMenuOpen(false)
                    }}
                    className="text-critical hover:bg-critical/10 flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium"
                  >
                    <Trash2 className="size-3.5" />
                    <span>{t('teamChat.delete')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {message.editedAt && (
          <span className="text-muted-foreground px-1 text-[10px] italic">
            ({t('teamChat.edited')})
          </span>
        )}
        {showAvatar && isMine && (
          <span className="text-muted-foreground pr-1 text-[10px]">{formattedTime}</span>
        )}
      </div>
    </div>
  )
}
