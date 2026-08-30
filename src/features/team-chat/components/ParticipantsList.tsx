import { Building2, Crown, LogOut, MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useTeamChatStore } from '@/store'
import { userList } from '@/data/users'
import type { Conversation } from '@/types'
import { isUserOnline } from '../utils/conversationHelpers'
import { cn } from '@/lib/utils'

interface ParticipantsListProps {
  conversation: Conversation
}

export function ParticipantsList({ conversation }: ParticipantsListProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const user = useCurrentUser()
  const leave = useTeamChatStore((s) => s.leaveConversation)
  const getOrCreateDm = useTeamChatStore((s) => s.getOrCreateDm)

  const members = conversation.participantIds
    .map((id) => userList.find((u) => u.id === id))
    .filter(Boolean)

  const handleStartDm = (otherUserId: string) => {
    if (!user) return
    const dmId = getOrCreateDm(otherUserId, user.id)
    navigate(`/chat?c=${dmId}`)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between px-1 pb-1">
        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
          {t('teamChat.tabs.participants')} &bull; {members.length}
        </p>
      </div>

      <div className="space-y-1">
        {members.map((m) => {
          if (!m) return null
          const isCreator = m.id === conversation.createdBy
          const isSelf = user?.id === m.id
          const online = isUserOnline(m)

          return (
            <div
              key={m.id}
              className="hover:bg-muted/60 group flex items-center gap-2.5 rounded-xl p-2 transition-colors"
            >
              {/* Avatar with Status */}
              <div className="relative shrink-0">
                <span className="bg-primary/15 text-primary flex size-8.5 items-center justify-center rounded-xl text-xs font-bold shadow-2xs">
                  {m.avatarSeed}
                </span>
                <span
                  className={cn(
                    'ring-card absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2',
                    online ? 'bg-safe' : 'bg-muted-foreground/30',
                  )}
                  title={online ? t('teamChat.online') : t('teamChat.offline')}
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs leading-tight font-bold">
                    {m.name}{' '}
                    {isSelf && (
                      <span className="text-muted-foreground font-normal">{t('teamChat.you')}</span>
                    )}
                  </p>
                  {isCreator && (
                    <span
                      className="text-amber-600 dark:text-amber-400"
                      title={t('teamChat.creator')}
                    >
                      <Crown className="size-3" />
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground flex items-center gap-1 truncate text-[10px]">
                  <Building2 className="size-2.5 shrink-0 opacity-60" />
                  <span className="truncate">{m.hospitalName}</span>
                </p>
              </div>

              {/* Actions */}
              {!isSelf && (
                <button
                  type="button"
                  onClick={() => handleStartDm(m.id)}
                  className="hover:bg-primary/10 hover:text-primary text-muted-foreground flex size-7 items-center justify-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                  title={t('teamChat.sendDirectMessageTo', { name: m.name })}
                  aria-label={t('teamChat.sendDirectMessageTo', { name: m.name })}
                >
                  <MessageCircle className="size-3.5" />
                </button>
              )}

              {isSelf && conversation.kind === 'group' && (
                <button
                  type="button"
                  onClick={() => leave(conversation.id, user.id)}
                  className="text-muted-foreground hover:bg-critical/10 hover:text-critical flex size-7 items-center justify-center rounded-lg transition-colors"
                  title={t('teamChat.leave')}
                  aria-label={t('teamChat.leave')}
                >
                  <LogOut className="size-3.5" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
