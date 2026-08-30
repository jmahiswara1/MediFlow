import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type KpiTone = 'critical' | 'low' | 'safe' | 'neutral' | 'primary'

interface KpiCardProps {
  label: string
  value: ReactNode
  subText?: ReactNode
  icon: LucideIcon
  tone?: KpiTone
  delta?: number
  sparkline?: number[]
  onClick?: () => void
}

const toneStyles: Record<
  KpiTone,
  { iconBg: string; iconFg: string; spark: string; badgeBorder: string }
> = {
  critical: {
    iconBg: 'bg-critical/12 text-critical',
    iconFg: 'text-critical',
    spark: 'stroke-critical',
    badgeBorder: 'border-critical/20',
  },
  low: {
    iconBg: 'bg-low/15 text-low-foreground',
    iconFg: 'text-low-foreground',
    spark: 'stroke-low',
    badgeBorder: 'border-low/20',
  },
  safe: {
    iconBg: 'bg-safe/12 text-safe',
    iconFg: 'text-safe',
    spark: 'stroke-safe',
    badgeBorder: 'border-safe/20',
  },
  neutral: {
    iconBg: 'bg-muted text-muted-foreground',
    iconFg: 'text-muted-foreground',
    spark: 'stroke-muted-foreground',
    badgeBorder: 'border-border',
  },
  primary: {
    iconBg: 'bg-primary/12 text-primary',
    iconFg: 'text-primary',
    spark: 'stroke-primary',
    badgeBorder: 'border-primary/20',
  },
}

function buildSparklinePath(values: number[], width: number, height: number): string {
  if (!values.length) return ''
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const stepX = values.length > 1 ? width / (values.length - 1) : 0
  return values
    .map((v, i) => {
      const x = i * stepX
      const y = height - ((v - min) / range) * (height - 6) - 3
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

function DeltaPill({ value }: { value: number }) {
  const isZero = value === 0
  const isUp = value > 0
  const Icon = isZero ? Minus : isUp ? ArrowUp : ArrowDown
  const colorClass = isZero
    ? 'bg-muted text-muted-foreground'
    : isUp
      ? 'bg-safe/15 text-safe'
      : 'bg-critical/15 text-critical'
  const formatted = `${isUp ? '+' : ''}${value}%`
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
        colorClass,
      )}
    >
      <Icon className="size-3" />
      {formatted}
    </span>
  )
}

export function KpiCard({
  label,
  value,
  subText,
  icon: Icon,
  tone = 'neutral',
  delta,
  sparkline,
  onClick,
}: KpiCardProps) {
  const styles = toneStyles[tone]
  const interactive = Boolean(onClick)
  const Comp = interactive ? 'button' : 'div'
  const sparkWidth = 72
  const sparkHeight = 24

  const isTextValue = typeof value === 'string' && value.length > 3 && Number.isNaN(Number(value))

  return (
    <Comp
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'bg-card text-card-foreground border-border relative flex flex-col justify-between gap-3 rounded-2xl border p-5 text-left shadow-sm transition-all',
        interactive &&
          'hover:border-primary/50 focus-visible:ring-ring cursor-pointer hover:shadow-md focus-visible:ring-2 focus-visible:outline-none',
      )}
    >
      {/* Top row: Label + Icon */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          {label}
        </p>
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            styles.iconBg,
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </div>

      {/* Bottom row: Value + Subtext + Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-foreground font-bold tracking-tight',
              isTextValue
                ? 'truncate text-xl leading-tight md:text-2xl'
                : 'text-3xl tabular-nums md:text-4xl',
            )}
            title={typeof value === 'string' ? value : undefined}
          >
            {value}
          </p>
          {(subText || delta !== undefined) && (
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {delta !== undefined && <DeltaPill value={delta} />}
              {subText && (
                <span className="text-muted-foreground truncate text-xs font-normal">
                  {subText}
                </span>
              )}
            </div>
          )}
        </div>

        {sparkline && sparkline.length > 1 && (
          <div className="shrink-0 pb-1">
            <svg
              width={sparkWidth}
              height={sparkHeight}
              viewBox={`0 0 ${sparkWidth} ${sparkHeight}`}
              className="overflow-visible"
              aria-hidden="true"
            >
              <path
                d={buildSparklinePath(sparkline, sparkWidth, sparkHeight)}
                fill="none"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.spark}
              />
            </svg>
          </div>
        )}
      </div>
    </Comp>
  )
}
