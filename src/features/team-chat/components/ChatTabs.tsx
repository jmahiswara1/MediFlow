import { FileText, MessageSquare, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'

export type ChatSideTab = 'messages' | 'participants' | 'files'

interface ChatTabsProps {
  active: ChatSideTab
  onChange: (tab: ChatSideTab) => void
}

export function ChatTabs({ active, onChange }: ChatTabsProps) {
  const { t } = useI18n()
  const tabs: { key: ChatSideTab; label: string; icon: typeof Users }[] = [
    { key: 'messages', label: t('teamChat.tabs.messages'), icon: MessageSquare },
    { key: 'participants', label: t('teamChat.tabs.participants'), icon: Users },
    { key: 'files', label: t('teamChat.tabs.files'), icon: FileText },
  ]

  return (
    <div className="bg-muted/50 border-border/70 grid grid-cols-3 gap-1 rounded-xl border p-1 shadow-2xs">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-xs font-semibold transition-all select-none',
              isActive
                ? 'bg-card text-primary ring-border/50 font-bold shadow-2xs ring-1'
                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="truncate">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
