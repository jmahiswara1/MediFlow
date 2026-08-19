import { useState } from 'react'
import { Send } from 'lucide-react'
import { useI18n } from '@/i18n/useI18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function AiChatPage() {
  const { t } = useI18n()
  const [messages, setMessages] = useState<string[]>([t('aiChat.welcome')])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, input.trim()])
    setInput('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('aiChat.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('aiChat.description')}</p>
      </div>

      <Card className="flex flex-1 flex-col">
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex flex-1 flex-col gap-2">
            {messages.map((message, index) => (
              <div key={index} className="bg-muted max-w-[75%] rounded-lg px-3 py-2 text-sm">
                {message}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              handleSend()
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t('aiChat.placeholder')}
            />
            <Button type="submit" size="icon">
              <Send className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
