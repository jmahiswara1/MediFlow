import { useMemo } from 'react'
import { kasusPenyakitList } from '@/data'
import type { KasusPenyakit, DiseaseSeverity } from '@/types'

export function useDiseaseDetection() {
  return useMemo(() => {
    return kasusPenyakitList.filter((kasus) => kasus.severity !== 'normal')
  }, [])
}

export function useDiseaseBySeverity(severity: DiseaseSeverity): KasusPenyakit[] {
  return useMemo(() => {
    return kasusPenyakitList.filter((kasus) => kasus.severity === severity)
  }, [severity])
}
