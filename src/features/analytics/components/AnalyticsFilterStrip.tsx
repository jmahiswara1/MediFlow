import { useMemo } from 'react'
import { Activity, Calendar, MapPin } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { CustomSelect, type SelectOption } from '@/components/ui/custom-select'
import type { Disease } from '@/types'
import type { RangeOption } from '../hooks/useAnalyticsData'
import { cn } from '@/lib/utils'

interface AnalyticsFilterStripProps {
  diseases: Disease[]
  selectedDiseaseId: string
  selectedRange: RangeOption
  selectedRegion: string
  onSelectDisease: (id: string) => void
  onSelectRange: (range: RangeOption) => void
  onSelectRegion: (region: string) => void
}

const REGION_OPTIONS = ['Surabaya & Jawa Timur', 'Jawa Barat', 'Jawa Tengah', 'all']

const RANGE_OPTIONS: {
  key: RangeOption
  labelKey:
    'analytics.filters.range7d' | 'analytics.filters.range30d' | 'analytics.filters.range90d'
}[] = [
  { key: '7d', labelKey: 'analytics.filters.range7d' },
  { key: '30d', labelKey: 'analytics.filters.range30d' },
  { key: '90d', labelKey: 'analytics.filters.range90d' },
]

export function AnalyticsFilterStrip({
  diseases,
  selectedDiseaseId,
  selectedRange,
  selectedRegion,
  onSelectDisease,
  onSelectRange,
  onSelectRegion,
}: AnalyticsFilterStripProps) {
  const { t } = useI18n()

  const diseaseOptions: SelectOption[] = useMemo(() => {
    const allOption: SelectOption = {
      value: 'all',
      label: t('analytics.filters.allDiseases'),
      subLabel: 'Agregasi seluruh kasus regional',
      icon: Activity,
    }

    const uniqueDiseases: Disease[] = []
    const seen = new Set<string>()
    for (const d of diseases) {
      if (!seen.has(d.name)) {
        seen.add(d.name)
        uniqueDiseases.push(d)
      }
    }

    const items: SelectOption[] = uniqueDiseases.map((d) => {
      const severityColor =
        d.severity === 'outbreak'
          ? 'bg-critical/15 text-critical'
          : d.severity === 'rising'
            ? 'bg-low/20 text-low-foreground'
            : 'bg-safe/15 text-safe'

      return {
        value: d.id,
        label: d.name,
        subLabel: `${d.caseCount} kasus aktif (${d.region})`,
        icon: Activity,
        badge: (
          <span
            className={cn(
              'rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase',
              severityColor,
            )}
          >
            {d.severity}
          </span>
        ),
      }
    })

    return [allOption, ...items]
  }, [diseases, t])

  const regionOptions: SelectOption[] = useMemo(() => {
    return REGION_OPTIONS.map((r) => ({
      value: r,
      label: r === 'all' ? t('analytics.filters.allRegions') : r,
      subLabel: r === 'all' ? 'Nasional' : 'Provinsi / Kota',
      icon: MapPin,
    }))
  }, [t])

  return (
    <div className="bg-card text-card-foreground border-border/80 flex flex-col gap-4 rounded-2xl border p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Disease & Region Dropdowns */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Disease Select */}
        <div className="w-full sm:w-72">
          <label className="text-muted-foreground mb-1 block text-[11px] font-semibold tracking-wide">
            {t('analytics.filters.disease')}
          </label>
          <CustomSelect
            options={diseaseOptions}
            value={selectedDiseaseId}
            onChange={onSelectDisease}
            placeholder={t('analytics.filters.disease')}
            icon={Activity}
          />
        </div>

        {/* Region Select */}
        <div className="w-full sm:w-60">
          <label className="text-muted-foreground mb-1 block text-[11px] font-semibold tracking-wide">
            {t('analytics.filters.region')}
          </label>
          <CustomSelect
            options={regionOptions}
            value={selectedRegion}
            onChange={onSelectRegion}
            placeholder={t('analytics.filters.region')}
            icon={MapPin}
          />
        </div>
      </div>

      {/* Right: Time Range Segmented Pills */}
      <div className="flex flex-col sm:items-end">
        <label className="text-muted-foreground mb-1 block text-[11px] font-semibold tracking-wide">
          {t('analytics.filters.range')}
        </label>
        <div className="bg-muted/60 border-border/60 flex items-center gap-1 rounded-xl border p-1 shadow-2xs">
          <Calendar className="text-muted-foreground ml-2 size-3.5" />
          {RANGE_OPTIONS.map((opt) => {
            const isActive = selectedRange === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onSelectRange(opt.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all select-none',
                  isActive
                    ? 'bg-card text-primary ring-border shadow-xs ring-1'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {t(opt.labelKey)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
