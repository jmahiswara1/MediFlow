import type { StockStatus, TransferStatus } from '@/types'

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

export function getStockStatus(currentStock: number, minimumStock: number): StockStatus {
  if (currentStock <= minimumStock * 0.5) return 'critical'
  if (currentStock <= minimumStock) return 'low'
  return 'safe'
}
