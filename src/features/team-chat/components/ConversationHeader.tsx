import { Building2, ChevronLeft, Info, Users as UsersIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { userList } from '@/data/users'
import type { Conversation } from '@/types'
import {
  getConversationAvatarSeed,
  getConversationTitle,
  isUserOnline,
} from '../utils/conversationHelpers'

interface ConversationHeaderProps {
  conv: Conversation
  currentUserId: string | undefined
  onBack?: () => void
  onOpenSidebar?: () => void
  isSidebarOpen?: boolean
}

export function ConversationHeader({
  conv,
  currentUserId,
  onBack,
  onOpenSidebar,
  isSidebarOpen,
}: ConversationHeaderProps) {
  const { t } = useI18n()
  const title = getConversationTitle(conv, currentUserId, userList)
  const seed = getConversationAvatarSeed(conv, currentUserId, userList)
  const isGroup = conv.kind === 'group'

  const otherUser = !isGroup
    ? userList.find((u) => u.id === conv.participantIds.find((id) => id !== currentUserId))
    : undefined
  const online = isUserOnline(otherUser)
  const memberCount = conv.participantIds.length

  return (
    <div className="border-border/80 bg-card/90 flex h-14 items-center justify-between gap-3 rounded-2xl border px-3.5 shadow-xs backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="hover:bg-muted text-muted-foreground -ml-1 flex size-8 items-center justify-center rounded-xl transition-colors md:hidden"
            aria-label={t('common.back') ?? 'Kembali'}
          >
            <ChevronLeft className="size-4" />
          </button>
        )}

        {/* Avatar with Status Ring */}
        <div className="relative shrink-0">
          <span
            className={cn(
              'flex size-9.5 items-center justify-center rounded-xl text-xs font-bold shadow-2xs',
              isGroup
                ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                : 'bg-primary/15 text-primary',
            )}
          >
            {seed}
          </span>
          {isGroup ? (
            <span className="ring-card absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xs ring-2">
              <UsersIcon className="size-2" />
            </span>
          ) : (
            <span
              className={cn(
                'ring-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2',
                online ? 'bg-safe' : 'bg-muted-foreground/40',
              )}
            />
          )}
        </div>

        {/* Header Title & Subtitle */}
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-bold tracking-tight">{title}</p>
          <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            {isGroup ? (
              <span className="flex items-center gap-1">
                <UsersIcon className="size-3" />
                <span>
                  {memberCount} {t('teamChat.members')}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 truncate">
                {otherUser?.hospitalName && (
                  <>
                    <Building2 className="size-3 shrink-0 opacity-70" />
                    <span className="truncate">{otherUser.hospitalName}</span>
                    <span className="opacity-40">•</span>
                  </>
                )}
                {online ? (
                  <span className="text-safe font-medium">{t('teamChat.online')}</span>
                ) : (
                  <span>{t('teamChat.offline')}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className={cn(
              'flex size-8.5 items-center justify-center rounded-xl transition-colors',
              isSidebarOpen
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground',
            )}
            aria-label={t('teamChat.summaryTitle')}
            title={t('teamChat.summaryTitle')}
          >
            <Info className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
