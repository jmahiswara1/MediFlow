import { Component, useEffect, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useUiStore } from '@/store'

interface State {
  error: Error | null
}

class RootErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('MediFlow error:', error, info)
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertTriangle className="text-destructive size-12" />
          <h1 className="text-2xl font-semibold tracking-tight">Terjadi kesalahan</h1>
          <p className="text-muted-foreground max-w-md text-sm">{this.state.error.message}</p>
          <Button
            onClick={() => {
              this.setState({ error: null })
              window.location.reload()
            }}
          >
            Coba lagi
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

// Keeps the `dark` class on <html> in sync with the persisted `theme`
// setting from uiStore. Tailwind's `dark:` variant (and every CSS
// variable override in index.css under `.dark { ... }`) only activates
// when this class is present on the root element.
function useThemeSync() {
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    // Helps native form controls (checkboxes, scrollbars, etc.) render
    // with the correct color scheme too.
    root.style.colorScheme = theme
  }, [theme])
}

function App() {
  useThemeSync()

  return (
    <RootErrorBoundary>
      <RouterProvider router={router} />
    </RootErrorBoundary>
  )
}

export default App
