import { NavLink } from 'react-router-dom'
import { Activity, Bot, LayoutDashboard, Map, PackageOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'

const navItems = [
  { to: '/', key: 'dashboard' as const, icon: LayoutDashboard, end: true },
  { to: '/stock-map', key: 'stockMap' as const, icon: Map, end: false },
  { to: '/transfer', key: 'transfer' as const, icon: PackageOpen, end: false },
  { to: '/analytics', key: 'analytics' as const, icon: Activity, end: false },
  { to: '/ai-chat', key: 'aiChat' as const, icon: Bot, end: false },
]

export function Sidebar() {
  const { t } = useI18n()

  return (
    <aside className="bg-sidebar hidden w-64 shrink-0 border-r md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-bold">
          MF
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{t('app.name')}</p>
          <p className="text-muted-foreground text-xs">{t('app.tagline')}</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive && 'bg-accent text-accent-foreground',
              )
            }
          >
            <item.icon className="size-4" />
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
