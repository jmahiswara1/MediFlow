import type { StockStatus, TransferStatus } from './index'

// === Rich card payloads (used by AI Chat - implementation in Phase 7 of feat/features) ===

export interface StockStatusCard {
  type: 'stock-status'
  medicineId: string
  medicineName: string
  currentStock: number
  unit: string
  dailyUsage: number
  daysRemaining: number
  status: StockStatus
  hospitalName?: string
}

export interface HospitalRecCard {
  type: 'hospital-recommendation'
  medicineName: string
  hospitals: {
    hospitalId: string
    hospitalName: string
    city: string
    distanceKm: number
    currentStock: number
    daysRemaining: number
  }[]
}

export interface PredictionCard {
  type: 'prediction'
  diseaseName: string
  region: string
  deltaPercent: number
  affectedHospitals: {
    hospitalName: string
    status: StockStatus
  }[]
}

export interface TransferCard {
  type: 'transfer'
  transferId: string
  fromHospitalName: string
  toHospitalName: string
  medicineName: string
  quantity: number
  status: TransferStatus
  createdAt: string
  createdByName: string
}

export interface HelpCard {
  type: 'help'
  examples: string[]
}

export type RichCard = StockStatusCard | HospitalRecCard | PredictionCard | TransferCard | HelpCard

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text?: string
  card?: RichCard
  createdAt: string
}

export type Urgency = 'high' | 'normal' | 'low'
