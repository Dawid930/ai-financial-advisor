import { Chat } from "@/components/chat/Chat"

export default function ChatPage() {
  return (
    <main className="container mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-center">
          AI Financial Advisor Chat
        </h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          Get personalized financial advice from our AI advisor. Ask questions
          about budgeting, investments, savings, or any other financial topics.
        </p>
        <Chat />
      </div>
    </main>
  )
}
