import type { Disease } from '@/types'

// Interpolate baseTrend (e.g. 6 weekly points) to `days` daily points with light noise.
export function generateTrendSeries(
  baseTrend: number[],
  days: number,
): { actual: number[]; dates: string[] } {
  const actual: number[] = []
  const dates: string[] = []
  const now = new Date()
  const baseLen = baseTrend.length

  for (let i = 0; i < days; i++) {
    const pos = baseLen <= 1 ? 0 : (i / Math.max(1, days - 1)) * (baseLen - 1)
    const lower = Math.floor(pos)
    const upper = Math.min(baseLen - 1, lower + 1)
    const t = pos - lower
    const baseValue = baseTrend[lower] * (1 - t) + baseTrend[upper] * t

    // Deterministic-ish noise based on index, bounded +/- 8%
    const noise = Math.sin(i * 0.91) * 0.04 + Math.cos(i * 0.47) * 0.03
    const value = Math.max(0, Math.round(baseValue * (1 + noise)))

    actual.push(value)

    const d = new Date(now)
    d.setDate(d.getDate() - (days - 1 - i))
    dates.push(d.toISOString().split('T')[0] ?? '')
  }

  return { actual, dates }
}

// Linear regression on recent trend, extrapolate `projectionDays` points forward.
export function generateProjection(
  recentTrend: number[],
  projectionDays: number,
): number[] {
  const n = recentTrend.length
  if (n < 2 || projectionDays <= 0) {
    return Array(projectionDays).fill(recentTrend[recentTrend.length - 1] ?? 0)
  }

  const sumX = (n - 1) * n / 2
  const sumY = recentTrend.reduce((a, b) => a + b, 0)
  const sumXY = recentTrend.reduce((acc, y, x) => acc + x * y, 0)
  const sumXX = (n - 1) * n * (2 * n - 1) / 6

  const denom = n * sumXX - sumX * sumX
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  const projection: number[] = []
  for (let i = 0; i < projectionDays; i++) {
    const x = n + i
    const value = slope * x + intercept
    projection.push(Math.max(0, Math.round(value)))
  }
  return projection
}

export function findDiseaseByName(
  list: Disease[],
  name: string | null | undefined,
): Disease | undefined {
  if (!name) return undefined
  const normalized = name.toLowerCase().trim()
  return list.find((d) => d.name.toLowerCase() === normalized)
}

export function diseasesByRegion(
  list: Disease[],
  region: string | null | undefined,
): Disease[] {
  if (!region) return list
  return list.filter((d) => d.region === region)
}