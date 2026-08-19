import { useI18n } from '@/i18n/useI18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnalyticsPage() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('analytics.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('analytics.description')}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.projection')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{t('common.empty')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.reasons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">{t('analytics.reasonsPlaceholder')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
