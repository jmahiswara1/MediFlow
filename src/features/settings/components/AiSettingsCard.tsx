import { Bot, Sparkles, Trash2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useChatStore, useSettingsStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export function AiSettingsCard() {
  const { t } = useI18n()
  const settings = useSettingsStore()
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const clearChatHistory = useChatStore((s) => s.clearHistory)

  const handleThresholdChange = (val: number) => {
    updateSettings({ outbreakThreshold: val })
    toast.success(`Ambang batas diubah ke +${val}%`)
  }

  const handleClearCache = () => {
    clearChatHistory()
    toast.success(t('aiChat.toastResetSuccess'))
  }

  return (
    <div className="bg-card border-border/80 space-y-5 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
          <Bot className="size-4" />
        </span>
        <div>
          <h3 className="text-foreground text-sm font-bold sm:text-base">
            {t('settings.aiSettings')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('settings.aiSettingsDesc')}</p>
        </div>
      </div>

      <div className="divide-border/60 divide-y rounded-xl border">
        {/* 1. Auto-Suggest Transfer Recommendations */}
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Zap className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.autoSuggest')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.autoSuggestDesc')}</p>
            </div>
          </div>
          <Switch
            checked={settings.autoSuggestTransfers}
            onCheckedChange={(checked) => {
              updateSettings({ autoSuggestTransfers: checked })
              toast.success(t('settings.toastSaved'))
            }}
            aria-label={t('settings.autoSuggest')}
          />
        </div>

        {/* 2. Outbreak Detection Threshold */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.outbreakThreshold')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.outbreakThresholdDesc')}</p>
            </div>
          </div>
          <div className="bg-muted/50 border-border/70 inline-flex shrink-0 items-center gap-1 rounded-xl border p-1">
            {[15, 20, 30].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleThresholdChange(val)}
                className={cn(
                  'cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold tabular-nums transition-all',
                  settings.outbreakThreshold === val
                    ? 'bg-card text-foreground font-bold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                +{val}%
              </button>
            ))}
          </div>
        </div>

        {/* 3. Clear AI Cache & Conversation History */}
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className="bg-critical/10 text-critical mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Trash2 className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground text-xs font-bold sm:text-sm">
                {t('settings.clearAiHistory')}
              </p>
              <p className="text-muted-foreground text-xs">{t('settings.clearAiHistoryDesc')}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="text-critical hover:bg-critical/10 hover:border-critical/30 shrink-0 cursor-pointer gap-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 className="size-3.5" />
            <span>{t('settings.clearAiHistoryBtn')}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
