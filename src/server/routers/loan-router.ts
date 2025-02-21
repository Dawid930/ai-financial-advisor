import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { loanOffers, loanComparisons } from "../db/schema"
import { eq, and, between, desc, sql } from "drizzle-orm"

// Input validation schemas
const createLoanOfferSchema = z.object({
  bankName: z.string(),
  interestRate: z.number(),
  minAmount: z.number(),
  maxAmount: z.number(),
  minDuration: z.number(),
  maxDuration: z.number(),
  fees: z.object({
    originationFee: z.number().optional(),
    lateFee: z.number().optional(),
    prepaymentFee: z.number().optional(),
  }),
  requirements: z.object({
    minCreditScore: z.number(),
    minIncome: z.number(),
    employmentStatus: z.string(),
    additionalRequirements: z.array(z.string()).optional(),
  }),
  affiliateLink: z.string().optional(),
})

const searchLoansSchema = z.object({
  amount: z.number(),
  duration: z.number(),
  creditScore: z.number().optional(),
  monthlyIncome: z.number().optional(),
})

const compareLoanSchema = z.object({
  loanIds: z.array(z.number()),
  criteria: z.object({
    amount: z.number(),
    duration: z.number(),
    creditScore: z.number().optional(),
    monthlyIncome: z.number().optional(),
  }),
})

export const loanRouter = j.router({
  // Create a new loan offer
  create: publicProcedure
    .input(createLoanOfferSchema)
    .post(async ({ ctx, c, input }) => {
      const { db } = ctx

      // Convert number values to strings for database
      const dbInput = {
        ...input,
        interestRate: input.interestRate.toString(),
        minAmount: input.minAmount.toString(),
        maxAmount: input.maxAmount.toString(),
      }

      const [loanOffer] = await db
        .insert(loanOffers)
        .values(dbInput)
        .returning()

      return c.json({ loanOffer })
    }),

  // Search for loans based on criteria
  search: publicProcedure
    .input(searchLoansSchema)
    .get(async ({ ctx, c, input }) => {
      const { db } = ctx
      const { amount, duration, creditScore, monthlyIncome } = input

      // Build base query conditions
      let conditions = [
        eq(loanOffers.isActive, true),
        sql`${loanOffers.minAmount}::numeric <= ${amount.toString()}::numeric`,
        sql`${loanOffers.maxAmount}::numeric >= ${amount.toString()}::numeric`,
        sql`${loanOffers.minDuration} <= ${duration}`,
        sql`${loanOffers.maxDuration} >= ${duration}`,
      ]

      // Add credit score condition if provided
      if (creditScore) {
        conditions.push(
          sql`(${loanOffers.requirements}->>'minCreditScore')::int <= ${creditScore}`
        )
      }

      // Add monthly income condition if provided
      if (monthlyIncome) {
        conditions.push(
          sql`(${loanOffers.requirements}->>'minIncome')::int <= ${monthlyIncome}`
        )
      }

      const loans = await db
        .select()
        .from(loanOffers)
        .where(and(...conditions))
        .orderBy(desc(loanOffers.interestRate))
        .limit(10)

      return c.json({ loans })
    }),

  // Compare specific loans
  compare: publicProcedure
    .input(compareLoanSchema)
    .post(async ({ ctx, c, input }) => {
      const { db } = ctx
      const { loanIds, criteria } = input

      // Get the selected loans
      const selectedLoans = await db
        .select()
        .from(loanOffers)
        .where(
          and(
            eq(loanOffers.isActive, true),
            sql`${loanOffers.id} = ANY(${loanIds})`
          )
        )

      if (!selectedLoans.length) {
        throw new Error("No active loans found for comparison")
      }

      // Calculate monthly payments and total costs
      const comparison = selectedLoans.map((loan) => {
        const monthlyInterestRate = parseFloat(loan.interestRate) / 12 / 100
        const numberOfPayments = criteria.duration

        // Calculate monthly payment using the loan formula
        const monthlyPayment =
          (criteria.amount * monthlyInterestRate) /
          (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))

        // Calculate total cost
        const totalCost = monthlyPayment * numberOfPayments

        return {
          ...loan,
          calculatedDetails: {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalCost: Math.round(totalCost * 100) / 100,
            totalInterest:
              Math.round((totalCost - criteria.amount) * 100) / 100,
          },
        }
      })

      // Sort by total cost
      comparison.sort(
        (a, b) => a.calculatedDetails.totalCost - b.calculatedDetails.totalCost
      )

      // Store comparison if user is authenticated
      const user = (ctx as any).user
      if (user?.id) {
        await db.insert(loanComparisons).values({
          userId: user.id,
          selectedLoans: loanIds,
          comparisonCriteria: criteria,
        })
      }

      return c.json({ comparison })
    }),

  // Get loan details by ID
  getById: publicProcedure
    .input(z.number())
    .get(async ({ ctx, c, input: id }) => {
      const { db } = ctx

      const loan = await db
        .select()
        .from(loanOffers)
        .where(eq(loanOffers.id, id))
        .limit(1)

      if (!loan.length) {
        throw new Error("Loan not found")
      }

      return c.json({ loan: loan[0] })
    }),
})
