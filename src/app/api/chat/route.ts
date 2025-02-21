import { NextResponse } from "next/server"
import { geminiService } from "@/server/services/gemini"

interface ChatRequest {
  message: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const response = await geminiService.sendMessage(message)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
