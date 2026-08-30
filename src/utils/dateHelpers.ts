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

export function formatRelative(value: string | Date, locale: 'en' | 'id' = 'id'): string {
  const date = typeof value === 'string' ? new Date(value) : value
  const diffMs = Date.now() - date.getTime()
  const isFuture = diffMs < 0
  const absMs = Math.abs(diffMs)
  const minutes = Math.round(absMs / (1000 * 60))
  const hours = Math.round(absMs / (1000 * 60 * 60))
  const days = Math.round(absMs / (1000 * 60 * 60 * 24))

  if (locale === 'id') {
    if (minutes < 1) return isFuture ? 'sebentar lagi' : 'baru saja'
    if (minutes < 60) return isFuture ? `dalam ${minutes} menit` : `${minutes} menit lalu`
    if (hours < 24) return isFuture ? `dalam ${hours} jam` : `${hours} jam lalu`
    return isFuture ? `dalam ${days} hari` : `${days} hari lalu`
  }

  if (minutes < 1) return isFuture ? 'soon' : 'just now'
  if (minutes < 60) return isFuture ? `in ${minutes}m` : `${minutes}m ago`
  if (hours < 24) return isFuture ? `in ${hours}h` : `${hours}h ago`
  return isFuture ? `in ${days}d` : `${days}d ago`
}
