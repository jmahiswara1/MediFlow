import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { useTotalUnreadForUser } from '@/store'
import { useCurrentUser } from '@/store'

interface FloatingChatButtonProps {
  open: boolean
  onToggle: () => void
}

export function FloatingChatButton({ open, onToggle }: FloatingChatButtonProps) {
  const { t } = useI18n()
  const user = useCurrentUser()
  const unread = useTotalUnreadForUser(user?.id)

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? t('teamChat.fabClose') : t('teamChat.fabOpen')}
      className={cn(
        'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 fixed right-4 bottom-4 z-50 flex size-12.5 cursor-pointer items-center justify-center rounded-full text-white transition-all duration-200 md:right-6 md:bottom-6',
        open ? 'bg-critical rotate-90' : 'bg-primary hover:bg-primary/90 hover:scale-105',
      )}
    >
      {open ? <X className="size-5" /> : <MessageCircle className="size-5" />}
      {!open && unread > 0 && (
        <span className="bg-critical text-critical-foreground ring-background absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold ring-2">
          <span className="bg-critical absolute inset-0 animate-ping rounded-full opacity-75" />
          <span className="relative">{unread > 9 ? '9+' : unread}</span>
        </span>
      )}
    </button>
  )
}
