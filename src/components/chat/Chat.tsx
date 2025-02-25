"use client"

import { useState } from "react"
import { ChatMessage } from "./ChatMessage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Bot, Sparkles } from "lucide-react"
import { useChat } from "@/hooks/useChat"
import { toast } from "sonner"

export function Chat() {
  const { messages, isLoading, error, sendMessage } = useChat()
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")

    try {
      await sendMessage(message)
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="flex flex-col h-[650px] w-full rounded-xl overflow-hidden border-gray-200 shadow-lg">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">AI Financial Advisor</h3>
          <p className="text-xs text-blue-100">Powered by Gemini AI</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your AI Financial Advisor
            </h3>
            <p className="text-gray-600 max-w-md">
              Ask me anything about loans, mortgages, financial planning, or how
              to improve your credit score.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isAi={message.isAi}
              timestamp={message.timestamp}
              suggestions={message.suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-pulse">
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            <p className="text-sm text-blue-700">Thinking...</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Input
            placeholder="Ask your financial question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-500">
            Error: {error}. Please try again.
          </p>
        )}
      </div>
    </Card>
  )
}
