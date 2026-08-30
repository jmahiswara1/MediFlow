import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, Building2, CheckCircle2, ShieldCheck } from 'lucide-react'
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

  const [selectedUserId, setSelectedUserId] = useState<string>(userList[0]?.id ?? 'usr-001')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  if (currentUser) {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
    return <Navigate to={from ?? '/'} replace />
  }

  const handleLoginSubmit = () => {
    if (!selectedUserId || isSubmitting) return

    const user = userList.find((u) => u.id === selectedUserId)
    if (!user) return

    setIsSubmitting(true)

    window.setTimeout(() => {
      login(user.id)
      setIsSubmitting(false)
      toast.success(`${t('app.name')} - ${user.name}`, {
        description: `${user.hospitalName} • ${user.role.toUpperCase()}`,
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

  const selectedUser = userList.find((u) => u.id === selectedUserId)

  return (
    <div className="bg-primary text-primary-foreground relative flex h-screen w-screen overflow-hidden select-none">
      {/* ================= AMBIENT CIRCLES ACROSS FULL TEAL BACKGROUND ================= */}
      <div className="bg-primary-foreground/10 pointer-events-none absolute -top-20 -left-20 size-80 rounded-full lg:size-96" />
      <div className="bg-primary-foreground/8 pointer-events-none absolute -bottom-28 left-1/4 size-80 rounded-full lg:size-96" />
      <div className="bg-primary-foreground/6 pointer-events-none absolute -top-16 -right-16 size-80 rounded-full lg:size-96" />
      <div className="bg-primary-foreground/5 pointer-events-none absolute -right-20 -bottom-20 size-64 rounded-full lg:size-80" />

      {/* ================= LEFT SECTION (50%): TEAL VALUE PROPOSITION ================= */}
      <div className="relative z-10 hidden h-full w-1/2 flex-col justify-between overflow-hidden px-8 py-8 md:flex lg:px-12 lg:py-10 xl:px-14 xl:py-12">
        {/* Top: Brand Header */}
        <div className="flex items-center gap-3">
          <div className="text-primary flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm">
            <img src="/logo.png" alt="MediFlow" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center truncate leading-tight">
            <div className="flex items-center">
              <span className="text-xl font-extrabold tracking-tight text-white">
                {t('app.name')}
              </span>
              <span className="ml-0.5 text-xl font-bold text-white/80">.</span>
            </div>
            <span className="truncate text-[11px] font-semibold tracking-wide text-white/80 uppercase">
              Medical Flow Logistics
            </span>
          </div>
        </div>

        {/* Center: Hero Value Proposition */}
        <div className="max-w-lg space-y-4 lg:space-y-5">
          <div className="space-y-2 lg:space-y-3">
            <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-white lg:text-3xl xl:text-4xl">
              Sistem Inteligensi Pasokan Medis Antar Faskes
            </h1>
            <p className="text-xs leading-relaxed text-white/90 sm:text-sm lg:text-base">
              Pemantauan ketersediaan obat real-time, redistribusi pasokan faskes, dan proyeksi
              lonjakan kebutuhan berbasis tren epidemiologi Surabaya.
            </p>
          </div>

          {/* Feature Highlight Pills */}
          <div className="flex flex-wrap gap-2 pt-1 lg:gap-2.5">
            <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Building2 className="size-3.5" />
              <span>10 RS Terkoneksi Surabaya</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Activity className="size-3.5" />
              <span>Sinkronisasi Stok Real-time</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <ShieldCheck className="size-3.5" />
              <span>Verifikasi Berjenjang Aman</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="flex items-center justify-between border-t border-white/15 pt-3.5 text-xs font-medium text-white/85">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-white" />
            <span>Jaringan Logistik Medis Jawa Timur</span>
          </div>
          <span>MediFlow v1.0</span>
        </div>
      </div>

      {/* ================= RIGHT SECTION (50%): LARGE FLOATING WHITE LOGIN CARD ================= */}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden p-4 sm:p-6 md:w-1/2 lg:p-8 xl:p-10">
        {/* Floating White Card on Teal Canvas - Clean fit with zero clipping */}
        <div className="bg-card text-card-foreground border-border/80 flex w-full max-w-md flex-col justify-between rounded-[28px] border p-5 shadow-2xl sm:rounded-[32px] sm:p-6 md:rounded-[36px] md:p-7 lg:max-w-lg">
          {/* Header */}
          <div className="flex flex-col">
            {/* Mobile Brand Logo */}
            <div className="mb-2 flex items-center justify-center gap-2 md:hidden">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-xl p-1">
                <img src="/logo.png" alt="MediFlow" className="size-5 object-contain" />
              </div>
              <span className="text-foreground text-lg font-extrabold tracking-tight">
                {t('app.name')}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-3 text-center">
              <h2 className="text-foreground text-xl font-extrabold tracking-tight sm:text-2xl">
                {t('login.title')}
              </h2>
              <p className="text-muted-foreground mt-0.5 text-xs">{t('login.subtitle')}</p>
            </div>

            {/* Multi-User Selector List - Fits all 5 accounts comfortably without scroll or clipping */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              {userList.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  isSelected={selectedUserId === user.id}
                  onSelect={(id) => setSelectedUserId(id)}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="border-border/60 mt-3 flex flex-col gap-2 border-t pt-3">
            {/* Primary Action Button */}
            <Button
              type="button"
              onClick={handleLoginSubmit}
              disabled={!selectedUser || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-xs font-bold shadow-sm transition-colors sm:h-11 sm:text-sm"
            >
              <span>
                {isSubmitting
                  ? 'Memuat Sesi...'
                  : `Masuk sebagai ${selectedUser?.name ?? 'Pengguna'}`}
              </span>
              <ArrowRight className="size-4" />
            </Button>

            {/* Reset Session Footer */}
            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setResetOpen(true)}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-[11px] underline-offset-4 transition-colors hover:underline"
              >
                {t('common.resetSession')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {t('login.resetConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-xs">
              {t('login.resetConfirmDescription')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetOpen(false)}
              className="rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleReset} className="rounded-xl">
              {t('login.resetConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
