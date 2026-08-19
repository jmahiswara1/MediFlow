export function formatDate(value: string | Date, locale: 'en' | 'id' = 'id'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function daysUntilStockout(currentStock: number, dailyUsage: number): number {
  if (dailyUsage <= 0) return Number.POSITIVE_INFINITY
  return Math.floor(currentStock / dailyUsage)
}

export function relativeTime(value: string | Date, locale: 'en' | 'id' = 'id'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  const diffMs = date.getTime() - Date.now()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (locale === 'id') {
    if (diffDays <= 0) return 'hari ini'
    return `${diffDays} hari lagi`
  }

  if (diffDays <= 0) return 'today'
  return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`
}
