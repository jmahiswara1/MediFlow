import type { User } from '@/types'

export const userList: User[] = [
  {
    id: 'usr-001',
    name: 'Rina Wulandari',
    role: 'requester',
    hospitalId: 'rs-001',
    hospitalName: 'RSUD Dr. Soetomo',
    avatarSeed: 'RW',
  },
  {
    id: 'usr-002',
    name: 'Budi Santoso',
    role: 'requester',
    hospitalId: 'rs-002',
    hospitalName: 'RSUD Dr. M. Soewandhie',
    avatarSeed: 'BS',
  },
  {
    id: 'usr-003',
    name: 'dr. Andi Pratama',
    role: 'approver',
    hospitalId: 'rs-004',
    hospitalName: 'RS Siloam Hospitals Surabaya',
    avatarSeed: 'AP',
  },
  {
    id: 'usr-004',
    name: 'Siti Rahayu',
    role: 'approver',
    hospitalId: 'rs-005',
    hospitalName: 'RS PHC Surabaya',
    avatarSeed: 'SR',
  },
  {
    id: 'usr-005',
    name: 'Dewi Lestari',
    role: 'requester',
    hospitalId: 'rs-003',
    hospitalName: 'RS Universitas Airlangga',
    avatarSeed: 'DL',
  },
]
