import { HelpCircle, Sparkles } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import type { HelpCard } from '@/types'

interface HelpCardViewProps {
  card: HelpCard
  onSelectPrompt?: (prompt: string) => void
}

export function HelpCardView({ card, onSelectPrompt }: HelpCardViewProps) {
  const { t } = useI18n()

  return (
    <div className="bg-card text-card-foreground border-border/90 flex flex-col gap-3 rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-primary/15 text-primary shrink-0 rounded-xl p-2">
          <HelpCircle className="size-4" />
        </div>
        <h4 className="text-foreground text-sm font-bold">{t('aiChat.cards.helpTitle')}</h4>
      </div>

      <div className="flex flex-col gap-1.5">
        {card.examples.map((example, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt?.(example)}
            className="group bg-muted/40 hover:bg-primary/10 border-border/60 hover:border-primary/30 flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-left text-xs transition-all"
          >
            <span className="text-foreground/90 group-hover:text-primary font-medium">
              "{example}"
            </span>
            <Sparkles className="text-muted-foreground group-hover:text-primary size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>
    </div>
  )
}
