import { create } from 'zustand'
import { obatList, rumahSakitList } from '@/data'
import type { Obat, RumahSakit } from '@/types'

interface StockState {
  obat: Obat[]
  rumahSakit: RumahSakit[]
}

export const useStockStore = create<StockState>()(() => ({
  obat: obatList,
  rumahSakit: rumahSakitList,
}))
