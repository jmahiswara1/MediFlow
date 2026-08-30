import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  Bell,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Info,
  MessageCircle,
  PackageCheck,
  TrendingUp,
  Truck,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrentUser } from '@/store'
import { useNotificationStore, useUnreadCount } from '@/store/notificationStore'
import { useI18n } from '@/i18n/useI18n'
import { formatRelative } from '@/utils/dateHelpers'
import type { Notification, NotificationType } from '@/types'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'incoming-request':
      return { icon: ArrowDownToLine, color: 'bg-primary/15 text-primary border-primary/25' }
    case 'request-approved':
      return { icon: CheckCircle2, color: 'bg-safe/15 text-safe-foreground border-safe/25' }
    case 'request-rejected':
      return { icon: XCircle, color: 'bg-destructive/15 text-destructive border-destructive/25' }
    case 'request-shipped':
      return {
        icon: Truck,
        color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
      }
    case 'request-completed':
      return { icon: PackageCheck, color: 'bg-safe/15 text-safe-foreground border-safe/25' }
    case 'stock-critical':
      return {
        icon: AlertTriangle,
        color: 'bg-destructive/15 text-destructive border-destructive/25',
      }
    case 'stock-rising':
      return {
        icon: TrendingUp,
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
      }
    case 'chat-mention':
      return {
        icon: MessageCircle,
        color: 'bg-primary/15 text-primary border-primary/25',
      }
    case 'chat-message':
      return {
        icon: MessageCircle,
        color: 'bg-muted text-muted-foreground border-border',
      }
    case 'system':
    default:
      return { icon: Info, color: 'bg-muted text-muted-foreground border-border' }
  }
}

export function TopBarNotificationMenu() {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const currentUser = useCurrentUser()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const unreadCount = useUnreadCount(currentUser?.id)

  const userNotifications = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : []
  const recentNotifications = userNotifications.slice(0, 5)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (!currentUser) return null

  const handleItemClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setOpen(false)
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllAsRead(currentUser.id)
  }

  const handleViewAll = () => {
    setOpen(false)
    navigate('/notifications')
  }

  return (
    <div ref={wrapperRef} className="relative">
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('topBar.closeMenu') : t('notifications.title')}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md transition-colors select-none',
          'hover:bg-accent hover:text-accent-foreground',
          open && 'bg-accent text-accent-foreground',
        )}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground animate-in zoom-in-50 ring-background absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full text-[10px] font-extrabold shadow-sm ring-2">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Menu */}
      {open && (
        <div
          role="menu"
          className={cn(
            'bg-popover text-popover-foreground border-border absolute right-0 z-50 mt-2.5 w-80 overflow-hidden rounded-2xl border shadow-xl sm:w-96',
            'animate-in fade-in slide-in-from-top-2 duration-150',
          )}
        >
          {/* Header */}
          <div className="border-border bg-muted/20 flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-sm font-bold tracking-tight">
                {t('notifications.title')}
              </h3>
              {unreadCount > 0 && (
                <span className="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold">
                  {unreadCount} {t('notifications.filterUnread').toLowerCase()}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 text-[11px] font-semibold transition-colors"
                title={t('notifications.markAllRead')}
              >
                <CheckCheck className="size-3.5" />
                <span>{t('notifications.markAllRead')}</span>
              </button>
            )}
          </div>

          {/* List of Recent Notifications */}
          <div className="divide-border/60 max-h-[340px] divide-y overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <Bell className="text-muted-foreground/50 size-7" />
                <p className="text-muted-foreground text-xs font-medium">
                  {t('notifications.noNew')}
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => {
                const iconStyle = getNotificationIcon(n.type)
                const Icon = iconStyle.icon
                const relTime = formatRelative(n.createdAt, locale)

                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={cn(
                      'group flex w-full cursor-pointer items-start gap-3 p-3.5 text-left transition-colors select-none',
                      n.read
                        ? 'hover:bg-muted/50'
                        : 'bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15',
                    )}
                  >
                    {/* Icon */}
                    <span
                      className={cn(
                        'flex size-8.5 shrink-0 items-center justify-center rounded-xl border text-xs shadow-2xs transition-transform group-hover:scale-105',
                        iconStyle.color,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>

                    {/* Text */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <p
                          className={cn(
                            'truncate text-xs leading-tight',
                            n.read ? 'text-foreground font-medium' : 'text-foreground font-bold',
                          )}
                        >
                          {n.title}
                        </p>
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                          {relTime}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-1 text-[11px] leading-relaxed">
                        {n.snippet}
                      </p>
                    </div>

                    {/* Unread indicator / chevron */}
                    <div className="flex shrink-0 items-center pt-1">
                      {!n.read ? (
                        <span className="bg-primary ring-primary/20 size-2 animate-pulse rounded-full ring-2" />
                      ) : (
                        <ChevronRight className="text-muted-foreground/40 group-hover:text-foreground size-3.5 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer - View All Link */}
          <div className="border-border bg-muted/10 border-t p-2">
            <button
              type="button"
              onClick={handleViewAll}
              className="bg-background text-foreground hover:bg-muted hover:text-primary border-border/80 flex h-8.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border text-xs font-bold shadow-2xs transition-colors"
            >
              <span>{t('notifications.viewAll')}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
