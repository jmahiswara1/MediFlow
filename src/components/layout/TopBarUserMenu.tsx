import { useEffect, useRef, useState } from 'react'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useCurrentUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'

export function TopBarUserMenu() {
  const { t } = useI18n()
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
  const roleLabel = currentUser.role === 'approver' ? t('userMenu.roleApprover') : t('userMenu.roleRequester')

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('topBar.closeMenu') : t('topBar.openMenu')}
        aria-haspopup="menu"
        aria-expanded={open}
        className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-full p-1 transition-colors"
      >
        <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-xs font-bold">
          {initials}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'bg-popover text-popover-foreground absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border shadow-lg',
            'animate-in fade-in slide-in-from-top-2 duration-150',
          )}
        >
          <div className="border-b p-3">
            <p className="text-sm font-semibold leading-tight">{currentUser.name}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{currentUser.hospitalName}</p>
            <span
              className={cn(
                'mt-2 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide',
                currentUser.role === 'approver'
                  ? 'bg-safe text-safe-foreground'
                  : 'bg-low text-low-foreground',
              )}
            >
              {roleLabel}
            </span>
          </div>
          <div className="p-1">
            <button
              type="button"
              disabled
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserIcon className="size-4" />
              {t('userMenu.profile')}
            </button>
            <button
              type="button"
              disabled
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Settings className="size-4" />
              {t('userMenu.settings')}
            </button>
            <div className="border-t my-1" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="text-critical hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            >
              <LogOut className="size-4" />
              {t('userMenu.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}