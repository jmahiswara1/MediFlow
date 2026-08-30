import { Building2, ShieldCheck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser } from '@/store'

export function ProfileCard() {
  const { t } = useI18n()
  const user = useCurrentUser()
  if (!user) return null

  return (
    <div className="from-primary/5 via-card to-card relative flex flex-col items-center gap-2.5 overflow-hidden bg-gradient-to-b px-4 py-4 text-center">
      {/* Avatar with Ring & Status Dot */}
      <div className="relative">
        <div className="bg-primary/15 text-primary ring-primary/25 shadow-primary/10 flex size-14 items-center justify-center rounded-2xl text-base font-bold shadow-md ring-2">
          {user.avatarSeed}
        </div>
        <span
          className="bg-safe ring-card absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full ring-2"
          title={t('teamChat.online')}
        >
          <span className="bg-safe absolute inset-0 animate-ping rounded-full opacity-75" />
        </span>
      </div>

      {/* User Info */}
      <div className="max-w-full min-w-0">
        <p className="text-foreground truncate text-sm font-bold tracking-tight">{user.name}</p>
        <div className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1 text-[11px]">
          <Building2 className="size-3 shrink-0 opacity-70" />
          <span className="truncate">{user.hospitalName}</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center justify-center pt-0.5">
        <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
          <ShieldCheck className="size-3" />
          <span>
            {user.role === 'requester' ? t('userMenu.roleRequester') : t('userMenu.roleApprover')}
          </span>
        </span>
      </div>
    </div>
  )
}
