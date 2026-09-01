import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2, ChevronRight } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useStockStore, useHospitalId } from '@/store'
import { getDaysRemaining } from '@/utils/statusHelpers'
import { getStockStatus } from '@/utils/statusHelpers'
import type { Hospital } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_DOT: Record<string, string> = {
  safe: 'bg-safe',
  low: 'bg-low',
  critical: 'bg-critical',
}

const STATUS_LABEL_KEY: Record<
  string,
  'distribution.safe' | 'distribution.low' | 'distribution.critical'
> = {
  safe: 'distribution.safe',
  low: 'distribution.low',
  critical: 'distribution.critical',
}

function summarize(hospital: Hospital) {
  let criticalCount = 0
  let lowest = Number.POSITIVE_INFINITY
  let hasAny = false
  for (const s of hospital.stocks) {
    hasAny = true
    const status = getStockStatus(s.currentStock, s.minimumStock)
    if (status === 'critical') criticalCount++
    const days = getDaysRemaining(s.currentStock, s.dailyUsage)
    if (Number.isFinite(days) && days < lowest) lowest = days
  }
  return {
    criticalCount,
    itemCount: hasAny ? hospital.stocks.length : 0,
    lowest: Number.isFinite(lowest) ? lowest : null,
  }
}

export function MiniHospitalList() {
  const { t } = useI18n()
  const hospitals = useStockStore((s) => s.hospitals)
  const currentHospitalId = useHospitalId()

  const sorted = [...hospitals]
    .map((h) => ({ hospital: h, summary: summarize(h) }))
    .sort((a, b) => {
      // Own hospital prioritized or highest urgency
      if (a.hospital.id === currentHospitalId) return -1
      if (b.hospital.id === currentHospitalId) return 1
      if (a.hospital.stockStatus !== b.hospital.stockStatus) {
        const order: Record<string, number> = { critical: 0, low: 1, safe: 2 }
        return order[a.hospital.stockStatus] - order[b.hospital.stockStatus]
      }
      return b.summary.criticalCount - a.summary.criticalCount
    })
    .slice(0, 4)

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight sm:text-base">
            {t('hospitalList.title')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('hospitalList.subtitle')}</p>
        </div>
        <Link
          to="/network"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
        >
          {t('dashboard.viewAll')}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="text-muted-foreground py-6 text-center text-sm">{t('common.empty')}</div>
      ) : (
        <ul className="divide-border/60 my-2 flex flex-col divide-y">
          {sorted.map(({ hospital, summary }) => {
            const dotClass = STATUS_DOT[hospital.stockStatus] ?? 'bg-muted-foreground'
            const statusLabel = t(STATUS_LABEL_KEY[hospital.stockStatus])
            const isOwn = hospital.id === currentHospitalId

            return (
              <li key={hospital.id}>
                <Link
                  to={`/network?rs=${hospital.id}`}
                  className={cn(
                    'group -mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors',
                    isOwn ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`size-2.5 shrink-0 rounded-full ${dotClass}`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Building2
                          className={cn(
                            'size-3.5 shrink-0',
                            isOwn ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        <p
                          className={cn(
                            'truncate text-sm leading-tight font-semibold transition-colors',
                            isOwn ? 'text-primary' : 'text-foreground group-hover:text-primary',
                          )}
                        >
                          {hospital.name}
                        </p>
                        {isOwn && (
                          <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide shadow-2xs">
                            {t('network.detail.yourHospital')}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-0.5 truncate text-xs">
                        {hospital.city} {' • '} {statusLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-right">
                    <div>
                      {summary.criticalCount > 0 ? (
                        <span className="bg-critical/10 text-critical border-critical/20 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums">
                          {summary.criticalCount} {t('hospitalList.criticalItems')}
                        </span>
                      ) : (
                        <span className="bg-safe/10 text-safe border-safe/20 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
                          {t('hospitalList.allOk')}
                        </span>
                      )}
                      {summary.lowest !== null && (
                        <p className="text-muted-foreground mt-0.5 text-[11px] tabular-nums">
                          {t('hospitalList.minShortest')}: {summary.lowest}d
                        </p>
                      )}
                    </div>
                    <ChevronRight className="text-muted-foreground/60 size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
