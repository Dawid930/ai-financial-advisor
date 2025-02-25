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
  role: "user" | "model" | "system" | "function"
  content: string
}

// Configuration for the AI model
const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
}

// System prompt to guide the AI's behavior
const SYSTEM_PROMPT = `You are an expert AI Financial Advisor specializing in loan comparisons and financial guidance. Your role is to:

1. Help users understand different loan options and their implications
2. Provide personalized loan recommendations based on user's financial situation
3. Explain financial concepts in simple, clear terms
4. Offer practical advice for improving loan eligibility
5. Help users make informed financial decisions

Guidelines:
- Always be professional and empathetic
- Explain complex terms in simple language
- Focus on practical, actionable advice
- Consider the user's full financial context
- Highlight both benefits and risks
- Never make promises about loan approval
- Be transparent about limitations of advice

When making suggestions:
- Focus on loan-related topics
- Suggest exploring different loan types
- Ask about financial goals
- Recommend ways to improve credit score
- Discuss budgeting and affordability

Remember: You are an advisor, not a lender. Always encourage users to verify information with actual financial institutions.`

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
   * Starts a new chat session with the system prompt
   */
  public startChat() {
    this.chatSession = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text:
                "[System Instructions] " +
                SYSTEM_PROMPT +
                "\n\nPlease acknowledge your role and confirm you understand these instructions.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand my role as an AI Financial Advisor. I will follow the guidelines provided and focus on helping users with their loan-related queries while maintaining professionalism and providing clear, actionable advice. I will be empathetic, explain concepts clearly, and always encourage users to verify information with financial institutions. I'm ready to assist with loan comparisons and financial guidance.",
            },
          ],
        },
      ],
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
         - Loan Amount: ${
           context.loanAmount
             ? `$${context.loanAmount.toLocaleString()}`
             : "Not specified"
         }
         - Loan Duration: ${
           context.loanDuration
             ? `${context.loanDuration} months`
             : "Not specified"
         }
         - Monthly Income: ${
           context.monthlyIncome
             ? `$${context.monthlyIncome.toLocaleString()}`
             : "Not specified"
         }
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
    // Common loan-related suggestions
    return [
      "Tell me more about your loan requirements",
      "Would you like to compare different loan types?",
      "Let's discuss your credit score and how to improve it",
      "Would you like to calculate your loan affordability?",
      "Shall we explore ways to improve your loan application?",
    ]
  }
}

// Export a singleton instance
export const geminiService = new GeminiService()
