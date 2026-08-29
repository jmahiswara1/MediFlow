import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

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
          <p className="text-muted-foreground max-w-md text-sm">
            {this.state.error.message}
          </p>
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

function App() {
  return (
    <RootErrorBoundary>
      <RouterProvider router={router} />
    </RootErrorBoundary>
  )
}

export default App
