// === Existing types (preserved from existing file) ===

export type StockStatus = 'safe' | 'low' | 'critical'

export type DiseaseSeverity = 'normal' | 'rising' | 'outbreak'

export type TransferStatus = 'pending' | 'approved' | 'shipped' | 'completed' | 'rejected'

export interface Medicine {
  id: string
  name: string
  category: string
  unit: string
  currentStock: number
  minimumStock: number
  dailyUsage: number
}

export interface Hospital {
  id: string
  name: string
  city: string
  region: string
  lat: number
  lng: number
  stockStatus: StockStatus
  stocks: HospitalStock[]
}

export interface Disease {
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
  fromHospitalName: string
  toHospitalId: string
  toHospitalName: string
  medicineId: string
  medicineName: string
  quantity: number
  urgency: 'high' | 'normal' | 'low'
  notes: string
  status: TransferStatus
  createdAt: string
  createdBy: string
  createdByName: string
  timeline: TransferTimelineEvent[]
}

// === New types added in Phase 1 (additive only, existing usages unaffected) ===

export type UserRole = 'requester' | 'approver'

export interface User {
  id: string
  name: string
  role: UserRole
  hospitalId: string
  hospitalName: string
  avatarSeed: string
}

export type NotificationType =
  | 'incoming-request'
  | 'request-approved'
  | 'request-rejected'
  | 'request-shipped'
  | 'request-completed'
  | 'stock-critical'
  | 'stock-rising'
  | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  snippet: string
  read: boolean
  createdAt: string
  link?: string
  transferId?: string
  medicineId?: string
}

export interface TransferTimelineEvent {
  status: TransferStatus
  at: string
  by?: string
  byName?: string
  reason?: string
  expedition?: string
  receivedBy?: string
}

export interface HospitalStock {
  medicineId: string
  currentStock: number
  minimumStock: number
  dailyUsage: number
}

export type {
  StockStatusCard,
  HospitalRecCard,
  PredictionCard,
  TransferCard,
  HelpCard,
  RichCard,
  ChatMessage,
  Urgency,
} from './chat'
