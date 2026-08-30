import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Languages, Moon, Search, Sun } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useUiStore } from '@/store'
import { TopBarUserMenu } from '@/components/layout/TopBarUserMenu'

const routeTitleKey: Record<string, string> = {
  '/': 'dashboard.title',
  '/network': 'network.title',
  '/analytics': 'analytics.title',
  '/ai-chat': 'aiChat.title',
  '/notifications': 'notifications.title',
}

export function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')

  const pageTitle = routeTitleKey[location.pathname]
    ? t(routeTitleKey[location.pathname] as never)
    : t('app.name')

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchValue.trim()
    if (query) {
      navigate(`/network?q=${encodeURIComponent(query)}`)
    } else {
      navigate('/network')
    }
  }

  return (
    <header className="bg-card/85 border-border relative z-30 flex h-14 shrink-0 items-center gap-3 rounded-2xl border px-4 shadow-sm backdrop-blur-xl">
      {/* Page title (left) */}
      <div className="hidden shrink-0 md:block">
        <h2 className="text-base font-semibold tracking-tight">{pageTitle}</h2>
      </div>

      {/* Global search */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-muted/60 border-border focus-within:border-primary/50 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 transition-colors"
      >
        <Search className="text-muted-foreground size-4 shrink-0" />
        <input
          type="search"
          name="q"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder={t('topBar.searchPlaceholder')}
          className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <kbd className="bg-background text-muted-foreground hidden shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase sm:inline-flex">
          {typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform) ? 'Cmd' : 'Ctrl'} K
        </kbd>
      </form>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
          aria-label="Toggle language"
          className="hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-semibold tracking-wide uppercase transition-colors"
        >
          <Languages className="size-4" />
          <span className="hidden md:inline">{locale}</span>
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
        >
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
        <TopBarUserMenu />
      </div>
    </header>
  )
}
