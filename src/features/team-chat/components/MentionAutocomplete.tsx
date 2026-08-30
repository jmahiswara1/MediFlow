import { useEffect, useRef } from 'react'
import { Building2, ClipboardList, Package, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import type { MentionSuggestion } from '../utils/mentionParser'

interface MentionAutocompleteProps {
  query: string
  suggestions: MentionSuggestion[]
  activeIndex: number
  onSelect: (suggestion: MentionSuggestion) => void
  onActiveIndexChange: (index: number) => void
  onClose: () => void
}

const KIND_META = {
  user: {
    icon: Users,
    i18nKey: 'users' as const,
    color: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  },
  hospital: {
    icon: Building2,
    i18nKey: 'hospitals' as const,
    color: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  },
  medicine: {
    icon: Package,
    i18nKey: 'medicines' as const,
    color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  transfer: {
    icon: ClipboardList,
    i18nKey: 'transfers' as const,
    color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  },
} as const

export function MentionAutocomplete({
  query,
  suggestions,
  activeIndex,
  onSelect,
  onActiveIndexChange,
  onClose,
}: MentionAutocompleteProps) {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  if (suggestions.length === 0) return null

  // Group suggestions by kind for visual structure
  const groups: Record<string, MentionSuggestion[]> = {}
  for (const s of suggestions) {
    if (!groups[s.kind]) groups[s.kind] = []
    groups[s.kind].push(s)
  }

  let runningIndex = -1

  return (
    <div
      ref={ref}
      role="listbox"
      className="bg-card text-card-foreground border-border motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 absolute bottom-full left-0 z-30 mb-2 w-80 overflow-hidden rounded-2xl border shadow-xl duration-150"
    >
      <div className="border-border/70 bg-muted/40 flex items-center justify-between border-b px-3 py-2">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          Mention &bull; &ldquo;{query}&rdquo;
        </p>
        <span className="text-muted-foreground/70 text-[10px]">
          {t('teamChat.mentionTooltip') ?? 'Gunakan ↑↓ Enter'}
        </span>
      </div>

      <div className="max-h-72 scrollbar-thin overflow-y-auto p-1.5">
        {(Object.keys(groups) as Array<keyof typeof groups>).map((kind) => {
          const cfg = KIND_META[kind as MentionSuggestion['kind']] ?? KIND_META.user
          const Icon = cfg.icon
          const label = t(`teamChat.mentionGroup.${cfg.i18nKey}`)
          const items = groups[kind]

          return (
            <div key={kind} className="mb-1.5 last:mb-0">
              <div className="text-muted-foreground flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold tracking-wide uppercase">
                <Icon className="size-3" />
                <span>{label}</span>
              </div>
              {items.map((s) => {
                runningIndex += 1
                const isActive = runningIndex === activeIndex
                return (
                  <button
                    key={`${s.kind}:${s.refId}`}
                    type="button"
                    onMouseEnter={() => onActiveIndexChange(runningIndex)}
                    onClick={() => onSelect(s)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors',
                      isActive
                        ? 'bg-primary/15 text-foreground font-semibold'
                        : 'hover:bg-muted/70',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-6.5 shrink-0 items-center justify-center rounded-lg shadow-2xs',
                        cfg.color,
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{s.label}</span>
                    {s.hint && (
                      <span className="text-muted-foreground shrink-0 truncate text-[10px]">
                        {s.hint}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
