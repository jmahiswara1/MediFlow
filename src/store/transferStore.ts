import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { TransferRequest, TransferStatus, Urgency } from '@/types'
import { transferRequestList } from '@/data/transferRequests'
import { userList } from '@/data/users'
import { useNotificationStore } from './notificationStore'
import { useHospitalId } from './authStore'

type AddRequestPayload = Omit<TransferRequest, 'id' | 'createdAt' | 'timeline' | 'status'>

interface TransferState {
  requests: TransferRequest[]
  addRequest: (req: AddRequestPayload) => string
  approveRequest: (id: string, approverId: string, approverName: string) => void
  declineRequest: (id: string, approverId: string, approverName: string, reason: string) => void
  markShipped: (id: string, expedition: string) => void
  markCompleted: (id: string, receivedBy: string) => void
  cancelRequest: (id: string) => void
  // Kept for backward compatibility
  updateStatus: (id: string, status: TransferStatus) => void
}

function genId(): string {
  return `trx-${String(Date.now()).slice(-6)}-${Math.floor(Math.random() * 1000)}`
}

function findApproverByHospital(hospitalId: string): string {
  const approver = userList.find((u) => u.role === 'approver' && u.hospitalId === hospitalId)
  return approver?.id ?? ''
}

function findRequesterByHospital(hospitalId: string): string {
  const requester = userList.find((u) => u.role === 'requester' && u.hospitalId === hospitalId)
  return requester?.id ?? ''
}

function urgencyLabel(u: Urgency): string {
  return u.charAt(0).toUpperCase() + u.slice(1)
}

export const useTransferStore = create<TransferState>()(
  persist(
    (set) => ({
      requests: transferRequestList,

      addRequest: (req) => {
        const id = genId()
        const now = new Date().toISOString()
        const newReq: TransferRequest = {
          ...req,
          status: 'pending',
          id,
          createdAt: now,
          timeline: [
            {
              status: 'pending',
              at: now,
              by: req.createdBy,
              byName: req.createdByName,
            },
          ],
        }
        set((state) => ({ requests: [...state.requests, newReq] }))

        // Side effect: trigger notification to approver of target hospital
        const approverId = findApproverByHospital(req.toHospitalId)
        if (approverId) {
          useNotificationStore.getState().addNotification({
            userId: approverId,
            type: 'incoming-request',
            title: `Permintaan masuk dari ${req.fromHospitalName}`,
            snippet: `${req.medicineName} ${req.quantity} - Urgency ${urgencyLabel(req.urgency)}`,
            link: `/network?focus=${id}&tab=incoming`,
            transferId: id,
          })
        }

        return id
      },

      approveRequest: (id, approverId, approverName) => {
        const now = new Date().toISOString()
        let target: TransferRequest | undefined
        set((state) => ({
          requests: state.requests.map((r) => {
            if (r.id !== id) return r
            const next: TransferRequest = {
              ...r,
              status: 'approved',
              timeline: [
                ...r.timeline,
                { status: 'approved', at: now, by: approverId, byName: approverName },
              ],
            }
            target = next
            return next
          }),
        }))

        if (target) {
          const requesterId = findRequesterByHospital(target.fromHospitalId)
          if (requesterId) {
            useNotificationStore.getState().addNotification({
              userId: requesterId,
              type: 'request-approved',
              title: 'Permintaan Anda disetujui',
              snippet: `${target.medicineName} ${target.quantity} - ${target.toHospitalName}`,
              link: `/network?focus=${id}&tab=outgoing`,
              transferId: id,
            })
          }
        }
      },

      declineRequest: (id, approverId, approverName, reason) => {
        const now = new Date().toISOString()
        let target: TransferRequest | undefined
        set((state) => ({
          requests: state.requests.map((r) => {
            if (r.id !== id) return r
            const next: TransferRequest = {
              ...r,
              status: 'rejected',
              timeline: [
                ...r.timeline,
                {
                  status: 'rejected',
                  at: now,
                  by: approverId,
                  byName: approverName,
                  reason,
                },
              ],
            }
            target = next
            return next
          }),
        }))

        if (target) {
          const requesterId = findRequesterByHospital(target.fromHospitalId)
          if (requesterId) {
            useNotificationStore.getState().addNotification({
              userId: requesterId,
              type: 'request-rejected',
              title: 'Permintaan Anda ditolak',
              snippet: reason,
              link: `/network?focus=${id}&tab=outgoing`,
              transferId: id,
            })
          }
        }
      },

      markShipped: (id, expedition) => {
        const now = new Date().toISOString()
        let target: TransferRequest | undefined
        set((state) => ({
          requests: state.requests.map((r) => {
            if (r.id !== id) return r
            const next: TransferRequest = {
              ...r,
              status: 'shipped',
              timeline: [...r.timeline, { status: 'shipped', at: now, expedition }],
            }
            target = next
            return next
          }),
        }))

        if (target) {
          const requesterId = findRequesterByHospital(target.fromHospitalId)
          if (requesterId) {
            useNotificationStore.getState().addNotification({
              userId: requesterId,
              type: 'request-shipped',
              title: 'Permintaan sedang dikirim',
              snippet: `${target.medicineName} - ETA ~3 jam`,
              link: `/network?focus=${id}&tab=outgoing`,
              transferId: id,
            })
          }
        }
      },

      markCompleted: (id, receivedBy) => {
        const now = new Date().toISOString()
        let target: TransferRequest | undefined
        set((state) => ({
          requests: state.requests.map((r) => {
            if (r.id !== id) return r
            const next: TransferRequest = {
              ...r,
              status: 'completed',
              timeline: [...r.timeline, { status: 'completed', at: now, receivedBy }],
            }
            target = next
            return next
          }),
        }))

        if (target) {
          const requesterId = findRequesterByHospital(target.fromHospitalId)
          const approverId = findApproverByHospital(target.toHospitalId)
          if (requesterId) {
            useNotificationStore.getState().addNotification({
              userId: requesterId,
              type: 'request-completed',
              title: 'Transfer selesai',
              snippet: `${target.medicineName} - Diterima oleh ${receivedBy}`,
              link: `/network?focus=${id}&tab=history`,
              transferId: id,
            })
          }
          if (approverId) {
            useNotificationStore.getState().addNotification({
              userId: approverId,
              type: 'request-completed',
              title: 'Transfer selesai',
              snippet: `${target.medicineName} - Telah diterima ${receivedBy}`,
              link: `/network?focus=${id}&tab=history`,
              transferId: id,
            })
          }
        }
      },

      cancelRequest: (id) => {
        set((state) => ({
          requests: state.requests.filter((r) => r.id !== id),
        }))
      },

      updateStatus: (id, status) => {
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)),
        }))
      },
    }),
    {
      name: 'mediflow-transfers',
      onRehydrateStorage: () => (state) => {
        if (state?.requests) {
          // Re-sync hospital names from real list if needed
          state.requests = state.requests.map((r) => {
            const fromH = userList.find((u) => u.hospitalId === r.fromHospitalId)
            const toH = userList.find((u) => u.hospitalId === r.toHospitalId)
            return {
              ...r,
              fromHospitalName: fromH?.hospitalName ?? r.fromHospitalName,
              toHospitalName: toH?.hospitalName ?? r.toHospitalName,
            }
          })
        }
      },
    },
  ),
)

// Selector helpers
export const useAllRequests = () => useTransferStore((s) => s.requests)

export const useIncomingRequests = () => {
  const hospitalId = useHospitalId()
  return useTransferStore(
    useShallow((s) =>
      hospitalId
        ? s.requests.filter(
            (r) =>
              r.toHospitalId === hospitalId && r.status !== 'completed' && r.status !== 'rejected',
          )
        : [],
    ),
  )
}

export const useOutgoingRequests = () => {
  const hospitalId = useHospitalId()
  return useTransferStore(
    useShallow((s) =>
      hospitalId
        ? s.requests.filter((r) => r.fromHospitalId === hospitalId && r.status !== 'completed')
        : [],
    ),
  )
}

export const useRequestById = (id: string | null | undefined) =>
  useTransferStore((s) => (id ? s.requests.find((r) => r.id === id) : undefined))
