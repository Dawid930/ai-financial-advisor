import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./db/schema"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js"

// Create a Postgres client with your database configuration
const client = postgres(process.env.DATABASE_URL || "")

// Create a Drizzle instance with the schema
const db = drizzle(client, { schema })

// Export the database type with our schema
export type DrizzleDatabase = PostgresJsDatabase<typeof schema>

// We don't actually use this client, it's just for type inference
client.end()
