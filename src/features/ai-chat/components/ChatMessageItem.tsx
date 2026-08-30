import { Bot, User as UserIcon } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { StockStatusCardView } from './cards/StockStatusCardView'
import { HospitalRecCardView } from './cards/HospitalRecCardView'
import { PredictionCardView } from './cards/PredictionCardView'
import { TransferCardView } from './cards/TransferCardView'
import { HelpCardView } from './cards/HelpCardView'
import { formatRelative } from '@/utils/dateHelpers'

interface ChatMessageItemProps {
  message: ChatMessage
  onSelectPrompt?: (prompt: string) => void
}

export function ChatMessageItem({ message, onSelectPrompt }: ChatMessageItemProps) {
  const isUser = message.role === 'user'

  const formattedTime = (() => {
    try {
      const d = new Date(message.createdAt)
      return isNaN(d.getTime())
        ? 'Baru saja'
        : `${formatRelative(message.createdAt)} • ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
    } catch {
      return 'Baru saja'
    }
  })()

  // Render markdown bold text formatted cleanly
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-foreground font-bold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  if (isUser) {
    return (
      <div className="flex max-w-[85%] flex-col items-end gap-1.5 self-end sm:max-w-[75%]">
        <div className="flex items-start gap-2.5">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-xs leading-relaxed font-medium shadow-xs">
            {message.text}
          </div>
          <div className="bg-primary/20 text-primary mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl">
            <UserIcon className="size-4" />
          </div>
        </div>
        <span className="text-muted-foreground pr-10 text-[10px]">{formattedTime}</span>
      </div>
    )
  }

  return (
    <div className="flex max-w-full flex-col items-start gap-1.5 self-start sm:max-w-[90%]">
      <div className="flex w-full items-start gap-2.5">
        <div className="bg-primary/10 border-primary/25 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border shadow-2xs">
          <Bot className="text-primary size-4" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Text Bubble */}
          {message.text && (
            <div className="bg-card text-card-foreground border-border/80 rounded-2xl rounded-tl-sm border p-4 text-xs leading-relaxed shadow-xs">
              <p className="text-foreground/90">{renderFormattedText(message.text)}</p>
            </div>
          )}

          {/* Rich Card Renderer */}
          {message.card && (
            <div className="w-full">
              {message.card.type === 'stock-status' && <StockStatusCardView card={message.card} />}
              {message.card.type === 'hospital-recommendation' && (
                <HospitalRecCardView card={message.card} />
              )}
              {message.card.type === 'prediction' && <PredictionCardView card={message.card} />}
              {message.card.type === 'transfer' && <TransferCardView card={message.card} />}
              {message.card.type === 'help' && (
                <HelpCardView card={message.card} onSelectPrompt={onSelectPrompt} />
              )}
            </div>
          )}
        </div>
      </div>

      <span className="text-muted-foreground pl-10 text-[10px]">{formattedTime}</span>
    </div>
  )
}
