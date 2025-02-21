import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
  boolean,
  decimal,
  integer,
  json,
  varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    isPremium: boolean("is_premium").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_clerk_id_idx").on(table.clerkId),
    index("user_email_idx").on(table.email),
  ]
)

export const loanOffers = pgTable(
  "loan_offers",
  {
    id: serial("id").primaryKey(),
    bankName: text("bank_name").notNull(),
    interestRate: decimal("interest_rate", {
      precision: 5,
      scale: 2,
    }).notNull(),
    minAmount: decimal("min_amount", { precision: 10, scale: 2 }).notNull(),
    maxAmount: decimal("max_amount", { precision: 10, scale: 2 }).notNull(),
    minDuration: integer("min_duration").notNull(), // in months
    maxDuration: integer("max_duration").notNull(), // in months
    fees: json("fees").notNull(), // Store various fees as JSON
    requirements: json("requirements").notNull(), // Store eligibility requirements as JSON
    affiliateLink: text("affiliate_link"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("loan_bank_name_idx").on(table.bankName),
    index("loan_interest_rate_idx").on(table.interestRate),
  ]
)

export const userPreferences = pgTable(
  "user_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    preferredLoanAmount: decimal("preferred_loan_amount", {
      precision: 10,
      scale: 2,
    }),
    preferredDuration: integer("preferred_duration"), // in months
    preferredBanks: json("preferred_banks"), // Array of preferred bank names
    monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }),
    creditScore: integer("credit_score"),
    notificationEnabled: boolean("notification_enabled")
      .default(true)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("user_preferences_user_id_idx").on(table.userId)]
)

// For storing chat history
export const chatHistory = pgTable(
  "chat_history",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    message: text("message").notNull(),
    isUserMessage: boolean("is_user_message").notNull(),
    metadata: json("metadata"), // Store any additional message metadata
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chat_history_user_id_idx").on(table.userId)]
)

// For tracking loan comparisons
export const loanComparisons = pgTable(
  "loan_comparisons",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    selectedLoans: json("selected_loans").notNull(), // Array of loan IDs being compared
    comparisonCriteria: json("comparison_criteria").notNull(), // User's comparison parameters
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("loan_comparisons_user_id_idx").on(table.userId)]
)
