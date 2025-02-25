import { chatHistory } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure } from "../jstack"

export const chatRouter = j.router({
  recentMessage: publicProcedure.query(async ({ c, ctx }) => {
    const { db } = ctx

    const [recentMessage] = await db
      .select()
      .from(chatHistory)
      .orderBy(desc(chatHistory.createdAt))
      .limit(1)

    return c.superjson(recentMessage ?? null)
  }),

  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string().min(1),
        userId: z.number(),
        isUserMessage: z.boolean().default(true),
        metadata: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, c, input }) => {
      const { message, userId, isUserMessage, metadata } = input
      const { db } = ctx

      const chatMessage = await db
        .insert(chatHistory)
        .values({
          message,
          userId,
          isUserMessage,
          metadata,
        })
        .returning()

      return c.superjson(chatMessage)
    }),
})
