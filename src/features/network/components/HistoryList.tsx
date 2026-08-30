import { useMemo } from 'react'
import { CheckCircle2, History, XCircle } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useAllRequests } from '@/store'
import { StatusBadge } from '@/components/ui/status-badge'
import { formatDate } from '@/utils/dateHelpers'
import type { TransferRequest } from '@/types'

function formatDuration(iso: string, locale: 'id' | 'en'): string {
  const start = new Date(iso).getTime()
  const now = Date.now()
  const diffH = Math.abs(Math.round((now - start) / (1000 * 60 * 60)))
  if (diffH < 24) {
    return locale === 'id' ? `${diffH} jam` : `${diffH}h`
  }
  const days = Math.round(diffH / 24)
  return locale === 'id' ? `${days} hari` : `${days}d`
}

export function HistoryList() {
  const { t, locale } = useI18n()
  const all = useAllRequests()

  const completed = useMemo(
    () =>
      all
        .filter((r) => r.status === 'completed' || r.status === 'rejected')
        .sort((a, b) => {
          const aLast = a.timeline[a.timeline.length - 1]
          const bLast = b.timeline[b.timeline.length - 1]
          return (
            new Date(bLast?.at ?? b.createdAt).getTime() -
            new Date(aLast?.at ?? a.createdAt).getTime()
          )
        }),
    [all],
  )

  if (completed.length === 0) {
    return (
      <div className="bg-card text-muted-foreground rounded-2xl border p-12 text-center">
        <History className="text-muted-foreground mx-auto mb-2 size-8" />
        <p className="text-sm">{t('network.detail.emptyHistory')}</p>
      </div>
    )
  }

  return (
    <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-border flex items-center justify-between border-b px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold">{t('network.tabs.history')}</h3>
          <p className="text-muted-foreground text-xs">
            {completed.length} {t('network.requestsCount')}
          </p>
        </div>
      </div>
      <ul className="divide-border divide-y">
        {completed.map((req) => (
          <HistoryRow key={req.id} req={req} locale={locale} />
        ))}
      </ul>
    </div>
  )
}

function HistoryRow({ req, locale }: { req: TransferRequest; locale: 'id' | 'en' }) {
  const { t } = useI18n()
  const isCompleted = req.status === 'completed'
  const Icon = isCompleted ? CheckCircle2 : XCircle
  const lastEvent = req.timeline[req.timeline.length - 1]

  return (
    <li className="hover:bg-accent/30 flex items-start gap-4 px-5 py-4 transition-colors">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
          isCompleted ? 'bg-safe/15 text-safe' : 'bg-critical/15 text-critical'
        }`}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{req.medicineName}</p>
          <span className="text-muted-foreground text-xs tabular-nums">{req.quantity}</span>
          <StatusBadge status={req.status} label={t(`status.${req.status}`)} />
        </div>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {req.fromHospitalName} {'->'} {req.toHospitalName}
        </p>
        {lastEvent?.reason && !isCompleted && (
          <p className="text-critical mt-1 text-xs italic">
            {t('transfer.declineReasonLabel')}: {lastEvent.reason}
          </p>
        )}
        {lastEvent && (
          <p className="text-muted-foreground mt-1 text-[11px] tabular-nums">
            {formatDate(lastEvent.at, locale)} - {formatDuration(lastEvent.at, locale)}
          </p>
        )}
      </div>
    </li>
  )
}
