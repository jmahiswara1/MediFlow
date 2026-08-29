import type { Disease } from '@/types'

export const diseaseList: Disease[] = [
  {
    id: 'kss-001',
    name: 'DBD',
    region: 'Jawa Barat',
    caseCount: 342,
    trend: [120, 145, 180, 210, 260, 342],
    severity: 'rising',
  },
  {
    id: 'kss-002',
    name: 'ISPA',
    region: 'Jawa Barat',
    caseCount: 510,
    trend: [400, 420, 380, 460, 490, 510],
    severity: 'normal',
  },
  {
    id: 'kss-003',
    name: 'Diare',
    region: 'Jawa Tengah',
    caseCount: 88,
    trend: [60, 65, 70, 80, 84, 88],
    severity: 'rising',
  },
  {
    id: 'kss-004',
    name: 'COVID-19',
    region: 'Jawa Timur',
    caseCount: 210,
    trend: [50, 70, 120, 160, 190, 210],
    severity: 'outbreak',
  },
  {
    id: 'kss-005',
    name: 'Influenza A',
    region: 'Jawa Timur',
    caseCount: 425,
    trend: [280, 310, 350, 380, 410, 425],
    severity: 'rising',
  },
  {
    id: 'kss-006',
    name: 'Tifus',
    region: 'Jawa Tengah',
    caseCount: 65,
    trend: [40, 45, 50, 55, 60, 65],
    severity: 'normal',
  },
]