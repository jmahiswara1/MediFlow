import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, Info } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import type { TrendDataPoint } from '@/utils/trendHelpers'
import type { Disease } from '@/types'
import { cn } from '@/lib/utils'

interface DiseaseTrendChartProps {
  data: TrendDataPoint[]
  disease?: Disease | null
}

export function DiseaseTrendChart({ data, disease }: DiseaseTrendChartProps) {
  const { t } = useI18n()

  const maxVal = Math.max(...data.map((d) => Math.max(d.actual ?? 0, d.projected ?? 0)), 100)

  // Find projected peak point
  const projectedPoints = data.filter((d) => d.projected !== null)
  const peakPoint = projectedPoints.reduce(
    (max, curr) => ((curr.projected ?? 0) > (max.projected ?? 0) ? curr : max),
    projectedPoints[0] || null,
  )

  const isOutbreak = disease?.severity === 'outbreak'

  return (
    <div className="bg-card text-card-foreground border-border/80 flex flex-col rounded-2xl border p-5 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-base font-bold tracking-tight">
              {t('analytics.chart.title')}
            </h3>
            {disease && (
              <span
                className={cn(
                  'rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                  isOutbreak
                    ? 'bg-critical/15 text-critical'
                    : disease.severity === 'rising'
                      ? 'bg-low/20 text-low-foreground'
                      : 'bg-safe/15 text-safe',
                )}
              >
                {disease.name} • {disease.severity}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-0.5 text-xs">{t('analytics.chart.subtitle')}</p>
        </div>

        {/* Peak Badge */}
        {peakPoint && (
          <div className="bg-primary/10 border-primary/20 text-primary flex items-center gap-1.5 self-start rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-2xs">
            <TrendingUp className="size-3.5" />
            <span>
              Puncak: ~{peakPoint.projected} kasus ({peakPoint.label})
            </span>
          </div>
        )}
      </div>

      {/* Main Composed Chart */}
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.6}
              vertical={false}
            />

            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />

            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.ceil(maxVal * 1.15)]}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip content={<CustomChartTooltip />} />

            {/* Actual Series (Solid Area + Line) */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fill="url(#actualGradient)"
              name={t('analytics.chart.actualSeries')}
              connectNulls={false}
              activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
            />

            {/* Projected Series (Dashed Line) */}
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#6366f1"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              name={t('analytics.chart.projectedSeries')}
              dot={false}
              activeDot={{ r: 5, fill: '#6366f1', stroke: 'var(--card)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Explanation Footer */}
      <div className="border-border/60 mt-4 flex flex-col gap-2 border-t pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="bg-primary size-2.5 rounded-full" />
            <span className="text-foreground font-medium">{t('analytics.chart.actualSeries')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 border-b-2 border-dashed border-[#6366f1]" />
            <span className="text-muted-foreground font-medium">
              {t('analytics.chart.projectedSeries')} (14d)
            </span>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
          <Info className="text-primary size-3.5 shrink-0" />
          <span>{t('analytics.chart.trendNotice')}</span>
        </div>
      </div>
    </div>
  )
}

interface TooltipPayloadItem {
  dataKey?: string
  value?: number | null
  [key: string]: unknown
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const actualItem = payload.find((p) => p.dataKey === 'actual')
  const projectedItem = payload.find((p) => p.dataKey === 'projected')

  return (
    <div className="bg-popover text-popover-foreground border-border min-w-36 space-y-1.5 rounded-xl border p-3 text-xs shadow-lg backdrop-blur-md">
      <p className="text-foreground font-bold">{label}</p>
      {actualItem && actualItem.value !== null && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="bg-primary size-2 rounded-full" />
            <span className="text-muted-foreground">Kasus Aktual:</span>
          </div>
          <span className="text-foreground font-semibold tabular-nums">
            {actualItem.value} kasus
          </span>
        </div>
      )}
      {projectedItem && projectedItem.value !== null && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#6366f1]" />
            <span className="text-muted-foreground">Proyeksi Model:</span>
          </div>
          <span className="font-semibold text-[#6366f1] tabular-nums">
            {projectedItem.value} kasus
          </span>
        </div>
      )}
    </div>
  )
}
