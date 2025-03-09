/*
<ai_context>
Defines the database schema for exports.
</ai_context>
*/

import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { projectsTable } from "./projects-schema"

export const exportTypeEnum = pgEnum("export_type", ["csv", "google_ads_api"])

export const exportsTable = pgTable("exports", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .notNull(),
  exportType: exportTypeEnum("export_type").notNull(),
  fileUrl: varchar("file_url"),
  campaignId: varchar("campaign_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertExport = typeof exportsTable.$inferInsert
export type SelectExport = typeof exportsTable.$inferSelect
