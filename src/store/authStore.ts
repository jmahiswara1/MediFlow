import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { userList } from '@/data/users'

interface AuthState {
  currentUser: User | null
  login: (userId: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (userId) => {
        const user = userList.find((u) => u.id === userId)
        if (user) set({ currentUser: user })
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: 'mediflow-auth' },
  ),
)

// Selector helpers
export const useCurrentUser = () => useAuthStore((s) => s.currentUser)
export const useRole = (): UserRole | null => useAuthStore((s) => s.currentUser?.role ?? null)
export const useHospitalId = (): string | null =>
  useAuthStore((s) => s.currentUser?.hospitalId ?? null)
export const useHospitalName = (): string | null =>
  useAuthStore((s) => s.currentUser?.hospitalName ?? null)
