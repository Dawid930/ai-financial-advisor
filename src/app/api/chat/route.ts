import { NextResponse } from "next/server"
import app from "@/server/index"

export async function GET() {
  try {
    console.log("GET: Creating request to /api/chat")
    const req = new Request("http://localhost:3000/api/chat", {
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("GET: Fetching with Hono app")
    const res = await app.fetch(req)
    console.log("GET: Response status:", res.status)
    const data = await res.json()
    console.log("GET: Response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST: Parsing request body")
    const body = await request.json()
    console.log("POST: Request body:", body)

    console.log("POST: Creating request to /api/chat")
    const req = new Request("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("POST: Fetching with Hono app")
    const res = await app.fetch(req)
    console.log("POST: Response status:", res.status)
    const data = await res.json()
    console.log("POST: Response data:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error sending message:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack)
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
