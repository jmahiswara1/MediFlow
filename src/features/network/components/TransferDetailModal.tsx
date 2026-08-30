import { useMemo } from 'react'
import { Check, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useRequestById } from '@/store'
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
import { cn } from '@/lib/utils'
import { formatDate, formatRelative } from '@/utils/dateHelpers'
import type { TransferStatus } from '@/types'

interface TransferDetailModalProps {
  open: boolean
  onClose: () => void
  transferId: string | null
}

const STEP_ORDER: TransferStatus[] = ['pending', 'approved', 'shipped', 'completed']
const STEP_LABEL_KEY: Record<TransferStatus, string> = {
  pending: 'transfer.step.requested',
  approved: 'transfer.step.approved',
  shipped: 'transfer.step.shipped',
  completed: 'transfer.step.completed',
  rejected: 'transfer.step.rejected',
}

const STEP_ICON: Record<TransferStatus, typeof Clock> = {
  pending: Clock,
  approved: Check,
  shipped: Truck,
  completed: CheckCircle2,
  rejected: XCircle,
}

function isStepActive(currentStatus: TransferStatus, step: TransferStatus): boolean {
  if (currentStatus === 'rejected') return false
  return STEP_ORDER.indexOf(currentStatus) >= STEP_ORDER.indexOf(step)
}

function isStepDone(currentStatus: TransferStatus, step: TransferStatus): boolean {
  if (currentStatus === 'rejected') return false
  return STEP_ORDER.indexOf(currentStatus) > STEP_ORDER.indexOf(step)
}

export function TransferDetailModal({ open, onClose, transferId }: TransferDetailModalProps) {
  const { t, locale } = useI18n()
  const transfer = useRequestById(transferId)

  const currentStep = useMemo<TransferStatus>(() => {
    if (!transfer) return 'pending'
    return transfer.status
  }, [transfer])

  if (!transfer) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('transfer.detailNotFound')}</DialogTitle>
            <DialogDescription>{t('transfer.transferMissing')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>{t('common.cancel')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const showSteps = transfer.status !== 'rejected'
  const showReject = transfer.status === 'rejected'

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>
              {transfer.id.toUpperCase()} - {transfer.medicineName}
            </DialogTitle>
            <StatusBadge status={transfer.status} label={t(`status.${transfer.status}`)} />
          </div>
          <DialogDescription>
            {transfer.fromHospitalName} {'->'} {transfer.toHospitalName} -{' '}
            {formatDate(transfer.createdAt, locale)}
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="border-border grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
          <SummaryItem
            label={t('transfer.medicine')}
            value={`${transfer.medicineName} x ${transfer.quantity}`}
          />
          <SummaryItem
            label={t('transfer.urgency')}
            value={t(`urgency.${transfer.urgency}`)}
            valueClass={
              transfer.urgency === 'high'
                ? 'text-critical'
                : transfer.urgency === 'low'
                  ? 'text-low-foreground'
                  : 'text-muted-foreground'
            }
          />
          <SummaryItem label={t('transfer.fromHospital')} value={transfer.fromHospitalName} />
          <SummaryItem label={t('transfer.toHospital')} value={transfer.toHospitalName} />
          {transfer.notes && (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                {t('transfer.notes')}
              </p>
              <p className="mt-1 text-sm italic">"{transfer.notes}"</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
            {t('transfer.tracker')}
          </p>

          {showSteps && (
            <ol className="border-border relative space-y-3 rounded-xl border p-4">
              {STEP_ORDER.map((step, idx) => {
                const event = transfer.timeline.find((e) => e.status === step)
                const active = isStepActive(currentStep, step)
                const done = isStepDone(currentStep, step) || currentStep === step
                const Icon = STEP_ICON[step]
                return (
                  <li key={step} className="relative flex gap-3 pl-1">
                    {idx < STEP_ORDER.length - 1 && (
                      <span
                        className={cn(
                          'absolute top-6 left-3.5 h-full w-px',
                          done ? 'bg-safe' : 'bg-border',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'z-10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                        done
                          ? 'border-safe bg-safe text-safe-foreground'
                          : active
                            ? 'border-primary bg-primary/10 text-primary animate-pulse'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1 pb-1">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          done ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {t(STEP_LABEL_KEY[step])}
                      </p>
                      {event && (
                        <p className="text-muted-foreground text-[11px] tabular-nums">
                          {formatDate(event.at, locale)} - {formatRelative(event.at, locale)}
                          {event.byName && ` - ${event.byName}`}
                          {event.expedition && ` - ${event.expedition}`}
                          {event.receivedBy && ` - ${t('transfer.receivedBy')} ${event.receivedBy}`}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          {showReject && (
            <div className="bg-critical/10 border-critical/30 text-critical rounded-xl border p-4">
              <div className="flex items-start gap-2">
                <XCircle className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">{t('transfer.step.rejected')}</p>
                  {transfer.timeline.find((e) => e.status === 'rejected')?.reason && (
                    <p className="text-critical/85 mt-1 text-sm italic">
                      "{transfer.timeline.find((e) => e.status === 'rejected')?.reason}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SummaryItem({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div>
      <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
        {label}
      </p>
      <p className={cn('mt-1 text-sm font-medium', valueClass)}>{value}</p>
    </div>
  )
}
