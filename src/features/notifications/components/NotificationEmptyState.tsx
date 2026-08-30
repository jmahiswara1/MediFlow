import { BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/useI18n'

interface NotificationEmptyStateProps {
  isFiltered?: boolean
  onResetFilter?: () => void
}

export function NotificationEmptyState({
  isFiltered = false,
  onResetFilter,
}: NotificationEmptyStateProps) {
  const { t } = useI18n()

  return (
    <div className="bg-card text-card-foreground border-border/70 flex flex-col items-center justify-center gap-3 rounded-2xl border p-12 text-center">
      <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl p-3">
        <BellOff className="size-7" />
      </div>

      <div className="max-w-sm space-y-1">
        <p className="text-foreground text-base font-bold">
          {isFiltered ? t('notifications.emptyFiltered') : t('notifications.empty')}
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          {isFiltered ? t('notifications.emptyFilteredDesc') : t('notifications.emptyDesc')}
        </p>
      </div>

      {isFiltered && onResetFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilter}
          className="mt-2 cursor-pointer rounded-xl text-xs font-semibold"
        >
          {t('notifications.filterAll')}
        </Button>
      )}
    </div>
  )
}
