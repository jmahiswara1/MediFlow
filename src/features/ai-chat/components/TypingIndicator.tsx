import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-primary/10 border-primary/20 flex size-8 shrink-0 items-center justify-center rounded-xl border">
        <Bot className="text-primary size-4" />
      </div>

      <div className="bg-card text-card-foreground border-border/80 flex items-center gap-1.5 rounded-2xl rounded-tl-sm border px-4 py-3 shadow-xs">
        <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
        <span className="bg-primary size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
        <span className="bg-primary size-2 animate-bounce rounded-full" />
      </div>
    </div>
  )
}
