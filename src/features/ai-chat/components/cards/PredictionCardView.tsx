import { useNavigate } from 'react-router-dom'
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import type { PredictionCard } from '@/types'
import { cn } from '@/lib/utils'

interface PredictionCardViewProps {
  card: PredictionCard
}

export function PredictionCardView({ card }: PredictionCardViewProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="bg-card text-card-foreground border-border/90 flex flex-col gap-3.5 rounded-2xl border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 text-primary shrink-0 rounded-xl p-2">
            <TrendingUp className="size-4" />
          </div>
          <div>
            <h4 className="text-foreground text-sm font-bold">
              {t('aiChat.cards.predictionTitle')}
            </h4>
            <p className="text-muted-foreground text-xs">
              {card.diseaseName} • {card.region}
            </p>
          </div>
        </div>

        <span className="bg-critical/15 text-critical rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums">
          +{card.deltaPercent}% Lonjakan
        </span>
      </div>

      {/* Affected Hospitals */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          {t('aiChat.cards.affectedHospitals')}
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {card.affectedHospitals.map((h, idx) => {
            const isCritical = h.status === 'critical'
            const isLow = h.status === 'low'

            return (
              <div
                key={idx}
                className="bg-muted/30 border-border/60 flex items-center justify-between rounded-xl border p-2.5 text-xs"
              >
                <span className="text-foreground truncate font-medium">{h.hospitalName}</span>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1 text-[10px] font-bold',
                    isCritical && 'text-critical',
                    isLow && 'text-low-foreground',
                    !isCritical && !isLow && 'text-safe',
                  )}
                >
                  {isCritical && <AlertCircle className="size-3" />}
                  {isLow && <AlertTriangle className="size-3" />}
                  {!isCritical && !isLow && <CheckCircle2 className="size-3" />}
                  <span>{h.status}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="border-border/60 flex justify-end border-t pt-3">
        <Button
          size="sm"
          onClick={() => navigate(`/analytics?disease=${encodeURIComponent(card.diseaseName)}`)}
          className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
        >
          <span>{t('aiChat.cards.viewAnalytics')}</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
