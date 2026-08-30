import { AlertTriangle, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/useI18n'

interface ResetDemoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ResetDemoDialog({ open, onOpenChange, onConfirm }: ResetDemoDialogProps) {
  const { t } = useI18n()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-border/70 bg-muted/30 border-b p-5">
          <div className="flex items-center gap-3">
            <span className="bg-critical/15 text-critical flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs">
              <AlertTriangle className="size-5" />
            </span>
            <div className="min-w-0 flex-1 pr-6">
              <DialogTitle className="text-base leading-snug font-bold">
                {t('settings.resetConfirmTitle')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-0.5 text-xs leading-normal">
                {t('settings.resetConfirmDesc')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body Warning */}
        <div className="space-y-3 px-5 py-4">
          <div className="bg-critical/10 border-critical/20 text-critical flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed">
            <span className="mt-0.5 shrink-0 font-bold">•</span>
            <p className="text-foreground/80 font-medium">
              Penyimpanan lokal browser (LocalStorage) untuk simulasi ini akan diatur ulang ke
              konfigurasi bawaan awal.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border/70 bg-muted/30 flex items-center justify-end gap-2.5 border-t px-5 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            className="bg-critical hover:bg-critical/90 cursor-pointer gap-1.5 rounded-xl px-4.5 py-2 text-xs font-bold text-white shadow-2xs transition-all"
          >
            <RotateCcw className="size-3.5" />
            <span>{t('settings.resetDemoDataBtn')}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
