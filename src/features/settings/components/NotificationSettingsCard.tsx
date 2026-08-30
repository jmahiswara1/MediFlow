import { Bell, MessageSquare, ShieldAlert, Sparkles, Volume2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useSettingsStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { Switch } from '@/components/ui/switch'

export function NotificationSettingsCard() {
  const { t } = useI18n()
  const settings = useSettingsStore()
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const toggle = (key: keyof typeof settings, label: string) => {
    const currentVal = settings[key]
    if (typeof currentVal === 'boolean') {
      updateSettings({ [key]: !currentVal } as Parameters<typeof updateSettings>[0])
      toast.success(`${label} ${!currentVal ? 'diaktifkan' : 'dinonaktifkan'}`)
    }
  }

  return (
    <div className="bg-card border-border/80 space-y-5 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
          <Bell className="size-4" />
        </span>
        <div>
          <h3 className="text-foreground text-sm font-bold sm:text-base">
            {t('settings.notifications')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('settings.notificationsDesc')}</p>
        </div>
      </div>

      <div className="divide-border/60 divide-y rounded-xl border">
        {/* 1. Incoming Transfer Requests */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Zap className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.notifyIncoming')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.notifyIncomingDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.notifyIncomingTransfers}
            onCheckedChange={() => toggle('notifyIncomingTransfers', t('settings.notifyIncoming'))}
            aria-label={t('settings.notifyIncoming')}
          />
        </div>

        {/* 2. Critical Stock Alerts */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-critical/10 text-critical mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <ShieldAlert className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.notifyStock')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.notifyStockDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.notifyCriticalStock}
            onCheckedChange={() => toggle('notifyCriticalStock', t('settings.notifyStock'))}
            aria-label={t('settings.notifyStock')}
          />
        </div>

        {/* 3. Outbreak Surge Alerts */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.notifyOutbreak')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.notifyOutbreakDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.notifyOutbreakSpikes}
            onCheckedChange={() => toggle('notifyOutbreakSpikes', t('settings.notifyOutbreak'))}
            aria-label={t('settings.notifyOutbreak')}
          />
        </div>

        {/* 4. Chat Mentions */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.notifyMentions')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.notifyMentionsDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.notifyChatMentions}
            onCheckedChange={() => toggle('notifyChatMentions', t('settings.notifyMentions'))}
            aria-label={t('settings.notifyMentions')}
          />
        </div>

        {/* 5. Sound Chime */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-muted text-foreground/80 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Volume2 className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.soundEnabled')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.soundEnabledDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.soundEnabled}
            onCheckedChange={() => toggle('soundEnabled', t('settings.soundEnabled'))}
            aria-label={t('settings.soundEnabled')}
          />
        </div>
      </div>
    </div>
  )
}
