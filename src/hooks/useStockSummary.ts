import { obatList } from '@/data'
import { getStockStatus } from '@/utils/statusHelpers'
import type { Obat, StockStatus } from '@/types'

export interface StockSummary {
  id: string
  name: string
  status: StockStatus
  currentStock: number
  minimumStock: number
  daysRemaining: number
}

function summarize(obat: Obat): StockSummary {
  return {
    id: obat.id,
    name: obat.name,
    status: getStockStatus(obat.currentStock, obat.minimumStock),
    currentStock: obat.currentStock,
    minimumStock: obat.minimumStock,
    daysRemaining: obat.dailyUsage > 0 ? Math.floor(obat.currentStock / obat.dailyUsage) : 0,
  }
}

export function useStockSummary(): StockSummary[] {
  return obatList.map(summarize)
}

export function useStockSummaryByStatus(status: StockStatus): StockSummary[] {
  return obatList.map(summarize).filter((item) => item.status === status)
}
