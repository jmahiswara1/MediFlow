import { useState } from 'react'
import { Check, Truck, X } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useIncomingRequests, useTransferStore } from '@/store'
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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import type { TransferRequest, Urgency } from '@/types'
import { formatRelative } from '@/utils/dateHelpers'

const URGENCY_BADGE: Record<Urgency, string> = {
  high: 'bg-critical text-critical-foreground',
  normal: 'bg-muted text-muted-foreground ring-1 ring-border',
  low: 'bg-low text-low-foreground',
}

export function IncomingRequestsTable() {
  const { t, locale } = useI18n()
  const requests = useIncomingRequests()
  const currentUser = useCurrentUser()
  const approve = useTransferStore((s) => s.approveRequest)
  const decline = useTransferStore((s) => s.declineRequest)
  const markShipped = useTransferStore((s) => s.markShipped)
  const [declineTarget, setDeclineTarget] = useState<TransferRequest | null>(null)
  const [declineReason, setDeclineReason] = useState('')
  const [shipTarget, setShipTarget] = useState<TransferRequest | null>(null)
  const [expedition, setExpedition] = useState('')

  const handleApprove = (req: TransferRequest) => {
    if (!currentUser) return
    approve(req.id, currentUser.id, currentUser.name)
    toast.success(t('transfer.approve'), {
      description: `${req.medicineName} • ${req.quantity} item disetujui`,
    })
  }

  const handleDeclineConfirm = () => {
    if (!declineTarget || !currentUser) return
    if (declineReason.trim().length < 10) return
    decline(declineTarget.id, currentUser.id, currentUser.name, declineReason.trim())
    toast.info(t('transfer.decline'), {
      description: declineReason.trim(),
    })
    setDeclineTarget(null)
    setDeclineReason('')
  }

  const handleShipConfirm = () => {
    if (!shipTarget) return
    if (expedition.trim().length < 2) return
    markShipped(shipTarget.id, expedition.trim())
    toast.success(t('transfer.markShipped'), {
      description: `${shipTarget.medicineName} • ${expedition.trim()}`,
    })
    setShipTarget(null)
    setExpedition('')
  }

  if (requests.length === 0) {
    return (
      <div className="bg-card text-muted-foreground rounded-2xl border p-12 text-center shadow-sm">
        <p className="text-sm">{t('network.detail.emptyIncoming')}</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-card overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
          <div>
            <h3 className="text-foreground text-sm font-bold tracking-tight">
              {t('network.tabs.incoming')}
            </h3>
            <p className="text-muted-foreground text-xs">
              {requests.length} {t('network.requestsCount')}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-border bg-muted/20 border-b text-left text-[11px] tracking-wide uppercase">
                <th className="px-5 py-3 font-semibold">{t('transfer.fromHospital')}</th>
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
                    <p className="text-foreground font-semibold">{req.fromHospitalName}</p>
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
                    <div className="flex items-center justify-end gap-2">
                      {req.status === 'pending' ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeclineTarget(req)}
                            className="gap-1 rounded-lg font-semibold"
                          >
                            <X className="size-3.5" />
                            <span>{t('transfer.decline')}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(req)}
                            className="gap-1 rounded-lg font-semibold"
                          >
                            <Check className="size-3.5" />
                            <span>{t('transfer.approve')}</span>
                          </Button>
                        </>
                      ) : req.status === 'approved' ? (
                        <Button
                          size="sm"
                          onClick={() => setShipTarget(req)}
                          className="gap-1 rounded-lg font-semibold"
                        >
                          <Truck className="size-3.5" />
                          <span>{t('transfer.markShipped')}</span>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs font-medium">
                          {t('network.processed')}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={Boolean(declineTarget)}
        onOpenChange={(open) => !open && setDeclineTarget(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t('transfer.decline')}</DialogTitle>
            <DialogDescription className="text-xs">
              {declineTarget?.medicineName} • {declineTarget?.quantity} item{' '}
              {t('transfer.fromHospital')} {declineTarget?.fromHospitalName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-foreground text-xs font-semibold">
              {t('transfer.declineReason')}
            </label>
            <Textarea
              value={declineReason}
              onChange={(event) => setDeclineReason(event.target.value)}
              placeholder={t('transfer.declineReasonPlaceholder')}
              rows={3}
              maxLength={280}
              className="rounded-xl text-xs"
            />
            <p className="text-muted-foreground text-xs">{declineReason.length}/280</p>
          </div>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeclineTarget(null)} className="rounded-xl">
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeclineConfirm}
              disabled={declineReason.trim().length < 10}
              className="rounded-xl font-semibold"
            >
              {t('transfer.decline')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(shipTarget)} onOpenChange={(open) => !open && setShipTarget(null)}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t('transfer.markShipped')}</DialogTitle>
            <DialogDescription className="text-xs">
              {shipTarget?.medicineName} • {shipTarget?.quantity} item {t('transfer.toHospital')}{' '}
              {shipTarget?.fromHospitalName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-foreground text-xs font-semibold">
              {t('transfer.expeditionLabel')}
            </label>
            <Input
              value={expedition}
              onChange={(event) => setExpedition(event.target.value)}
              placeholder={t('transfer.expeditionPlaceholder')}
              maxLength={80}
              className="rounded-xl text-xs"
            />
          </div>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShipTarget(null)} className="rounded-xl">
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleShipConfirm}
              disabled={expedition.trim().length < 2}
              className="rounded-xl font-semibold"
            >
              {t('transfer.markShipped')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
