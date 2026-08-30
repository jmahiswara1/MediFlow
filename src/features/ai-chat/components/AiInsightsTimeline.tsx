import { useState, useMemo } from 'react'
import { AlertCircle, AlertTriangle, Sparkles, TrendingUp, Truck } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { cn } from '@/lib/utils'

export type TimelineCategory = 'all' | 'alerts' | 'forecast' | 'automation'

interface AiInsightsTimelineProps {
  onSelectPrompt: (prompt: string) => void
}

interface TimelineItem {
  id: string
  title: string
  subtitle: string
  timeAgo: string
  category: 'alerts' | 'forecast' | 'automation'
  type: 'danger' | 'warning' | 'info' | 'success'
  isUnread?: boolean
  queryPrompt: string
}

export function AiInsightsTimeline({ onSelectPrompt }: AiInsightsTimelineProps) {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<TimelineCategory>('all')

  const items: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [
      {
        id: 'tl-1',
        title: 'Anomali Stok Kritis Terdeteksi',
        subtitle: 'Infus NaCl 0.9% tersisa < 3 hari di RSUD Dr. Soetomo',
        timeAgo: '2 jam lalu',
        category: 'alerts',
        type: 'danger',
        isUnread: true,
        queryPrompt: 'Cek stok kritis Infus NaCl 0.9% di RSUD Dr. Soetomo',
      },
      {
        id: 'tl-2',
        title: 'Risiko Defisit Oseltamivir Meningkat',
        subtitle: 'Lonjakan pasien ISPA & Flu di 3 RS Surabaya',
        timeAgo: '3 jam lalu',
        category: 'alerts',
        type: 'warning',
        isUnread: true,
        queryPrompt: 'Di mana rumah sakit terdekat yang memiliki surplus Oseltamivir?',
      },
      {
        id: 'tl-3',
        title: 'Pengajuan Transfer TRX-001 Disetujui',
        subtitle: 'Amoxicillin 500mg (200 unit) siap dikirim',
        timeAgo: '5 jam lalu',
        category: 'automation',
        type: 'info',
        isUnread: false,
        queryPrompt: 'Bagaimana status pengajuan transfer TRX-001?',
      },
      {
        id: 'tl-4',
        title: 'Model Prediksi Kasus DBD Diperbarui (v2.4)',
        subtitle: 'Proyeksi kenaikan +28% dalam 14 hari ke depan',
        timeAgo: 'Kemarin',
        category: 'forecast',
        type: 'success',
        isUnread: false,
        queryPrompt: 'Bagaimana prediksi lonjakan kasus DBD 14 hari ke depan?',
      },
      {
        id: 'tl-5',
        title: 'Surplus Terdeteksi: RS Universitas Airlangga',
        subtitle: 'Tersedia 450 unit cadangan Paracetamol 500mg',
        timeAgo: '1 hari lalu',
        category: 'automation',
        type: 'info',
        isUnread: false,
        queryPrompt: 'Di mana RS terdekat yang punya surplus Paracetamol?',
      },
    ]

    return list
  }, [])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return items
    return items.filter((item) => item.category === activeTab)
  }, [items, activeTab])

  const tabs: { key: TimelineCategory; label: string }[] = [
    { key: 'all', label: t('aiChat.timeline.tabs.all') },
    { key: 'alerts', label: t('aiChat.timeline.tabs.alerts') },
    { key: 'forecast', label: t('aiChat.timeline.tabs.forecast') },
    { key: 'automation', label: t('aiChat.timeline.tabs.automation') },
  ]

  const getIcon = (item: TimelineItem) => {
    switch (item.type) {
      case 'danger':
        return (
          <div className="bg-critical/15 text-critical flex size-7 shrink-0 items-center justify-center rounded-full">
            <AlertCircle className="size-4" />
          </div>
        )
      case 'warning':
        return (
          <div className="bg-low/20 text-low-foreground flex size-7 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="size-4" />
          </div>
        )
      case 'success':
        return (
          <div className="bg-safe/15 text-safe flex size-7 shrink-0 items-center justify-center rounded-full">
            <TrendingUp className="size-4" />
          </div>
        )
      case 'info':
      default:
        return (
          <div className="bg-primary/15 text-primary flex size-7 shrink-0 items-center justify-center rounded-full">
            <Truck className="size-3.5" />
          </div>
        )
    }
  }

  return (
    <div className="bg-card text-card-foreground border-border/80 flex h-full flex-col justify-between rounded-2xl border p-4 shadow-xs">
      <div className="flex min-h-0 flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-foreground text-sm font-bold tracking-tight">
              {t('aiChat.timeline.title')}
            </h3>
            <Sparkles className="text-primary size-3.5" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-muted/60 border-border/60 flex items-center gap-1 rounded-xl border p-1 shadow-2xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 rounded-lg py-1 text-center text-[11px] font-semibold transition-all select-none',
                  isActive
                    ? 'bg-card text-primary ring-border font-bold shadow-2xs ring-1'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Feed Cards List */}
        <div className="flex min-h-0 flex-1 scrollbar-thin flex-col gap-2.5 overflow-y-auto pr-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPrompt(item.queryPrompt)}
              className="group bg-card hover:bg-muted/50 border-border/70 hover:border-primary/40 relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-left shadow-2xs transition-all"
            >
              {getIcon(item)}

              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-foreground group-hover:text-primary truncate text-xs font-bold transition-colors">
                    {item.title}
                  </p>
                  {item.isUnread && (
                    <span className="bg-primary size-2 shrink-0 rounded-full shadow-xs" />
                  )}
                </div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                  {item.subtitle}
                </p>
                <span className="text-muted-foreground/80 mt-1 block text-[10px]">
                  {item.timeAgo}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Version */}
      <div className="border-border/50 text-muted-foreground/70 mt-2 flex shrink-0 items-center justify-end border-t pt-2.5 text-[11px] font-medium">
        <span>{t('aiChat.timeline.version')}</span>
      </div>
    </div>
  )
}
