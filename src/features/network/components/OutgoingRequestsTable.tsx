import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/useI18n'
import { useOutgoingRequests, useTransferStore } from '@/store'
import { StatusBadge } from '@/components/ui/status-badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TransferRequest, Urgency } from '@/types'
import { formatRelative } from '@/utils/dateHelpers'

interface OutgoingRequestsTableProps {
  onNewRequest?: () => void
}

const URGENCY_BADGE: Record<Urgency, string> = {
  high: 'bg-critical text-critical-foreground',
  normal: 'bg-muted text-muted-foreground ring-1 ring-border',
  low: 'bg-low text-low-foreground',
}

export function OutgoingRequestsTable({ onNewRequest }: OutgoingRequestsTableProps) {
  const { t, locale } = useI18n()
  const requests = useOutgoingRequests()
  const cancel = useTransferStore((s) => s.cancelRequest)
  const [cancelTarget, setCancelTarget] = useState<TransferRequest | null>(null)

  const handleCancelConfirm = () => {
    if (!cancelTarget) return
    cancel(cancelTarget.id)
    toast.info(t('transfer.cancel'), {
      description: `${cancelTarget.medicineName} • ${cancelTarget.quantity}`,
    })
    setCancelTarget(null)
  }

  if (requests.length === 0) {
    return (
      <div className="bg-card text-card-foreground flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm">
        <p className="text-muted-foreground text-sm">{t('network.detail.emptyOutgoing')}</p>
        {onNewRequest && (
          <Button onClick={onNewRequest} className="mt-4 gap-2 rounded-xl">
            <Plus className="size-4" />
            <span>{t('network.createNew')}</span>
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h3 className="text-foreground text-sm font-bold tracking-tight">
              {t('network.tabs.outgoing')}
            </h3>
            <p className="text-muted-foreground text-xs">
              {requests.length} {t('network.requestsCount')}
            </p>
          </div>
          {onNewRequest && (
            <Button
              size="sm"
              onClick={onNewRequest}
              className="gap-1.5 rounded-xl font-semibold shadow-xs"
            >
              <Plus className="size-3.5" />
              <span>{t('network.createNew')}</span>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-border bg-muted/20 border-b text-left text-[11px] tracking-wide uppercase">
                <th className="px-5 py-3 font-semibold">{t('transfer.toHospital')}</th>
                <th className="px-3 py-3 font-semibold">{t('transfer.medicine')}</th>
                <th className="px-3 py-3 text-right font-semibold">{t('transfer.quantity')}</th>
                <th className="px-3 py-3 font-semibold">{t('transfer.urgency')}</th>
                <th className="px-3 py-3 font-semibold">{t('network.status')}</th>
                <th className="px-3 py-3 font-semibold">{t('network.updated')}</th>
                <th className="px-5 py-3 text-right font-semibold">{t('network.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-foreground font-semibold">{req.toHospitalName}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-foreground/90 text-sm font-medium">{req.medicineName}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right font-semibold tabular-nums">
                    {req.quantity}
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${URGENCY_BADGE[req.urgency]}`}
                    >
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={req.status} label={t(`status.${req.status}`)} />
                  </td>
                  <td className="text-muted-foreground px-3 py-3.5 text-xs tabular-nums">
                    {formatRelative(req.createdAt, locale)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {req.status === 'pending' ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setCancelTarget(req)}
                        className="gap-1 rounded-lg"
                      >
                        <X className="size-3.5" />
                        <span>{t('transfer.cancel')}</span>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs font-medium">
                        {t('network.processed')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {t('transfer.cancelConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {t('transfer.cancelConfirmDescription')
                .replace('{medicine}', cancelTarget?.medicineName ?? '')
                .replace('{hospital}', cancelTarget?.toHospitalName ?? '')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelTarget(null)} className="rounded-xl">
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              className="rounded-xl font-semibold"
            >
              {t('transfer.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
