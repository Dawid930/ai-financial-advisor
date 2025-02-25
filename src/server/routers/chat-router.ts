import { z } from "zod"
import { j, privateProcedure } from "../jstack"
import { geminiService } from "../services/gemini"

// Input validation schemas
const contextSchema = z.object({
  loanAmount: z.number().optional(),
  loanDuration: z.number().optional(),
  monthlyIncome: z.number().optional(),
  creditScore: z.number().optional(),
})

const messageSchema = z.object({
  message: z.string().min(1),
  context: contextSchema.optional(),
})

export const chatRouter = j.router({
  send: privateProcedure.input(messageSchema).post(async ({ c, input }) => {
    try {
      const { message, context } = input

      // Get AI response using Gemini
      const aiResponse = await geminiService.sendMessage(message, context)
      return c.json(aiResponse)
    } catch (error) {
      console.error("Error processing message:", error)
      return c.json(
        { error: "Failed to process message" },
        error instanceof Error ? 500 : 400
      )
    }
  }),
})
