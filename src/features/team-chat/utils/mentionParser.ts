// Parse inline @-mentions out of message text. Tokens are alphanumeric + dash/underscore.
// We resolve each token against lookup maps (users / hospitals / medicines / transfers).
// Unknown tokens are dropped (the text remains, just without a chip).

import type {
  ChatMention,
  ChatMentionKind,
  Hospital,
  Medicine,
  TransferRequest,
  User,
} from '@/types'

const TOKEN_PATTERN = /@([A-Za-z][A-Za-z0-9_-]{1,40})/g

interface LookupTables {
  users: User[]
  hospitals: Hospital[]
  medicines: Medicine[]
  transfers: TransferRequest[]
}

function normalize(input: string): string {
  return input.toLowerCase().trim()
}

function buildIndexes(tables: LookupTables) {
  const userByName = new Map<string, User>()
  for (const u of tables.users) {
    userByName.set(normalize(u.name), u)
    userByName.set(normalize(u.avatarSeed), u)
    const first = u.name.split(/\s+/)[0]
    if (first) userByName.set(normalize(first), u)
  }

  const hospitalById = new Map<string, Hospital>()
  const hospitalByShortName = new Map<string, Hospital>()
  for (const h of tables.hospitals) {
    hospitalById.set(normalize(h.id), h)
    hospitalByShortName.set(normalize(h.name), h)
    hospitalByShortName.set(normalize(h.city), h)
    const firstWord = h.name.split(/\s+/)[0]
    if (firstWord) hospitalByShortName.set(normalize(firstWord), h)
  }

  const medicineById = new Map<string, Medicine>()
  const medicineByName = new Map<string, Medicine>()
  for (const m of tables.medicines) {
    medicineById.set(normalize(m.id), m)
    medicineByName.set(normalize(m.name), m)
    const stripped = m.name.replace(/\d+\s*(mg|ml|mcg|g)/gi, '').trim()
    if (stripped) medicineByName.set(normalize(stripped), m)
  }

  const transferById = new Map<string, TransferRequest>()
  for (const tr of tables.transfers) {
    transferById.set(normalize(tr.id), tr)
  }

  return {
    userByName,
    hospitalById,
    hospitalByShortName,
    medicineById,
    medicineByName,
    transferById,
  }
}

export interface ResolvedToken {
  raw: string
  mention?: ChatMention
}

export function parseMentions(text: string, tables: LookupTables): ResolvedToken[] {
  const out: ResolvedToken[] = []
  const indexes = buildIndexes(tables)
  let lastIndex = 0

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const start = match.index ?? 0
    const raw = match[0]
    const token = match[1]

    if (start > lastIndex) {
      out.push({ raw: text.slice(lastIndex, start) })
    }

    const key = normalize(token)
    let mention: ChatMention | undefined

    const user = indexes.userByName.get(key)
    if (user) {
      mention = { kind: 'user', refId: user.id, label: user.name }
    } else if (indexes.hospitalById.has(key) || indexes.hospitalByShortName.has(key)) {
      const h = indexes.hospitalById.get(key) ?? indexes.hospitalByShortName.get(key)!
      mention = { kind: 'hospital', refId: h.id, label: h.name, href: `/network?rs=${h.id}` }
    } else if (indexes.medicineById.has(key) || indexes.medicineByName.has(key)) {
      const m = indexes.medicineById.get(key) ?? indexes.medicineByName.get(key)!
      mention = { kind: 'medicine', refId: m.id, label: m.name, href: '/analytics' }
    } else if (indexes.transferById.has(key)) {
      const tr = indexes.transferById.get(key)!
      mention = {
        kind: 'transfer',
        refId: tr.id,
        label: tr.id.toUpperCase(),
        href: `/network?focus=${tr.id}&tab=outgoing`,
      }
    }

    out.push({ raw, mention })
    lastIndex = start + raw.length
  }

  if (lastIndex < text.length) {
    out.push({ raw: text.slice(lastIndex) })
  }

  return out
}

export function extractMentionEntities(text: string, tables: LookupTables): ChatMention[] {
  const tokens = parseMentions(text, tables)
  const seen = new Set<string>()
  const mentions: ChatMention[] = []
  for (const t of tokens) {
    if (!t.mention) continue
    const k = `${t.mention.kind}:${t.mention.refId}`
    if (seen.has(k)) continue
    seen.add(k)
    mentions.push(t.mention)
  }
  return mentions
}

export interface MentionSuggestion {
  kind: ChatMentionKind
  refId: string
  label: string
  hint?: string
  href?: string
}

export function suggestMentions(
  prefix: string,
  tables: LookupTables,
  limit = 6,
): MentionSuggestion[] {
  const key = normalize(prefix)
  if (!key) return []
  const out: MentionSuggestion[] = []

  for (const u of tables.users) {
    if (
      normalize(u.name).includes(key) ||
      normalize(u.avatarSeed).includes(key) ||
      normalize(u.hospitalName).includes(key)
    ) {
      out.push({ kind: 'user', refId: u.id, label: u.name, hint: u.hospitalName })
    }
  }

  for (const h of tables.hospitals) {
    if (normalize(h.name).includes(key) || normalize(h.city).includes(key)) {
      out.push({
        kind: 'hospital',
        refId: h.id,
        label: h.name,
        hint: h.city,
        href: `/network?rs=${h.id}`,
      })
    }
  }

  for (const m of tables.medicines) {
    if (normalize(m.name).includes(key) || normalize(m.category).includes(key)) {
      out.push({
        kind: 'medicine',
        refId: m.id,
        label: m.name,
        hint: m.category,
        href: '/analytics',
      })
    }
  }

  for (const tr of tables.transfers) {
    if (
      normalize(tr.id).includes(key) ||
      normalize(tr.medicineName).includes(key) ||
      normalize(tr.fromHospitalName).includes(key) ||
      normalize(tr.toHospitalName).includes(key)
    ) {
      out.push({
        kind: 'transfer',
        refId: tr.id,
        label: tr.id.toUpperCase(),
        hint: `${tr.fromHospitalName} \u2192 ${tr.toHospitalName}`,
        href: `/network?focus=${tr.id}&tab=outgoing`,
      })
    }
  }

  return out.slice(0, limit)
}
