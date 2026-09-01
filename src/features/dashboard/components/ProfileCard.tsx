import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Send, ShieldCheck, UserCheck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useStockStore } from '@/store'
import { Button } from '@/components/ui/button'

export function ProfileCard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const hospitals = useStockStore((s) => s.hospitals)
  const myHospital = hospitals.find((h) => h.id === currentUser?.hospitalId)

  if (!currentUser) return null

  const initials = currentUser.avatarSeed || currentUser.name.slice(0, 2).toUpperCase()
  const isApprover = currentUser.role === 'approver'
  const roleLabel = isApprover ? t('userMenu.roleApprover') : t('userMenu.roleRequester')

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col justify-between rounded-2xl border p-6 shadow-sm md:p-7">
      {/* Top: Avatar + Name + Role */}
      <div className="flex items-center gap-3.5">
        <div className="bg-primary/10 text-primary ring-primary/20 flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold tracking-tight ring-1">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-base leading-tight font-bold">
            {currentUser.name}
          </h3>
          <span className="bg-secondary text-secondary-foreground mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium">
            {isApprover ? <ShieldCheck className="size-3" /> : <UserCheck className="size-3" />}
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Middle: Hospital highlight (name + city/region — same hospital data, laid out with more weight) */}
      <div className="border-border/80 bg-muted/30 my-3 flex items-center gap-3 rounded-xl border p-3.5">
        <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-bold">{currentUser.hospitalName}</p>
          {myHospital && (
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 truncate text-xs">
              <MapPin className="size-3 shrink-0" />
              {myHospital.city}, {myHospital.region}
            </p>
          )}
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
