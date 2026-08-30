import type { Disease, StockStatus } from '@/types'

export interface TrendDataPoint {
  date: string
  label: string
  actual: number | null
  projected: number | null
  confidenceUpper?: number | null
  confidenceLower?: number | null
}

export interface DiseaseMedicineCorrelation {
  diseaseName: string
  medicineIds: string[]
  surgeMultiplier: number
  rationaleId: string
  rationaleEn: string
}

export const DISEASE_MEDICINE_MAP: DiseaseMedicineCorrelation[] = [
  {
    diseaseName: 'DBD (Demam Berdarah)',
    medicineIds: ['obt-003', 'obt-009', 'obt-001'],
    surgeMultiplier: 1.5,
    rationaleId:
      'Lonjakan kasus demam berdarah secara langsung menaikkan kebutuhan rehidrasi cairan intravena (Infus NaCl 0.9%, IV Fluids 500ml) dan antipiretik (Paracetamol 500mg) untuk penanganan trombositopenia.',
    rationaleEn:
      'Dengue outbreak directly drives up consumption of intravenous fluid rehydration (NaCl 0.9%, IV Fluids 500ml) and antipyretics (Paracetamol 500mg) for thrombocytopenia management.',
  },
  {
    diseaseName: 'ISPA',
    medicineIds: ['obt-001', 'obt-004', 'obt-006'],
    surgeMultiplier: 1.35,
    rationaleId:
      'Peningkatan infeksi saluran pernapasan memicu konsumsi antivirus Oseltamivir, Paracetamol, serta kebutuhan proteksi APD Masker N95 bagi tenaga medis.',
    rationaleEn:
      'Rising acute respiratory infections trigger demand for Oseltamivir antiviral, Paracetamol, and N95 protective masks for medical staff.',
  },
  {
    diseaseName: 'Influenza A',
    medicineIds: ['obt-004', 'obt-001', 'obt-006'],
    surgeMultiplier: 1.4,
    rationaleId:
      'Klaster Influenza A musiman mempercepat laju pemakaian antiviral Oseltamivir 75mg hingga 1.4x lipat dari rata-rata konsumsi normal.',
    rationaleEn:
      'Seasonal Influenza A clusters accelerate the burn rate of Oseltamivir 75mg antiviral up to 1.4x above normal daily usage.',
  },
  {
    diseaseName: 'COVID-19',
    medicineIds: ['obt-007', 'obt-005', 'obt-006'],
    surgeMultiplier: 1.5,
    rationaleId:
      'Kenaikan transmisi COVID-19 meningkatkan permintaan terapi Paxlovid, suplementasi Vitamin D3 1000 IU dosis tinggi, dan masker respirator N95.',
    rationaleEn:
      'Increased COVID-19 transmission elevates demand for Paxlovid antiviral therapy, high-dose Vitamin D3, and N95 respirators.',
  },
  {
    diseaseName: 'Diare Akut',
    medicineIds: ['obt-003', 'obt-010', 'obt-001'],
    surgeMultiplier: 1.3,
    rationaleId:
      'Insiden diare akut dan dehidrasi meningkatkan kebutuhan cairan infus pengganti elektrolit dan spuit injeksi 10ml.',
    rationaleEn:
      'Acute diarrhea incidence increases requirement for electrolyte replacement IV fluids and 10ml injection syringes.',
  },
  {
    diseaseName: 'Tifus Abdominalis',
    medicineIds: ['obt-002', 'obt-003', 'obt-001'],
    surgeMultiplier: 1.35,
    rationaleId:
      'Kasus demam tifoid membutuhkan terapi antibiotik Amoxicillin 500mg berkelanjutan dan hidrasi pendukung.',
    rationaleEn:
      'Typhoid fever cases require sustained Amoxicillin 500mg antibiotic courses and supportive fluid therapy.',
  },
]

// Interpolate and project daily series with seamless actual-to-projected continuity
export function generateTrendSeries(
  baseTrend: number[],
  historyDays: number = 30,
  projectionDays: number = 14,
): TrendDataPoint[] {
  const points: TrendDataPoint[] = []
  const now = new Date()
  const baseLen = Math.max(1, baseTrend.length)

  // 1. Generate Historical Actuals
  const actualValues: number[] = []
  for (let i = 0; i < historyDays; i++) {
    const pos = baseLen <= 1 ? 0 : (i / Math.max(1, historyDays - 1)) * (baseLen - 1)
    const lower = Math.floor(pos)
    const upper = Math.min(baseLen - 1, lower + 1)
    const t = pos - lower
    const baseValue = (baseTrend[lower] ?? 100) * (1 - t) + (baseTrend[upper] ?? 100) * t

    // Natural noise variance +/- 5%
    const noise = Math.sin(i * 0.91) * 0.03 + Math.cos(i * 0.47) * 0.02
    const value = Math.max(10, Math.round(baseValue * (1 + noise)))
    actualValues.push(value)

    const d = new Date(now)
    d.setDate(d.getDate() - (historyDays - 1 - i))
    const dateStr = d.toISOString().split('T')[0] ?? ''
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

    // On the very last historical point, set projected equal to actual to create a continuous line
    const isLastActual = i === historyDays - 1

    points.push({
      date: dateStr,
      label,
      actual: value,
      projected: isLastActual ? value : null,
      confidenceUpper: isLastActual ? value : null,
      confidenceLower: isLastActual ? value : null,
    })
  }

  // 2. Generate Linear / Polynomial Projections forward
  const n = actualValues.length
  const recentWindow = Math.min(14, n)
  const recentTrend = actualValues.slice(-recentWindow)
  const rwLen = recentTrend.length

  // Calculate slope on recent window
  const sumX = ((rwLen - 1) * rwLen) / 2
  const sumY = recentTrend.reduce((a, b) => a + b, 0)
  const sumXY = recentTrend.reduce((acc, y, x) => acc + x * y, 0)
  const sumXX = ((rwLen - 1) * rwLen * (2 * rwLen - 1)) / 6

  const denom = rwLen * sumXX - sumX * sumX
  const slope = denom === 0 ? 0 : (rwLen * sumXY - sumX * sumY) / denom
  const lastActual = actualValues[actualValues.length - 1] ?? 100

  for (let j = 1; j <= projectionDays; j++) {
    const projectedVal = Math.max(15, Math.round(lastActual + slope * j))
    // Confidence interval expands as we project further into the future (+/- 3% per day)
    const margin = Math.round(projectedVal * (0.04 + j * 0.015))
    const upper = projectedVal + margin
    const lower = Math.max(0, projectedVal - margin)

    const fd = new Date(now)
    fd.setDate(fd.getDate() + j)
    const dateStr = fd.toISOString().split('T')[0] ?? ''
    const label = fd.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

    points.push({
      date: dateStr,
      label,
      actual: null,
      projected: projectedVal,
      confidenceUpper: upper,
      confidenceLower: lower,
    })
  }

  return points
}

// Calculate adjusted daily consumption burn rate based on disease impact
export function calculateSurgeUsage(
  baseDailyUsage: number,
  medicineId: string,
  disease?: Disease | null,
): { adjustedDailyUsage: number; multiplier: number; isImpacted: boolean } {
  if (!disease) {
    return { adjustedDailyUsage: baseDailyUsage, multiplier: 1.0, isImpacted: false }
  }

  const correlation = DISEASE_MEDICINE_MAP.find(
    (c) =>
      disease.name.toLowerCase().includes(c.diseaseName.toLowerCase()) ||
      c.diseaseName.toLowerCase().includes(disease.name.toLowerCase()),
  )

  if (!correlation || !correlation.medicineIds.includes(medicineId)) {
    return { adjustedDailyUsage: baseDailyUsage, multiplier: 1.0, isImpacted: false }
  }

  let mult = correlation.surgeMultiplier
  if (disease.severity === 'outbreak') {
    mult += 0.2
  } else if (disease.severity === 'normal') {
    mult = Math.max(1.0, mult - 0.2)
  }

  const adjustedDailyUsage = Math.round(baseDailyUsage * mult)
  return {
    adjustedDailyUsage,
    multiplier: Number(mult.toFixed(2)),
    isImpacted: true,
  }
}

export function calculateDaysLeft(currentStock: number, dailyUsage: number): number {
  if (dailyUsage <= 0) return 999
  return Math.max(0, Math.floor(currentStock / dailyUsage))
}

export function getStockStatusFromDays(daysLeft: number): StockStatus {
  if (daysLeft <= 3) return 'critical'
  if (daysLeft <= 7) return 'low'
  return 'safe'
}

export function findDiseaseByName(
  list: Disease[],
  name: string | null | undefined,
): Disease | undefined {
  if (!name) return undefined
  const normalized = name.toLowerCase().trim()
  return list.find(
    (d) =>
      d.name.toLowerCase() === normalized ||
      d.name.toLowerCase().includes(normalized) ||
      normalized.includes(d.name.toLowerCase()),
  )
}

export function diseasesByRegion(list: Disease[], region: string | null | undefined): Disease[] {
  if (!region || region === 'all') return list
  return list.filter((d) => d.region === region)
}
