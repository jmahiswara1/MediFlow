import { Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface UserCardProps {
  user: User
  onSelect: (userId: string) => void
  disabled?: boolean
}

export function UserCard({ user, onSelect, disabled }: UserCardProps) {
  const isRequester = user.role === 'requester'
  const initials = user.avatarSeed || user.name.slice(0, 2).toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      disabled={disabled}
      className={cn(
        'group bg-card text-card-foreground hover:bg-accent/40 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all',
        'hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none',
      )}
    >
      <span className="bg-primary text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold tracking-tight">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold leading-tight">{user.name}</p>
        <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
          <Building2 className="size-3 shrink-0" />
          <span className="truncate">{user.hospitalName}</span>
        </div>
      </div>
      <span
        className={cn(
          'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase',
          isRequester
            ? 'bg-low text-low-foreground'
            : 'bg-safe text-safe-foreground',
        )}
      >
        {user.role}
      </span>
    </button>
  )
}