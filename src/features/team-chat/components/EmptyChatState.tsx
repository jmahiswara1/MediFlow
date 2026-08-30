import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'

export function EmptyChatState({ compact }: { compact?: boolean }) {
  const { t } = useI18n()
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-3 px-6 text-center ${
        compact ? 'py-6' : 'py-12'
      }`}
    >
      <div className="bg-muted text-muted-foreground rounded-full p-4">
        <MessageCircle className="size-8" />
      </div>
      <div>
        <p className="text-sm font-bold">{t('teamChat.empty')}</p>
        <p className="text-muted-foreground mt-1 max-w-xs text-xs">{t('teamChat.noMessages')}</p>
      </div>
    </div>
  )
}
