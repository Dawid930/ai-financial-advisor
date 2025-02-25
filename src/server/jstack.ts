import { jstack } from "jstack"
import { db } from "./db"

// Define environment type
interface Env {
  Bindings: {
    DATABASE_URL: string
  }
}

// Define the context type
interface Context {
  db: typeof db
  user?: {
    id: number
    clerkId: string
    email: string
  }
}

// Initialize jstack with context
export const j = jstack.init<Env>()

/**
 * Type-safely injects database into all procedures
 */
const databaseMiddleware = j.middleware(
  async (ctx: { next: (arg: { db: typeof db }) => Promise<any> }) => {
    return await ctx.next({ db })
  }
)

/**
 * Mocked auth middleware - will be replaced with Clerk later
 */
const authMiddleware = j.middleware(
  async (ctx: {
    next: (arg: {
      user: { id: number; clerkId: string; email: string }
    }) => Promise<any>
  }) => {
    // For now, we'll use a mock user
    const mockUser = {
      id: 1,
      clerkId: "mock_clerk_id",
      email: "mock@example.com",
    }

    return await ctx.next({ user: mockUser })
  }
)

/**
 * Public (unauthenticated) procedures
 */
export const publicProcedure = j.procedure.use(databaseMiddleware)

/**
 * Private (authenticated) procedures
 */
export const privateProcedure = publicProcedure.use(authMiddleware)
