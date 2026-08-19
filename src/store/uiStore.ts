import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Locale } from '@/i18n'

interface UiState {
  locale: Locale
  theme: 'light' | 'dark'
  setLocale: (locale: Locale) => void
  toggleTheme: () => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'id',
      theme: 'light',
      setLocale: (locale) => set({ locale }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'mediflow-ui' },
  ),
)
