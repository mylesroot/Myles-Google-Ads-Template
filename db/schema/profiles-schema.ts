/*
<ai_context>
Defines the database schema for profiles.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, decimal } from "drizzle-orm/pg-core"

export const membershipEnum = pgEnum("membership", [
  "free",
  "starter",
  "pro",
  "agency"
])

export const profilesTable = pgTable("profiles", {
  userId: text("user_id").primaryKey().notNull(),
  membership: membershipEnum("membership").notNull().default("free"),
  credits: decimal("credits", { precision: 10, scale: 1 }).default("5"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProfile = typeof profilesTable.$inferInsert
export type SelectProfile = typeof profilesTable.$inferSelect
