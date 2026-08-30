import { useI18n } from '@/i18n/useI18n'
import { useAnalyticsData } from './hooks/useAnalyticsData'
import { AnalyticsMetrics } from './components/AnalyticsMetrics'
import { AnalyticsFilterStrip } from './components/AnalyticsFilterStrip'
import { DiseaseTrendChart } from './components/DiseaseTrendChart'
import { EpidemiologyReasoningCard } from './components/EpidemiologyReasoningCard'
import { StockPredictionTable } from './components/StockPredictionTable'
import { Building2 } from 'lucide-react'

export function AnalyticsPage() {
  const { t } = useI18n()
  const {
    diseaseParam,
    rangeParam,
    regionParam,
    setDisease,
    setRange,
    setRegion,
    availableDiseases,
    activeDisease,
    chartData,
    stockPredictions,
    kpis,
    reasoning,
    currentHospital,
  } = useAnalyticsData()

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
            {t('analytics.title')}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{t('analytics.description')}</p>
        </div>

        {currentHospital && (
          <div className="bg-primary/5 border-primary/25 flex items-center gap-2 self-start rounded-xl border px-3 py-1.5 shadow-2xs">
            <Building2 className="text-primary size-4" />
            <div className="text-xs">
              <span className="text-muted-foreground">Faskes Aktif: </span>
              <span className="text-primary font-bold">{currentHospital.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Top 4 KPI Metrics */}
      <AnalyticsMetrics
        totalCases={kpis.totalRegionalCases}
        growthPercent={kpis.trendGrowthPercent}
        criticalCount={kpis.criticalCount}
        avgDays={kpis.avgDays}
      />

      {/* Filter Controls Bar */}
      <AnalyticsFilterStrip
        diseases={availableDiseases}
        selectedDiseaseId={diseaseParam}
        selectedRange={rangeParam}
        selectedRegion={regionParam}
        onSelectDisease={setDisease}
        onSelectRange={setRange}
        onSelectRegion={setRegion}
      />

      {/* 2-Column Main Content Grid */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Left Column (Chart + Reasoning Insights) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <DiseaseTrendChart data={chartData} disease={activeDisease} />
          <EpidemiologyReasoningCard
            title={reasoning.title}
            points={reasoning.points}
            recommendation={reasoning.recommendation}
            recommendedMedicineId={reasoning.recommendedMedicineId}
          />
        </div>

        {/* Right Column (Stock Runway Prediction Table) */}
        <div className="flex flex-col lg:col-span-5">
          <StockPredictionTable items={stockPredictions} />
        </div>
      </div>
    </div>
  )
}
