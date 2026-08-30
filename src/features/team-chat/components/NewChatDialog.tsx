import { useMemo, useState } from 'react'
import { Building2, MessageSquare, Search, ShieldCheck, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useTeamChatStore } from '@/store'
import { userList } from '@/data/users'
import { isUserOnline } from '../utils/conversationHelpers'
import { cn } from '@/lib/utils'

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (conversationId: string) => void
}

export function NewChatDialog({ open, onOpenChange, onCreated }: NewChatDialogProps) {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const getOrCreateDm = useTeamChatStore((s) => s.getOrCreateDm)

  const [search, setSearch] = useState('')

  const others = useMemo(() => userList.filter((u) => u.id !== currentUser?.id), [currentUser])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return others
    return others.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.hospitalName.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    )
  }, [others, search])

  const handleSelectUser = (targetUserId: string) => {
    if (!currentUser) return
    const dmId = getOrCreateDm(targetUserId, currentUser.id)
    onCreated?.(dmId)
    handleClose()
  }

  const handleClose = () => {
    setSearch('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-border/70 bg-muted/30 border-b p-5">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs">
              <MessageSquare className="size-5" />
            </span>
            <div className="min-w-0 flex-1 pr-6">
              <DialogTitle className="text-base leading-snug font-bold">
                {t('teamChat.newChatDialog.title')}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground pt-0.5 text-xs leading-normal">
                {t('teamChat.newChatDialog.description')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3.5 px-5 py-4">
          {/* Search Box */}
          <div className="bg-muted/50 border-border/70 focus-within:border-primary/50 focus-within:bg-card flex h-10 items-center gap-2.5 rounded-xl border px-3 shadow-2xs transition-all">
            <Search className="text-muted-foreground size-4 shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('teamChat.newChatDialog.searchPlaceholder')}
              className="placeholder:text-muted-foreground/60 min-w-0 flex-1 bg-transparent text-xs outline-none sm:text-sm"
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-muted-foreground hover:text-foreground flex size-4.5 items-center justify-center rounded-full"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* User List */}
          <div className="border-border/60 max-h-72 scrollbar-thin overflow-y-auto rounded-xl border p-1">
            {filtered.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-xs">
                {t('teamChat.newChatDialog.noUsersFound')}
              </div>
            ) : (
              filtered.map((u) => {
                const online = isUserOnline(u)
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u.id)}
                    className="hover:bg-primary/5 hover:border-primary/20 group flex w-full items-center gap-3 rounded-xl border border-transparent p-2.5 text-left transition-all"
                  >
                    {/* Avatar with Status Dot */}
                    <div className="relative shrink-0">
                      <span className="bg-primary/15 text-primary group-hover:bg-primary/25 flex size-10 items-center justify-center rounded-xl text-xs font-bold shadow-2xs transition-colors">
                        {u.avatarSeed}
                      </span>
                      <span
                        className={cn(
                          'ring-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2',
                          online ? 'bg-safe' : 'bg-muted-foreground/30',
                        )}
                        title={online ? t('teamChat.online') : t('teamChat.offline')}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="group-hover:text-primary truncate text-xs font-bold transition-colors sm:text-sm">
                          {u.name}
                        </p>
                        <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold">
                          <ShieldCheck className="size-2.5" />
                          <span>
                            {u.role === 'requester'
                              ? t('userMenu.roleRequester')
                              : t('userMenu.roleApprover')}
                          </span>
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5 flex items-center gap-1 truncate text-[11px]">
                        <Building2 className="size-3 shrink-0 opacity-60" />
                        <span className="truncate">{u.hospitalName}</span>
                      </p>
                    </div>

                    {/* Start Chat Action Pill */}
                    <span className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold opacity-0 shadow-2xs transition-all group-hover:opacity-100">
                      {t('teamChat.newChatDialog.startChat')}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
