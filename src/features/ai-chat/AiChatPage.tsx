import { useRef, useState, useEffect } from 'react'
import {
  useChatStore,
  useCurrentUser,
  useHospitalId,
  useStockStore,
  useTransferStore,
} from '@/store'
import { processChatQuery } from './utils/chatRuleEngine'
import { ChatHeader } from './components/ChatHeader'
import { ChatEmptyState } from './components/ChatEmptyState'
import { ChatMessageItem } from './components/ChatMessageItem'
import { TypingIndicator } from './components/TypingIndicator'
import { QuickActionChips } from './components/QuickActionChips'
import { ChatInput } from './components/ChatInput'
import { AiInsightsTimeline } from './components/AiInsightsTimeline'
import type { ChatMessage } from '@/types'

export function AiChatPage() {
  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)
  const clearHistory = useChatStore((s) => s.clearHistory)

  const currentUser = useCurrentUser()
  const hospitalId = useHospitalId()
  const hospitals = useStockStore((s) => s.hospitals)
  const medicines = useStockStore((s) => s.medicines)
  const transfers = useTransferStore((s) => s.requests)

  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentHospital = hospitals.find((h) => h.id === hospitalId) ?? hospitals[0] ?? null

  // Scroll to bottom smoothly on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    addMessage(userMsg)

    // 2. Simulate Natural AI Thinking & Query Processing
    setIsTyping(true)

    setTimeout(() => {
      const response = processChatQuery(text, {
        currentUser,
        currentHospital,
        hospitals,
        medicines,
        transfers,
      })

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: response.text,
        card: response.card,
        createdAt: new Date().toISOString(),
      }

      addMessage(botMsg)
      setIsTyping(false)
    }, 500)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
      {/* 2-Column Split Grid */}
      <div className="grid h-full min-h-0 w-full flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-12">
        {/* Left Column: Chat Canvas (~68-70% / 8 of 12 cols) */}
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:col-span-8">
          {/* Top Header inside workspace */}
          <ChatHeader onReset={clearHistory} />

          {/* Main Floating Chat Canvas Card */}
          <div className="bg-card/85 border-border/80 relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-xs">
            {/* Messages / Empty State Area */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 pb-28 sm:p-5 sm:pb-32">
              {!hasMessages ? (
                <ChatEmptyState />
              ) : (
                <>
                  {messages.map((msg) => (
                    <ChatMessageItem
                      key={msg.id}
                      message={msg}
                      onSelectPrompt={handleSendMessage}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Floating Frosted Gradient Area */}
            <div className="from-card via-card/95 pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t to-transparent p-3 pt-8 backdrop-blur-[2px]">
              <div className="pointer-events-auto">
                <QuickActionChips onSelectPrompt={handleSendMessage} />
              </div>
              <div className="pointer-events-auto">
                <ChatInput onSend={handleSendMessage} disabled={isTyping} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insights Timeline (~30-32% / 4 of 12 cols) */}
        <div className="hidden h-full min-h-0 flex-col overflow-hidden lg:col-span-4 lg:flex">
          <AiInsightsTimeline onSelectPrompt={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}
