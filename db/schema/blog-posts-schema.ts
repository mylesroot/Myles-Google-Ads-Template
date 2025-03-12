/*
<ai_context>
Defines the database schema for blog posts.
</ai_context>
*/

import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { categoriesTable } from "./blog-categories-schema"

export const postStatusEnum = pgEnum("post_status", ["draft", "published"])

export const postsTable = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  status: postStatusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  categoryId: uuid("category_id").references(() => categoriesTable.id),
  tags: text("tags").array(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertPost = typeof postsTable.$inferInsert
export type SelectPost = typeof postsTable.$inferSelect
