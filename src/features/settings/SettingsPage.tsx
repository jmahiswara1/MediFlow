import { useI18n } from '@/i18n/useI18n'
import { GeneralSettingsCard } from './components/GeneralSettingsCard'
import { NotificationSettingsCard } from './components/NotificationSettingsCard'
import { AiSettingsCard } from './components/AiSettingsCard'
import { SystemInfoCard } from './components/SystemInfoCard'

export function SettingsPage() {
  const { t } = useI18n()

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-auto pr-1 pb-8">
      {/* Header */}
      <div className="mb-6 space-y-1">
        <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground text-xs md:text-sm">{t('settings.subtitle')}</p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-6">
        <GeneralSettingsCard />
        <NotificationSettingsCard />
        <AiSettingsCard />
        <SystemInfoCard />
      </div>
    </div>
  )
}
