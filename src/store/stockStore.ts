import { create } from 'zustand'
import { medicineList, hospitalList } from '@/data'
import type { Medicine, Hospital } from '@/types'

interface StockState {
  Medicine: Medicine[]
  Hospital: Hospital[]
}

export const useStockStore = create<StockState>()(() => ({
  Medicine: medicineList,
  Hospital: hospitalList,
}))
