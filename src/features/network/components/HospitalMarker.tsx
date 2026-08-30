import L from 'leaflet'
import type { Hospital, StockStatus } from '@/types'

const COLOR_MAP: Record<StockStatus, { bg: string; fill: string; ring: string }> = {
  safe: {
    bg: '#10b981', // emerald
    fill: 'rgba(16, 185, 129, 0.25)',
    ring: 'rgba(16, 185, 129, 0.4)',
  },
  low: {
    bg: '#f59e0b', // amber
    fill: 'rgba(245, 158, 11, 0.25)',
    ring: 'rgba(245, 158, 11, 0.4)',
  },
  critical: {
    bg: '#ef4444', // crimson
    fill: 'rgba(239, 68, 68, 0.25)',
    ring: 'rgba(239, 68, 68, 0.5)',
  },
}

interface CreateMarkerOptions {
  status: StockStatus
  isCurrent?: boolean
  isSelected?: boolean
  name?: string
}

export function createHospitalMarker({
  status,
  isCurrent = false,
  isSelected = false,
}: CreateMarkerOptions) {
  const config = COLOR_MAP[status]
  const pulseHtml =
    status === 'critical'
      ? `<div class="absolute -inset-2 rounded-full animate-ping opacity-40" style="background: ${config.bg};"></div>`
      : ''

  const currentRingHtml = isCurrent
    ? `<div class="absolute -inset-2 rounded-full ring-2 ring-primary ring-offset-2 bg-primary/20"></div>`
    : ''

  const selectedRingHtml = isSelected
    ? `<div class="absolute -inset-2.5 rounded-full ring-2 ring-foreground ring-offset-2"></div>`
    : ''

  return L.divIcon({
    className: 'mediflow-custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
    html: `
      <div class="relative flex items-center justify-center size-7 cursor-pointer transition-transform hover:scale-110">
        ${pulseHtml}
        ${currentRingHtml}
        ${selectedRingHtml}
        <div class="relative flex items-center justify-center size-7 rounded-full shadow-lg border-2 border-white" style="background: ${config.bg};">
          <svg class="size-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </div>
    `,
  })
}

export function getStatusLabel(status: StockStatus, locale: 'id' | 'en' = 'id'): string {
  if (locale === 'en') {
    return { safe: 'Safe', low: 'Low', critical: 'Critical' }[status]
  }
  return { safe: 'Aman', low: 'Menipis', critical: 'Kritis' }[status]
}

export function getStockSummaryText(hospital: Hospital): string {
  const total = hospital.stocks.length
  let critical = 0
  let low = 0
  for (const s of hospital.stocks) {
    if (s.currentStock <= s.minimumStock * 0.5) critical++
    else if (s.currentStock <= s.minimumStock) low++
  }
  return `${total} items (${critical} critical, ${low} low)`
}
