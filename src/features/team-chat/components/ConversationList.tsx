import { useState, useMemo } from 'react'
import { MessageSquare, Plus, Search, Users as UsersIcon, X } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useConversationsForUser, useUnreadByConversation } from '@/store'
import { ConversationListItem } from './ConversationListItem'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  activeId: string | null
  onSelect: (id: string) => void
  onNewChat: () => void
  onNewGroup: () => void
}

type ConvFilter = 'all' | 'dm' | 'group'

export function ConversationList({
  activeId,
  onSelect,
  onNewChat,
  onNewGroup,
}: ConversationListProps) {
  const { t } = useI18n()
  const user = useCurrentUser()
  const conversations = useConversationsForUser(user?.id)
  const unreadByConv = useUnreadByConversation(user?.id)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ConvFilter>('all')

  const filtered = useMemo(() => {
    let list = conversations
    if (filter === 'dm') {
      list = list.filter((c) => c.kind === 'dm')
    } else if (filter === 'group') {
      list = list.filter((c) => c.kind === 'group')
    }

    const q = search.toLowerCase().trim()
    if (!q) return list
    return list.filter((c) => {
      const preview = c.lastMessagePreview?.toLowerCase() ?? ''
      const name = c.name?.toLowerCase() ?? ''
      return preview.includes(q) || name.includes(q) || c.id.includes(q)
    })
  }, [conversations, filter, search])

  return (
    <div className="bg-card border-border/80 flex h-full min-h-0 flex-col rounded-2xl border shadow-xs">
      {/* Search & Filter Header */}
      <div className="border-border/70 space-y-2 border-b p-2.5">
        {/* Search Bar */}
        <div className="bg-muted/50 border-border/70 focus-within:border-primary/50 focus-within:bg-card flex h-9 items-center gap-2 rounded-xl border px-3 shadow-2xs transition-all">
          <Search className="text-muted-foreground size-3.5 shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('teamChat.searchPlaceholder')}
            className="placeholder:text-muted-foreground/60 min-w-0 flex-1 bg-transparent text-xs outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-full"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* Quick Filter Tabs */}
        <div className="bg-muted/40 border-border/50 grid grid-cols-3 gap-1 rounded-lg border p-0.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-md py-1 text-center text-[11px] font-semibold transition-all',
              filter === 'all'
                ? 'bg-card text-primary font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('teamChat.all')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('dm')}
            className={cn(
              'rounded-md py-1 text-center text-[11px] font-semibold transition-all',
              filter === 'dm'
                ? 'bg-card text-primary font-bold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('teamChat.dm')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('group')}
            className={cn(
              'rounded-md py-1 text-center text-[11px] font-semibold transition-all',
              filter === 'group'
                ? 'bg-card font-bold text-indigo-600 shadow-2xs dark:text-indigo-400'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t('teamChat.group')}
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="min-h-0 flex-1 scrollbar-thin overflow-y-auto p-1.5">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-1.5 px-4 py-8 text-center text-xs">
            <MessageSquare className="size-8 opacity-25" />
            <p className="font-medium">{search ? t('common.empty') : t('teamChat.empty')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <div className="text-muted-foreground/80 px-2.5 pt-1 pb-1 text-[10px] font-bold tracking-wider uppercase">
              {t('teamChat.lastChats')}
            </div>
            {filtered.map((c) => (
              <ConversationListItem
                key={c.id}
                conv={c}
                currentUserId={user?.id}
                active={activeId === c.id}
                unread={unreadByConv[c.id] ?? 0}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-border/70 bg-card/60 flex shrink-0 gap-2 border-t p-2">
        <button
          type="button"
          onClick={onNewChat}
          className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-colors"
        >
          <Plus className="size-3.5" />
          <span>{t('teamChat.newChat')}</span>
        </button>
        <button
          type="button"
          onClick={onNewGroup}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold text-indigo-600 shadow-2xs transition-colors hover:bg-indigo-500/20 dark:text-indigo-400"
        >
          <UsersIcon className="size-3.5" />
          <span>{t('teamChat.newGroup')}</span>
        </button>
      </div>
    </div>
  )
}
