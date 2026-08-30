import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, className, disabled, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'focus-visible:ring-ring inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted-foreground/30 hover:bg-muted-foreground/40',
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}
