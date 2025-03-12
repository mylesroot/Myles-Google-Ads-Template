/*
<ai_context>
Defines the database schema for blog categories.
</ai_context>
*/

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const categoriesTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertCategory = typeof categoriesTable.$inferInsert
export type SelectCategory = typeof categoriesTable.$inferSelect
