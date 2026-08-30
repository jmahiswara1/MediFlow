import { useNavigate } from 'react-router-dom'
import { AlertCircle, AlertTriangle, CheckCircle2, Pill, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import type { StockStatusCard } from '@/types'
import { cn } from '@/lib/utils'

interface StockStatusCardViewProps {
  card: StockStatusCard
}

export function StockStatusCardView({ card }: StockStatusCardViewProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const isCritical = card.status === 'critical'
  const isLow = card.status === 'low'

  const progressPercent = Math.min(100, Math.max(10, Math.round((card.daysRemaining / 20) * 100)))

  const handleRequestTransfer = () => {
    navigate(`/network?medicine=${card.medicineId}`)
  }

  return (
    <div className="bg-card text-card-foreground border-border/90 flex flex-col gap-3.5 rounded-2xl border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'shrink-0 rounded-xl p-2',
              isCritical
                ? 'bg-critical/15 text-critical'
                : isLow
                  ? 'bg-low/20 text-low-foreground'
                  : 'bg-safe/15 text-safe',
            )}
          >
            <Pill className="size-4" />
          </div>
          <div>
            <h4 className="text-foreground text-sm font-bold">{card.medicineName}</h4>
            <p className="text-muted-foreground text-xs">{card.hospitalName ?? 'Faskes Anda'}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase shadow-2xs',
            isCritical && 'bg-critical text-white',
            isLow && 'bg-low text-low-foreground',
            !isCritical && !isLow && 'bg-safe/15 text-safe',
          )}
        >
          {isCritical && <AlertCircle className="size-3 shrink-0" />}
          {isLow && <AlertTriangle className="size-3 shrink-0" />}
          {!isCritical && !isLow && <CheckCircle2 className="size-3 shrink-0" />}
          <span>{card.status}</span>
        </span>
      </div>

      {/* Metrics Row */}
      <div className="bg-muted/40 border-border/60 grid grid-cols-3 gap-2 rounded-xl border p-3 text-center">
        <div>
          <p className="text-muted-foreground text-[10px] font-semibold uppercase">Stok Fisik</p>
          <p className="text-foreground text-sm font-bold tabular-nums">
            {card.currentStock.toLocaleString('id-ID')} {card.unit}
          </p>
        </div>
        <div className="border-border/60 border-x">
          <p className="text-muted-foreground text-[10px] font-semibold uppercase">Konsumsi</p>
          <p className="text-foreground text-sm font-bold tabular-nums">{card.dailyUsage} /hari</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-semibold uppercase">Ketahanan</p>
          <p
            className={cn(
              'text-sm font-bold tabular-nums',
              isCritical ? 'text-critical' : isLow ? 'text-low-foreground' : 'text-safe',
            )}
          >
            {card.daysRemaining} hari
          </p>
        </div>
      </div>

      {/* Runway Progress */}
      <div className="space-y-1">
        <div className="text-muted-foreground flex justify-between text-[11px] font-medium">
          <span>Kapasitas Buffer</span>
          <span>{card.daysRemaining} dari target 20 hari</span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isCritical ? 'bg-critical' : isLow ? 'bg-low' : 'bg-primary',
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Action CTA */}
      <div className="border-border/60 flex justify-end border-t pt-3">
        <Button
          size="sm"
          variant={isCritical ? 'destructive' : isLow ? 'default' : 'outline'}
          onClick={handleRequestTransfer}
          className="gap-1.5 rounded-xl font-semibold shadow-xs"
        >
          <Truck className="size-3.5" />
          <span>{t('aiChat.cards.requestTransfer')}</span>
        </Button>
      </div>
    </div>
  )
}
