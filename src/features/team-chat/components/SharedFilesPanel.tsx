import { FileText, Image as ImageIcon, Film, FileQuestion, HardDrive } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import type { FileBucket } from '../utils/sharedFiles'

interface SharedFilesPanelProps {
  summary: {
    documents: number
    photos: number
    movies: number
    other: number
    totalSizeMb: number
  }
}

const ICON: Record<FileBucket, typeof FileText> = {
  documents: FileText,
  photos: ImageIcon,
  movies: Film,
  other: FileQuestion,
}

const KEY: Record<FileBucket, string> = {
  documents: 'documents',
  photos: 'photos',
  movies: 'movies',
  other: 'other',
}

const COLOR: Record<FileBucket, string> = {
  documents: 'bg-primary/15 text-primary',
  photos: 'bg-chart-4/15 text-chart-4',
  movies: 'bg-safe/15 text-safe-foreground',
  other: 'bg-muted text-muted-foreground',
}

export function SharedFilesPanel({ summary }: SharedFilesPanelProps) {
  const { t } = useI18n()
  const rows: FileBucket[] = ['documents', 'photos', 'movies', 'other']

  return (
    <div className="space-y-3">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-primary/10 border-primary/20 rounded-xl border p-3 shadow-2xs">
          <p className="text-foreground text-xl leading-none font-extrabold tabular-nums">
            {summary.documents}
          </p>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-wider uppercase">
            {t('teamChat.fileTypes.documents')}
          </p>
        </div>
        <div className="bg-chart-4/10 border-chart-4/20 rounded-xl border p-3 shadow-2xs">
          <p className="text-foreground text-xl leading-none font-extrabold tabular-nums">
            {summary.photos}
          </p>
          <p className="text-muted-foreground mt-1 text-[10px] font-bold tracking-wider uppercase">
            {t('teamChat.fileTypes.photos')}
          </p>
        </div>
      </div>

      {/* File Category List */}
      <div className="space-y-1">
        {rows.map((bucket) => {
          const Icon = ICON[bucket]
          return (
            <div
              key={bucket}
              className="hover:bg-muted/60 flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors"
            >
              <span
                className={`flex size-7.5 shrink-0 items-center justify-center rounded-lg shadow-2xs ${COLOR[bucket]}`}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="flex-1 text-xs font-semibold">
                {t(`teamChat.fileTypes.${KEY[bucket]}`)}
              </span>
              <span className="bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums">
                {summary[bucket]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Total Storage Used */}
      <div className="border-border/60 text-muted-foreground flex items-center gap-1.5 border-t pt-2.5 text-[11px]">
        <HardDrive className="size-3.5 opacity-70" />
        <span>{summary.totalSizeMb} MB berkas terlampir</span>
      </div>
    </div>
  )
}
