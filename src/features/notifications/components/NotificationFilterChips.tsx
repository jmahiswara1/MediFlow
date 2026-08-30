import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

export type NotificationFilter = 'all' | 'unread' | 'transfer' | 'stock' | 'system'

interface NotificationFilterChipsProps {
  activeFilter: NotificationFilter
  onFilterChange: (filter: NotificationFilter) => void
  counts: {
    all: number
    unread: number
    transfer: number
    stock: number
    system: number
  }
}

export function NotificationFilterChips({
  activeFilter,
  onFilterChange,
  counts,
}: NotificationFilterChipsProps) {
  const { t } = useI18n()

  const filters: { key: NotificationFilter; label: string; count: number }[] = [
    { key: 'all', label: t('notifications.filterAll'), count: counts.all },
    { key: 'unread', label: t('notifications.filterUnread'), count: counts.unread },
    { key: 'transfer', label: t('notifications.filterTransfer'), count: counts.transfer },
    { key: 'stock', label: t('notifications.filterStock'), count: counts.stock },
    { key: 'system', label: t('notifications.filterSystem'), count: counts.system },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key
        return (
          <button
            key={filter.key}
            type="button"
            onClick={() => onFilterChange(filter.key)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all select-none',
              isActive
                ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                : 'bg-card text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground border',
            )}
          >
            <span>{filter.label}</span>
            <span
              className={cn(
                'py-0.2 rounded-md px-1.5 text-[10px] font-bold tracking-tight',
                isActive
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {filter.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
