import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GenerativeModel,
  ChatSession,
  GenerationConfig,
} from "@google/generative-ai"

// Type for chat message
interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Configuration for the AI model
const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
}

class GeminiService {
  private model: GenerativeModel
  private chatSession: ChatSession | null = null

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables")
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
    })
  }

  /**
   * Starts a new chat session with the given history
   * @param history Previous chat messages
   */
  public startChat(history: ChatMessage[] = []) {
    this.chatSession = this.model.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: msg.content,
      })),
    })
    return this.chatSession
  }

  /**
   * Sends a message to the AI and gets a response
   * @param message The message to send
   * @param context Additional context about the user's financial situation
   * @returns The AI's response
   */
  public async sendMessage(
    message: string,
    context?: {
      loanAmount?: number
      loanDuration?: number
      monthlyIncome?: number
      creditScore?: number
    }
  ) {
    if (!this.chatSession) {
      this.startChat()
    }

    // Add context to the message if provided
    const fullMessage = context
      ? `User Context:
         - Loan Amount: ${context.loanAmount || "Not specified"}
         - Loan Duration: ${context.loanDuration || "Not specified"}
         - Monthly Income: ${context.monthlyIncome || "Not specified"}
         - Credit Score: ${context.creditScore || "Not specified"}
         
         User Message: ${message}`
      : message

    try {
      const result = await this.chatSession!.sendMessage(fullMessage)
      const response = await result.response
      const text = response.text()

      return {
        message: text,
        suggestions: this.generateSuggestions(text),
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error)
      throw new Error("Failed to get AI response")
    }
  }

  /**
   * Generates contextual suggestions based on the AI's response
   * @param response The AI's response text
   * @returns Array of suggested next user actions
   */
  private generateSuggestions(response: string): string[] {
    // TODO: Implement more sophisticated suggestion generation
    // For now, return static suggestions
    return [
      "Tell me more about your loan requirements",
      "Would you like to calculate loan affordability?",
      "Let's review your financial situation",
    ]
  }
}

// Export a singleton instance
export const geminiService = new GeminiService()
