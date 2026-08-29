import type { StockStatus, TransferStatus, Urgency } from '@/types'

export const stockStatusLabels: Record<StockStatus, { en: string; id: string }> = {
  safe: { en: 'Safe', id: 'Aman' },
  low: { en: 'Low', id: 'Menipis' },
  critical: { en: 'Critical', id: 'Kritis' },
}

export const transferStatusLabels: Record<TransferStatus, { en: string; id: string }> = {
  pending: { en: 'Pending', id: 'Pending' },
  approved: { en: 'Approved', id: 'Disetujui' },
  shipped: { en: 'Shipped', id: 'Dikirim' },
  completed: { en: 'Completed', id: 'Selesai' },
  rejected: { en: 'Rejected', id: 'Ditolak' },
}

export const urgencyLabels: Record<Urgency, { en: string; id: string }> = {
  high: { en: 'High', id: 'Tinggi' },
  normal: { en: 'Normal', id: 'Normal' },
  low: { en: 'Low', id: 'Rendah' },
}

export function getStockStatus(currentStock: number, minimumStock: number): StockStatus {
  if (minimumStock <= 0) return 'safe'
  if (currentStock <= minimumStock * 0.5) return 'critical'
  if (currentStock <= minimumStock) return 'low'
  return 'safe'
}

export function getDaysRemaining(currentStock: number, dailyUsage: number): number {
  if (dailyUsage <= 0) return Number.POSITIVE_INFINITY
  return Math.floor(currentStock / dailyUsage)
}

export type StatusTone = 'positive' | 'neutral' | 'negative'

export function getTransferStatusTone(status: TransferStatus): StatusTone {
  switch (status) {
    case 'pending':
      return 'neutral'
    case 'approved':
    case 'shipped':
    case 'completed':
      return 'positive'
    case 'rejected':
      return 'negative'
  }
}

export function getStockStatusTone(status: StockStatus): StatusTone {
  switch (status) {
    case 'safe':
      return 'positive'
    case 'low':
      return 'neutral'
    case 'critical':
      return 'negative'
  }
}