import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useI18n } from '@/i18n/useI18n'
import type { StockStatus } from '@/types'

interface StockDistributionCardProps {
  items: { status: StockStatus }[]
}

const COLORS: Record<StockStatus, string> = {
  safe: 'var(--safe)',
  low: 'var(--low)',
  critical: 'var(--critical)',
}

const LABEL_KEY: Record<
  StockStatus,
  'distribution.safe' | 'distribution.low' | 'distribution.critical'
> = {
  safe: 'distribution.safe',
  low: 'distribution.low',
  critical: 'distribution.critical',
}

export function StockDistributionCard({ items }: StockDistributionCardProps) {
  const { t } = useI18n()

  const counts: Record<StockStatus, number> = { safe: 0, low: 0, critical: 0 }
  for (const it of items) counts[it.status]++
  const total = items.length || 1

  const data = (Object.keys(counts) as StockStatus[]).map((status) => ({
    status,
    label: t(LABEL_KEY[status]),
    value: counts[status],
    pct: Math.round((counts[status] / total) * 100),
  }))

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-2 sm:mb-0">
        <h3 className="text-sm font-semibold tracking-tight sm:text-base">
          {t('distribution.title')}
        </h3>
        <p className="text-muted-foreground text-xs">{t('distribution.subtitle')}</p>
      </div>

      <div className="my-auto flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-around sm:gap-5">
        {/* Donut Chart with Center Stat */}
        <div className="relative size-32 shrink-0 sm:size-36 md:size-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={48}
                outerRadius={68}
                strokeWidth={3}
                stroke="var(--card)"
                paddingAngle={3}
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                formatter={(value, _name, item) => [
                  `${value} (${item.payload.pct}%)`,
                  item.payload.label,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-foreground text-2xl font-bold tracking-tight tabular-nums md:text-3xl">
              {total}
            </p>
            <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              {t('distribution.items')}
            </p>
          </div>
        </div>

        {/* Legend List */}
        <ul className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-32">
          {data.map((entry) => (
            <li
              key={entry.status}
              className="bg-muted/30 border-border/60 flex items-center justify-between gap-3 rounded-xl border px-3 py-1.5"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[entry.status] }}
                />
                <span className="text-foreground text-xs font-medium">{entry.label}</span>
              </span>
              <span className="text-muted-foreground text-xs font-semibold tabular-nums">
                {entry.value} <span className="text-[10px] font-normal">({entry.pct}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
