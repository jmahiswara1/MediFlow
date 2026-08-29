import { useEffect } from 'react'
import { Languages, Moon, Sun } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBarUserMenu } from '@/components/layout/TopBarUserMenu'
import { Button } from '@/components/ui/button'
import { useUiStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'

export function PageWrapper() {
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const { locale, setLocale } = useI18n()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
          <div className="text-muted-foreground text-sm">
            MediFlow
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
              aria-label="Toggle language"
              className="gap-1.5"
            >
              <Languages className="size-4" />
              <span className="text-xs font-semibold uppercase tabular-nums">{locale}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
            <TopBarUserMenu />
          </div>
        </header>
        <main
          key={location.pathname}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 flex-1 overflow-y-auto p-4 duration-200 md:p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}