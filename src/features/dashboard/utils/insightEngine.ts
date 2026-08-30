import type { StockStatus, Disease, TransferRequest } from '@/types'

export type InsightTone = 'warning' | 'info' | 'positive' | 'critical'

export interface InsightCta {
  label: string
  href: string
}

export interface DashboardInsight {
  tone: InsightTone
  type: 'stock-critical' | 'stock-rising' | 'transfer-overload' | 'system'
  headline: string
  body: string
  cta: InsightCta | null
}

export interface StockItemLite {
  name: string
  status: StockStatus
  daysRemaining: number
}

interface GenerateInput {
  stockItems: StockItemLite[]
  diseases: Disease[]
  transfers: TransferRequest[]
  locale: 'id' | 'en'
}

function pctChange(trend: number[]): number {
  if (trend.length < 2) return 0
  const last = trend[trend.length - 1] ?? 0
  const prev = trend[trend.length - 2] ?? 0
  if (prev === 0) return 0
  return Math.round(((last - prev) / prev) * 100)
}

function isId(locale: 'id' | 'en'): boolean {
  return locale === 'id'
}

function topCritical(stockItems: StockItemLite[]): StockItemLite | undefined {
  return stockItems
    .filter((s) => s.status === 'critical')
    .slice()
    .sort((a, b) => a.daysRemaining - b.daysRemaining)[0]
}

function topRising(diseases: Disease[]): Disease | undefined {
  return diseases
    .filter((d) => d.severity !== 'normal')
    .slice()
    .sort((a, b) => pctChange(b.trend) - pctChange(a.trend))[0]
}

function countByStatus(stockItems: StockItemLite[], status: StockStatus): number {
  return stockItems.filter((s) => s.status === status).length
}

function activeTransferCount(transfers: TransferRequest[]): number {
  return transfers.filter(
    (t) => t.status === 'pending' || t.status === 'approved' || t.status === 'shipped',
  ).length
}

export function generateDashboardInsights({
  stockItems,
  diseases,
  transfers,
  locale,
}: GenerateInput): DashboardInsight[] {
  const id = isId(locale)
  const critical = topCritical(stockItems)
  const criticalCount = countByStatus(stockItems, 'critical')
  const lowCount = countByStatus(stockItems, 'low')
  const rising = topRising(diseases)
  const active = activeTransferCount(transfers)
  const insights: DashboardInsight[] = []

  // 1. Top insight: critical stock (highest priority)
  if (critical) {
    const pct = criticalCount / Math.max(stockItems.length, 1)
    insights.push({
      type: 'stock-critical',
      tone: 'critical',
      headline: id
        ? `${critical.name} tinggal ${critical.daysRemaining} hari di beberapa RS.`
        : `${critical.name} has ${critical.daysRemaining} days left at multiple hospitals.`,
      body: id
        ? `${criticalCount} item (${Math.round(pct * 100)}%) dari total stok berada di level kritis. Pertimbangkan transfer preventif dari RS dengan surplus.`
        : `${criticalCount} items (${Math.round(pct * 100)}%) of total stock are at critical level. Consider preventive transfer from surplus hospitals.`,
      cta: {
        label: id ? 'Cari RS Surplus' : 'Find Surplus Hospitals',
        href: '/network',
      },
    })
  }

  // 2. Second: rising disease (if any)
  if (rising) {
    const pct = pctChange(rising.trend)
    insights.push({
      type: 'stock-rising',
      tone: 'warning',
      headline: id
        ? `Tren ${rising.name} naik ${pct}% di ${rising.region}.`
        : `${rising.name} trend up ${pct}% in ${rising.region}.`,
      body: id
        ? `Pantau penggunaan obat terkait dan pertimbangkan stocking preventif dalam 7-14 hari ke depan.`
        : `Monitor related medication usage and consider preventive stocking in the next 7-14 days.`,
      cta: {
        label: id ? 'Lihat Analitik' : 'View Analytics',
        href: `/analytics?disease=${encodeURIComponent(rising.name)}`,
      },
    })
  }

  // 3. Third: transfer overload or general
  if (active > 5) {
    insights.push({
      type: 'transfer-overload',
      tone: 'info',
      headline: id
        ? `${active} transfer aktif sedang berjalan.`
        : `${active} active transfers in progress.`,
      body: id
        ? `Pantau status real-time dan prioritaskan yang ber-urgency tinggi.`
        : `Monitor real-time status and prioritize high-urgency requests.`,
      cta: {
        label: id ? 'Buka Network' : 'Open Network',
        href: '/network',
      },
    })
  }

  // 4. Fallback: all good
  if (insights.length === 0) {
    insights.push({
      type: 'system',
      tone: 'positive',
      headline: id ? 'Semua stok dan tren terkendali.' : 'All stock and trends under control.',
      body: id
        ? `Tidak ada outbreak aktif dan ${active} transfer berjalan normal.`
        : `No active outbreak and ${active} transfers running normally.`,
      cta: null,
    })
  }

  // Padding: if less than 3 insights, add lowCount info
  if (insights.length < 3 && lowCount > 0) {
    insights.push({
      type: 'stock-rising',
      tone: 'info',
      headline: id ? `${lowCount} item di level menipis.` : `${lowCount} items at low level.`,
      body: id
        ? `Pantau burn rate dan pertimbangkan restock preventif.`
        : `Watch burn rate and consider preventive restock.`,
      cta: {
        label: id ? 'Lihat Detail' : 'View Details',
        href: '/analytics?range=30d',
      },
    })
  }

  return insights.slice(0, 3)
}

// Backward compatible: single insight for non-banner usage
export function generateDashboardInsight(input: GenerateInput): {
  tone: 'warning' | 'info' | 'positive'
  headline: string
  body: string
  cta: InsightCta | null
} {
  const insights = generateDashboardInsights(input)
  const top = insights[0]
  if (!top) {
    return {
      tone: 'positive',
      headline: '',
      body: '',
      cta: null,
    }
  }
  // map tone
  const mappedTone: 'warning' | 'info' | 'positive' =
    top.tone === 'critical' ? 'warning' : top.tone === 'positive' ? 'positive' : 'info'
  return {
    tone: mappedTone,
    headline: top.headline,
    body: top.body,
    cta: top.cta,
  }
}
