import { NavLink } from 'react-router-dom'
import {
  Activity,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Network,
} from 'lucide-react'
import { useAuthStore, useCurrentUser, useUnreadCount, useUiStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', key: 'dashboard' as const, icon: LayoutDashboard, end: true },
  { to: '/network', key: 'network' as const, icon: Network, end: false },
  { to: '/analytics', key: 'analytics' as const, icon: Activity, end: false },
  { to: '/ai-chat', key: 'aiChat' as const, icon: Bot, end: false },
  {
    to: '/notifications',
    key: 'notifications' as const,
    icon: Bell,
    end: false,
    showBadge: true,
  },
]

export function Sidebar() {
  const { t } = useI18n()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const currentUser = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const unreadCount = useUnreadCount(currentUser?.id)

  return (
    <aside
      data-collapsed={collapsed}
      style={{ width: collapsed ? '5rem' : '16rem' }}
      className="bg-primary text-primary-foreground border-primary-foreground/10 fixed top-3 bottom-3 left-3 z-40 hidden overflow-hidden rounded-2xl border shadow-md transition-[width] duration-200 md:flex md:flex-col"
    >
      {/* Decorative soft overlay circles (match HeroBanner) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary-foreground/8 absolute -top-16 -right-16 size-64 rounded-full" />
        <div className="bg-primary-foreground/6 absolute -right-8 -bottom-20 size-48 rounded-full" />
      </div>

      {/* Brand header */}
      <div
        className={cn(
          'border-primary-foreground/15 relative z-10 flex h-20 shrink-0 items-center border-b',
          collapsed ? 'justify-center px-2' : 'gap-3 px-6',
        )}
      >
        <div className="bg-primary-foreground text-primary flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl p-1 text-base font-bold tracking-tight shadow-sm">
          <img src="/logo.png" alt="MF Logo" className="h-full w-full object-contain" />
        </div>
        {!collapsed && (
          <div className="flex flex-col justify-center truncate leading-tight">
            <div className="flex items-center">
              <span className="text-primary-foreground text-base font-bold tracking-tight">
                {t('app.name')}
              </span>
              <span className="text-primary-foreground/70 ml-0.5 text-base font-bold">.</span>
            </div>
            <span className="text-primary-foreground/70 truncate text-[10px] tracking-wide uppercase">
              Medical Flow
            </span>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="relative z-10 flex flex-1 flex-col items-stretch gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const badge = item.showBadge ? unreadCount : 0
          const label = t(`nav.${item.key}`)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? label : undefined}
              aria-label={label}
              className={({ isActive }) =>
                cn(
                  'group text-primary-foreground/85 hover:bg-primary-foreground/12 hover:text-primary-foreground relative flex shrink-0 items-center rounded-xl text-sm font-medium transition-colors',
                  collapsed
                    ? 'h-11 w-11 justify-center self-center'
                    : 'h-11 justify-start gap-3 px-3',
                  isActive && 'bg-primary-foreground/18 text-primary-foreground shadow-sm',
                )
              }
            >
              <span className="relative shrink-0">
                <item.icon className="size-5" />
                {badge > 0 && (
                  <span className="bg-critical text-critical-foreground absolute -top-1.5 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-primary-foreground/15 relative z-10 shrink-0 border-t p-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          className={cn(
            'text-primary-foreground/85 hover:bg-primary-foreground/12 hover:text-primary-foreground flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            collapsed ? 'h-11 justify-center' : 'h-11 gap-3',
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <>
              <ChevronLeft className="size-5 shrink-0" />
              <span>{t('sidebar.collapse')}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          aria-label={t('userMenu.logout')}
          title={collapsed ? t('userMenu.logout') : undefined}
          className={cn(
            'text-primary-foreground/85 hover:bg-primary-foreground/12 hover:text-primary-foreground mt-1 flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            collapsed ? 'h-11 justify-center' : 'h-11 gap-3',
          )}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span>{t('userMenu.logout')}</span>}
        </button>
      </div>
    </aside>
  )
}
