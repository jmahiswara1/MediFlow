import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowDownToLine, ArrowUpFromLine, History, Map as MapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/i18n/useI18n'
import {
  useCurrentUser,
  useHospitalId,
  useStockStore,
  useIncomingRequests,
  useOutgoingRequests,
} from '@/store'
import { MapView } from './components/MapView'
import { HospitalDetailPanel } from './components/HospitalDetailPanel'
import { HospitalExplorerList } from './components/HospitalExplorerList'
import { IncomingRequestsTable } from './components/IncomingRequestsTable'
import { OutgoingRequestsTable } from './components/OutgoingRequestsTable'
import { HistoryList } from './components/HistoryList'
import { TransferDialog } from './components/TransferDialog'
import { TransferDetailModal } from './components/TransferDetailModal'

type Tab = 'map' | 'incoming' | 'outgoing' | 'history'

export function NetworkPage() {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = useCurrentUser()
  const hospitalId = useHospitalId()
  const hospitals = useStockStore((s) => s.hospitals)
  const incomingRequests = useIncomingRequests()
  const outgoingRequests = useOutgoingRequests()

  const [headerNewRequestOpen, setHeaderNewRequestOpen] = useState(false)

  const tabParam = searchParams.get('tab') as Tab | null
  const rsParam = searchParams.get('rs')
  const medicineParam = searchParams.get('medicine')
  const focusParam = searchParams.get('focus')
  const searchQueryParam = searchParams.get('q') ?? ''

  const defaultTab: Tab = currentUser?.role === 'approver' ? 'incoming' : 'map'
  const activeTab: Tab = tabParam ?? defaultTab

  const selectedHospital = useMemo(
    () => hospitals.find((h) => h.id === rsParam) ?? null,
    [hospitals, rsParam],
  )

  const isRequester = currentUser?.role === 'requester'

  const directTransferDialogOpen =
    Boolean(medicineParam) && Boolean(selectedHospital) && isRequester

  const isDialogOpen = (directTransferDialogOpen || headerNewRequestOpen) && isRequester

  const detailModalOpen = Boolean(focusParam)
  const detailModalId = focusParam

  const setTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams)
    next.set('tab', tab)
    if (tab !== 'map') next.delete('rs')
    setSearchParams(next, { replace: true })
  }

  const handleSelectHospital = (id: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (id) next.set('rs', id)
    else next.delete('rs')
    setSearchParams(next, { replace: true })
  }

  const handleRequestTransfer = () => {
    if (!selectedHospital) return
    const firstStock = selectedHospital.stocks[0]
    const medicineId = firstStock?.medicineId ?? 'obt-001'
    const next = new URLSearchParams(searchParams)
    next.set('medicine', medicineId)
    setSearchParams(next, { replace: true })
  }

  const handleCloseTransferDialog = () => {
    setHeaderNewRequestOpen(false)
    const next = new URLSearchParams(searchParams)
    next.delete('medicine')
    setSearchParams(next, { replace: true })
  }

  const handleCloseDetailModal = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('focus')
    setSearchParams(next, { replace: true })
  }

  const tabs: {
    key: Tab
    label: string
    icon: typeof MapIcon
    badge?: number
  }[] = [
    {
      key: 'map',
      label: t('network.tabs.map'),
      icon: MapIcon,
    },
    {
      key: 'incoming',
      label: t('network.tabs.incoming'),
      icon: ArrowDownToLine,
      badge: incomingRequests.length > 0 ? incomingRequests.length : undefined,
    },
    {
      key: 'outgoing',
      label: t('network.tabs.outgoing'),
      icon: ArrowUpFromLine,
      badge: outgoingRequests.length > 0 ? outgoingRequests.length : undefined,
    },
    {
      key: 'history',
      label: t('network.tabs.history'),
      icon: History,
    },
  ]

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-5">
      {/* Page Header */}
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
          {t('network.title')}
        </h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{t('network.description')}</p>
      </div>

      {/* Modern Segmented Tab Menu */}
      <div className="bg-muted/50 border-border/80 flex gap-1.5 overflow-x-auto rounded-2xl border p-1.5 shadow-2xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setTab(tab.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all select-none',
                isActive
                  ? 'bg-card text-primary ring-border shadow-xs ring-1'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="grid items-start gap-5 lg:grid-cols-12">
          {/* Sticky 1-screen Map View */}
          <div className="bg-card sticky top-4 flex h-[calc(100vh-10rem)] max-h-[720px] min-h-[480px] flex-col overflow-hidden rounded-2xl border shadow-sm lg:col-span-7 xl:col-span-7">
            <MapView
              hospitals={hospitals}
              selectedHospitalId={rsParam}
              currentHospitalId={hospitalId}
              onSelect={handleSelectHospital}
            />
          </div>

          {/* Side Panel: Detail or Hospital Explorer */}
          <div className="sticky top-4 flex h-[calc(100vh-10rem)] max-h-[720px] min-h-[480px] min-w-0 flex-col lg:col-span-5 xl:col-span-5">
            {selectedHospital ? (
              <HospitalDetailPanel
                hospital={selectedHospital}
                onClose={() => handleSelectHospital(null)}
                onRequestTransfer={
                  isRequester && currentUser.hospitalId !== selectedHospital.id
                    ? handleRequestTransfer
                    : undefined
                }
              />
            ) : (
              <HospitalExplorerList
                hospitals={hospitals}
                currentHospitalId={hospitalId}
                onSelectHospital={(id) => handleSelectHospital(id)}
                initialSearch={searchQueryParam}
              />
            )}
          </div>
        </div>
      )}

      {/* Incoming tab */}
      {activeTab === 'incoming' && <IncomingRequestsTable />}

      {/* Outgoing tab */}
      {activeTab === 'outgoing' && (
        <OutgoingRequestsTable
          // Only 'requester' may create/send a new transfer request.
          onNewRequest={isRequester ? () => setHeaderNewRequestOpen(true) : undefined}
        />
      )}

      {/* History tab */}
      {activeTab === 'history' && <HistoryList />}

      {/* Unified Transfer Dialog */}
      <TransferDialog
        open={isDialogOpen}
        onClose={handleCloseTransferDialog}
        toHospital={directTransferDialogOpen ? selectedHospital : null}
        preSelectedMedicineId={medicineParam}
      />

      {/* Detail Modal */}
      <TransferDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        transferId={detailModalId}
      />
    </div>
  )
}
