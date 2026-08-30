import type {
  Disease,
  Hospital,
  Medicine,
  RichCard,
  StockStatusCard,
  HospitalRecCard,
  PredictionCard,
  TransferCard,
  HelpCard,
  TransferRequest,
  User,
} from '@/types'
import { diseaseList } from '@/data/diseases'
import { haversineDistance } from '@/utils/geoHelpers'
import { calculateDaysLeft, getStockStatusFromDays } from '@/utils/trendHelpers'

export type Intent =
  'stock-status' | 'find-surplus' | 'predict' | 'transfer-status' | 'help' | 'unknown'

export interface ChatEngineContext {
  currentUser: User | null
  currentHospital: Hospital | null
  hospitals: Hospital[]
  medicines: Medicine[]
  transfers: TransferRequest[]
}

// 1. Entity Extraction Helpers
function extractMedicine(query: string, medicines: Medicine[]): Medicine | null {
  const q = query.toLowerCase()

  // Keyword aliases
  if (q.includes('infus') || q.includes('nacl') || q.includes('cairan')) {
    return medicines.find((m) => m.id === 'obt-003') ?? medicines[2] ?? null
  }
  if (q.includes('paracetamol') || q.includes('panas') || q.includes('demam')) {
    return medicines.find((m) => m.id === 'obt-001') ?? medicines[0] ?? null
  }
  if (q.includes('masker') || q.includes('n95') || q.includes('mask')) {
    return medicines.find((m) => m.id === 'obt-006') ?? medicines[5] ?? null
  }
  if (q.includes('oseltamivir') || q.includes('flu') || q.includes('influenza')) {
    return medicines.find((m) => m.id === 'obt-004') ?? medicines[3] ?? null
  }
  if (q.includes('paxlovid')) {
    return medicines.find((m) => m.id === 'obt-007') ?? medicines[6] ?? null
  }
  if (q.includes('amoxicillin') || q.includes('antibiotik')) {
    return medicines.find((m) => m.id === 'obt-002') ?? medicines[1] ?? null
  }
  if (q.includes('vitamin') || q.includes('d3')) {
    return medicines.find((m) => m.id === 'obt-005') ?? medicines[4] ?? null
  }
  if (q.includes('gloves') || q.includes('sarung tangan')) {
    return medicines.find((m) => m.id === 'obt-008') ?? medicines[7] ?? null
  }
  if (q.includes('spuit') || q.includes('syringe') || q.includes('jarum')) {
    return medicines.find((m) => m.id === 'obt-010') ?? medicines[9] ?? null
  }

  for (const med of medicines) {
    if (q.includes(med.name.toLowerCase()) || q.includes(med.category.toLowerCase())) {
      return med
    }
  }

  return null
}

function extractHospital(query: string, hospitals: Hospital[]): Hospital | null {
  const q = query.toLowerCase()
  for (const h of hospitals) {
    const cleanName = h.name.toLowerCase().replace('rsud', '').replace('rs', '').trim()
    if (q.includes(cleanName) || q.includes(h.name.toLowerCase())) {
      return h
    }
  }
  return null
}

function extractDisease(query: string): Disease | null {
  const q = query.toLowerCase()
  if (q.includes('dbd') || q.includes('dengue') || q.includes('berdarah')) {
    return diseaseList.find((d) => d.name.includes('DBD')) ?? diseaseList[0] ?? null
  }
  if (q.includes('ispa') || q.includes('pernapasan')) {
    return diseaseList.find((d) => d.name.includes('ISPA')) ?? diseaseList[1] ?? null
  }
  if (q.includes('influenza') || q.includes('flu')) {
    return diseaseList.find((d) => d.name.includes('Influenza')) ?? diseaseList[2] ?? null
  }
  if (q.includes('covid')) {
    return diseaseList.find((d) => d.name.includes('COVID')) ?? diseaseList[4] ?? null
  }
  if (q.includes('diare')) {
    return diseaseList.find((d) => d.name.includes('Diare')) ?? diseaseList[3] ?? null
  }
  if (q.includes('tifus') || q.includes('tipes')) {
    return diseaseList.find((d) => d.name.includes('Tifus')) ?? diseaseList[5] ?? null
  }
  return null
}

function extractTransferId(query: string): string | null {
  const match = query.match(/trx-\d+/i)
  return match ? match[0].toUpperCase() : null
}

// 2. Intent Classifier
export function classifyIntent(query: string): { intent: Intent; confidence: number } {
  const q = query.toLowerCase().trim()

  if (/^(help|bantuan|\?|menu|panduan|fitur)$/i.test(q)) {
    return { intent: 'help', confidence: 1.0 }
  }

  if (/trx-\d+/i.test(q) || q.includes('status transfer') || q.includes('pengajuan transfer')) {
    return { intent: 'transfer-status', confidence: 0.95 }
  }

  if (
    q.includes('surplus') ||
    q.includes('lebih') ||
    q.includes('di mana') ||
    q.includes('dimana') ||
    q.includes('where') ||
    q.includes('faskes terdekat') ||
    q.includes('cari pasokan')
  ) {
    return { intent: 'find-surplus', confidence: 0.9 }
  }

  if (
    q.includes('prediksi') ||
    q.includes('forecast') ||
    q.includes('proyeksi') ||
    q.includes('wabah') ||
    q.includes('kasus') ||
    q.includes('lonjakan') ||
    q.includes('dbd') ||
    q.includes('ispa') ||
    q.includes('covid')
  ) {
    return { intent: 'predict', confidence: 0.88 }
  }

  if (
    q.includes('stok') ||
    q.includes('stock') ||
    q.includes('kritis') ||
    q.includes('sisa') ||
    q.includes('tersedia') ||
    q.includes('ada berapa') ||
    q.includes('how many') ||
    q.includes('habis') ||
    q.includes('obat')
  ) {
    return { intent: 'stock-status', confidence: 0.85 }
  }

  return { intent: 'unknown', confidence: 0.3 }
}

// 3. Card Builders
function buildStockStatusCard(medicine: Medicine, targetHospital: Hospital): StockStatusCard {
  const stockItem = targetHospital.stocks.find((s) => s.medicineId === medicine.id)
  const currentStock = stockItem ? stockItem.currentStock : medicine.currentStock
  const dailyUsage = stockItem ? stockItem.dailyUsage : medicine.dailyUsage
  const daysRemaining = calculateDaysLeft(currentStock, dailyUsage)
  const status = getStockStatusFromDays(daysRemaining)

  return {
    type: 'stock-status',
    medicineId: medicine.id,
    medicineName: medicine.name,
    currentStock,
    unit: medicine.unit,
    dailyUsage,
    daysRemaining,
    status,
    hospitalName: targetHospital.name,
  }
}

function buildHospitalRecCard(
  medicine: Medicine,
  currentHospital: Hospital | null,
  allHospitals: Hospital[],
): HospitalRecCard {
  const myLat = currentHospital?.lat ?? -7.2684
  const myLng = currentHospital?.lng ?? 112.7582

  const recommendations = allHospitals
    .filter((h) => h.id !== currentHospital?.id)
    .map((h) => {
      const stockItem = h.stocks.find((s) => s.medicineId === medicine.id)
      const currentStock = stockItem ? stockItem.currentStock : 0
      const dailyUsage = stockItem ? stockItem.dailyUsage : 10
      const daysRemaining = calculateDaysLeft(currentStock, dailyUsage)
      const distanceKm = Math.round(haversineDistance(myLat, myLng, h.lat, h.lng) * 10) / 10

      return {
        hospitalId: h.id,
        hospitalName: h.name,
        city: h.city,
        distanceKm,
        currentStock,
        daysRemaining,
      }
    })
    .filter((h) => h.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 3)

  return {
    type: 'hospital-recommendation',
    medicineName: medicine.name,
    hospitals: recommendations,
  }
}

function buildPredictionCard(disease: Disease, hospitals: Hospital[]): PredictionCard {
  const affected = hospitals.slice(0, 4).map((h) => {
    // Determine status based on critical items
    const hasCritical = h.stocks.some((s) => calculateDaysLeft(s.currentStock, s.dailyUsage) <= 3)
    const hasLow = h.stocks.some((s) => calculateDaysLeft(s.currentStock, s.dailyUsage) <= 7)

    return {
      hospitalName: h.name,
      status: hasCritical ? ('critical' as const) : hasLow ? ('low' as const) : ('safe' as const),
    }
  })

  return {
    type: 'prediction',
    diseaseName: disease.name,
    region: disease.region,
    deltaPercent: disease.severity === 'outbreak' ? 28 : disease.severity === 'rising' ? 18 : 6,
    affectedHospitals: affected,
  }
}

function buildTransferCard(transferId: string, transfers: TransferRequest[]): TransferCard | null {
  const item = transfers.find((t) => t.id.toLowerCase() === transferId.toLowerCase())
  if (!item) return null

  return {
    type: 'transfer',
    transferId: item.id,
    fromHospitalName: item.fromHospitalName,
    toHospitalName: item.toHospitalName,
    medicineName: item.medicineName,
    quantity: item.quantity,
    status: item.status,
    createdAt: item.createdAt,
    createdByName: item.createdByName,
  }
}

function buildHelpCard(): HelpCard {
  return {
    type: 'help',
    examples: [
      'Stok Infus NaCl 0.9% di RSUD Dr. Soetomo',
      'Di mana RS terdekat yang punya surplus Paracetamol?',
      'Prediksi kenaikan kasus DBD 14 hari',
      'Status transfer TRX-001',
      'Cek obat dengan stok paling kritis',
    ],
  }
}

// 4. Main Rule Engine Process Function
export function processChatQuery(
  rawQuery: string,
  context: ChatEngineContext,
): { text: string; card?: RichCard } {
  const query = rawQuery.trim()
  const { intent } = classifyIntent(query)
  const { currentHospital, hospitals, medicines, transfers } = context

  const activeHospital = currentHospital ??
    hospitals[0] ?? {
      id: 'rs-001',
      name: 'RSUD Dr. Soetomo',
      city: 'Surabaya',
      lat: -7.2684,
      lng: 112.7582,
      stocks: [],
    }

  switch (intent) {
    case 'transfer-status': {
      const transferId = extractTransferId(query) ?? transfers[0]?.id ?? 'TRX-001'
      const card = buildTransferCard(transferId, transfers)
      if (card) {
        return {
          text: `Berikut status terkini untuk pengajuan transfer logistik **${transferId}**:`,
          card,
        }
      }
      return {
        text: `Pengajuan transfer dengan ID **${transferId}** tidak ditemukan di sistem. Berikut contoh transfer aktif:`,
        card: transfers[0]
          ? (buildTransferCard(transfers[0].id, transfers) ?? undefined)
          : buildHelpCard(),
      }
    }

    case 'find-surplus': {
      const medicine =
        extractMedicine(query, medicines) ??
        medicines.find((m) => m.id === 'obt-003') ??
        medicines[0]!
      const card = buildHospitalRecCard(medicine, activeHospital, hospitals)
      return {
        text: `Saya menemukan **${card.hospitals.length} faskes jejaring di Surabaya** dengan surplus ketersediaan **${medicine.name}**:`,
        card,
      }
    }

    case 'predict': {
      const disease = extractDisease(query) ?? diseaseList[0]!
      const card = buildPredictionCard(disease, hospitals)
      return {
        text: `Berdasarkan pemodelan epidemiologi regional, berikut proyeksi 14 hari ke depan untuk **${disease.name}**:`,
        card,
      }
    }

    case 'stock-status': {
      const medicine = extractMedicine(query, medicines) ?? medicines[0]!
      const specifiedHospital = extractHospital(query, hospitals) ?? activeHospital
      const card = buildStockStatusCard(medicine, specifiedHospital)
      const statusText =
        card.status === 'critical'
          ? 'berada dalam kondisi **KRITIS** (< 3 hari)'
          : card.status === 'low'
            ? 'berada dalam kondisi **MENIPIS**'
            : 'berada dalam kondisi **AMAN**'

      return {
        text: `Ketersediaan **${medicine.name}** di **${specifiedHospital.name}** saat ini ${statusText}:`,
        card,
      }
    }

    case 'help': {
      return {
        text: 'Saya dapat membantu Anda mengecek ketersediaan obat, merekomendasikan faskes surplus, menampilkan prediksi lonjakan kasus, dan melacak transfer medis. Coba pertanyaan berikut:',
        card: buildHelpCard(),
      }
    }

    default: {
      // If unknown, check if medicine was mentioned
      const medicine = extractMedicine(query, medicines)
      if (medicine) {
        const card = buildStockStatusCard(medicine, activeHospital)
        return {
          text: `Berikut informasi ketersediaan untuk **${medicine.name}**:`,
          card,
        }
      }

      return {
        text: 'Maaf, saya belum memahami pertanyaan tersebut secara spesifik. Silakan pilih salah satu topik bantuan di bawah ini atau gunakan format pertanyaan cepat:',
        card: buildHelpCard(),
      }
    }
  }
}
