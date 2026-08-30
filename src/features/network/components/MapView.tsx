import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useSearchParams } from 'react-router-dom'
import { LocateFixed } from 'lucide-react'
import type { Hospital } from '@/types'
import { createHospitalMarker, getStatusLabel, getStockSummaryText } from './HospitalMarker'
import { useI18n } from '@/i18n/useI18n'

interface MapViewProps {
  hospitals: Hospital[]
  selectedHospitalId: string | null
  currentHospitalId: string | null
  onSelect: (hospitalId: string | null) => void
}

// Center of Surabaya
const SURABAYA_CENTER: [number, number] = [-7.265, 112.745]
const DEFAULT_ZOOM = 12
const FIT_BOUNDS_MAX_ZOOM = 12.5
const FOCUS_ZOOM = 14.5

// Strict bounding box for Surabaya
const SURABAYA_BOUNDS: [[number, number], [number, number]] = [
  [-7.42, 112.55], // Southwest
  [-7.15, 112.92], // Northeast
]

function FitBounds({ hospitals }: { hospitals: Hospital[] }) {
  const map = useMap()
  useEffect(() => {
    if (hospitals.length === 0) return
    const bounds = hospitals.map((h) => [h.lat, h.lng] as [number, number])
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: FIT_BOUNDS_MAX_ZOOM })
  }, [map, hospitals])
  return null
}

function FocusHospital({
  hospitalId,
  hospitals,
}: {
  hospitalId: string | null
  hospitals: Hospital[]
}) {
  const map = useMap()
  useEffect(() => {
    if (!hospitalId) return
    const hospital = hospitals.find((h) => h.id === hospitalId)
    if (!hospital) return
    map.flyTo([hospital.lat, hospital.lng], FOCUS_ZOOM, { duration: 0.8 })
  }, [map, hospitalId, hospitals])
  return null
}

export function MapView({
  hospitals,
  selectedHospitalId,
  currentHospitalId,
  onSelect,
}: MapViewProps) {
  const { t, locale } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const rsParam = searchParams.get('rs')
    if (rsParam && rsParam !== selectedHospitalId) {
      // handled by parent
    } else if (!rsParam && selectedHospitalId) {
      const next = new URLSearchParams(searchParams)
      next.set('rs', selectedHospitalId)
      setSearchParams(next, { replace: true })
    } else if (rsParam && !selectedHospitalId) {
      const next = new URLSearchParams(searchParams)
      next.delete('rs')
      setSearchParams(next, { replace: true })
    }
  }, [selectedHospitalId, searchParams, setSearchParams])

  const currentHospital = hospitals.find((h) => h.id === currentHospitalId)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={SURABAYA_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={11}
        maxZoom={18}
        maxBounds={SURABAYA_BOUNDS}
        maxBoundsViscosity={0.8}
        scrollWheelZoom
        className="z-0 h-full w-full"
        style={{ minHeight: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {hospitals.length > 0 && <FitBounds hospitals={hospitals} />}
        {selectedHospitalId && (
          <FocusHospital hospitalId={selectedHospitalId} hospitals={hospitals} />
        )}

        {hospitals.map((hospital) => {
          const isCurrent = hospital.id === currentHospitalId
          const isSelected = hospital.id === selectedHospitalId
          return (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={createHospitalMarker({
                status: hospital.stockStatus,
                isCurrent,
                isSelected,
                name: hospital.name,
              })}
              eventHandlers={{
                click: () => onSelect(hospital.id),
              }}
            >
              <Popup className="mediflow-map-popup">
                <div className="space-y-1 p-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full ${
                        hospital.stockStatus === 'safe'
                          ? 'bg-emerald-500'
                          : hospital.stockStatus === 'low'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                    />
                    <p className="text-sm leading-tight font-semibold text-slate-900 dark:text-slate-100">
                      {hospital.name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {hospital.city} • {getStatusLabel(hospital.stockStatus, locale)}
                  </p>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    {getStockSummaryText(hospital)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Floating Status Legend */}
      <div className="border-border/80 bg-card/90 absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-3 rounded-xl border px-3.5 py-2 text-xs font-medium shadow-md backdrop-blur-md">
        <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
          {t('network.legend')}:
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-safe size-2.5 rounded-full shadow-xs" />
          <span>{t('status.safe')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-low size-2.5 rounded-full shadow-xs" />
          <span>{t('status.low')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-critical size-2.5 animate-pulse rounded-full shadow-xs" />
          <span>{t('status.critical')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="ring-primary bg-primary/40 size-2.5 rounded-full ring-2 ring-offset-1" />
          <span>{t('network.detail.yourHospital')}</span>
        </span>
      </div>

      {/* Locate Me Floating Button */}
      {currentHospital && (
        <button
          type="button"
          onClick={() => onSelect(currentHospital.id)}
          className="border-border/80 bg-card/90 hover:bg-card hover:text-primary absolute right-4 bottom-4 z-[400] flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-md backdrop-blur-md transition-all active:scale-95"
          title={t('network.locateMe')}
        >
          <LocateFixed className="text-primary size-4" />
          <span>{t('network.locateMe')}</span>
        </button>
      )}
    </div>
  )
}
