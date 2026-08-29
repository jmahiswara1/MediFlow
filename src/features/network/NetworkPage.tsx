// Placeholder for NetworkPage (Phase 7 shell).
// Real implementation with Leaflet map, hospital detail panel, incoming/outgoing tables
// will be added in feat/features branch.

import { useI18n } from '@/i18n/useI18n'

export function NetworkPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t('network.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('network.description')}</p>
      </div>
      <div className="bg-card text-card-foreground flex flex-col items-center justify-center gap-3 rounded-xl border py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Map Leaflet + detail panel + incoming/outgoing menyusul di branch feat/features.
        </p>
      </div>
    </div>
  )
}