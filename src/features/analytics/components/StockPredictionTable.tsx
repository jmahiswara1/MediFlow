import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, AlertTriangle, CheckCircle2, Pill, Search, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import type { StockPredictionItem } from '../hooks/useAnalyticsData'
import { cn } from '@/lib/utils'

interface StockPredictionTableProps {
  items: StockPredictionItem[]
  initialSearch?: string
}

export function StockPredictionTable({ items, initialSearch = '' }: StockPredictionTableProps) {
  const { t } = useI18n()
  const navigate = useNavigate()

  // State untuk search input
  const [search, setSearch] = useState(initialSearch)
  // State untuk melacak perubahan props initialSearch
  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch)

  // Gantikan useEffect: Update state sinkron saat render jika props berubah
  if (initialSearch !== prevInitialSearch) {
    setPrevInitialSearch(initialSearch)
    setSearch(initialSearch)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = search.toLowerCase()
    return items.filter(
      (item) =>
        item.medicine.name.toLowerCase().includes(q) ||
        item.medicine.category.toLowerCase().includes(q),
    )
  }, [items, search])

  const handleRequestTransfer = (medicineId: string) => {
    navigate(`/network?medicine=${medicineId}`)
  }

  return (
    <div className="bg-card text-card-foreground border-border/80 flex flex-col rounded-2xl border shadow-xs">
      {/* Header & Search */}
      <div className="border-border/80 flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-foreground text-base font-bold tracking-tight">
            {t('analytics.table.title')}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-xs">{t('analytics.table.subtitle')}</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('analytics.table.searchPlaceholder')}
            className="border-border bg-muted/40 focus:border-primary/50 w-full rounded-xl border py-1.5 pr-3 pl-8 text-xs transition-colors outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[520px] overflow-x-auto overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-card sticky top-0 z-10">
            <tr className="text-muted-foreground border-border/60 bg-muted/20 border-b text-[11px] font-semibold tracking-wide uppercase">
              <th className="px-5 py-3">{t('analytics.table.medicine')}</th>
              <th className="px-3 py-3 text-right">{t('analytics.table.currentStock')}</th>
              <th className="px-3 py-3 text-right">{t('analytics.table.burnRate')}</th>
              <th className="px-3 py-3 text-center">{t('analytics.table.daysLeft')}</th>
              <th className="px-5 py-3 text-right">{t('analytics.table.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-border/60 divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-muted-foreground py-10 text-center text-xs">
                  {t('analytics.table.empty')}
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isCritical = item.status === 'critical'
                const isLow = item.status === 'low'

                return (
                  <tr
                    key={item.medicine.id}
                    className={cn(
                      'hover:bg-muted/40 transition-colors',
                      isCritical && 'bg-critical/5',
                    )}
                  >
                    {/* Medicine Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          className={cn(
                            'shrink-0 rounded-lg p-1.5',
                            isCritical
                              ? 'bg-critical/10 text-critical'
                              : isLow
                                ? 'bg-low/20 text-low-foreground'
                                : 'bg-primary/10 text-primary',
                          )}
                        >
                          <Pill className="size-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-xs font-bold">
                            {item.medicine.name}
                          </p>
                          <p className="text-muted-foreground truncate text-[11px]">
                            {item.medicine.category} • {item.medicine.unit}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td className="text-foreground px-3 py-3.5 text-right font-semibold tabular-nums">
                      {item.currentStock.toLocaleString('id-ID')}
                    </td>

                    {/* Burn Rate */}
                    <td className="px-3 py-3.5 text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-foreground font-semibold tabular-nums">
                          {item.adjustedDailyUsage} /hari
                        </span>
                        {item.isImpacted && (
                          <span className="text-critical text-[10px] font-bold">
                            {item.multiplier}x lonjakan
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Days Left Badge */}
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums shadow-2xs',
                          isCritical && 'bg-critical text-white',
                          isLow && 'bg-low text-low-foreground font-semibold',
                          !isCritical && !isLow && 'bg-safe/15 text-safe',
                        )}
                      >
                        {isCritical && <AlertCircle className="size-3 shrink-0" />}
                        {isLow && <AlertTriangle className="size-3 shrink-0" />}
                        {!isCritical && !isLow && <CheckCircle2 className="size-3 shrink-0" />}
                        <span>{item.daysLeft >= 900 ? '> 30 hari' : `${item.daysLeft} hari`}</span>
                      </span>
                    </td>

                    {/* Fast Action */}
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant={isCritical ? 'destructive' : isLow ? 'default' : 'outline'}
                        onClick={() => handleRequestTransfer(item.medicine.id)}
                        className="gap-1.5 rounded-lg text-xs"
                      >
                        <Truck className="size-3" />
                        <span>{t('analytics.table.requestTransfer')}</span>
                      </Button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
