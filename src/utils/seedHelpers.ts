// Seed generators for static lookback data (Dashboard chart, etc.)

export interface StockTrendPoint {
  date: string
  critical: number
  low: number
}

// Generate 14-day historical stock trend for the Dashboard chart.
// Counts of items per status across all hospitals on that day.
export function generateStockTrendHistory(): StockTrendPoint[] {
  // Static base arrays that simulate fluctuation over 14 days.
  const baseCritical = [3, 4, 5, 4, 6, 7, 5, 8, 9, 7, 8, 10, 9, 11]
  const baseLow = [5, 6, 5, 7, 8, 6, 9, 8, 10, 9, 11, 10, 12, 11]

  const points: StockTrendPoint[] = []
  const now = new Date()

  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - (13 - i))
    points.push({
      date: d.toISOString().split('T')[0] ?? '',
      critical: baseCritical[i] ?? 0,
      low: baseLow[i] ?? 0,
    })
  }

  return points
}