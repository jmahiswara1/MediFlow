import { useState, useMemo } from 'react'
import { Building2, ChevronRight, MapPin, Search } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import type { Hospital, StockStatus } from '@/types'
import { haversineDistance } from '@/utils/geoHelpers'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

interface HospitalExplorerListProps {
  hospitals: Hospital[]
  currentHospitalId: string | null
  onSelectHospital: (hospitalId: string) => void
  initialSearch?: string
}

type StatusFilter = 'all' | StockStatus

export function HospitalExplorerList({
  hospitals,
  currentHospitalId,
  onSelectHospital,
  initialSearch = '',
}: HospitalExplorerListProps) {
  const { t } = useI18n()

  const [search, setSearch] = useState(initialSearch)
  const [prevInitialSearch, setPrevInitialSearch] = useState(initialSearch)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Gantikan useEffect: Update state sinkron saat render jika props berubah
  if (initialSearch !== prevInitialSearch) {
    setPrevInitialSearch(initialSearch)
    setSearch(initialSearch)
  }

  const currentHospital = useMemo(
    () => hospitals.find((h) => h.id === currentHospitalId),
    [hospitals, currentHospitalId],
  )

  const counts = useMemo(() => {
    let critical = 0
    let low = 0
    let safe = 0
    for (const h of hospitals) {
      if (h.stockStatus === 'critical') critical++
      else if (h.stockStatus === 'low') low++
      else safe++
    }
    return { all: hospitals.length, critical, low, safe }
  }, [hospitals])

  const filteredHospitals = useMemo(() => {
    return hospitals
      .map((h) => {
        const distance =
          currentHospital && currentHospital.id !== h.id
            ? haversineDistance(currentHospital.lat, currentHospital.lng, h.lat, h.lng)
            : null
        return { ...h, distance }
      })
      .filter((h) => {
        if (statusFilter !== 'all' && h.stockStatus !== statusFilter) return false
        if (search.trim()) {
          const q = search.toLowerCase()
          return h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q)
        }
        return true
      })
      .sort((a, b) => {
        if (a.id === currentHospitalId) return -1
        if (b.id === currentHospitalId) return 1
        const statusOrder: Record<StockStatus, number> = { critical: 0, low: 1, safe: 2 }
        if (a.stockStatus !== b.stockStatus) {
          return statusOrder[a.stockStatus] - statusOrder[b.stockStatus]
        }
        return (a.distance ?? 0) - (b.distance ?? 0)
      })
  }, [hospitals, currentHospital, currentHospitalId, statusFilter, search])

  return (
    <div className="bg-card text-card-foreground border-border flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* Header & Search */}
      <div className="border-border space-y-3 border-b p-4">
        <div>
          <h3 className="text-foreground text-base font-semibold tracking-tight">
            {t('network.allHospitals')}
          </h3>
          <p className="text-muted-foreground text-xs">{t('network.detail.selectPrompt')}</p>
        </div>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('network.searchHospital')}
            className="border-border bg-muted/40 focus:border-primary/50 w-full rounded-xl border py-2 pr-3 pl-9 text-xs transition-colors outline-none"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'critical', 'low', 'safe'] as StatusFilter[]).map((st) => {
            const isActive = statusFilter === st
            const label = st === 'all' ? t('network.allHospitals') : t(`status.${st}`)
            const count = counts[st]
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 text-[10px] font-semibold',
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-background text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hospital List */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredHospitals.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center text-xs">
            {t('network.noResults')}
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredHospitals.map((h) => {
              const isOwn = h.id === currentHospitalId
              return (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => onSelectHospital(h.id)}
                    className={cn(
                      'group flex w-full flex-col gap-2 rounded-xl border p-3 text-left transition-all',
                      isOwn
                        ? 'bg-primary/5 border-primary/30 hover:bg-primary/10 shadow-xs'
                        : 'border-border/70 hover:border-border hover:bg-muted/40',
                    )}
                  >
                    {/* Top row: Name + Badges */}
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <Building2
                          className={cn(
                            'size-4 shrink-0',
                            isOwn ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                        <p
                          className={cn(
                            'truncate text-sm font-semibold transition-colors',
                            isOwn ? 'text-primary' : 'text-foreground group-hover:text-primary',
                          )}
                        >
                          {h.name}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5">
                        {isOwn && (
                          <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide shadow-xs">
                            {t('network.detail.yourHospital')}
                          </span>
                        )}
                        <StatusBadge status={h.stockStatus} label={t(`status.${h.stockStatus}`)} />
                        <ChevronRight className="text-muted-foreground/60 size-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom metadata row */}
                    <div className="text-muted-foreground flex items-center gap-2 pl-6 text-xs">
                      <span>{h.city}</span>
                      {h.distance !== null ? (
                        <>
                          <span className="opacity-40">•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="text-primary size-3" />
                            {h.distance.toFixed(1)} km {t('network.detail.distanceFromYou')}
                          </span>
                        </>
                      ) : (
                        isOwn && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="text-primary/90 font-medium">Lokasi Aktif</span>
                          </>
                        )
                      )}
                      <span className="opacity-40">•</span>
                      <span className="tabular-nums">{h.stocks.length} items obat</span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
