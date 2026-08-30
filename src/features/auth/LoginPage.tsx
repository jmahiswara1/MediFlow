import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { userList } from '@/data/users'
import { Button } from '@/components/ui/button'
import { UserCard } from '@/features/auth/components/UserCard'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const STORAGE_KEYS = [
  'mediflow-auth',
  'mediflow-ui',
  'mediflow-transfers',
  'mediflow-notifications',
  'mediflow-chat',
]

export function LoginPage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const login = useAuthStore((s) => s.login)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)

  if (currentUser) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    return <Navigate to={from ?? '/'} replace />
  }

  const handleSelect = (userId: string) => {
    setPendingId(userId)
    const user = userList.find((u) => u.id === userId)
    if (!user) return

    window.setTimeout(() => {
      login(userId)
      setPendingId(null)
      toast.success(t('app.name') + ' - ' + user.name, {
        description: user.hospitalName + ' - ' + user.role,
      })
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(from ?? '/', { replace: true })
    }, 200)
  }

  const handleReset = () => {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k))
    setResetOpen(false)
    window.location.reload()
  }

  return (
    <div className="bg-background flex min-h-screen">
      {/* Hero (hidden on mobile) */}
      <div className="bg-sidebar text-sidebar-foreground border-sidebar-border relative hidden flex-1 overflow-hidden border-r md:flex">
        <div className="relative z-10 flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-10 items-center justify-center rounded-lg text-sm font-bold">
              MF
            </span>
            <span className="text-sm font-semibold tracking-tight">{t('app.name')}</span>
          </div>
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{t('app.tagline')}</h1>
            <p className="text-sidebar-foreground/70 text-sm leading-relaxed">
              Pemantauan stok dan distribusi medis antar rumah sakit dengan prediksi berbasis tren
              kasus penyakit.
            </p>
          </div>
          <div className="text-sidebar-foreground/60 text-xs">Demo mode</div>
        </div>
        <div className="from-sidebar-primary/20 absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />
      </div>

      {/* Login card */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">{t('login.title')}</h2>
            <p className="text-muted-foreground text-sm">{t('login.subtitle')}</p>
          </div>

          <div className="space-y-2">
            {userList.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onSelect={handleSelect}
                disabled={pendingId !== null}
              />
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
            >
              {t('common.resetSession')}
            </button>
          </div>
        </div>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('login.resetConfirmTitle')}</DialogTitle>
            <DialogDescription>{t('login.resetConfirmDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              {t('login.resetConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
