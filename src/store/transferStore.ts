import { create } from 'zustand'
import { transferRequestList } from '@/data'
import type { TransferRequest, TransferStatus } from '@/types'

interface TransferState {
  requests: TransferRequest[]
  addRequest: (request: TransferRequest) => void
  updateStatus: (id: string, status: TransferStatus) => void
}

export const useTransferStore = create<TransferState>()((set) => ({
  requests: transferRequestList,
  addRequest: (request) => set((state) => ({ requests: [...state.requests, request] })),
  updateStatus: (id, status) =>
    set((state) => ({
      requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
}))
