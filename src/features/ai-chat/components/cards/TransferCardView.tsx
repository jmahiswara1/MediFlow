import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, PackageCheck, Send, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import type { TransferCard } from '@/types'
import { cn } from '@/lib/utils'

interface TransferCardViewProps {
  card: TransferCard
}

export function TransferCardView({ card }: TransferCardViewProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  const statusConfig = {
    pending: { label: 'Pending Approval', color: 'bg-low/20 text-low-foreground', icon: Clock },
    approved: {
      label: 'Approved (Packing)',
      color: 'bg-primary/20 text-primary',
      icon: PackageCheck,
    },
    shipped: { label: 'In Transit (Dikirim)', color: 'bg-primary/20 text-primary', icon: Truck },
    completed: { label: 'Completed', color: 'bg-safe/20 text-safe', icon: CheckCircle2 },
    rejected: { label: 'Rejected', color: 'bg-critical/20 text-critical', icon: Clock },
  }[card.status] || { label: card.status, color: 'bg-muted text-muted-foreground', icon: Clock }

  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-card text-card-foreground border-border/90 flex flex-col gap-3.5 rounded-2xl border p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 text-primary shrink-0 rounded-xl p-2">
            <Truck className="size-4" />
          </div>
          <div>
            <h4 className="text-foreground text-sm font-bold">{card.transferId}</h4>
            <p className="text-muted-foreground text-xs">Oleh {card.createdByName}</p>
          </div>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase shadow-2xs',
            statusConfig.color,
          )}
        >
          <StatusIcon className="size-3" />
          <span>{statusConfig.label}</span>
        </span>
      </div>

      {/* Transfer Route & Item */}
      <div className="bg-muted/40 border-border/60 space-y-2 rounded-xl border p-3 text-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-muted-foreground text-[10px] font-semibold uppercase">Faskes Asal</p>
            <p className="text-foreground truncate font-bold">{card.fromHospitalName}</p>
          </div>
          <ArrowRight className="text-muted-foreground size-3.5 shrink-0" />
          <div className="min-w-0 text-right">
            <p className="text-muted-foreground text-[10px] font-semibold uppercase">
              Faskes Tujuan
            </p>
            <p className="text-foreground truncate font-bold">{card.toHospitalName}</p>
          </div>
        </div>

        <div className="border-border/60 flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground font-medium">Pasokan Medis:</span>
          <span className="text-foreground font-bold tabular-nums">
            {card.medicineName} ({card.quantity} unit)
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="border-border/60 flex justify-end border-t pt-3">
        <Button
          size="sm"
          onClick={() => navigate('/network')}
          className="gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
        >
          <Send className="size-3.5" />
          <span>{t('aiChat.cards.viewTransfer')}</span>
        </Button>
      </div>
    </div>
  )
}
