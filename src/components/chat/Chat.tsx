"use client"

import { useState } from "react"
import { ChatMessage } from "./ChatMessage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useChat } from "@/hooks/useChat"
import { toast } from "sonner"

export function Chat() {
  const { messages, isLoading, error, sendMessage } = useChat()
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")

    await sendMessage(message)

    if (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a conversation with your AI Financial Advisor
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isAi={message.isAi}
              timestamp={message.timestamp}
            />
          ))
        )}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask your financial question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
