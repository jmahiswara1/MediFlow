import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Activity, Building2, Languages, Moon, Pill, Search, Sun } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useStockStore, useUiStore } from '@/store'
import { diseaseList } from '@/data'
import { TopBarUserMenu } from '@/components/layout/TopBarUserMenu'
import { TopBarNotificationMenu } from '@/components/layout/TopBarNotificationMenu'
import { cn } from '@/lib/utils'

const routeTitleKey: Record<string, string> = {
  '/': 'dashboard.title',
  '/network': 'network.title',
  '/analytics': 'analytics.title',
  '/assistant': 'aiChat.title',
  '/chat': 'nav.teamChat',
  '/notifications': 'notifications.title',
  '/profile': 'profile.title',
  '/settings': 'settings.title',
}

type SearchResultKind = 'hospital' | 'medicine' | 'disease'

interface SearchResult {
  kind: SearchResultKind
  id: string
  title: string
  subtitle: string
}

const MAX_PER_CATEGORY = 4

export function Navbar() {
  const { t, locale, setLocale } = useI18n()
  const theme = useUiStore((s) => s.theme)
  const toggleTheme = useUiStore((s) => s.toggleTheme)
  const location = useLocation()
  const navigate = useNavigate()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)

  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const pageTitle = routeTitleKey[location.pathname]
    ? t(routeTitleKey[location.pathname] as never)
    : t('app.name')

  // Close on outside click / Escape, like any standard search-with-suggestions widget.
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const results = useMemo<SearchResult[]>(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return []

    const hospitalMatches: SearchResult[] = hospitals
      .filter((h) => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .map((h) => ({ kind: 'hospital', id: h.id, title: h.name, subtitle: h.city }))

    const medicineMatches: SearchResult[] = medicines
      .filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .map((m) => ({ kind: 'medicine', id: m.id, title: m.name, subtitle: m.category }))

    const diseaseMatches: SearchResult[] = diseaseList
      .filter((d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q))
      .slice(0, MAX_PER_CATEGORY)
      .map((d) => ({ kind: 'disease', id: d.id, title: d.name, subtitle: d.region }))

    return [...hospitalMatches, ...medicineMatches, ...diseaseMatches]
  }, [searchValue, hospitals, medicines])

  const goToResult = (result: SearchResult) => {
    if (result.kind === 'hospital') {
      navigate(`/network?tab=map&rs=${encodeURIComponent(result.id)}`)
    } else if (result.kind === 'medicine') {
      navigate(`/analytics?medQ=${encodeURIComponent(result.title)}`)
    } else {
      navigate(`/analytics?disease=${encodeURIComponent(result.id)}`)
    }
    setSearchValue('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchValue.trim()

    if (!query) {
      setIsOpen(false)
      navigate('/network?tab=map')
      return
    }

    const picked = activeIndex >= 0 ? results[activeIndex] : results[0]
    if (picked) {
      goToResult(picked)
      return
    }

    setIsOpen(false)
    navigate(`/network?tab=map&q=${encodeURIComponent(query)}`)
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
    }
  }

  const categoryLabel = (kind: SearchResultKind) => {
    if (kind === 'hospital') return t('topBar.categoryHospitals')
    if (kind === 'medicine') return t('topBar.categoryMedicines')
    return t('topBar.categoryDiseases')
  }

  const categoryIcon = (kind: SearchResultKind) => {
    if (kind === 'hospital') return Building2
    if (kind === 'medicine') return Pill
    return Activity
  }

  let lastRenderedKind: SearchResultKind | null = null

  return (
    <header className="bg-card/85 border-border relative z-30 flex h-14 shrink-0 items-center gap-3 rounded-2xl border px-4 shadow-sm backdrop-blur-xl">
      {/* Page title (left) */}
      <div className="hidden shrink-0 md:block">
        <h2 className="text-base font-semibold tracking-tight">{pageTitle}</h2>
      </div>

      {/* Global search */}
      <div ref={containerRef} className="relative min-w-0 flex-1">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-muted/60 border-border focus-within:border-primary/50 flex h-9 min-w-0 items-center gap-2 rounded-xl border px-3 transition-colors"
        >
          <button
            type="submit"
            aria-label={t('topBar.searchPlaceholder')}
            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            <Search className="size-4" />
          </button>
          <input
            type="search"
            name="q"
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value)
              setActiveIndex(-1)
              setIsOpen(true)
            }}
            onFocus={() => {
              if (searchValue.trim()) setIsOpen(true)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={t('topBar.searchPlaceholder')}
            className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-sm outline-none"
            autoComplete="off"
          />
        </form>

        {/* Results dropdown: hospitals, medicines, and diseases, grouped */}
        {isOpen && searchValue.trim() && (
          <div className="bg-card border-border absolute top-[calc(100%+0.5rem)] left-0 z-40 max-h-96 w-full min-w-[280px] overflow-y-auto rounded-xl border p-1.5 shadow-lg">
            {results.length === 0 ? (
              <p className="text-muted-foreground px-3 py-4 text-center text-xs">
                {t('topBar.noResults')}
              </p>
            ) : (
              results.map((result, index) => {
                const Icon = categoryIcon(result.kind)
                const showHeader = result.kind !== lastRenderedKind
                lastRenderedKind = result.kind
                return (
                  <div key={`${result.kind}-${result.id}`}>
                    {showHeader && (
                      <p className="text-muted-foreground px-2.5 pt-2 pb-1 text-[10px] font-bold tracking-wide uppercase">
                        {categoryLabel(result.kind)}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => goToResult(result)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                        index === activeIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/70',
                      )}
                    >
                      <Icon
                        className={cn(
                          'size-4 shrink-0',
                          index === activeIndex ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{result.title}</span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {result.subtitle}
                        </span>
                      </span>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

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
        <TopBarNotificationMenu />
        <div className="ml-1 flex items-center sm:ml-2">
          <TopBarUserMenu />
        </div>
      </div>
    </header>
  )
}
