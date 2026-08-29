import { useMemo } from 'react'
import { diseaseList } from '@/data'
import type { Disease, DiseaseSeverity } from '@/types'

export function useDiseaseDetection(): Disease[] {
  return useMemo(() => {
    return diseaseList.filter((disease) => disease.severity !== 'normal')
  }, [])
}

export function useDiseaseBySeverity(severity: DiseaseSeverity): Disease[] {
  return useMemo(() => {
    return diseaseList.filter((disease) => disease.severity === severity)
  }, [severity])
}