import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are not set")
}

// Create a Postgres client with Supabase configuration
const connectionString = process.env.SUPABASE_URL
const client = postgres(connectionString, {
  max: 3, // Increase max connections
  idle_timeout: 30, // Increase idle timeout
  connect_timeout: 10, // Add explicit connect timeout
  max_lifetime: 60 * 30,
  ssl: "require",
  // Supabase requires these headers for authentication
  prepare: false,
  pass: process.env.SUPABASE_ANON_KEY,
  connection: {
    application_name: "ai-financial-advisor",
  },
  debug: process.env.NODE_ENV === "development", // Enable debug in development
})

// Create a Drizzle instance with the schema
export const db = drizzle(client, { schema })

// Export the database type with our schema
export type DrizzleDatabase = typeof db

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    // @ts-ignore - postgres-js types are not perfect
    await client`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}
