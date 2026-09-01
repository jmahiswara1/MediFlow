import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ClipboardList, TrendingUp, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { useAllRequests, useHospitalId } from '@/store'
import { useStockSummary } from '@/hooks/useStockSummary'
import { useDiseaseDetection } from '@/hooks/useDiseaseDetection'
import { KpiCard } from '@/features/dashboard/components/KpiCard'
import { AiPredictionBanner } from '@/features/dashboard/components/AiPredictionBanner'
import { StockTrendsChart } from '@/features/dashboard/components/StockTrendsChart'
import { RecentTransfers } from '@/features/dashboard/components/RecentTransfers'
import { HeroBanner } from '@/features/dashboard/components/HeroBanner'
import { ProfileCard } from '@/features/dashboard/components/ProfileCard'
import { StockDistributionCard } from '@/features/dashboard/components/StockDistributionCard'
import { MiniHospitalList } from '@/features/dashboard/components/MiniHospitalList'
import { generateDashboardInsights } from '@/features/dashboard/utils/insightEngine'
import { getDaysRemaining } from '@/utils/statusHelpers'
import { generateStockTrendHistory } from '@/utils/seedHelpers'

function pctDelta(trend: number[]): number {
  if (trend.length < 2) return 0
  const last = trend[trend.length - 1] ?? 0
  const prev = trend[trend.length - 2] ?? 0
  if (prev === 0) return 0
  return Math.round(((last - prev) / prev) * 100)
}

export function DashboardPage() {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const hospitalId = useHospitalId()
  const summary = useStockSummary()
  const risingDiseases = useDiseaseDetection()
  const allRequests = useAllRequests()
  const trendHistory = useMemo(() => generateStockTrendHistory(), [])

  const counts = useMemo(() => {
    let critical = 0
    let low = 0
    let safe = 0
    for (const item of summary) {
      if (item.status === 'critical') critical++
      else if (item.status === 'low') low++
      else safe++
    }
    return { critical, low, safe }
  }, [summary])

  const activeTransfers = useMemo(
    () =>
      allRequests.filter(
        (r) => r.status === 'pending' || r.status === 'approved' || r.status === 'shipped',
      ),
    [allRequests],
  )

  const myActive = useMemo(
    () =>
      activeTransfers.filter(
        (r) => r.fromHospitalId === hospitalId || r.toHospitalId === hospitalId,
      ),
    [activeTransfers, hospitalId],
  )

  const inbound = myActive.filter((r) => r.toHospitalId === hospitalId).length
  const outbound = myActive.filter((r) => r.fromHospitalId === hospitalId).length

  const pendingOutgoing = useMemo(
    () => allRequests.filter((r) => r.fromHospitalId === hospitalId && r.status === 'pending'),
    [allRequests, hospitalId],
  )

  const trendingDisease = risingDiseases[0]
  const trendingDelta = trendingDisease ? pctDelta(trendingDisease.trend) : 0
  const trendingSpark = trendingDisease?.trend ?? []

  const criticalDelta = useMemo(() => {
    const last = trendHistory[trendHistory.length - 1]?.critical ?? counts.critical
    const prev = trendHistory[trendHistory.length - 2]?.critical ?? counts.critical
    if (prev === 0) return 0
    return Math.round(((last - prev) / prev) * 100)
  }, [trendHistory, counts.critical])

  const insights = useMemo(
    () =>
      generateDashboardInsights({
        stockItems: summary.map((s) => ({
          name: s.name,
          status: s.status,
          daysRemaining: Number.isFinite(s.daysRemaining)
            ? s.daysRemaining
            : getDaysRemaining(s.currentStock, 0),
        })),
        diseases: risingDiseases,
        transfers: allRequests,
        locale,
      }),
    [summary, risingDiseases, allRequests, locale],
  )

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
      {/* Row 1: Hero + Profile (12-col grid: 7 / 5) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <HeroBanner />
        </div>
        <div className="lg:col-span-5">
          <ProfileCard />
        </div>
      </div>

      {/* Row 2: KPI Strip (4 cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('dashboard.criticalStock')}
          value={counts.critical}
          subText={
            counts.critical === 0
              ? t('dashboard.noOutbreak')
              : `${counts.critical} ${t('distribution.items')}`
          }
          icon={AlertTriangle}
          tone="critical"
          delta={criticalDelta}
          sparkline={trendHistory.map((d) => d.critical)}
          onClick={() => navigate('/analytics?range=14d')}
        />
        <KpiCard
          label={t('dashboard.activeTransfers')}
          value={activeTransfers.length}
          subText={`${inbound} ${t('dashboard.inbound')} • ${outbound} ${t('dashboard.outbound')}`}
          icon={Truck}
          tone="primary"
          onClick={() => navigate(`/network?tab=${hospitalId ? 'outgoing' : 'incoming'}`)}
        />
        <KpiCard
          label={t('dashboard.trendingDisease')}
          value={trendingDisease?.name ?? '-'}
          subText={
            trendingDisease
              ? `${trendingDelta >= 0 ? '+' : ''}${trendingDelta}% ${t('dashboard.vsLastWeek')}`
              : t('dashboard.noOutbreak')
          }
          icon={TrendingUp}
          tone={trendingDisease ? 'low' : 'safe'}
          sparkline={trendingSpark}
          onClick={() =>
            trendingDisease
              ? navigate(`/analytics?disease=${encodeURIComponent(trendingDisease.name)}`)
              : navigate('/analytics')
          }
        />
        <KpiCard
          label={t('dashboard.pendingOrders')}
          value={pendingOutgoing.length}
          subText={t('dashboard.awaitingApproval')}
          icon={ClipboardList}
          tone="neutral"
          onClick={() => navigate('/network?tab=outgoing')}
        />
      </div>

      {/* Row 3: AI Prediction Banner */}
      <AiPredictionBanner insights={insights} />

      {/* Row 4: Stock Trends (7 cols) + Distribution (5 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <StockTrendsChart />
        </div>
        <div className="lg:col-span-5">
          <StockDistributionCard items={summary} />
        </div>
      </div>

      {/* Row 5: Mini Hospital List (7 cols) + Recent Transfers (5 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MiniHospitalList />
        </div>
        <div className="lg:col-span-5">
          <RecentTransfers />
        </div>
      </div>
    </div>
  )
}
