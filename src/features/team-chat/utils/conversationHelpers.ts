// Helpers for formatting conversation metadata used in lists, headers and popovers.

import type { Conversation, User } from '@/types'

export function getConversationTitle(
  conv: Conversation,
  currentUserId: string | undefined,
  users: User[],
): string {
  if (conv.kind === 'group' && conv.name) return conv.name
  const otherId = conv.participantIds.find((id) => id !== currentUserId)
  const other = users.find((u) => u.id === otherId)
  return other?.name ?? 'Unknown user'
}

export function getConversationAvatarSeed(
  conv: Conversation,
  currentUserId: string | undefined,
  users: User[],
): string {
  if (conv.avatarSeed) return conv.avatarSeed
  if (conv.kind === 'group') return 'GR'
  const otherId = conv.participantIds.find((id) => id !== currentUserId)
  const other = users.find((u) => u.id === otherId)
  return other?.avatarSeed ?? other?.name.slice(0, 2).toUpperCase() ?? '?'
}

export function isUserOnline(_user: User | undefined): boolean {
  // Demo: all seeded users appear online for the live feel of the reference image.
  // A real implementation would consume presence pings.
  return Boolean(_user)
}

export function groupConversationsByKind<T extends Conversation>(
  convs: T[],
): {
  dms: T[]
  groups: T[]
} {
  const dms: T[] = []
  const groups: T[] = []
  for (const c of convs) {
    if (c.kind === 'dm') dms.push(c)
    else groups.push(c)
  }
  return { dms, groups }
}
