import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage } from '@/types'

const MAX_MESSAGES = 50

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  clearHistory: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) =>
        set((state) => {
          const next = [...state.messages, msg]
          return { messages: next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next }
        }),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'mediflow-chat' },
  ),
)

export const MAX_CHAT_MESSAGES = MAX_MESSAGES