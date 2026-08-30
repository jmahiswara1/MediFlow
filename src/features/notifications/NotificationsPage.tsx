import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/store'
import { useNotificationStore } from '@/store/notificationStore'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import {
  NotificationFilterChips,
  type NotificationFilter,
} from './components/NotificationFilterChips'
import { NotificationItem } from './components/NotificationItem'
import { NotificationEmptyState } from './components/NotificationEmptyState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Notification } from '@/types'

function getDateGroupKey(dateString: string): 'today' | 'yesterday' | 'thisWeek' | 'older' {
  const itemDate = new Date(dateString)
  const now = new Date()

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000
  const startOfThisWeek = startOfToday - 7 * 24 * 60 * 60 * 1000
  const itemTime = itemDate.getTime()

  if (itemTime >= startOfToday) {
    return 'today'
  }
  if (itemTime >= startOfYesterday) {
    return 'yesterday'
  }
  if (itemTime >= startOfThisWeek) {
    return 'thisWeek'
  }
  return 'older'
}

const TRANSFER_TYPES = [
  'incoming-request',
  'request-approved',
  'request-rejected',
  'request-shipped',
  'request-completed',
]

const STOCK_TYPES = ['stock-critical', 'stock-rising']

export function NotificationsPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentUser = useAuthStore((s) => s.currentUser)
  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const clearAll = useNotificationStore((s) => s.clearAll)

  const [markAllDialogOpen, setMarkAllDialogOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  // Current user's notifications
  const userNotifications = useMemo(() => {
    if (!currentUser) return []
    return notifications.filter((n) => n.userId === currentUser.id)
  }, [notifications, currentUser])

  // Active filter from URL query param
  const activeFilter = (searchParams.get('filter') as NotificationFilter) || 'all'

  const handleFilterChange = (filter: NotificationFilter) => {
    if (filter === 'all') {
      searchParams.delete('filter')
    } else {
      searchParams.set('filter', filter)
    }
    setSearchParams(searchParams, { replace: true })
  }

  // Filter counters
  const counts = useMemo(() => {
    return {
      all: userNotifications.length,
      unread: userNotifications.filter((n) => !n.read).length,
      transfer: userNotifications.filter((n) => TRANSFER_TYPES.includes(n.type)).length,
      stock: userNotifications.filter((n) => STOCK_TYPES.includes(n.type)).length,
      system: userNotifications.filter((n) => n.type === 'system').length,
    }
  }, [userNotifications])

  // Filtered notification list
  const filteredNotifications = useMemo(() => {
    return userNotifications.filter((n) => {
      if (activeFilter === 'unread') return !n.read
      if (activeFilter === 'transfer') return TRANSFER_TYPES.includes(n.type)
      if (activeFilter === 'stock') return STOCK_TYPES.includes(n.type)
      if (activeFilter === 'system') return n.type === 'system'
      return true
    })
  }, [userNotifications, activeFilter])

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: {
      key: 'today' | 'yesterday' | 'thisWeek' | 'older'
      label: string
      items: Notification[]
    }[] = [
      { key: 'today', label: t('notifications.today'), items: [] },
      { key: 'yesterday', label: t('notifications.yesterday'), items: [] },
      { key: 'thisWeek', label: t('notifications.thisWeek'), items: [] },
      { key: 'older', label: t('notifications.older'), items: [] },
    ]

    filteredNotifications.forEach((item) => {
      const groupKey = getDateGroupKey(item.createdAt)
      const group = groups.find((g) => g.key === groupKey)
      if (group) {
        group.items.push(item)
      }
    })

    return groups.filter((g) => g.items.length > 0)
  }, [filteredNotifications, t])

  const handleConfirmMarkAll = () => {
    if (currentUser) {
      markAllAsRead(currentUser.id)
      toast.success(t('notifications.markAllRead'), {
        description: `${counts.unread} ${t('notifications.title').toLowerCase()} ${t('notifications.markAsRead').toLowerCase()}`,
      })
    }
    setMarkAllDialogOpen(false)
  }

  const handleConfirmClear = () => {
    if (currentUser) {
      clearAll(currentUser.id)
      toast.success(t('notifications.clearAll'), {
        description: t('notifications.clearAllConfirmDesc'),
      })
    }
    setClearDialogOpen(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-12">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t('notifications.title')}
            </h1>
            {counts.unread > 0 && (
              <span className="bg-primary/15 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold">
                {counts.unread} {t('notifications.filterUnread').toLowerCase()}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t('notifications.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {counts.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkAllDialogOpen(true)}
              className="border-border/80 cursor-pointer gap-1.5 rounded-xl text-xs font-semibold"
            >
              <CheckCheck className="text-primary size-3.5" />
              <span>{t('notifications.markAllRead')}</span>
            </Button>
          )}

          {userNotifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer gap-1.5 rounded-xl text-xs font-semibold"
            >
              <Trash2 className="size-3.5" />
              <span>{t('notifications.clearAll')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      {userNotifications.length > 0 && (
        <NotificationFilterChips
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
      )}

      {/* Main Content List / Empty State */}
      {userNotifications.length === 0 ? (
        <NotificationEmptyState />
      ) : filteredNotifications.length === 0 ? (
        <NotificationEmptyState isFiltered onResetFilter={() => handleFilterChange('all')} />
      ) : (
        <div className="flex flex-col gap-6">
          {groupedNotifications.map((group) => (
            <div key={group.key} className="space-y-2.5">
              {/* Group Header */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                  {group.label}
                </span>
                <div className="bg-border/60 h-px flex-1" />
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-2">
                {group.items.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mark All As Read Confirmation Dialog */}
      <Dialog open={markAllDialogOpen} onOpenChange={setMarkAllDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {t('notifications.markAllConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-xs">
              {t('notifications.markAllConfirmDesc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkAllDialogOpen(false)}
              className="rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmMarkAll}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              {t('notifications.markAllRead')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {t('notifications.clearAllConfirmTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-1 text-xs">
              {t('notifications.clearAllConfirmDesc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearDialogOpen(false)}
              className="rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmClear}
              className="rounded-xl"
            >
              {t('notifications.clearAll')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
