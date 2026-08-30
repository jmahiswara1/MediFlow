import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowDownToLine,
  CheckCircle2,
  ChevronRight,
  Info,
  PackageCheck,
  TrendingUp,
  Truck,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelative } from '@/utils/dateHelpers'
import { useI18n } from '@/i18n/useI18n'
import type { Notification, NotificationType } from '@/types'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
}

function getNotificationStyle(type: NotificationType) {
  switch (type) {
    case 'incoming-request':
      return {
        icon: ArrowDownToLine,
        color: 'bg-primary/10 text-primary border-primary/20',
        badge: 'Permintaan Masuk',
      }
    case 'request-approved':
      return {
        icon: CheckCircle2,
        color: 'bg-safe/15 text-safe-foreground border-safe/25',
        badge: 'Disetujui',
      }
    case 'request-rejected':
      return {
        icon: XCircle,
        color: 'bg-destructive/15 text-destructive border-destructive/25',
        badge: 'Ditolak',
      }
    case 'request-shipped':
      return {
        icon: Truck,
        color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
        badge: 'Dalam Pengiriman',
      }
    case 'request-completed':
      return {
        icon: PackageCheck,
        color: 'bg-safe/15 text-safe-foreground border-safe/25',
        badge: 'Transfer Selesai',
      }
    case 'stock-critical':
      return {
        icon: AlertTriangle,
        color: 'bg-destructive/15 text-destructive border-destructive/25',
        badge: 'Stok Kritis',
      }
    case 'stock-rising':
      return {
        icon: TrendingUp,
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
        badge: 'Tren Kasus Naik',
      }
    case 'system':
    default:
      return {
        icon: Info,
        color: 'bg-muted text-muted-foreground border-border',
        badge: 'Info Sistem',
      }
  }
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const navigate = useNavigate()
  const { locale } = useI18n()
  const style = getNotificationStyle(notification.type)
  const Icon = style.icon

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const relativeTime = formatRelative(notification.createdAt, locale)

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-all sm:gap-4',
        notification.read
          ? 'bg-card text-card-foreground border-border/70 hover:border-primary/40 hover:bg-muted/40'
          : 'bg-primary/4 dark:bg-primary/10 border-primary/25 hover:border-primary/50 hover:bg-primary/8',
      )}
    >
      {/* Type Icon Badge */}
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl border text-sm shadow-2xs transition-transform group-hover:scale-105 sm:size-11',
          style.color,
        )}
      >
        <Icon className="size-5" />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              'truncate text-xs leading-tight sm:text-sm',
              notification.read ? 'text-foreground font-semibold' : 'text-foreground font-bold',
            )}
          >
            {notification.title}
          </p>
          <span className="text-muted-foreground/60 hidden text-xs sm:inline">•</span>
          <span className="text-muted-foreground shrink-0 text-[11px] font-medium">
            {relativeTime}
          </span>
        </div>

        <p className="text-muted-foreground truncate text-xs sm:text-sm">{notification.snippet}</p>
      </div>

      {/* Unread Indicator & Arrow */}
      <div className="flex shrink-0 items-center gap-2.5">
        {!notification.read && (
          <span
            className="bg-primary ring-primary/20 size-2.5 animate-pulse rounded-full ring-4"
            title="Belum dibaca"
          />
        )}
        {notification.link && (
          <ChevronRight className="text-muted-foreground/50 group-hover:text-primary size-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </div>
    </div>
  )
}
