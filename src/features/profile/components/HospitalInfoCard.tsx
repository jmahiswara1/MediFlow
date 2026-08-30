import { Building2, CheckCircle2, MapPin, Shield } from 'lucide-react'
import { useHospitalId, useStockStore } from '@/store'
import { useI18n } from '@/i18n/useI18n'
import { StatusBadge } from '@/components/ui/status-badge'

export function HospitalInfoCard() {
  const { t } = useI18n()
  const hospitalId = useHospitalId()
  const hospitals = useStockStore((s) => s.hospitals)

  const hospital = hospitals.find((h) => h.id === hospitalId) ?? hospitals[0]

  if (!hospital) return null

  const totalStockItems = hospital.stocks?.length ?? 0
  const criticalItems = hospital.stocks?.filter((s) => s.currentStock < s.minimumStock).length ?? 0

  return (
    <div className="bg-card border-border/80 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl shadow-2xs">
            <Building2 className="size-5" />
          </span>
          <div>
            <h3 className="text-foreground text-sm font-bold sm:text-base">
              {t('profile.hospitalDetails')}
            </h3>
            <p className="text-muted-foreground text-xs">{hospital.name}</p>
          </div>
        </div>

        <StatusBadge status={hospital.stockStatus} label={t(`status.${hospital.stockStatus}`)} />
      </div>

      {/* Hospital Metrics Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="bg-muted/30 border-border/60 rounded-xl border p-3">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            {t('profile.hospitalRegion')}
          </p>
          <p className="text-foreground mt-0.5 flex items-center gap-1 text-xs font-bold">
            <MapPin className="text-primary size-3.5" />
            <span>
              {hospital.city}, {hospital.region}
            </span>
          </p>
        </div>

        <div className="bg-muted/30 border-border/60 rounded-xl border p-3">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Katalog Buffer Obat
          </p>
          <p className="text-foreground mt-0.5 text-xs font-bold tabular-nums">
            {totalStockItems} Jenis ({criticalItems} Defisit)
          </p>
        </div>

        <div className="bg-muted/30 border-border/60 rounded-xl border p-3">
          <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
            Koordinat Jaringan
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs font-semibold tabular-nums">
            {hospital.lat.toFixed(4)}, {hospital.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* SATUSEHAT Integration Card */}
      <div className="bg-safe/10 border-safe/25 flex items-center justify-between gap-3 rounded-xl border p-3.5">
        <div className="flex items-center gap-2.5">
          <span className="bg-safe text-safe-foreground flex size-8 shrink-0 items-center justify-center rounded-lg shadow-2xs">
            <Shield className="size-4" />
          </span>
          <div>
            <p className="text-foreground text-xs font-bold">{t('profile.satusehatStatus')}</p>
            <p className="text-muted-foreground text-[11px]">
              ID Faskes:{' '}
              <span className="text-foreground/90 font-mono font-semibold">
                ID-FAS-{hospital.id.toUpperCase()}-3578
              </span>
            </p>
          </div>
        </div>

        <span className="bg-safe/20 text-safe border-safe/30 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold shadow-2xs">
          <CheckCircle2 className="size-3" />
          <span>{t('profile.satusehatConnected')}</span>
        </span>
      </div>
    </div>
  )
}
