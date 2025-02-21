import { useState } from "react"

interface Message {
  id: string
  content: string
  isAi: boolean
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

interface ChatResponse {
  message: string
  suggestions?: string[]
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isAi: false,
      timestamp: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = (await response.json()) as ChatResponse

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isAi: true,
        timestamp: new Date(),
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      }))
    }
  }

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
  }
}
