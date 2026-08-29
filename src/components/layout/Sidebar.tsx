import { NavLink } from 'react-router-dom'
import { Activity, Bell, Bot, LayoutDashboard, Network } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import { useCurrentUser, useUnreadCount } from '@/store'

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
  const currentUser = useCurrentUser()
  const unreadCount = useUnreadCount(currentUser?.id)

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 border-r border-sidebar-border md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-9 items-center justify-center rounded-lg text-sm font-bold tracking-tight">
          MF
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">{t('app.name')}</p>
          <p className="text-sidebar-foreground/70 text-[11px]">{t('app.tagline')}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const badge = item.showBadge ? unreadCount : 0
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{t(`nav.${item.key}`)}</span>
              {badge > 0 && (
                <span className="bg-sidebar-primary text-sidebar-primary-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums">
                  {badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-[11px] text-sidebar-foreground/60">
        Demo mode - 5 akun tersedia
      </div>
    </aside>
  )
}