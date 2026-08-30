import { Bell } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'

// Shell: filter chips + list skeleton. Full implementation lives in feat/features branch.
export function NotificationsPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('notifications.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('notifications.description')}</p>
      </div>

      <div className="bg-card text-card-foreground flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
        <span className="bg-muted text-muted-foreground rounded-full p-4">
          <Bell className="size-6" />
        </span>
        <div className="space-y-1">
          <p className="font-medium">{t('notifications.empty')}</p>
          <p className="text-muted-foreground text-sm">Implementasi lengkap menyusul.</p>
        </div>
      </div>
    </div>
  )
}
