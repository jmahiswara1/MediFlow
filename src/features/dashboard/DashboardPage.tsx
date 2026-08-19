import { useI18n } from '@/i18n/useI18n'
import { useStockSummaryByStatus } from '@/hooks/useStockSummary'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  const { t } = useI18n()
  const critical = useStockSummaryByStatus('critical')
  const low = useStockSummaryByStatus('low')
  const safe = useStockSummaryByStatus('safe')

  const metrics = [
    { label: t('dashboard.criticalStock'), value: critical.length },
    { label: t('dashboard.lowStock'), value: low.length },
    { label: t('dashboard.safeStock'), value: safe.length },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('dashboard.description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.diseaseTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{t('common.empty')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.aiInsight')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{t('dashboard.aiInsightPlaceholder')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
