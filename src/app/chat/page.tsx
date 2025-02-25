import { Chat } from "@/components/chat/Chat"
import { Sparkles, MessageSquare, Info } from "lucide-react"

export default function ChatPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Financial Advisor Chat</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get personalized financial advice from our AI advisor. Ask questions
            about loans, budgeting, investments, or any other financial topics.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-3">
            <Chat />
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">
                  Tips for better results
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Be specific about your financial goals</li>
                <li>• Provide details about your income and expenses</li>
                <li>• Ask about specific loan types you're interested in</li>
                <li>• Share your credit score range for personalized advice</li>
                <li>• Ask for explanations of financial terms</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Sample questions</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • "What's the difference between fixed and variable rate
                  loans?"
                </li>
                <li>• "How can I improve my credit score?"</li>
                <li>
                  • "What loan amount can I afford with a $5,000 monthly
                  income?"
                </li>
                <li>• "Should I choose a 15-year or 30-year mortgage?"</li>
                <li>• "What documents do I need for a loan application?"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
