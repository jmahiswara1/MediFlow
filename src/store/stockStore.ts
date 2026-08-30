import { create } from 'zustand'
import { medicineList, hospitalList } from '@/data'
import type { Medicine, Hospital } from '@/types'

interface StockState {
  medicines: Medicine[]
  hospitals: Hospital[]
}

export const useStockStore = create<StockState>()(() => ({
  medicines: medicineList,
  hospitals: hospitalList,
}))
