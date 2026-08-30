// BroadcastChannel helper for cross-tab team-chat sync.
// Falls back to a no-op when the API is not available (e.g. older Safari).

export type TeamChatBroadcast =
  | { type: 'message:new'; payload: { conversationId: string; messageId: string } }
  | { type: 'message:edit'; payload: { messageId: string } }
  | { type: 'message:delete'; payload: { messageId: string; conversationId: string } }
  | { type: 'conversation:new'; payload: { conversationId: string } }
  | { type: 'conversation:update'; payload: { conversationId: string } }
  | { type: 'conversation:leave'; payload: { conversationId: string; userId: string } }
  | { type: 'read:update'; payload: { conversationId: string; userId: string } }

const CHANNEL_NAME = 'mediflow-team-chat'
const TAB_ID = `tab-${Math.random().toString(36).slice(2, 10)}`

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null
  if (typeof BroadcastChannel === 'undefined') return null
  if (channel) return channel
  try {
    channel = new BroadcastChannel(CHANNEL_NAME)
  } catch {
    channel = null
  }
  return channel
}

export function broadcastTeamChat(event: TeamChatBroadcast): void {
  const ch = getChannel()
  if (!ch) return
  try {
    ch.postMessage({ ...event, originId: TAB_ID })
  } catch {
    // ignore quota/serialization errors
  }
}

export function subscribeTeamChat(handler: (event: TeamChatBroadcast) => void): () => void {
  const ch = getChannel()
  if (!ch) return () => {}
  const listener = (event: MessageEvent) => {
    const data = event.data
    if (!data || data.originId === TAB_ID) return
    const { originId: originId, ...rest } = data
    void originId
    handler(rest as unknown as TeamChatBroadcast)
  }
  ch.addEventListener('message', listener)
  return () => ch.removeEventListener('message', listener)
}

export const TAB_ORIGIN_ID = TAB_ID
