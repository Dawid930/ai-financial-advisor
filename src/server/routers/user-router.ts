import { z } from "zod"
import { users, userPreferences } from "../db/schema"
import { eq } from "drizzle-orm"
import { j, privateProcedure, publicProcedure } from "../jstack"

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

export const userRouter = j.router({
  // Create a new user (called after Clerk authentication)
  create: publicProcedure
    .input(createUserSchema)
    .post(async ({ c, ctx, input }) => {
      const { db } = ctx

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, input.clerkId),
      })

      if (existingUser) {
        return c.json({ error: "User already exists" }, 400)
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
  getProfile: privateProcedure.get(async ({ c, ctx }) => {
    const { db, user } = ctx

    const userProfile = await db.query.users.findFirst({
      where: eq(users.clerkId, user.clerkId),
      with: {
        preferences: true,
      },
    })

    if (!userProfile) {
      return c.json({ error: "User not found" }, 404)
    }

    return c.json({ user: userProfile })
  }),

  // Update user preferences
  updatePreferences: privateProcedure
    .input(updatePreferencesSchema)
    .post(async ({ c, ctx, input }) => {
      const { db, user } = ctx

      // Get user ID from clerk ID
      const dbUser = await db.query.users.findFirst({
        where: eq(users.clerkId, user.clerkId),
      })

      if (!dbUser) {
        return c.json({ error: "User not found" }, 404)
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
  delete: privateProcedure.post(async ({ c, ctx }) => {
    const { db, user } = ctx

    await db.delete(users).where(eq(users.clerkId, user.clerkId))

    return c.json({ message: "User deleted successfully" })
  }),
})
