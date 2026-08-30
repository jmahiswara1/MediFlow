import { Activity, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

interface AnalyticsMetricsProps {
  totalCases: number
  growthPercent: number
  criticalCount: number
  avgDays: number
}

export function AnalyticsMetrics({
  totalCases,
  growthPercent,
  criticalCount,
  avgDays,
}: AnalyticsMetricsProps) {
  const { t } = useI18n()

  const metrics = [
    {
      label: t('analytics.kpi.activeCases'),
      value: totalCases.toLocaleString('id-ID'),
      subtext: 'Kasus terpantau aktif di wilayah',
      icon: Activity,
      iconColor: 'text-primary',
      badge: null,
    },
    {
      label: t('analytics.kpi.trendGrowth'),
      value: `${growthPercent >= 0 ? '+' : ''}${growthPercent}%`,
      subtext: 'Vs periode sebelumnya',
      icon: TrendingUp,
      iconColor: growthPercent > 15 ? 'text-critical' : 'text-primary',
      badge: (
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums',
            growthPercent > 15 ? 'bg-critical/15 text-critical' : 'bg-safe/15 text-safe',
          )}
        >
          {growthPercent > 15 ? 'Meningkat Pesat' : 'Terkendali'}
        </span>
      ),
    },
    {
      label: t('analytics.kpi.atRiskMedicines'),
      value: `${criticalCount} item`,
      subtext: 'Stok diproyeksikan < 3 hari',
      icon: AlertTriangle,
      iconColor: criticalCount > 0 ? 'text-critical' : 'text-safe',
      badge: (
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold',
            criticalCount > 0 ? 'bg-critical/15 text-critical' : 'bg-safe/15 text-safe',
          )}
        >
          {criticalCount > 0 ? 'Perlu Intervensi' : 'Aman'}
        </span>
      ),
    },
    {
      label: t('analytics.kpi.avgRunway'),
      value: `${avgDays} hari`,
      subtext: 'Estimasi buffer ketahanan faskes',
      icon: ShieldCheck,
      iconColor: avgDays <= 7 ? 'text-low-foreground' : 'text-safe',
      badge: null,
    },
  ]

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon
        return (
          <div
            key={idx}
            className="bg-card text-card-foreground border-border/80 hover:border-border flex flex-col justify-between rounded-2xl border p-4 shadow-xs transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium">{m.label}</p>
                <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                  {m.value}
                </p>
              </div>
              <div className="bg-muted/60 shrink-0 rounded-xl p-2">
                <Icon className={cn('size-5', m.iconColor)} />
              </div>
            </div>

            <div className="border-border/50 text-muted-foreground mt-3 flex items-center justify-between gap-2 border-t pt-2 text-[11px]">
              <span className="truncate">{m.subtext}</span>
              {m.badge && <div className="shrink-0">{m.badge}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
