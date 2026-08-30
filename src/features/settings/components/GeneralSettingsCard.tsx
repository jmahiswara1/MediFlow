import { Moon, PanelLeft, Sliders, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { useUiStore, useSettingsStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import type { Locale } from '@/i18n'
import { cn } from '@/lib/utils'

export function GeneralSettingsCard() {
  const { t } = useI18n()
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const locale = useUiStore((s) => s.locale)
  const setLocale = useUiStore((s) => s.setLocale)
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed)
  const compactMode = useSettingsStore((s) => s.compactMode)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale)
    toast.success(
      newLocale === 'id' ? 'Bahasa diubah ke Bahasa Indonesia' : 'Language changed to English',
    )
  }

  const handleDensityChange = (compact: boolean) => {
    updateSettings({ compactMode: compact })
    toast.success(t('settings.toastSaved'))
  }

  return (
    <div className="bg-card border-border/80 space-y-5 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
          <Sliders className="size-4" />
        </span>
        <div>
          <h3 className="text-foreground text-sm font-bold sm:text-base">
            {t('settings.general')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('settings.generalDesc')}</p>
        </div>
      </div>

      <div className="divide-border/60 divide-y rounded-xl border">
        {/* 1. Theme Setting */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-xs font-bold sm:text-sm">{t('settings.theme')}</p>
            <p className="text-muted-foreground text-xs">{t('settings.themeDesc')}</p>
          </div>
          <div className="bg-muted/50 border-border/70 inline-flex shrink-0 items-center gap-1 rounded-xl border p-1">
            <button
              type="button"
              onClick={() => {
                if (theme !== 'light') toggleTheme()
              }}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                theme === 'light'
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Sun className="size-3.5" />
              <span>{t('settings.themeLight')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (theme !== 'dark') toggleTheme()
              }}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                theme === 'dark'
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Moon className="size-3.5" />
              <span>{t('settings.themeDark')}</span>
            </button>
          </div>
        </div>

        {/* 2. Language Setting */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-xs font-bold sm:text-sm">{t('settings.language')}</p>
            <p className="text-muted-foreground text-xs">{t('settings.languageDesc')}</p>
          </div>
          <div className="bg-muted/50 border-border/70 inline-flex shrink-0 items-center gap-1 rounded-xl border p-1">
            <button
              type="button"
              onClick={() => handleLanguageChange('id')}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                locale === 'id'
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>🇮🇩</span>
              <span>Indonesia</span>
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                locale === 'en'
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

        {/* 3. Sidebar Behavior */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-xs font-bold sm:text-sm">
              {t('settings.sidebarMode')}
            </p>
            <p className="text-muted-foreground text-xs">{t('settings.sidebarModeDesc')}</p>
          </div>
          <div className="bg-muted/50 border-border/70 inline-flex shrink-0 items-center gap-1 rounded-xl border p-1">
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                !sidebarCollapsed
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <PanelLeft className="size-3.5" />
              <span>{t('settings.sidebarExpanded')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(true)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                sidebarCollapsed
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{t('settings.sidebarCollapsed')}</span>
            </button>
          </div>
        </div>

        {/* 4. Display Density */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-xs font-bold sm:text-sm">{t('settings.density')}</p>
            <p className="text-muted-foreground text-xs">{t('settings.densityDesc')}</p>
          </div>
          <div className="bg-muted/50 border-border/70 inline-flex shrink-0 items-center gap-1 rounded-xl border p-1">
            <button
              type="button"
              onClick={() => handleDensityChange(false)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                !compactMode
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{t('settings.densityComfortable')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDensityChange(true)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                compactMode
                  ? 'bg-card text-foreground font-bold shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span>{t('settings.densityCompact')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
