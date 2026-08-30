import { useMemo, useRef, useState } from 'react'
import { Paperclip, Send, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { useStockStore, useTransferStore } from '@/store'
import type {
  AttachedCard,
  ChatMention,
  Conversation,
  Hospital,
  Medicine,
  TransferRequest,
  User,
} from '@/types'
import { userList } from '@/data/users'
import { MentionAutocomplete } from './MentionAutocomplete'
import {
  extractMentionEntities,
  suggestMentions,
  type MentionSuggestion,
} from '../utils/mentionParser'

interface MessageComposerProps {
  conversation: Conversation
  currentUserId: string | undefined
  onSend: (params: {
    text?: string
    mentions?: ChatMention[]
    attachments?: AttachedCard[]
  }) => void
  disabled?: boolean
  compact?: boolean
}

function detectMentionPrefix(text: string, caret: number): { query: string; start: number } | null {
  const upToCaret = text.slice(0, caret)
  const match = /(^|\s)@([A-Za-z][A-Za-z0-9_-]*)$/.exec(upToCaret)
  if (!match) return null
  return { query: match[2], start: caret - match[2].length - 1 }
}

export function MessageComposer({
  conversation,
  currentUserId,
  onSend,
  disabled,
  compact,
}: MessageComposerProps) {
  const { t } = useI18n()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)
  const transfers = useTransferStore((s) => s.requests)
  const [text, setText] = useState('')
  const [attachments, setAttachments] = useState<AttachedCard[]>([])
  const [mentionQuery, setMentionQuery] = useState<{ query: string; start: number } | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [attachMenuOpen, setAttachMenuOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const tables = useMemo(
    () => ({ users: userList as User[], hospitals, medicines, transfers }),
    [hospitals, medicines, transfers],
  )

  const suggestions = useMemo(() => {
    if (!mentionQuery) return []
    return suggestMentions(mentionQuery.query, tables, 8)
  }, [mentionQuery, tables])

  const [prevQuery, setPrevQuery] = useState<string | undefined>(undefined)
  if (mentionQuery?.query !== prevQuery) {
    setPrevQuery(mentionQuery?.query)
    setActiveIndex(0)
  }

  const handleSelectMention = (s: MentionSuggestion) => {
    if (!mentionQuery || !textareaRef.current) return
    const caret = textareaRef.current.selectionStart ?? text.length
    const before = text.slice(0, mentionQuery.start)
    const after = text.slice(caret)
    const inserted = `@${s.refId} `
    const next = before + inserted + after
    setText(next)
    setMentionQuery(null)
    requestAnimationFrame(() => {
      const pos = before.length + inserted.length
      textareaRef.current?.setSelectionRange(pos, pos)
      textareaRef.current?.focus()
    })
  }

  const handleSend = () => {
    if (!currentUserId) return
    const trimmed = text.trim()
    if (!trimmed && attachments.length === 0) return
    const mentions = trimmed ? extractMentionEntities(trimmed, tables) : undefined
    onSend({
      text: trimmed || undefined,
      mentions,
      attachments: attachments.length > 0 ? attachments : undefined,
    })
    setText('')
    setAttachments([])
    setMentionQuery(null)
    setAttachMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionQuery) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(suggestions.length - 1, i + 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(0, i - 1))
        return
      }
      if (e.key === 'Enter' && suggestions[activeIndex]) {
        e.preventDefault()
        handleSelectMention(suggestions[activeIndex])
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setMentionQuery(null)
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setText(value)
    const caret = e.target.selectionStart ?? value.length
    setMentionQuery(detectMentionPrefix(value, caret))
  }

  const addAttachment = (card: AttachedCard) => {
    setAttachments((a) => [...a, card])
    setAttachMenuOpen(false)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  const firstStock: { hospital: Hospital; medicine: Medicine } | null = (() => {
    const h = hospitals[0]
    if (!h) return null
    const stock = h.stocks[0]
    if (!stock) return null
    const m = medicines.find((mm) => mm.id === stock.medicineId)
    if (!m) return null
    return { hospital: h, medicine: m }
  })()

  const firstTransfer: TransferRequest | null = transfers[0] ?? null

  const canSend =
    (text.trim().length > 0 || attachments.length > 0) && !disabled && Boolean(currentUserId)

  // Suppress unused var lint for conversation prop (kept for future per-room behavior)
  void conversation

  return (
    <div className="bg-card border-border/80 focus-within:border-primary/50 focus-within:ring-primary/10 relative rounded-2xl border shadow-xs transition-all focus-within:ring-2">
      {attachments.length > 0 && (
        <div className="border-border/70 flex flex-wrap gap-1.5 border-b px-3 pt-2.5 pb-2">
          {attachments.map((card, idx) => (
            <span
              key={idx}
              className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
            >
              {card.type === 'stock' && t('teamChat.attachMenu.stock')}
              {card.type === 'hospital' && t('teamChat.attachMenu.hospital')}
              {card.type === 'transfer' && t('teamChat.attachMenu.transfer')}
              <button
                type="button"
                onClick={() => setAttachments((a) => a.filter((_, i) => i !== idx))}
                className="hover:bg-primary/20 -mr-1 ml-1 flex size-4 items-center justify-center rounded-full transition-colors"
                aria-label="Remove attachment"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-2 sm:p-2.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setAttachMenuOpen((v) => !v)}
            className="hover:bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-xl transition-colors"
            aria-label={t('teamChat.attach')}
            title={t('teamChat.attach')}
          >
            <Paperclip className="size-4" />
          </button>
          {attachMenuOpen && (
            <div className="bg-card border-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 absolute bottom-full left-0 z-30 mb-2 w-72 overflow-hidden rounded-2xl border p-1 shadow-xl">
              <div className="border-border/60 bg-muted/30 border-b px-2.5 py-1.5">
                <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                  {t('teamChat.quickAttach')}
                </p>
              </div>
              <button
                type="button"
                disabled={!firstStock}
                onClick={() =>
                  firstStock &&
                  addAttachment({
                    type: 'stock',
                    medicineId: firstStock.medicine.id,
                    hospitalId: firstStock.hospital.id,
                  })
                }
                className="hover:bg-muted flex w-full items-start gap-2.5 rounded-xl p-2 text-left text-xs transition-colors disabled:opacity-50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 font-bold text-emerald-700 shadow-2xs dark:text-emerald-300">
                  S
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{t('teamChat.attachMenu.stock')}</p>
                  {firstStock && (
                    <p className="text-muted-foreground truncate text-[10px]">
                      {firstStock.medicine.name} &bull; {firstStock.hospital.name}
                    </p>
                  )}
                </div>
              </button>
              <button
                type="button"
                disabled={!hospitals[0]}
                onClick={() =>
                  hospitals[0] && addAttachment({ type: 'hospital', hospitalId: hospitals[0].id })
                }
                className="hover:bg-muted flex w-full items-start gap-2.5 rounded-xl p-2 text-left text-xs transition-colors disabled:opacity-50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 font-bold text-violet-700 shadow-2xs dark:text-violet-300">
                  H
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{t('teamChat.attachMenu.hospital')}</p>
                  {hospitals[0] && (
                    <p className="text-muted-foreground truncate text-[10px]">
                      {hospitals[0].name}
                    </p>
                  )}
                </div>
              </button>
              <button
                type="button"
                disabled={!firstTransfer}
                onClick={() =>
                  firstTransfer && addAttachment({ type: 'transfer', transferId: firstTransfer.id })
                }
                className="hover:bg-muted flex w-full items-start gap-2.5 rounded-xl p-2 text-left text-xs transition-colors disabled:opacity-50"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 font-bold text-amber-700 shadow-2xs dark:text-amber-300">
                  T
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{t('teamChat.attachMenu.transfer')}</p>
                  {firstTransfer && (
                    <p className="text-muted-foreground truncate text-[10px]">
                      {firstTransfer.id.toUpperCase()} &bull; {firstTransfer.medicineName}
                    </p>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="relative min-w-0 flex-1">
          {mentionQuery && (
            <MentionAutocomplete
              query={mentionQuery.query}
              suggestions={suggestions}
              activeIndex={activeIndex}
              onSelect={handleSelectMention}
              onActiveIndexChange={setActiveIndex}
              onClose={() => setMentionQuery(null)}
            />
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t('teamChat.placeholder')}
            rows={compact ? 1 : 2}
            disabled={disabled || !currentUserId}
            className="placeholder:text-muted-foreground/60 w-full resize-none bg-transparent px-1 py-1.5 text-xs leading-relaxed outline-none disabled:opacity-60 sm:text-sm"
          />
        </div>

        <button
          type="button"
          tabIndex={-1}
          className="hover:bg-muted text-muted-foreground hidden size-9 items-center justify-center rounded-xl transition-colors sm:flex"
          aria-label="Emoji"
        >
          <Smile className="size-4" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl transition-all',
            canSend
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm hover:scale-105'
              : 'bg-muted text-muted-foreground/60 cursor-not-allowed',
          )}
          aria-label={t('teamChat.send')}
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}
