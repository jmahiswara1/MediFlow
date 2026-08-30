import { Building2, ClipboardList, Package } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { useStockStore, useTransferStore } from '@/store'
import { getDaysRemaining } from '@/utils/statusHelpers'
import { StatusBadge } from '@/components/ui/status-badge'
import type { AttachedCard } from '@/types'

interface AttachmentCardProps {
  card: AttachedCard
}

function AttachmentShell({
  icon,
  title,
  subtitle,
  meta,
  href,
  tone,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  meta?: ReactNode
  href?: string
  tone: 'primary' | 'muted'
}) {
  const Wrapper = href ? 'a' : 'div'
  return (
    <Wrapper
      href={href}
      className={cn(
        'group relative flex items-start gap-3 rounded-xl border p-2.5 text-xs shadow-2xs transition-all',
        tone === 'primary'
          ? 'bg-card/95 border-primary/30 hover:border-primary/60 text-foreground hover:shadow-xs'
          : 'bg-card/95 border-border/90 hover:border-foreground/30 text-foreground hover:shadow-xs',
      )}
    >
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg shadow-2xs',
          tone === 'primary' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="group-hover:text-primary truncate text-xs leading-tight font-bold transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-muted-foreground mt-0.5 truncate text-[11px] leading-tight">
            {subtitle}
          </p>
        )}
        {meta && <div className="mt-1.5 flex items-center gap-1.5">{meta}</div>}
      </div>
    </Wrapper>
  )
}

export function AttachmentCard({ card }: AttachmentCardProps) {
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)
  const transfers = useTransferStore((s) => s.requests)
  const { t } = useI18n()

  if (card.type === 'stock') {
    const hospital = hospitals.find((h) => h.id === card.hospitalId)
    const medicine = medicines.find((m) => m.id === card.medicineId)
    const stock = hospital?.stocks.find((s) => s.medicineId === card.medicineId)
    if (!hospital || !medicine || !stock) return null
    const days = getDaysRemaining(stock.currentStock, stock.dailyUsage)
    return (
      <AttachmentShell
        icon={<Package className="size-4" />}
        title={`${medicine.name} \u00b7 ${hospital.name}`}
        subtitle={`${stock.currentStock} ${medicine.unit} \u00b7 burn ${stock.dailyUsage}/day`}
        meta={
          <div className="flex items-center gap-1.5">
            <StatusBadge
              status={hospital.stockStatus}
              label={t(`status.${hospital.stockStatus}`)}
            />
            <span className="text-muted-foreground text-[11px]">
              {days === Number.POSITIVE_INFINITY ? '\u221e' : days} hari
            </span>
          </div>
        }
        href={`/network?rs=${hospital.id}`}
        tone="primary"
      />
    )
  }

  if (card.type === 'hospital') {
    const hospital = hospitals.find((h) => h.id === card.hospitalId)
    if (!hospital) return null
    return (
      <AttachmentShell
        icon={<Building2 className="size-4" />}
        title={hospital.name}
        subtitle={`${hospital.city} \u00b7 ${hospital.region}`}
        meta={
          <StatusBadge status={hospital.stockStatus} label={t(`status.${hospital.stockStatus}`)} />
        }
        href={`/network?rs=${hospital.id}`}
        tone="muted"
      />
    )
  }

  if (card.type === 'transfer') {
    const tr = transfers.find((r) => r.id === card.transferId)
    if (!tr) return null
    return (
      <AttachmentShell
        icon={<ClipboardList className="size-4" />}
        title={`${tr.id.toUpperCase()} \u00b7 ${tr.medicineName}`}
        subtitle={`${tr.fromHospitalName} \u2192 ${tr.toHospitalName}`}
        meta={
          <div className="flex items-center gap-1.5">
            <StatusBadge status={tr.status} label={t(`status.${tr.status}`)} />
            <span className="text-muted-foreground text-[11px]">
              {tr.quantity} unit \u00b7 {tr.urgency}
            </span>
          </div>
        }
        href={`/network?focus=${tr.id}&tab=outgoing`}
        tone="muted"
      />
    )
  }

  return null
}
