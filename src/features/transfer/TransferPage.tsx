import { useI18n } from '@/i18n/useI18n'
import { useTransferStore } from '@/store'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/utils/dateHelpers'
import type { TransferStatus } from '@/types'

const statusVariant: Record<TransferStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'secondary',
  approved: 'default',
  shipped: 'default',
  completed: 'default',
  rejected: 'destructive',
}

export function TransferPage() {
  const { t, locale } = useI18n()
  const requests = useTransferStore((state) => state.requests)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('transfer.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('transfer.description')}</p>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {request.obatId} · {request.quantity} {t('transfer.quantity')}
              </CardTitle>
              <Badge variant={statusVariant[request.status]}>{t(`status.${request.status}`)}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                {formatDate(request.createdAt, locale)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
