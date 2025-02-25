import { useState } from "react"

interface Message {
  id: string
  content: string
  isAi: boolean
  timestamp: Date
  suggestions?: string[]
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

interface ChatResponse {
  message: string
  suggestions: string[]
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })

  const sendMessage = async (
    content: string,
    context?: {
      loanAmount?: number
      loanDuration?: number
      monthlyIncome?: number
      creditScore?: number
    }
  ) => {
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
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = (await res.json()) as ChatResponse

      if (!data.message || !data.suggestions) {
        throw new Error("Invalid response format")
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isAi: true,
        timestamp: new Date(),
        suggestions: data.suggestions,
      }

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }))

      return data
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Something went wrong",
      }))
      throw error
    }
  }

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
  }
}
