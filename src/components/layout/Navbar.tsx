import { Languages, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/useI18n'
import { useUiStore } from '@/store'

export function Navbar() {
  const { locale, setLocale } = useI18n()
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div className="text-muted-foreground text-sm">MediFlow</div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
          aria-label="Toggle language"
        >
          <Languages className="size-4" />
        </Button>
        <span className="text-xs font-semibold uppercase">{locale}</span>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
      </div>
    </header>
  )
}
