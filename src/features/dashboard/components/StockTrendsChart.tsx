import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { generateStockTrendHistory } from '@/utils/seedHelpers'
import { useI18n } from '@/i18n/useI18n'

export function StockTrendsChart() {
  const { t, locale } = useI18n()
  const data = useMemo(() => generateStockTrendHistory(), [])

  const formatDate = (date: string) => {
    const d = new Date(date)
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'short',
    }).format(d)
  }

  const maxValue = Math.max(...data.map((d) => Math.max(d.critical, d.low))) + 3

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-5 shadow-sm md:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{t('dashboard.stockTrends')}</h3>
          <p className="text-muted-foreground text-xs">{t('dashboard.stockTrendsSub')}</p>
        </div>
      </div>

      <div className="h-56 w-full md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="criticalArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--critical)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--critical)" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="lowArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--low)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--low)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.6}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, maxValue]}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--popover)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
              formatter={(value) => (
                <span className="text-foreground text-xs font-medium capitalize">
                  {value === 'critical' ? t('status.critical') : t('status.low')}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke="var(--critical)"
              strokeWidth={2.2}
              fill="url(#criticalArea)"
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="var(--low)"
              strokeWidth={2.2}
              fill="url(#lowArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
