import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Navigation, Send } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import type { HospitalRecCard } from '@/types'

interface HospitalRecCardViewProps {
  card: HospitalRecCard
}

export function HospitalRecCardView({ card }: HospitalRecCardViewProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <div className="bg-card text-card-foreground border-border/90 flex flex-col gap-3.5 rounded-2xl border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/15 text-primary shrink-0 rounded-xl p-2">
          <Building2 className="size-4" />
        </div>
        <div>
          <h4 className="text-foreground text-sm font-bold">{t('aiChat.cards.surplusTitle')}</h4>
          <p className="text-muted-foreground text-xs">
            Pasokan: <span className="text-primary font-semibold">{card.medicineName}</span>
          </p>
        </div>
      </div>

      {/* Hospital Recommendation List */}
      <div className="divide-border/60 border-border/60 bg-muted/20 divide-y overflow-hidden rounded-xl border">
        {card.hospitals.map((h) => (
          <div
            key={h.hospitalId}
            className="hover:bg-muted/40 flex items-center justify-between gap-3 p-3 transition-colors"
          >
            <div className="min-w-0 space-y-1">
              <p className="text-foreground truncate text-xs font-bold">{h.hospitalName}</p>
              <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                <span className="text-primary flex items-center gap-1 font-semibold">
                  <Navigation className="size-3" />
                  {h.distanceKm} km
                </span>
                <span>•</span>
                <span>{h.city}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span className="bg-safe/15 text-safe rounded-md px-2 py-0.5 text-xs font-bold tabular-nums">
                +{h.currentStock.toLocaleString('id-ID')} unit
              </span>
              <span className="text-muted-foreground text-[10px] font-medium">
                Ketahanan ~{h.daysRemaining} hari
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="border-border/60 flex items-center justify-between gap-2 border-t pt-3">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/network')}
          className="gap-1.5 rounded-xl text-xs"
        >
          <MapPin className="size-3.5" />
          <span>{t('aiChat.cards.viewOnMap')}</span>
        </Button>

        <Button
          size="sm"
          onClick={() => navigate('/network')}
          className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
        >
          <Send className="size-3.5" />
          <span>{t('aiChat.cards.requestTransfer')}</span>
        </Button>
      </div>
    </div>
  )
}
