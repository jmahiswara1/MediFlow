import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lightbulb, Sparkles, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'

interface EpidemiologyReasoningCardProps {
  title: string
  points: string[]
  recommendation: string
  recommendedMedicineId: string | null
}

export function EpidemiologyReasoningCard({
  title,
  points,
  recommendation,
  recommendedMedicineId,
}: EpidemiologyReasoningCardProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const handleAction = () => {
    if (recommendedMedicineId) {
      navigate(`/network?medicine=${recommendedMedicineId}`)
    } else {
      navigate('/network')
    }
  }

  return (
    <div className="bg-card text-card-foreground border-border/80 flex flex-col justify-between rounded-2xl border p-5 shadow-xs">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary shrink-0 rounded-xl p-2">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-bold tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-xs">{t('analytics.reasoning.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Insight Points */}
        <ul className="space-y-2.5">
          {points.map((pt, idx) => (
            <li
              key={idx}
              className="text-foreground/90 flex items-start gap-2.5 text-xs leading-relaxed"
            >
              <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>

        {/* Recommendation Box */}
        <div className="bg-muted/50 border-border/70 space-y-1.5 rounded-xl border p-3.5">
          <div className="text-primary flex items-center gap-1.5 text-xs font-bold">
            <Lightbulb className="size-3.5" />
            <span>{t('analytics.reasoning.recommendationTitle')}</span>
          </div>
          <p className="text-foreground text-xs leading-relaxed font-medium">{recommendation}</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-border/60 mt-4 flex justify-end border-t pt-3">
        <Button
          size="default"
          onClick={handleAction}
          className="gap-2 rounded-xl font-semibold shadow-xs"
        >
          <Truck className="size-4" />
          <span>{t('analytics.reasoning.actionButton')}</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
