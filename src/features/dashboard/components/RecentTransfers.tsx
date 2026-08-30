import { Link } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronRight,
} from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useAllRequests } from '@/store'
import type { TransferRequest, TransferStatus } from '@/types'

const STATUS_ICONS: Record<TransferStatus, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  shipped: Truck,
  completed: CheckCircle2,
  rejected: XCircle,
}

const STATUS_BADGE_STYLE: Record<TransferStatus, string> = {
  pending: 'bg-muted text-muted-foreground border-border',
  approved: 'bg-primary/10 text-primary border-primary/20',
  shipped: 'bg-primary/15 text-primary border-primary/30',
  completed: 'bg-safe/10 text-safe border-safe/20',
  rejected: 'bg-critical/10 text-critical border-critical/20',
}

function formatRelative(iso: string, locale: 'id' | 'en'): string {
  const date = new Date(iso)
  const diffMs = date.getTime() - Date.now()
  const diffH = Math.round(diffMs / (1000 * 60 * 60))
  const sign = diffH < 0 ? '-' : ''
  const abs = Math.abs(diffH)
  if (abs < 24) {
    return locale === 'id' ? `${sign}${abs} jam` : `${sign}${abs}h`
  }
  const days = Math.round(abs / 24)
  return locale === 'id' ? `${sign}${days} hari` : `${sign}${days}d`
}

export function RecentTransfers() {
  const { t, locale } = useI18n()
  const all = useAllRequests()

  const recent = [...all]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            {t('dashboard.recentTransfers')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('dashboard.recentTransfersSub')}</p>
        </div>
        <Link
          to="/network?tab=history"
          className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
        >
          {t('dashboard.viewAll')}
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 items-center justify-center py-6 text-sm">
          {t('common.empty')}
        </div>
      ) : (
        <ul className="divide-border/60 my-2 flex flex-1 flex-col divide-y">
          {recent.map((req) => (
            <RecentRow key={req.id} req={req} locale={locale} />
          ))}
        </ul>
      )}
    </div>
  )
}

function RecentRow({ req, locale }: { req: TransferRequest; locale: 'id' | 'en' }) {
  const { t } = useI18n()
  const StatusIcon = STATUS_ICONS[req.status]
  const isOutgoing = req.status === 'shipped' || req.status === 'rejected'
  const DirectionIcon = isOutgoing ? ArrowUpFromLine : ArrowDownToLine

  return (
    <li>
      <Link
        to={`/network?focus=${req.id}`}
        className="hover:bg-muted/50 group -mx-2 flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <DirectionIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="group-hover:text-primary text-foreground truncate text-sm leading-tight font-semibold transition-colors">
              {req.medicineName}{' '}
              <span className="text-muted-foreground text-xs font-normal">
                ({req.quantity} units)
              </span>
            </p>
            <p className="text-muted-foreground mt-0.5 truncate text-xs">
              {req.fromHospitalName} {'->'} {req.toHospitalName} {' - '}{' '}
              {formatRelative(req.createdAt, locale)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_STYLE[req.status]}`}
          >
            <StatusIcon className="size-3.5" />
            <span>{t(`status.${req.status}`)}</span>
          </span>
          <ChevronRight className="text-muted-foreground/60 size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </li>
  )
}
