import { NavLink } from 'react-router-dom'
import { Activity, Bot, LayoutDashboard, MessageCircle, Network } from 'lucide-react'
import { useCurrentUser, useTotalUnreadForUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', key: 'dashboard' as const, icon: LayoutDashboard, end: true },
  { to: '/network', key: 'network' as const, icon: Network, end: false },
  { to: '/analytics', key: 'analytics' as const, icon: Activity, end: false },
  { to: '/assistant', key: 'aiChat' as const, icon: Bot, end: false },
  {
    to: '/chat',
    key: 'teamChat' as const,
    icon: MessageCircle,
    end: false,
    showBadge: 'chat' as const,
  },
]

export function BottomNav() {
  const { t } = useI18n()
  const currentUser = useCurrentUser()
  const chatUnread = useTotalUnreadForUser(currentUser?.id)

  return (
    <nav
      aria-label="Mobile Navigation"
      className="bg-card/90 border-border/80 fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-t px-2 shadow-lg backdrop-blur-xl md:hidden"
    >
      {navItems.map((item) => {
        const badge = item.showBadge === 'chat' ? chatUnread : 0
        const label = t(`nav.${item.key}`)

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'relative flex min-w-14 flex-col items-center justify-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors select-none',
                isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <item.icon
                    className={cn(
                      'size-5 transition-transform duration-200',
                      isActive ? 'text-primary scale-110' : 'text-muted-foreground',
                    )}
                  />
                  {badge > 0 && (
                    <span className="bg-critical text-critical-foreground absolute -top-1 -right-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold tabular-nums">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </span>
                <span className="truncate leading-none">{label}</span>
                {isActive && (
                  <span className="bg-primary absolute -bottom-1 h-0.5 w-6 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
