import { medicineList } from '@/data'
import { getStockStatus } from '@/utils/statusHelpers'
import type { Medicine, StockStatus } from '@/types'

export interface StockSummary {
  id: string
  name: string
  status: StockStatus
  currentStock: number
  minimumStock: number
  daysRemaining: number
}

function summarize(Medicine: Medicine): StockSummary {
  return {
    id: Medicine.id,
    name: Medicine.name,
    status: getStockStatus(Medicine.currentStock, Medicine.minimumStock),
    currentStock: Medicine.currentStock,
    minimumStock: Medicine.minimumStock,
    daysRemaining: Medicine.dailyUsage > 0 ? Math.floor(Medicine.currentStock / Medicine.dailyUsage) : 0,
  }
}

export function useStockSummary(): StockSummary[] {
  return medicineList.map(summarize)
}

export function useStockSummaryByStatus(status: StockStatus): StockSummary[] {
  return medicineList.map(summarize).filter((item) => item.status === status)
}
