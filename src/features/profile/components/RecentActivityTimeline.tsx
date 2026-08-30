import { ArrowUpRight, History, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser, useTransferStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { formatRelative } from '@/utils/dateHelpers'
import { StatusBadge } from '@/components/ui/status-badge'

export function RecentActivityTimeline() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const requests = useTransferStore((s) => s.requests)

  if (!user) return null

  const userRequests = requests
    .filter((r) => r.fromHospitalId === user.hospitalId || r.toHospitalId === user.hospitalId)
    .slice(0, 5)

  return (
    <div className="bg-card border-border/80 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
            <History className="size-4" />
          </span>
          <h3 className="text-foreground text-sm font-bold sm:text-base">
            {t('profile.recentActivity')}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/network')}
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-semibold hover:underline"
        >
          <span>{t('dashboard.recentTransfers.viewAll')}</span>
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      {userRequests.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-xs italic">
          {t('profile.noRecentActivity')}
        </p>
      ) : (
        <div className="divide-border/60 divide-y overflow-hidden rounded-xl border">
          {userRequests.map((req) => {
            const isOutgoing = req.fromHospitalId === user.hospitalId

            return (
              <div
                key={req.id}
                onClick={() => navigate(`/network?focus=${req.id}`)}
                className="hover:bg-muted/40 flex cursor-pointer items-center justify-between gap-3 p-3.5 transition-colors"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="bg-primary/10 text-primary flex size-8.5 shrink-0 items-center justify-center rounded-xl font-bold">
                    <Package className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-xs font-bold sm:text-sm">
                      {req.medicineName} ({req.quantity.toLocaleString('id-ID')} unit)
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1 truncate text-[11px]">
                      <span>
                        {isOutgoing ? `Ke ${req.toHospitalName}` : `Dari ${req.fromHospitalName}`}
                      </span>
                      <span>•</span>
                      <span>{formatRelative(req.createdAt)}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={req.status} label={t(`status.${req.status}`)} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
