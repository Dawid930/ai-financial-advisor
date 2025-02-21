import { z } from "zod"
import { j, publicProcedure } from "../jstack"
import { users, userPreferences } from "../db/schema"
import { eq } from "drizzle-orm"
import { Context } from "hono"
import { DrizzleDatabase } from "../types"
import { ContextWithSuperJSON } from "jstack"

// Input validation schemas
const createUserSchema = z.object({
  clerkId: z.string(),
  email: z.string().email(),
})

const updatePreferencesSchema = z.object({
  preferredLoanAmount: z.number().optional(),
  preferredDuration: z.number().optional(),
  preferredBanks: z.array(z.string()).optional(),
  monthlyIncome: z.number().optional(),
  creditScore: z.number().optional(),
  notificationEnabled: z.boolean().optional(),
})

// Create authenticated procedure
const authMiddleware = j.middleware(async ({ c, next }) => {
  // TODO: Implement Clerk authentication
  // For now, we'll use a mock user
  const mockUser = {
    clerkId: "mock_clerk_id",
    email: "mock@example.com",
  }

  return next({ user: mockUser })
})

const privateProcedure = publicProcedure.use(authMiddleware)

interface RouterContext {
  db: DrizzleDatabase
  user: {
    clerkId: string
    email: string
  }
}

export const userRouter = j.router({
  // Create a new user (called after Clerk authentication)
  create: publicProcedure
    .input(createUserSchema)
    .post(async ({ ctx, c, input }) => {
      const { db } = ctx

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, input.clerkId),
      })

      if (existingUser) {
        throw new Error("User already exists")
      }

      // Create new user
      const [user] = await db
        .insert(users)
        .values({
          clerkId: input.clerkId,
          email: input.email,
        })
        .returning()

      return c.json({ user })
    }),

  // Get user profile
  getProfile: privateProcedure.get(async ({ ctx, c }) => {
    const { db, user } = ctx

    const userProfile = await db.query.users.findFirst({
      where: eq(users.clerkId, user.clerkId),
      with: {
        preferences: true,
      },
    })

    if (!userProfile) {
      throw new Error("User not found")
    }

    return c.json({ user: userProfile })
  }),

  // Update user preferences
  updatePreferences: privateProcedure
    .input(updatePreferencesSchema)
    .post(async ({ ctx, c, input }) => {
      const { db, user } = ctx

      // Get user ID from clerk ID
      const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.clerkId),
      })

      if (!dbUser) {
        throw new Error("User not found")
      }

      // Convert number values to strings for database
      const dbInput = {
        ...input,
        preferredLoanAmount: input.preferredLoanAmount?.toString(),
        monthlyIncome: input.monthlyIncome?.toString(),
      }

      // Update or create preferences
      const [preferences] = await db
        .insert(userPreferences)
        .values({
          userId: dbUser.id,
          ...dbInput,
        })
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: dbInput,
        })
        .returning()

      return c.json({ preferences })
    }),

  // Delete user account
  delete: privateProcedure.post(async ({ ctx, c }) => {
    const { db, user } = ctx

    await db.delete(users).where(eq(users.clerkId, user.clerkId))

    return c.json({ message: "User deleted successfully" })
  }),
})
