import { useI18n } from '@/i18n/useI18n'
import { useStockStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive'> = {
  safe: 'default',
  low: 'secondary',
  critical: 'destructive',
}

export function StockMapPage() {
  const { t } = useI18n()
  const rumahSakit = useStockStore((state) => state.rumahSakit)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('stockMap.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('stockMap.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('stockMap.legend')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="default">{t('status.safe')}</Badge>
          <Badge variant="secondary">{t('status.low')}</Badge>
          <Badge variant="destructive">{t('status.critical')}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rumahSakit.map((rs) => (
          <Card key={rs.id}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{rs.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">{rs.city}</p>
              <Badge variant={statusVariant[rs.stockStatus]} className="mt-2">
                {t(`status.${rs.stockStatus}`)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
