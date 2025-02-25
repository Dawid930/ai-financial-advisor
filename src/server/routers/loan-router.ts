import { z } from "zod"
import { loans, loanComparisons } from "../db/schema"
import { eq } from "drizzle-orm"
import { j, privateProcedure } from "../jstack"

// Input validation schemas
const loanComparisonSchema = z.object({
  loanAmount: z.number(),
  duration: z.number(),
  bankIds: z.array(z.string()),
})

const saveLoanSchema = z.object({
  bankId: z.string(),
  amount: z.number(),
  duration: z.number(),
  interestRate: z.number(),
  monthlyPayment: z.number(),
  totalPayment: z.number(),
})

export const loanRouter = j.router({
  // Get loan comparison
  compare: privateProcedure
    .input(loanComparisonSchema)
    .post(async ({ c, ctx, input }) => {
      const { db, user } = ctx
      const { loanAmount, duration, bankIds } = input

      // TODO: Implement actual loan comparison logic
      // For now, return mock data
      const mockComparisons = bankIds.map((bankId) => ({
        bankId,
        interestRate: 5 + Math.random() * 5,
        monthlyPayment: (loanAmount * (1 + 0.05)) / duration,
        totalPayment: loanAmount * (1 + 0.05),
      }))

      // Save comparison to database
      const [comparison] = await db
        .insert(loanComparisons)
        .values({
          userId: user.id,
          loanAmount: loanAmount.toString(),
          duration: duration,
          results: mockComparisons,
        })
        .returning()

      if (!comparison) {
        return c.json({ error: "Failed to save comparison" }, 500)
      }

      return c.json({
        comparisonId: comparison.id,
        results: mockComparisons,
      })
    }),

  // Save loan
  save: privateProcedure
    .input(saveLoanSchema)
    .post(async ({ c, ctx, input }) => {
      const { db, user } = ctx

      const [loan] = await db
        .insert(loans)
        .values({
          userId: user.id,
          bankId: input.bankId,
          amount: input.amount.toString(),
          duration: input.duration,
          interestRate: input.interestRate.toString(),
          monthlyPayment: input.monthlyPayment.toString(),
          totalPayment: input.totalPayment.toString(),
        })
        .returning()

      if (!loan) {
        return c.json({ error: "Failed to save loan" }, 500)
      }

      return c.json({ loan })
    }),

  // Get saved loans
  getSaved: privateProcedure.get(async ({ c, ctx }) => {
    const { db, user } = ctx

    const savedLoans = await db
      .select()
      .from(loans)
      .where(eq(loans.userId, user.id))

    return c.json({ loans: savedLoans })
  }),

  // Get comparison history
  getHistory: privateProcedure.get(async ({ c, ctx }) => {
    const { db, user } = ctx

    const history = await db
      .select()
      .from(loanComparisons)
      .where(eq(loanComparisons.userId, user.id))
      .orderBy(loanComparisons.createdAt)

    return c.json({ history })
  }),
})
