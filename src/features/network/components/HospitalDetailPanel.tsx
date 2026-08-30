import { useMemo } from 'react'
import { Building2, MapPin, Truck, X } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser } from '@/store'
import type { Hospital } from '@/types'
import { StatusBadge } from '@/components/ui/status-badge'
import { type StatusVariant } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import { useHospitalDistance } from '../hooks/useHospitalDistance'
import { getDaysRemaining, getStockStatus } from '@/utils/statusHelpers'
import { cn } from '@/lib/utils'

interface HospitalDetailPanelProps {
  hospital: Hospital
  onClose: () => void
  onRequestTransfer?: () => void
}

export function HospitalDetailPanel({
  hospital,
  onClose,
  onRequestTransfer,
}: HospitalDetailPanelProps) {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const distance = useHospitalDistance(hospital)

  const isOwnHospital = currentUser?.hospitalId === hospital.id
  const canRequest = currentUser?.role === 'requester' && !isOwnHospital

  const sortedStocks = useMemo(
    () =>
      [...hospital.stocks].sort((a, b) => {
        const statusA = getStockStatus(a.currentStock, a.minimumStock)
        const statusB = getStockStatus(b.currentStock, b.minimumStock)
        const order = { critical: 0, low: 1, safe: 2 } as const
        if (statusA !== statusB) return order[statusA] - order[statusB]
        return (
          a.currentStock / Math.max(a.dailyUsage, 1) - b.currentStock / Math.max(b.dailyUsage, 1)
        )
      }),
    [hospital.stocks],
  )

  const criticalStocks = sortedStocks.filter(
    (s) => getStockStatus(s.currentStock, s.minimumStock) === 'critical',
  )
  const lowestDays = sortedStocks.length
    ? Math.min(...sortedStocks.map((s) => getDaysRemaining(s.currentStock, s.dailyUsage)))
    : null

  return (
    <aside className="bg-card text-card-foreground flex flex-col rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="border-border flex items-start justify-between gap-3 border-b p-5">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <StatusBadge
              status={hospital.stockStatus as StatusVariant}
              label={hospital.stockStatus.toUpperCase()}
            />
            {isOwnHospital && (
              <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-xs">
                {t('network.detail.yourHospital')}
              </span>
            )}
          </div>
          <h3 className="text-foreground truncate text-lg font-bold tracking-tight">
            {hospital.name}
          </h3>
          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <Building2 className="text-primary size-3.5 shrink-0" />
            <span>{hospital.city}</span>
            <span className="opacity-50">•</span>
            <span>{hospital.region}</span>
          </div>
          {distance !== null && (
            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
              <MapPin className="text-primary size-3.5 shrink-0" />
              <span>
                {distance.toFixed(1)} km {t('network.detail.distanceFromYou')}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="hover:bg-accent hover:text-accent-foreground rounded-xl p-1.5 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Alert if critical */}
      {criticalStocks.length > 0 && lowestDays !== null && lowestDays <= 3 && (
        <div className="bg-critical/10 border-critical/30 text-critical mx-5 mt-4 flex items-start gap-2 rounded-xl border p-3">
          <span className="bg-critical mt-0.5 size-1.5 shrink-0 rounded-full" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold">{t('network.detail.urgentShortage')}</p>
            <p className="text-critical/85 mt-0.5">
              {criticalStocks[0]?.medicineId ?? 'Item'} - {lowestDays}{' '}
              {t('network.detail.daysLeftShort')}
            </p>
          </div>
        </div>
      )}

      {/* Items table */}
      <div className="px-5 py-4">
        <p className="text-muted-foreground mb-2 text-[11px] font-semibold tracking-wide uppercase">
          {t('network.detail.items')} ({sortedStocks.length})
        </p>
        <ul className="border-border divide-border flex flex-col divide-y rounded-xl border">
          {sortedStocks.map((stock) => {
            const status = getStockStatus(stock.currentStock, stock.minimumStock)
            const days = getDaysRemaining(stock.currentStock, stock.dailyUsage)
            return (
              <li
                key={stock.medicineId}
                className="flex items-center justify-between gap-3 px-3 py-2.5 first:pt-2 last:pb-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{stock.medicineId}</p>
                  <p className="text-muted-foreground mt-0.5 text-[11px] tabular-nums">
                    {stock.currentStock} / {stock.minimumStock}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums',
                    status === 'safe' && 'bg-safe/15 text-safe',
                    status === 'low' && 'bg-low/20 text-low-foreground',
                    status === 'critical' && 'bg-critical/15 text-critical',
                  )}
                >
                  {Number.isFinite(days) ? `${days}d` : 'N/A'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer with Request Transfer */}
      {canRequest && onRequestTransfer && (
        <div className="border-border border-t p-4">
          <Button
            size="lg"
            onClick={onRequestTransfer}
            className="w-full gap-2 rounded-xl font-semibold shadow-sm"
          >
            <Truck className="size-4" />
            <span>{t('network.requestTransfer')}</span>
          </Button>
        </div>
      )}
    </aside>
  )
}
