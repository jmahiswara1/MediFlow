import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Send, ShieldCheck, UserCheck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser } from '@/store'
import { Button } from '@/components/ui/button'

interface ProfileCardProps {
  activeCount?: number
  pendingCount?: number
}

export function ProfileCard({ activeCount = 0, pendingCount = 0 }: ProfileCardProps) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()

  if (!currentUser) return null

  const initials = currentUser.avatarSeed || currentUser.name.slice(0, 2).toUpperCase()
  const isApprover = currentUser.role === 'approver'
  const roleLabel = isApprover ? t('userMenu.roleApprover') : t('userMenu.roleRequester')

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-6 shadow-sm md:p-7">
      {/* Top Header: Avatar + User & Role info + Hospital Integrated */}
      <div>
        <div className="flex items-center gap-3.5">
          <div className="bg-primary/10 text-primary ring-primary/20 flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold tracking-tight ring-1">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-base leading-tight font-bold">
              {currentUser.name}
            </h3>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium">
                {isApprover ? <ShieldCheck className="size-3" /> : <UserCheck className="size-3" />}
                {roleLabel}
              </span>
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/80 inline-flex items-center gap-1 truncate font-medium">
                <Building2 className="text-primary size-3.5 shrink-0" />
                {currentUser.hospitalName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Clean Unified Stats Bar with Divider */}
      <div className="divide-border border-border/80 bg-muted/30 my-3 grid grid-cols-2 divide-x rounded-xl border">
        <div className="px-4 py-2.5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            {t('dashboard.activeShipments')}
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">{activeCount}</p>
        </div>
        <div className="px-4 py-2.5">
          <p className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
            {t('dashboard.pendingRequests')}
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold tabular-nums">{pendingCount}</p>
        </div>
      </div>

      {/* Bottom: Direct Action Buttons */}
      <div className="flex items-center gap-2.5">
        <Button
          size="default"
          className="flex-1 gap-2 rounded-xl font-semibold shadow-sm"
          onClick={() => navigate('/network')}
        >
          <Send className="size-4" />
          {t('dashboard.requestStock')}
        </Button>
        <Button
          size="default"
          variant="outline"
          className="gap-2 rounded-xl font-medium"
          onClick={() => navigate('/network')}
        >
          <MapPin className="size-4" />
          {t('dashboard.openMap')}
        </Button>
      </div>
    </div>
  )
}
