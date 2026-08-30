import { Building2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface UserCardProps {
  user: User
  onSelect: (userId: string) => void
  isSelected?: boolean
  disabled?: boolean
}

export function UserCard({ user, onSelect, isSelected = false, disabled }: UserCardProps) {
  const isRequester = user.role === 'requester'
  const initials = user.avatarSeed || user.name.slice(0, 2).toUpperCase()

  return (
    <button
      type="button"
      onClick={() => onSelect(user.id)}
      disabled={disabled}
      className={cn(
        'group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors select-none sm:gap-3.5 sm:px-3.5 sm:py-2.5',
        isSelected
          ? 'bg-primary/8 border-primary ring-primary/40 ring-1'
          : 'bg-card text-card-foreground border-border/80 hover:border-primary/50 hover:bg-muted/40',
        disabled && 'pointer-events-none cursor-not-allowed opacity-60',
      )}
    >
      {/* Avatar Badge */}
      <span
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-tight transition-colors sm:size-9',
          isSelected
            ? 'bg-primary text-primary-foreground'
            : isRequester
              ? 'bg-primary/15 text-primary'
              : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
        )}
      >
        {initials}
      </span>

      {/* User & Hospital Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p className="text-foreground truncate text-xs leading-tight font-bold sm:text-sm">
            {user.name}
          </p>
          <span
            className={cn(
              'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase',
              isRequester ? 'bg-low/20 text-low-foreground' : 'bg-safe/20 text-safe-foreground',
            )}
          >
            {user.role}
          </span>
        </div>

        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[11px] leading-tight">
          <Building2 className="text-muted-foreground/70 size-2.5 shrink-0 sm:size-3" />
          <span className="truncate">{user.hospitalName}</span>
        </div>
      </div>

      {/* Selection Radio Circle */}
      <div
        className={cn(
          'flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors',
          isSelected
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground/30 group-hover:border-primary/50',
        )}
      >
        {isSelected && <Check className="size-2.5 stroke-[3]" />}
      </div>
    </button>
  )
}
