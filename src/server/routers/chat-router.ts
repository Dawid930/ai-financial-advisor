import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { chatHistory } from "../db/schema"
import { eq } from "drizzle-orm"
import { geminiService } from "../services/gemini"

// Types
type Role = "user" | "assistant"
interface ChatMessage {
  role: Role
  content: string
}

// Input validation schemas
const sendMessageSchema = z.object({
  message: z.string(),
  context: z
    .object({
      loanAmount: z.number().optional(),
      loanDuration: z.number().optional(),
      monthlyIncome: z.number().optional(),
      creditScore: z.number().optional(),
    })
    .optional(),
})

const systemPrompt = `You are an AI Financial Advisor specializing in loans and financial planning. 
Your role is to help users understand their loan options, calculate affordability, and make informed financial decisions.
You should:
1. Be professional but friendly
2. Always explain financial terms in simple language
3. Consider the user's financial situation when giving advice
4. Provide specific, actionable recommendations
5. Be transparent about the limitations of your advice
6. Encourage users to consult with financial professionals for complex decisions

When discussing loans, always consider:
- Loan amount and duration
- Interest rates and total cost
- User's income and credit score
- Monthly payment affordability
- Alternative options
- Hidden fees and terms`

export const chatRouter = j.router({
  // Send a message to the AI
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .post(async ({ ctx, c, input }) => {
      const { db } = ctx
      const { message, context } = input

      try {
        // Store user message
        await db.insert(chatHistory).values({
          message,
          isUserMessage: true,
          metadata: context || {},
          userId: 1, // TODO: Replace with actual user ID once auth is implemented
        })

        // Prepare conversation history for context
        const recentMessages = await db
          .select()
          .from(chatHistory)
          .where(eq(chatHistory.userId, 1)) // TODO: Replace with actual user ID
          .orderBy(chatHistory.createdAt)
          .limit(10)

        // Format conversation for the AI
        const conversation: ChatMessage[] = recentMessages.map((msg) => ({
          role: msg.isUserMessage ? "user" : "assistant",
          content: msg.message,
        }))

        // Start a new chat session with history and system prompt
        geminiService.startChat([
          { role: "assistant" as const, content: systemPrompt },
          ...conversation,
        ])

        // Get AI response
        const aiResponse = await geminiService.sendMessage(message, context)

        // Store AI response
        await db.insert(chatHistory).values({
          message: aiResponse.message,
          isUserMessage: false,
          metadata: {
            suggestions: aiResponse.suggestions,
            context,
          },
          userId: 1, // TODO: Replace with actual user ID
        })

        return c.json(aiResponse)
      } catch (error) {
        console.error("Chat error:", error)
        throw new Error("Failed to process message")
      }
    }),

  // Get chat history
  getHistory: publicProcedure
    .input(z.number().optional())
    .get(async ({ ctx, c, input: limit = 50 }) => {
      const { db } = ctx

      const messages = await db
        .select()
        .from(chatHistory)
        .where(eq(chatHistory.userId, 1)) // TODO: Replace with actual user ID
        .orderBy(chatHistory.createdAt)
        .limit(limit)

      return c.json({ messages })
    }),

  // Clear chat history
  clearHistory: publicProcedure.post(async ({ ctx, c }) => {
    const { db } = ctx

    await db.delete(chatHistory).where(eq(chatHistory.userId, 1)) // TODO: Replace with actual user ID

    return c.json({ message: "Chat history cleared" })
  }),
})
