import type { Conversation, TeamChatMessage } from '@/types'

const SEED_BASE_DATE = '2026-08-30T07:00:00Z'

export const conversationSeed: Conversation[] = [
  {
    id: 'conv-001',
    kind: 'dm',
    participantIds: ['usr-001', 'usr-003'],
    createdBy: 'usr-001',
    createdAt: '2026-08-28T09:00:00Z',
    lastActivityAt: '2026-08-30T08:24:00Z',
    lastMessagePreview: 'Oke, sudah saya cek. Besok pagi tim ekspedisi ambil.',
    members: [
      { userId: 'usr-001', joinedAt: '2026-08-28T09:00:00Z', lastReadAt: '2026-08-30T08:24:00Z' },
      { userId: 'usr-003', joinedAt: '2026-08-28T09:00:00Z', lastReadAt: '2026-08-30T07:50:00Z' },
    ],
  },
  {
    id: 'conv-002',
    kind: 'group',
    name: 'Tim Stok Kritis Surabaya',
    description: 'Koordinasi harian antar RS untuk obat kategori kritis.',
    avatarSeed: 'TS',
    participantIds: ['usr-001', 'usr-002', 'usr-003', 'usr-005'],
    createdBy: 'usr-003',
    createdAt: '2026-08-25T10:00:00Z',
    lastActivityAt: '2026-08-30T08:45:00Z',
    lastMessagePreview: 'Mau saya share status TRX-005?',
    members: [
      { userId: 'usr-001', joinedAt: '2026-08-25T10:00:00Z', lastReadAt: '2026-08-30T08:46:00Z' },
      { userId: 'usr-002', joinedAt: '2026-08-25T10:00:00Z', lastReadAt: '2026-08-30T08:20:00Z' },
      { userId: 'usr-003', joinedAt: '2026-08-25T10:00:00Z', lastReadAt: '2026-08-30T08:45:00Z' },
      { userId: 'usr-005', joinedAt: '2026-08-25T10:00:00Z', lastReadAt: '2026-08-30T08:10:00Z' },
    ],
  },
  {
    id: 'conv-003',
    kind: 'group',
    name: 'Koordinasi Apoteker Klaster Pusat',
    description: 'Diskusi mingguan apoteker penanggung jawab klaster Surabaya Pusat.',
    avatarSeed: 'KA',
    participantIds: ['usr-003', 'usr-004', 'usr-001'],
    createdBy: 'usr-003',
    createdAt: '2026-08-20T13:00:00Z',
    lastActivityAt: '2026-08-29T15:32:00Z',
    lastMessagePreview: 'Siap dok, saya jadwalkan rapat evaluasi hari Senin ya.',
    members: [
      { userId: 'usr-001', joinedAt: '2026-08-20T13:00:00Z', lastReadAt: '2026-08-29T16:00:00Z' },
      { userId: 'usr-003', joinedAt: '2026-08-20T13:00:00Z', lastReadAt: '2026-08-29T15:32:00Z' },
      { userId: 'usr-004', joinedAt: '2026-08-20T13:00:00Z', lastReadAt: '2026-08-29T15:00:00Z' },
    ],
  },
]

export const messageSeed: TeamChatMessage[] = [
  {
    id: 'msg-001',
    conversationId: 'conv-001',
    senderId: 'usr-001',
    text: 'Selamat pagi dok, untuk TRX-001 Infus NaCl, kira-kira bisa diproses hari ini?',
    createdAt: '2026-08-30T07:30:00Z',
  },
  {
    id: 'msg-002',
    conversationId: 'conv-001',
    senderId: 'usr-003',
    text: 'Pagi Rina. Stok kami masih bisa cover 40 ampul. Saya approve ya.',
    createdAt: '2026-08-30T07:48:00Z',
  },
  {
    id: 'msg-003',
    conversationId: 'conv-001',
    senderId: 'usr-001',
    text: 'Terima kasih dok! Saya cek ekspedisi',
    createdAt: '2026-08-30T08:02:00Z',
  },
  {
    id: 'msg-004',
    conversationId: 'conv-001',
    senderId: 'usr-003',
    text: 'Oke, sudah saya cek. Besok pagi tim ekspedisi ambil.',
    createdAt: '2026-08-30T08:24:00Z',
  },

  {
    id: 'msg-005',
    conversationId: 'conv-002',
    senderId: 'usr-003',
    text: 'Morning team. Pantauan stok pagi ini: ada 2 item kritis yang perlu perhatian.',
    createdAt: '2026-08-30T08:10:00Z',
  },
  {
    id: 'msg-006',
    conversationId: 'conv-002',
    senderId: 'usr-001',
    text: '@Siti Rahayu untuk stok Oseltamivir di RS PHC gimana? Saya lihat di dashboard agak tipis.',
    mentions: [
      { kind: 'user', refId: 'usr-004', label: 'Siti Rahayu', href: undefined },
      { kind: 'medicine', refId: 'obt-004', label: 'Oseltamivir 75mg', href: '/analytics' },
    ],
    createdAt: '2026-08-30T08:15:00Z',
  },
  {
    id: 'msg-007',
    conversationId: 'conv-002',
    senderId: 'usr-002',
    text: 'Di RS Soewandhie masih aman untuk Paracetamol, 1600 tablet. Bisa dilepas kalau butuh.',
    createdAt: '2026-08-30T08:20:00Z',
  },
  {
    id: 'msg-008',
    conversationId: 'conv-002',
    senderId: 'usr-005',
    text: 'Aku update status TRX-005 ya, sudah approved',
    mentions: [
      {
        kind: 'transfer',
        refId: 'trx-005',
        label: 'TRX-005',
        href: '/network?focus=trx-005&tab=outgoing',
      },
    ],
    createdAt: '2026-08-30T08:35:00Z',
  },
  {
    id: 'msg-009',
    conversationId: 'conv-002',
    senderId: 'usr-003',
    text: 'Mau saya share status TRX-005?',
    createdAt: '2026-08-30T08:45:00Z',
  },

  {
    id: 'msg-010',
    conversationId: 'conv-003',
    senderId: 'usr-004',
    text: 'Dok, laporan konsumsi cairan infus minggu ini sudah saya kirim ke email. Ada kenaikan cukup tajam di RS PHC.',
    createdAt: '2026-08-29T11:24:00Z',
  },
  {
    id: 'msg-011',
    conversationId: 'conv-003',
    senderId: 'usr-001',
    text: 'Sudah saya terima, Bu Siti. Kalau boleh tahu penyebabnya lonjakan kasus DBD atau ada faktor lain?',
    createdAt: '2026-08-29T11:28:00Z',
  },
  {
    id: 'msg-012',
    conversationId: 'conv-003',
    senderId: 'usr-001',
    text: 'Soalnya di dashboard analitik kami juga muncul proyeksi kenaikan +28% untuk Surabaya Timur.',
    createdAt: '2026-08-29T11:36:00Z',
  },
  {
    id: 'msg-013',
    conversationId: 'conv-003',
    senderId: 'usr-004',
    text: 'Betul, sepertinya terkait DBD. Siap dok, saya jadwalkan rapat evaluasi hari Senin ya.',
    createdAt: '2026-08-29T15:32:00Z',
  },
]

export const seedBaseDate = SEED_BASE_DATE
