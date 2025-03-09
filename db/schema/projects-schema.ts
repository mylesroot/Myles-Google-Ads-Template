/*
<ai_context>
Defines the database schema for projects.
</ai_context>
*/

import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core"
import { profilesTable } from "./profiles-schema"

export const projectsTable = pgTable("projects", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .references(() => profilesTable.userId)
    .notNull(),
  urls: text("urls").array().notNull(),
  scrapedData: jsonb("scraped_data"),
  generatedCopy: jsonb("generated_copy"),
  status: varchar("status").default("pending"), // Options: pending, scraping, generating, completed, review
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertProject = typeof projectsTable.$inferInsert
export type SelectProject = typeof projectsTable.$inferSelect
