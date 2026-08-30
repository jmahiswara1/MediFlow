import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { userList } from '@/data/users'

interface AuthState {
  currentUser: User | null
  customUsers: Record<string, Partial<User>>
  login: (userId: string) => void
  logout: () => void
  updateUser: (userId: string, partial: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      customUsers: {},
      login: (userId) => {
        const baseUser = userList.find((u) => u.id === userId)
        if (!baseUser) return
        const custom = get().customUsers[userId] || {}
        set({ currentUser: { ...baseUser, ...custom } })
      },
      logout: () => set({ currentUser: null }),
      updateUser: (userId, partial) => {
        set((state) => {
          const updatedCustom = {
            ...state.customUsers,
            [userId]: { ...(state.customUsers[userId] || {}), ...partial },
          }
          const baseUser = userList.find((u) => u.id === userId)
          const updatedUser = baseUser
            ? { ...baseUser, ...updatedCustom[userId] }
            : state.currentUser
              ? { ...state.currentUser, ...partial }
              : null

          return {
            customUsers: updatedCustom,
            currentUser: state.currentUser?.id === userId ? updatedUser : state.currentUser,
          }
        })
      },
    }),
    {
      name: 'mediflow-auth',
      onRehydrateStorage: () => (state) => {
        if (state?.currentUser) {
          const baseUser = userList.find((u) => u.id === state.currentUser?.id)
          const custom = state.customUsers?.[state.currentUser.id] || {}
          if (baseUser) {
            state.currentUser = { ...baseUser, ...custom }
          }
        }
      },
    },
  ),
)

// Selector helpers
export const useCurrentUser = () => useAuthStore((s) => s.currentUser)
export const useRole = (): UserRole | null => useAuthStore((s) => s.currentUser?.role ?? null)
export const useHospitalId = (): string | null =>
  useAuthStore((s) => s.currentUser?.hospitalId ?? null)
export const useHospitalName = (): string | null =>
  useAuthStore((s) => s.currentUser?.hospitalName ?? null)
