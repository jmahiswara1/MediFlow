import { type ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { Skeleton } from '@/components/ui/skeleton'

// AuthGate wrapper: redirects to /login if no user, after hydration.
export function AuthGate({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const location = useLocation()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Zustand persist hydrates synchronously in this version, but we tick once
    // to avoid a flash of the login screen when reading from localStorage.
    const t = window.setTimeout(() => setHydrated(true), 30)
    return () => window.clearTimeout(t)
  }, [])

  if (!hydrated) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="space-y-3">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
