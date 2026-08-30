import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  subLabel?: string
  badge?: ReactNode
  icon?: LucideIcon
  disabled?: boolean
}

interface CustomSelectProps {
  options: SelectOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  icon?: LucideIcon
  error?: boolean
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  disabled = false,
  className,
  icon: LeadingIcon,
  error = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleSelect = (val: string, optDisabled?: boolean) => {
    if (optDisabled) return
    onChange(val)
    setOpen(false)
  }

  const IconToRender = selectedOption?.icon ?? LeadingIcon

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'border-border/90 bg-background text-foreground flex h-10 w-full items-center justify-between gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium shadow-2xs transition-all outline-none select-none',
          'hover:border-primary/50 focus:border-primary focus:ring-primary/20 focus:ring-2',
          open && 'border-primary ring-primary/20 ring-2',
          disabled && 'bg-muted/40 cursor-not-allowed opacity-60',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
          {IconToRender && <IconToRender className="text-primary size-4 shrink-0" />}
          <div className="min-w-0 flex-1 truncate">
            {selectedOption ? (
              <span className="text-foreground font-semibold">{selectedOption.label}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          {selectedOption?.badge && <div className="shrink-0">{selectedOption.badge}</div>}
        </div>

        <ChevronDown
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform duration-150',
            open && 'text-primary rotate-180',
          )}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {open && (
        <div
          role="listbox"
          className={cn(
            'bg-popover text-popover-foreground border-border absolute right-0 left-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border p-1.5 shadow-xl backdrop-blur-md',
            'animate-in fade-in-0 zoom-in-95 duration-100',
          )}
        >
          <ul className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value
              const OptIcon = opt.icon

              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    className={cn(
                      'group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left text-xs transition-all select-none',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'hover:bg-muted/70 text-foreground',
                      opt.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                      {OptIcon && (
                        <OptIcon
                          className={cn(
                            'size-4 shrink-0',
                            isSelected
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs leading-tight font-semibold">{opt.label}</p>
                        {opt.subLabel && (
                          <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
                            {opt.subLabel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {opt.badge && <div>{opt.badge}</div>}
                      {isSelected && <Check className="text-primary size-4 shrink-0" />}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
