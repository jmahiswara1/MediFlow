import { useMemo } from 'react'
import { haversineDistance } from '@/utils/geoHelpers'
import type { Hospital } from '@/types'

export interface HospitalDistance {
  hospital: Hospital
  distanceKm: number
}

// Reference point for distance calculation.
// In a real app this would be the current user's hospital coordinates.
const REFERENCE_LAT = -6.9175
const REFERENCE_LNG = 107.6191

export function useHospitalDistance(hospital: Hospital | null | undefined): number | null {
  return useMemo(() => {
    if (!hospital) return null
    return haversineDistance(REFERENCE_LAT, REFERENCE_LNG, hospital.lat, hospital.lng)
  }, [hospital])
}

export function useAllHospitalDistances(hospitals: Hospital[]): HospitalDistance[] {
  return useMemo(
    () =>
      hospitals.map((hospital) => ({
        hospital,
        distanceKm: haversineDistance(REFERENCE_LAT, REFERENCE_LNG, hospital.lat, hospital.lng),
      })),
    [hospitals],
  )
}
