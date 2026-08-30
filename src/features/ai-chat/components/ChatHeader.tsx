import { useState } from 'react'
import { Download, RotateCcw, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
    toast.success('Riwayat percakapan berhasil direset')
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Tautan percakapan disalin ke clipboard')
  }

  const handleExport = () => {
    toast.success('Ringkasan inteligensi siap diekspor')
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
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 rounded-xl px-2.5 text-xs font-semibold"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden md:inline">{t('aiChat.resetChat')}</span>
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {t('aiChat.resetConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-xs">
              {t('aiChat.resetConfirmDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
              className="rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReset}
              className="rounded-xl"
            >
              {t('aiChat.resetChat')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
