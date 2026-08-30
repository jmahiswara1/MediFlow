import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStockStore, useCurrentUser, useHospitalId } from '@/store'
import { diseaseList } from '@/data/diseases'
import type { Disease, Medicine, StockStatus } from '@/types'
import {
  generateTrendSeries,
  calculateSurgeUsage,
  calculateDaysLeft,
  getStockStatusFromDays,
  DISEASE_MEDICINE_MAP,
  type TrendDataPoint,
} from '@/utils/trendHelpers'

export type RangeOption = '7d' | '30d' | '90d'

export interface StockPredictionItem {
  medicine: Medicine
  currentStock: number
  baseDailyUsage: number
  adjustedDailyUsage: number
  multiplier: number
  isImpacted: boolean
  daysLeft: number
  status: StockStatus
}

export function useAnalyticsData() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = useCurrentUser()
  const hospitalId = useHospitalId()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)

  // Current hospital stocks
  const currentHospital = useMemo(
    () => hospitals.find((h) => h.id === hospitalId) ?? hospitals[0] ?? null,
    [hospitals, hospitalId],
  )

  // Filter params
  const diseaseParam = searchParams.get('disease') || 'all'
  const rangeParam = (searchParams.get('range') as RangeOption) || '30d'
  const regionParam = searchParams.get('region') || 'Surabaya & Jawa Timur'

  const setDisease = (disease: string) => {
    const next = new URLSearchParams(searchParams)
    if (disease === 'all') next.delete('disease')
    else next.set('disease', disease)
    setSearchParams(next, { replace: true })
  }

  const setRange = (range: RangeOption) => {
    const next = new URLSearchParams(searchParams)
    if (range === '30d') next.delete('range')
    else next.set('range', range)
    setSearchParams(next, { replace: true })
  }

  const setRegion = (region: string) => {
    const next = new URLSearchParams(searchParams)
    if (region === 'all') next.delete('region')
    else next.set('region', region)
    setSearchParams(next, { replace: true })
  }

  // Filtered diseases based on region
  const availableDiseases = useMemo(() => {
    if (regionParam === 'all') return diseaseList
    return diseaseList.filter((d) => d.region === regionParam)
  }, [regionParam])

  // Active selected disease object (or first one / aggregated)
  const activeDisease = useMemo<Disease | null>(() => {
    if (diseaseParam === 'all') {
      // Find the highest severity disease in the active region as featured
      const outbreak = availableDiseases.find((d) => d.severity === 'outbreak')
      if (outbreak) return outbreak
      const rising = availableDiseases.find((d) => d.severity === 'rising')
      if (rising) return rising
      return availableDiseases[0] ?? null
    }
    return (
      availableDiseases.find(
        (d) =>
          d.id === diseaseParam ||
          d.name.toLowerCase() === diseaseParam.toLowerCase() ||
          d.name.toLowerCase().includes(diseaseParam.toLowerCase()),
      ) ?? null
    )
  }, [availableDiseases, diseaseParam])

  // Chart Data Generation
  const chartData = useMemo<TrendDataPoint[]>(() => {
    const historyDays = rangeParam === '7d' ? 7 : rangeParam === '90d' ? 90 : 30
    const projectionDays = rangeParam === '7d' ? 7 : rangeParam === '90d' ? 30 : 14

    if (activeDisease) {
      return generateTrendSeries(activeDisease.trend, historyDays, projectionDays)
    }

    // Aggregated trend across available diseases
    const aggTrend = [0, 0, 0, 0, 0, 0]
    for (const d of availableDiseases) {
      d.trend.forEach((v, idx) => {
        aggTrend[idx] = (aggTrend[idx] ?? 0) + v
      })
    }
    return generateTrendSeries(aggTrend, historyDays, projectionDays)
  }, [activeDisease, availableDiseases, rangeParam])

  // Stock Predictions derived from current hospital stock & surge multiplier
  const stockPredictions = useMemo<StockPredictionItem[]>(() => {
    return medicines
      .map((med) => {
        const hospitalStock = currentHospital?.stocks.find((s) => s.medicineId === med.id)
        const currentStock = hospitalStock ? hospitalStock.currentStock : med.currentStock
        const baseDailyUsage = hospitalStock ? hospitalStock.dailyUsage : med.dailyUsage

        const { adjustedDailyUsage, multiplier, isImpacted } = calculateSurgeUsage(
          baseDailyUsage,
          med.id,
          activeDisease,
        )

        const daysLeft = calculateDaysLeft(currentStock, adjustedDailyUsage)
        const status = getStockStatusFromDays(daysLeft)

        return {
          medicine: med,
          currentStock,
          baseDailyUsage,
          adjustedDailyUsage,
          multiplier,
          isImpacted,
          daysLeft,
          status,
        }
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
  }, [medicines, currentHospital, activeDisease])

  // KPIs
  const kpis = useMemo(() => {
    let totalRegionalCases = 0
    let prevTotal = 0
    for (const d of availableDiseases) {
      totalRegionalCases += d.caseCount
      const firstVal = d.trend[0] ?? 100
      prevTotal += firstVal
    }

    const growthRatio = prevTotal > 0 ? (totalRegionalCases - prevTotal) / prevTotal : 0
    const trendGrowthPercent = Math.round(growthRatio * 100)

    const criticalCount = stockPredictions.filter((s) => s.status === 'critical').length
    const validDays = stockPredictions.filter(
      (s) => Number.isFinite(s.daysLeft) && s.daysLeft < 900,
    )
    const avgDays = validDays.length
      ? Math.round(validDays.reduce((acc, curr) => acc + curr.daysLeft, 0) / validDays.length)
      : 14

    return {
      totalRegionalCases,
      trendGrowthPercent,
      criticalCount,
      avgDays,
    }
  }, [availableDiseases, stockPredictions])

  // AI Reasoning
  const reasoning = useMemo(() => {
    if (!activeDisease) {
      return {
        title: 'Korelasi Multivarian Epidemiologi',
        points: [
          'Sebagian besar kasus di wilayah terpantau menunjukkan kenaikan musiman stabil.',
          'Kebutuhan pasokan cairan infus dan analgesik diproyeksikan meningkat bertahap 15-20% dalam 30 hari ke depan.',
          'Pastikan faskes menjaga batas aman buffer stock minimal 14 hari konsumsi.',
        ],
        recommendation: 'Lakukan pemantauan berkala pada obat-obatan berstatus menipis.',
        recommendedMedicineId: null,
      }
    }

    const correlation = DISEASE_MEDICINE_MAP.find(
      (c) =>
        activeDisease.name.toLowerCase().includes(c.diseaseName.toLowerCase()) ||
        c.diseaseName.toLowerCase().includes(activeDisease.name.toLowerCase()),
    )

    const highestShortage = stockPredictions.find((s) => s.isImpacted && s.status !== 'safe')
    const recMedicine = highestShortage?.medicine.name ?? 'Infus NaCl 0.9%'
    const recMedId = highestShortage?.medicine.id ?? 'obt-003'

    const points = [
      `Tren ${activeDisease.name} di ${activeDisease.region} berada pada fase "${activeDisease.severity.toUpperCase()}" dengan akumulasi ${activeDisease.caseCount} kasus aktif.`,
      correlation?.rationaleId ??
        `Pola penularan penyakit memicu lonjakan konsumsi obat pendukung sebesar ${((correlation?.surgeMultiplier ?? 1.3) * 100 - 100).toFixed(0)}%.`,
      `Proyeksi model mengindikasikan lonjakan beban rawat inap berpotensi menguras stok ${recMedicine} dalam ${highestShortage?.daysLeft ?? 3} hari ke depan jika tidak ada reallokasi pasokan.`,
    ]

    return {
      title: `Analisis Wabah ${activeDisease.name} (${activeDisease.region})`,
      points,
      recommendation: `Disarankan segera mengajukan transfer masuk untuk ${recMedicine} dari rumah sakit jejaring terdekat yang memiliki surplus stok.`,
      recommendedMedicineId: recMedId,
    }
  }, [activeDisease, stockPredictions])

  return {
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
    currentUser,
  }
}
