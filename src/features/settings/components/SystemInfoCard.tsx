import { useState } from 'react'
import { CheckCircle2, Download, Network, RotateCcw, Server, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/useI18n'
import { ResetDemoDialog } from './ResetDemoDialog'

export function SystemInfoCard() {
  const { t } = useI18n()
  const [resetOpen, setResetOpen] = useState(false)

  const handleExport = () => {
    try {
      const data: Record<string, unknown> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('mediflow')) {
          data[key] = JSON.parse(localStorage.getItem(key) || '{}')
        }
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mediflow-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('File cadangan JSON berhasil diunduh')
    } catch {
      toast.error('Gagal mengekspor data')
    }
  }

  const handleConfirmReset = () => {
    localStorage.clear()
    toast.success(t('settings.toastResetSuccess'))
    setResetOpen(false)
    setTimeout(() => {
      window.location.href = '/'
    }, 600)
  }

  return (
    <>
      <div className="bg-card border-border/80 space-y-5 rounded-2xl border p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
            <Server className="size-4" />
          </span>
          <div>
            <h3 className="text-foreground text-sm font-bold sm:text-base">
              {t('settings.system')}
            </h3>
            <p className="text-muted-foreground text-xs">{t('settings.systemDesc')}</p>
          </div>
        </div>

        {/* Integration Status Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="bg-muted/30 border-border/60 space-y-1 rounded-xl border p-3.5">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              {t('settings.satusehatStatus')}
            </p>
            <div className="text-safe flex items-center gap-1.5 text-xs font-bold">
              <CheckCircle2 className="size-3.5" />
              <span>{t('settings.satusehatOnline')}</span>
            </div>
          </div>

          <div className="bg-muted/30 border-border/60 space-y-1 rounded-xl border p-3.5">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              {t('settings.networkNodes')}
            </p>
            <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
              <Network className="text-primary size-3.5" />
              <span>{t('settings.networkNodesCount')}</span>
            </div>
          </div>

          <div className="bg-muted/30 border-border/60 space-y-1 rounded-xl border p-3.5">
            <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              {t('settings.appVersion')}
            </p>
            <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
              <Sparkles className="text-primary size-3.5" />
              <span>MediFlow Enterprise v2.4.0</span>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="divide-border/60 divide-y rounded-xl border">
          {/* Export JSON */}
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="bg-primary/10 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <Download className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground text-xs font-bold sm:text-sm">
                  {t('settings.exportData')}
                </p>
                <p className="text-muted-foreground text-xs">{t('settings.exportDataDesc')}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="shrink-0 cursor-pointer gap-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all"
            >
              <Download className="size-3.5" />
              <span>{t('settings.exportDataBtn')}</span>
            </Button>
          </div>

          {/* Reset Demo Data */}
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="bg-critical/10 text-critical mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <RotateCcw className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-foreground text-xs font-bold sm:text-sm">
                  {t('settings.resetDemoData')}
                </p>
                <p className="text-muted-foreground text-xs">{t('settings.resetDemoDataDesc')}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResetOpen(true)}
              className="text-critical hover:bg-critical/10 hover:border-critical/30 shrink-0 cursor-pointer gap-1.5 rounded-xl text-xs font-bold transition-all"
            >
              <RotateCcw className="size-3.5" />
              <span>{t('settings.resetDemoDataBtn')}</span>
            </Button>
          </div>
        </div>
      </div>

      <ResetDemoDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        onConfirm={handleConfirmReset}
      />
    </>
  )
}
