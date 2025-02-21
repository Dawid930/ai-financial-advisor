import { j } from "../jstack"
import { users } from "../db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs"
import { getAuth } from "@clerk/nextjs/server"
import type { DrizzleDatabase } from "../types"
import type { EmailAddress } from "@clerk/nextjs/server"

interface AuthContext {
  db: DrizzleDatabase
  user: {
    id: number
    clerkId: string
    email: string
    isPremium: boolean
  }
}

// Create authentication middleware
export const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    // Get the auth context from Clerk
    const { userId } = await getAuth(c.req)

    if (!userId) {
      throw new Error("Unauthorized")
    }

    // Get user from our database
    const { db } = c.var as { db: DrizzleDatabase }
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    })

    // If user doesn't exist in our database, create them
    if (!dbUser) {
      // Get user data from auth context
      const { emailAddresses, primaryEmailAddressId } = await auth().getUser(
        userId
      )
      const primaryEmail = emailAddresses.find(
        (email: EmailAddress) => email.id === primaryEmailAddressId
      )

      if (!primaryEmail) {
        throw new Error("No primary email found")
      }

      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: primaryEmail.emailAddress,
        })
        .returning()

      if (!newUser) {
        throw new Error("Failed to create user")
      }

      return next({
        user: {
          id: newUser.id,
          clerkId: newUser.clerkId,
          email: newUser.email,
          isPremium: newUser.isPremium,
        },
      })
    }

    // Return user data to the next middleware/handler
    return next({
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        isPremium: dbUser.isPremium,
      },
    })
  } catch (error) {
    throw new Error("Authentication failed")
  }
})

// Create authenticated procedure
export const privateProcedure = j.procedure.use(authMiddleware)
