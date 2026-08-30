import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SettingsState {
  // Notification Preferences
  notifyIncomingTransfers: boolean
  notifyCriticalStock: boolean
  notifyOutbreakSpikes: boolean
  notifyChatMentions: boolean
  soundEnabled: boolean

  // AI & Analytics Preferences
  autoSuggestTransfers: boolean
  outbreakThreshold: number // percentage e.g. 20
  defaultDateRange: '30d' | '90d'
  compactMode: boolean

  // Actions
  updateSettings: (
    partial: Partial<Omit<SettingsState, 'updateSettings' | 'resetSettings'>>,
  ) => void
  resetSettings: () => void
}

const defaultSettings = {
  notifyIncomingTransfers: true,
  notifyCriticalStock: true,
  notifyOutbreakSpikes: true,
  notifyChatMentions: true,
  soundEnabled: true,
  autoSuggestTransfers: true,
  outbreakThreshold: 20,
  defaultDateRange: '30d' as const,
  compactMode: false,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'mediflow-settings',
    },
  ),
)
