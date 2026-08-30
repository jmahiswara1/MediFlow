import { useState } from 'react'
import { Building2, Calendar, FileBadge, Mail, Pencil, Phone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { ProfileEditDialog } from './ProfileEditDialog'

export function ProfileHeaderCard() {
  const { t } = useI18n()
  const user = useCurrentUser()
  const [editOpen, setEditOpen] = useState(false)

  if (!user) return null

  const isApprover = user.role === 'approver'
  const initials = user.avatarSeed || user.name.slice(0, 2).toUpperCase()

  return (
    <>
      <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl p-6 shadow-sm md:p-7">
        {/* Soft overlay circles for depth (matching Dashboard HeroBanner) */}
        <div className="bg-primary-foreground/10 pointer-events-none absolute -top-16 -right-16 size-64 rounded-full blur-xs" />
        <div className="bg-primary-foreground/8 pointer-events-none absolute -right-8 -bottom-20 size-48 rounded-full blur-xs" />
        <div className="bg-primary-foreground/5 pointer-events-none absolute top-1/2 -left-12 size-36 rounded-full blur-xs" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Avatar with Status Ring */}
            <div className="relative self-start sm:self-auto">
              <span className="bg-primary-foreground text-primary ring-primary-foreground/25 flex size-20 items-center justify-center rounded-2xl text-xl font-bold shadow-md ring-4 sm:size-22 sm:text-2xl">
                {initials}
              </span>
              <span
                className="bg-safe ring-primary absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full shadow-2xs ring-2"
                title={t('teamChat.online')}
              >
                <span className="size-2 animate-pulse rounded-full bg-white" />
              </span>
            </div>

            {/* Name, Role & Hospital Info */}
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-primary-foreground truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {user.name}
                </h2>
                <span className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/25 inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold shadow-2xs backdrop-blur-sm">
                  <ShieldCheck className="size-3.5" />
                  <span>
                    {isApprover ? t('userMenu.roleApprover') : t('userMenu.roleRequester')}
                  </span>
                </span>
              </div>

              <p className="text-primary-foreground/90 flex items-center gap-1.5 text-xs font-medium">
                <Building2 className="text-primary-foreground size-4 shrink-0" />
                <span className="truncate">{user.hospitalName}</span>
                {user.department && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="truncate">{user.department}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0 self-start sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
              className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/25 hover:border-primary-foreground/50 cursor-pointer gap-2 rounded-xl text-xs font-semibold shadow-2xs backdrop-blur-sm transition-all"
            >
              <Pencil className="size-3.5" />
              <span>{t('profile.editProfile')}</span>
            </Button>
          </div>
        </div>

        {/* Info Grid Pills */}
        <div className="border-primary-foreground/15 mt-6 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-primary-foreground/10 border-primary-foreground/15 hover:bg-primary-foreground/15 flex items-center gap-3 rounded-xl border p-3 backdrop-blur-xs transition-colors">
            <span className="bg-primary-foreground/15 text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Mail className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-primary-foreground/75 text-[10px] font-bold tracking-wider uppercase">
                {t('profile.email')}
              </p>
              <p className="text-primary-foreground truncate text-xs font-semibold">
                {user.email || '-'}
              </p>
            </div>
          </div>

          <div className="bg-primary-foreground/10 border-primary-foreground/15 hover:bg-primary-foreground/15 flex items-center gap-3 rounded-xl border p-3 backdrop-blur-xs transition-colors">
            <span className="bg-primary-foreground/15 text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Phone className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-primary-foreground/75 text-[10px] font-bold tracking-wider uppercase">
                {t('profile.phone')}
              </p>
              <p className="text-primary-foreground truncate text-xs font-semibold">
                {user.phone || '-'}
              </p>
            </div>
          </div>

          <div className="bg-primary-foreground/10 border-primary-foreground/15 hover:bg-primary-foreground/15 flex items-center gap-3 rounded-xl border p-3 backdrop-blur-xs transition-colors">
            <span className="bg-primary-foreground/15 text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <FileBadge className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-primary-foreground/75 text-[10px] font-bold tracking-wider uppercase">
                {t('profile.licenseNumber')}
              </p>
              <p className="text-primary-foreground truncate text-xs font-semibold">
                {user.licenseNumber || '-'}
              </p>
            </div>
          </div>

          <div className="bg-primary-foreground/10 border-primary-foreground/15 hover:bg-primary-foreground/15 flex items-center gap-3 rounded-xl border p-3 backdrop-blur-xs transition-colors">
            <span className="bg-primary-foreground/15 text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Calendar className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-primary-foreground/75 text-[10px] font-bold tracking-wider uppercase">
                {t('profile.joinedSince')}
              </p>
              <p className="text-primary-foreground truncate text-xs font-semibold">
                {user.joinedDate || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ProfileEditDialog open={editOpen} onOpenChange={setEditOpen} />
    </>
  )
}
