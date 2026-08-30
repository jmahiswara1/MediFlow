import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n'

interface UiState {
  locale: Locale
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  setLocale: (locale: Locale) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'id',
      theme: 'light',
      sidebarCollapsed: false,
      setLocale: (locale) => set({ locale }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    { name: 'mediflow-ui' },
  ),
)
