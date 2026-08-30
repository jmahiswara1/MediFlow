// Compute aggregated 'shared files' counts for a conversation's attachments.
// The reference design groups counts by file type (Documents/Photos/Movies/Other).
// For our domain we map attachment types to these buckets:
//   - hospital/transfer/stock  -> Documents
//   - (future photos) -> Photos
//   - (future movies) -> Movies
//   - unknown -> Other

import type { AttachedCard, TeamChatMessage } from '@/types'

export type FileBucket = 'documents' | 'photos' | 'movies' | 'other'

export interface SharedFilesSummary {
  documents: number
  photos: number
  movies: number
  other: number
  total: number
  totalSizeMb: number
}

function bucketFor(_card: AttachedCard): FileBucket {
  // Demo mapping: all current attachments become "documents" until richer
  // attachment types are introduced (e.g. photo upload).
  void _card
  return 'documents'
}

// Approximate display sizes for the demo (no real file data).
const DEMO_SIZE_MB: Record<FileBucket, number> = {
  documents: 12.6,
  photos: 8.4,
  movies: 45.0,
  other: 5.2,
}

export function summarizeSharedFiles(messages: TeamChatMessage[]): SharedFilesSummary {
  const counts: Record<FileBucket, number> = {
    documents: 0,
    photos: 0,
    movies: 0,
    other: 0,
  }
  let total = 0
  for (const m of messages) {
    if (!m.attachments) continue
    for (const card of m.attachments) {
      const bucket = bucketFor(card)
      counts[bucket] += 1
      total += 1
    }
  }
  const totalSizeMb =
    Math.round(
      (counts.documents * DEMO_SIZE_MB.documents +
        counts.photos * DEMO_SIZE_MB.photos +
        counts.movies * DEMO_SIZE_MB.movies +
        counts.other * DEMO_SIZE_MB.other) *
        10,
    ) / 10
  return { ...counts, total, totalSizeMb }
}
