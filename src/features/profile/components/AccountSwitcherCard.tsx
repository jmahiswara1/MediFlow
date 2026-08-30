import { Check, ShieldCheck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { userList } from '@/data/users'
import { useAuthStore, useCurrentUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

export function AccountSwitcherCard() {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const login = useAuthStore((s) => s.login)

  const handleSwitch = (userId: string, name: string) => {
    if (userId === currentUser?.id) return
    login(userId)
    toast.success(`Beralih akun ke ${name}`)
  }

  return (
    <div className="bg-card border-border/80 space-y-3.5 rounded-2xl border p-5 shadow-xs sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
          <Users className="size-4" />
        </span>
        <div>
          <h3 className="text-foreground text-sm font-bold sm:text-base">
            {t('profile.accountSwitcher')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('profile.accountSwitcherDesc')}</p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {userList.map((u) => {
          const isActive = u.id === currentUser?.id
          const isApprover = u.role === 'approver'

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => handleSwitch(u.id, u.name)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-2.5 text-left transition-all',
                isActive
                  ? 'bg-primary/10 border-primary/30 text-foreground ring-primary/20 font-bold shadow-2xs ring-1'
                  : 'bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground/80 hover:text-foreground',
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-2xs',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {u.avatarSeed}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs leading-snug font-bold">{u.name}</p>
                  <p className="text-muted-foreground truncate text-[10px]">{u.hospitalName}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <span className="bg-muted text-muted-foreground inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                  <ShieldCheck className="size-2.5" />
                  <span>
                    {isApprover ? t('userMenu.roleApprover') : t('userMenu.roleRequester')}
                  </span>
                </span>
                {isActive && (
                  <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full shadow-2xs">
                    <Check className="size-3 stroke-[3]" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
