import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowUp, Mic, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const { t } = useI18n()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }, [disabled])

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || disabled) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleVoiceInput = () => {
    toast.info('Input suara segera hadir di pembaruan berikutnya')
  }

  const handlePlusAction = () => {
    toast.info('Pilih template prompt dari menu rekomendasi di atas')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-foreground border-border/80 focus-within:border-primary/60 focus-within:ring-primary/15 flex items-center gap-2 rounded-full border px-2 py-1.5 shadow-md backdrop-blur-xl transition-all focus-within:ring-2"
    >
      {/* Plus Action Button */}
      <button
        type="button"
        onClick={handlePlusAction}
        className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        title="Opsi Prompt"
      >
        <Plus className="size-4" />
      </button>

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('aiChat.placeholder')}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent px-2 text-xs outline-none disabled:opacity-50"
      />

      {/* Voice Mic Button */}
      <button
        type="button"
        onClick={handleVoiceInput}
        className="text-muted-foreground hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
        title="Input Suara"
      >
        <Mic className="size-4" />
      </button>

      {/* Send Button */}
      <Button
        type="submit"
        size="sm"
        disabled={!input.trim() || disabled}
        className="size-8 shrink-0 rounded-full p-0 shadow-xs"
      >
        <ArrowUp className="size-4 stroke-[2.5]" />
      </Button>
    </form>
  )
}
