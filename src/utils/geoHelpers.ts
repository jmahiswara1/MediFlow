// Haversine distance calculator + format helpers.

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(km * 10) / 10
}

export function formatDistance(km: number, locale: 'en' | 'id' = 'id'): string {
  if (km < 1) {
    const m = Math.round(km * 1000)
    return locale === 'id' ? `${m} m` : `${m} m`
  }
  return locale === 'id' ? `${km.toFixed(1)} km` : `${km.toFixed(1)} km`
}

export interface Coordinate {
  lat: number
  lng: number
}

export function midpoint(a: Coordinate, b: Coordinate): Coordinate {
  return {
    lat: (a.lat + b.lat) / 2,
    lng: (a.lng + b.lng) / 2,
  }
}
