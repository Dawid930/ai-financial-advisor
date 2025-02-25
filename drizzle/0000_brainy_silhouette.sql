CREATE TABLE "chat_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_user_message" boolean NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_comparisons" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"loan_amount" text NOT NULL,
	"duration" integer NOT NULL,
	"results" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loan_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_name" text NOT NULL,
	"interest_rate" numeric(5, 2) NOT NULL,
	"min_amount" numeric(10, 2) NOT NULL,
	"max_amount" numeric(10, 2) NOT NULL,
	"min_duration" integer NOT NULL,
	"max_duration" integer NOT NULL,
	"fees" json NOT NULL,
	"requirements" json NOT NULL,
	"affiliate_link" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"bank_id" text NOT NULL,
	"amount" text NOT NULL,
	"duration" integer NOT NULL,
	"interest_rate" text NOT NULL,
	"monthly_payment" text NOT NULL,
	"total_payment" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"preferred_loan_amount" text,
	"preferred_duration" integer,
	"preferred_banks" jsonb,
	"monthly_income" text,
	"credit_score" integer,
	"notification_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text NOT NULL,
	"is_premium" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_comparisons" ADD CONSTRAINT "loan_comparisons_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_history_user_id_idx" ON "chat_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loan_comparisons_user_id_idx" ON "loan_comparisons" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "loan_bank_name_idx" ON "loan_offers" USING btree ("bank_name");--> statement-breakpoint
CREATE INDEX "loan_interest_rate_idx" ON "loan_offers" USING btree ("interest_rate");--> statement-breakpoint
CREATE INDEX "user_preferences_user_id_idx" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_clerk_id_idx" ON "users" USING btree ("clerk_id");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "users" USING btree ("email");