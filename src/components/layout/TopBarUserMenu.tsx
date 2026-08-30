import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, User as UserIcon, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useCurrentUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'

export function TopBarUserMenu() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (!currentUser) return null

  const initials = currentUser.avatarSeed || currentUser.name.slice(0, 2).toUpperCase()
  const isApprover = currentUser.role === 'approver'
  const roleLabel = isApprover ? t('userMenu.roleApprover') : t('userMenu.roleRequester')

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('topBar.closeMenu') : t('topBar.openMenu')}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-full p-1 transition-colors',
          open && 'bg-accent',
        )}
      >
        <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-bold shadow-xs">
          {initials}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'bg-popover text-popover-foreground border-border absolute right-0 z-50 mt-2.5 w-64 overflow-hidden rounded-2xl border shadow-xl',
            'animate-in fade-in slide-in-from-top-2 duration-150',
          )}
        >
          <div className="border-border bg-muted/20 space-y-1.5 border-b p-3.5">
            <p className="text-foreground text-sm leading-tight font-bold">{currentUser.name}</p>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Building2 className="text-primary size-3.5 shrink-0" />
              <span className="truncate">{currentUser.hospitalName}</span>
            </div>
            <div className="pt-0.5">
              <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="space-y-0.5 p-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
              className="text-foreground/90 hover:bg-muted hover:text-foreground flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors"
            >
              <UserIcon className="text-primary size-4" />
              <span>{t('userMenu.profile')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/settings')
              }}
              className="text-foreground/90 hover:bg-muted hover:text-foreground flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors"
            >
              <Settings className="text-primary size-4" />
              <span>{t('userMenu.settings')}</span>
            </button>
            <div className="border-border my-1 border-t" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="text-critical hover:bg-critical/10 flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors"
            >
              <LogOut className="size-4" />
              <span>{t('userMenu.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
