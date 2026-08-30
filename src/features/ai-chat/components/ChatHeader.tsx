import { useState } from 'react'
import { AlertTriangle, Download, RotateCcw, Share2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ChatHeaderProps {
  onReset: () => void
}

export function ChatHeader({ onReset }: ChatHeaderProps) {
  const { t } = useI18n()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmReset = () => {
    setShowConfirm(false)
    onReset()
    toast.success(t('aiChat.toastResetSuccess'))
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success(t('aiChat.toastShareSuccess'))
  }

  const handleExport = () => {
    toast.success(t('aiChat.toastExportSuccess'))
  }

  return (
    <>
      <div className="flex items-center justify-between pb-3">
        {/* Left: Title + Connected indicator */}
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
            {t('aiChat.title')}
          </h1>
          <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            <span className="bg-safe inline-block size-2 animate-pulse rounded-full shadow-xs" />
            <span className="font-medium">{t('aiChat.connectedToEngine')}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
            className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold"
          >
            <Share2 className="size-3.5" />
            <span className="hidden sm:inline">{t('aiChat.actions.share')}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">{t('aiChat.actions.export')}</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowConfirm(true)}
            className="text-muted-foreground hover:text-critical hover:bg-critical/10 h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden md:inline">{t('aiChat.resetChat')}</span>
          </Button>
        </div>
      </div>

      {/* Improved Reset Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
          {/* Header */}
          <DialogHeader className="border-border/70 bg-muted/30 border-b p-5">
            <div className="flex items-center gap-3">
              <span className="bg-critical/15 text-critical flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs">
                <AlertTriangle className="size-5" />
              </span>
              <div className="min-w-0 flex-1 pr-6">
                <DialogTitle className="text-base leading-snug font-bold">
                  {t('aiChat.resetConfirmTitle')}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground pt-0.5 text-xs leading-normal">
                  {t('aiChat.resetConfirmDescription')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body with Warning Callout */}
          <div className="space-y-3 px-5 py-4">
            <div className="bg-critical/10 border-critical/20 text-critical flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed">
              <span className="mt-0.5 shrink-0 font-bold">•</span>
              <p className="text-foreground/80 font-medium">{t('aiChat.resetConfirmWarning')}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-border/70 bg-muted/30 flex items-center justify-end gap-2.5 border-t px-5 py-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmReset}
              className="bg-critical hover:bg-critical/90 cursor-pointer gap-1.5 rounded-xl px-4.5 py-2 text-xs font-bold text-white shadow-2xs transition-all"
            >
              <Trash2 className="size-3.5" />
              <span>{t('aiChat.resetChat')}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
