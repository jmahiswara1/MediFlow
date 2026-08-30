import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '@/types'
import { notificationList } from '@/data/notifications'

interface NotificationState {
  notifications: Notification[]
  addNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: (userId?: string) => void
  clearAll: (userId?: string) => void
}

function genId(): string {
  return `notif-${String(Date.now()).slice(-6)}-${Math.floor(Math.random() * 1000)}`
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: notificationList,
      addNotification: (data) =>
        set((state) => ({
          notifications: [
            {
              ...data,
              id: genId(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllAsRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            !userId || n.userId === userId ? { ...n, read: true } : n,
          ),
        })),
      clearAll: (userId) =>
        set((state) => ({
          notifications: userId ? state.notifications.filter((n) => n.userId !== userId) : [],
        })),
    }),
    {
      name: 'mediflow-notifications',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const existingIds = new Set(state.notifications.map((n) => n.id))
          const newEntries = notificationList.filter((n) => !existingIds.has(n.id))
          if (newEntries.length > 0) {
            state.notifications = [...newEntries, ...state.notifications]
          }
        }
      },
    },
  ),
)

// Selector helpers
export const useNotificationsByUser = (userId: string | undefined) => {
  const notifications = useNotificationStore((s) => s.notifications)
  return useMemo(
    () => (userId ? notifications.filter((n) => n.userId === userId) : []),
    [notifications, userId],
  )
}

export const useUnreadCount = (userId: string | undefined) =>
  useNotificationStore((s) =>
    userId ? s.notifications.filter((n) => n.userId === userId && !n.read).length : 0,
  )
