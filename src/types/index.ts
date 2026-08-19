export type StockStatus = 'safe' | 'low' | 'critical'

export type DiseaseSeverity = 'normal' | 'rising' | 'outbreak'

export type TransferStatus = 'pending' | 'approved' | 'shipped' | 'completed' | 'rejected'

export interface Obat {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minimumStock: number
  dailyUsage: number
}

export interface RumahSakit {
  id: string
  name: string
  city: string
  region: string
  lat: number
  lng: number
  stockStatus: StockStatus
}

export interface KasusPenyakit {
  id: string
  name: string
  region: string
  caseCount: number
  trend: number[]
  severity: DiseaseSeverity
}

export interface TransferRequest {
  id: string
  fromHospitalId: string
  toHospitalId: string
  obatId: string
  quantity: number
  notes: string
  status: TransferStatus
  createdAt: string
}
