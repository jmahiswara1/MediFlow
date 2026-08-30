import { Activity, CheckCheck, MessageSquare, Send, TrendingUp } from 'lucide-react'
import { useCurrentUser, useTransferStore, useConversationsForUser } from '@/store'
import { useI18n } from '@/i18n/useI18n'

export function UserActivityStats() {
  const { t } = useI18n()
  const user = useCurrentUser()
  const requests = useTransferStore((s) => s.requests)
  const conversations = useConversationsForUser(user?.id)

  if (!user) return null

  const initiatedCount = requests.filter(
    (r) => r.fromHospitalId === user.hospitalId || r.createdBy === user.id,
  ).length

  const approvedCount = requests.filter(
    (r) =>
      r.toHospitalId === user.hospitalId &&
      (r.status === 'approved' || r.status === 'shipped' || r.status === 'completed'),
  ).length

  return (
    <div className="bg-card border-border/80 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg shadow-2xs">
            <Activity className="size-4" />
          </span>
          <div>
            <h3 className="text-foreground text-sm font-bold sm:text-base">
              {t('profile.activitySummary')}
            </h3>
            <p className="text-muted-foreground text-xs">
              Metrik koordinasi stok dan logistik medis fasilitas kesehatan Anda
            </p>
          </div>
        </div>

        <span className="text-primary bg-primary/10 border-primary/20 self-start rounded-full border px-2.5 py-0.5 text-[11px] font-semibold sm:self-auto">
          Live Data
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Transfers Initiated */}
        <div className="bg-muted/30 border-border/60 hover:border-primary/30 hover:bg-muted/50 flex flex-col justify-between rounded-xl border p-4 transition-all">
          <div className="flex items-center justify-between">
            <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-lg shadow-2xs">
              <Send className="size-4" />
            </span>
            <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-bold">
              Inisiasi
            </span>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-foreground text-2xl font-bold tabular-nums sm:text-3xl">
              {initiatedCount}
            </p>
            <p className="text-foreground/90 text-xs font-semibold">
              {t('profile.transfersInitiated')}
            </p>
            <p className="text-muted-foreground text-[11px]">Permintaan pasokan faskes</p>
          </div>
        </div>

        {/* Metric 2: Transfers Approved */}
        <div className="bg-muted/30 border-border/60 hover:border-safe/30 hover:bg-muted/50 flex flex-col justify-between rounded-xl border p-4 transition-all">
          <div className="flex items-center justify-between">
            <span className="bg-safe/15 text-safe flex size-8 items-center justify-center rounded-lg shadow-2xs">
              <CheckCheck className="size-4" />
            </span>
            <span className="bg-safe/10 text-safe rounded px-1.5 py-0.5 text-[10px] font-bold">
              Otorisasi
            </span>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-foreground text-2xl font-bold tabular-nums sm:text-3xl">
              {approvedCount}
            </p>
            <p className="text-foreground/90 text-xs font-semibold">
              {t('profile.transfersApproved')}
            </p>
            <p className="text-muted-foreground text-[11px]">Disetujui & dialokasikan</p>
          </div>
        </div>

        {/* Metric 3: Coordination Chats */}
        <div className="bg-muted/30 border-border/60 hover:bg-muted/50 flex flex-col justify-between rounded-xl border p-4 transition-all hover:border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 shadow-2xs dark:text-indigo-400">
              <MessageSquare className="size-4" />
            </span>
            <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
              Jaringan
            </span>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-foreground text-2xl font-bold tabular-nums sm:text-3xl">
              {conversations.length}
            </p>
            <p className="text-foreground/90 text-xs font-semibold">
              {t('profile.activeConversations')}
            </p>
            <p className="text-muted-foreground text-[11px]">Saluran koordinasi aktif</p>
          </div>
        </div>

        {/* Metric 4: SLA / Response Rate */}
        <div className="bg-muted/30 border-border/60 hover:bg-muted/50 flex flex-col justify-between rounded-xl border p-4 transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 shadow-2xs dark:text-amber-400">
              <TrendingUp className="size-4" />
            </span>
            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              Efisiensi
            </span>
          </div>
          <div className="mt-4 space-y-0.5">
            <p className="text-foreground text-2xl font-bold tabular-nums sm:text-3xl">98.5%</p>
            <p className="text-foreground/90 text-xs font-semibold">{t('profile.responseRate')}</p>
            <p className="text-muted-foreground text-[11px]">Waktu tanggap &lt; 15 menit</p>
          </div>
        </div>
      </div>
    </div>
  )
}
