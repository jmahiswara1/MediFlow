import { cn } from '@/lib/utils'
import type { StockStatus, TransferStatus, Urgency } from '@/types'

export type StatusVariant =
  | StockStatus
  | TransferStatus
  | `urgency-${Urgency}`

interface StatusBadgeProps {
  status: StatusVariant
  label: string
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  // Stock status
  safe: 'bg-safe text-safe-foreground',
  low: 'bg-low text-low-foreground',
  critical: 'bg-critical text-critical-foreground',
  // Transfer status
  pending: 'bg-muted text-muted-foreground ring-1 ring-border',
  approved: 'bg-primary text-primary-foreground',
  shipped: 'bg-chart-4 text-primary-foreground',
  completed: 'bg-safe text-safe-foreground',
  rejected: 'bg-critical text-critical-foreground',
  // Urgency
  'urgency-high': 'bg-critical text-critical-foreground',
  'urgency-normal': 'bg-muted text-muted-foreground ring-1 ring-border',
  'urgency-low': 'bg-low text-low-foreground',
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide',
        variantStyles[status],
        className,
      )}
    >
      {label}
    </span>
  )
}