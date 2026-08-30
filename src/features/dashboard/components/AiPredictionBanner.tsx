import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { DashboardInsight, InsightTone } from '@/features/dashboard/utils/insightEngine'

interface AiPredictionBannerProps {
  insights: DashboardInsight[]
}

const toneStyles: Record<
  InsightTone,
  { border: string; accent: string; badgeBg: string; dot: string }
> = {
  critical: {
    border: 'border-critical/30',
    accent: 'text-critical',
    badgeBg: 'bg-critical/10 text-critical border-critical/20',
    dot: 'bg-critical',
  },
  warning: {
    border: 'border-low/30',
    accent: 'text-low-foreground',
    badgeBg: 'bg-low/15 text-low-foreground border-low/20',
    dot: 'bg-low',
  },
  info: {
    border: 'border-primary/30',
    accent: 'text-primary',
    badgeBg: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  positive: {
    border: 'border-safe/30',
    accent: 'text-safe',
    badgeBg: 'bg-safe/10 text-safe border-safe/20',
    dot: 'bg-safe',
  },
}

export function AiPredictionBanner({ insights }: AiPredictionBannerProps) {
  if (insights.length === 0) return null
  const [primary, ...secondary] = insights
  if (!primary) return null
  const styles = toneStyles[primary.tone]

  return (
    <div
      className={cn(
        'bg-card border-border relative flex flex-col gap-4 rounded-2xl border p-5 shadow-sm transition-all md:p-6',
        styles.border,
      )}
    >
      {/* Top Banner Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors',
            styles.badgeBg,
          )}
        >
          <Sparkles className="size-5" />
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              MediFlow AI Insight
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
                styles.badgeBg,
              )}
            >
              {primary.tone}
            </span>
          </div>

          <h3 className="text-foreground text-base leading-snug font-semibold md:text-lg">
            {primary.headline}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed">{primary.body}</p>

          {primary.cta && (
            <div className="pt-1.5">
              <Link
                to={primary.cta.href}
                className="bg-primary/10 text-primary hover:bg-primary/15 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <span>{primary.cta.label}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Insights Grid */}
      {secondary.length > 0 && (
        <div className="border-border/70 grid gap-2.5 border-t pt-4 sm:grid-cols-2">
          {secondary.map((item, idx) => {
            const itemTone = toneStyles[item.tone]
            return (
              <Link
                key={`${item.type}-${idx}`}
                to={item.cta?.href ?? '/'}
                className="hover:bg-muted/60 group -mx-2 flex items-start gap-2.5 rounded-xl p-2.5 transition-colors"
              >
                <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', itemTone.dot)} />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors">
                    {item.headline}
                  </p>
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                    {item.body}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
