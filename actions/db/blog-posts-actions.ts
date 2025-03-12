"use server"

import { db } from "@/db/db"
import {
  postsTable,
  InsertPost,
  SelectPost,
  postStatusEnum,
  categoriesTable
} from "@/db/schema"
import { ActionState } from "@/types"
import { eq, desc, and, like, isNull, not, or, sql } from "drizzle-orm"

export async function createPostAction(
  data: InsertPost
): Promise<ActionState<SelectPost>> {
  try {
    const [newPost] = await db.insert(postsTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Post created successfully",
      data: newPost
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return { isSuccess: false, message: "Failed to create post" }
  }
}

export async function getPostsAction(
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      orderBy: [desc(postsTable.createdAt)],
      limit,
      offset
    })
    return {
      isSuccess: true,
      message: "Posts retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting posts:", error)
    return { isSuccess: false, message: "Failed to get posts" }
  }
}

export async function getPublishedPostsAction(
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: eq(postsTable.status, "published"),
      orderBy: [desc(postsTable.publishedAt)],
      limit,
      offset
    })
    return {
      isSuccess: true,
      message: "Published posts retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting published posts:", error)
    return { isSuccess: false, message: "Failed to get published posts" }
  }
}

export async function getPostByIdAction(
  id: string
): Promise<ActionState<SelectPost>> {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(postsTable.id, id)
    })

    if (!post) {
      return { isSuccess: false, message: "Post not found" }
    }

    return {
      isSuccess: true,
      message: "Post retrieved successfully",
      data: post
    }
  } catch (error) {
    console.error("Error getting post by id:", error)
    return { isSuccess: false, message: "Failed to get post" }
  }
}

export async function getPostBySlugAction(
  slug: string
): Promise<ActionState<SelectPost>> {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(postsTable.slug, slug)
    })

    if (!post) {
      return { isSuccess: false, message: "Post not found" }
    }

    return {
      isSuccess: true,
      message: "Post retrieved successfully",
      data: post
    }
  } catch (error) {
    console.error("Error getting post by slug:", error)
    return { isSuccess: false, message: "Failed to get post" }
  }
}

export async function getPublishedPostBySlugAction(
  slug: string
): Promise<ActionState<SelectPost>> {
  try {
    const post = await db.query.posts.findFirst({
      where: and(eq(postsTable.slug, slug), eq(postsTable.status, "published"))
    })

    if (!post) {
      return { isSuccess: false, message: "Published post not found" }
    }

    return {
      isSuccess: true,
      message: "Published post retrieved successfully",
      data: post
    }
  } catch (error) {
    console.error("Error getting published post by slug:", error)
    return { isSuccess: false, message: "Failed to get published post" }
  }
}

export async function getPostsByCategoryAction(
  categoryId: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: eq(postsTable.categoryId, categoryId),
      orderBy: [desc(postsTable.createdAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Posts by category retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting posts by category:", error)
    return { isSuccess: false, message: "Failed to get posts by category" }
  }
}

export async function getPublishedPostsByCategoryAction(
  categoryId: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: and(
        eq(postsTable.categoryId, categoryId),
        eq(postsTable.status, "published")
      ),
      orderBy: [desc(postsTable.publishedAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Published posts by category retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting published posts by category:", error)
    return {
      isSuccess: false,
      message: "Failed to get published posts by category"
    }
  }
}

export async function getPublishedPostsByCategorySlugAction(
  categorySlug: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const category = await db.query.categories.findFirst({
      where: eq(categoriesTable.slug, categorySlug)
    })

    if (!category) {
      return { isSuccess: false, message: "Category not found" }
    }

    const posts = await db.query.posts.findMany({
      where: and(
        eq(postsTable.categoryId, category.id),
        eq(postsTable.status, "published")
      ),
      orderBy: [desc(postsTable.publishedAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Published posts by category slug retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting published posts by category slug:", error)
    return {
      isSuccess: false,
      message: "Failed to get published posts by category slug"
    }
  }
}

export async function updatePostAction(
  id: string,
  data: Partial<InsertPost>
): Promise<ActionState<SelectPost>> {
  try {
    // If status is being updated to published and publishedAt is not set, set it to now
    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date()
    }

    const [updatedPost] = await db
      .update(postsTable)
      .set(data)
      .where(eq(postsTable.id, id))
      .returning()

    if (!updatedPost) {
      return { isSuccess: false, message: "Post not found to update" }
    }

    return {
      isSuccess: true,
      message: "Post updated successfully",
      data: updatedPost
    }
  } catch (error) {
    console.error("Error updating post:", error)
    return { isSuccess: false, message: "Failed to update post" }
  }
}

export async function publishPostAction(
  id: string
): Promise<ActionState<SelectPost>> {
  try {
    const [publishedPost] = await db
      .update(postsTable)
      .set({
        status: "published",
        publishedAt: new Date()
      })
      .where(eq(postsTable.id, id))
      .returning()

    if (!publishedPost) {
      return { isSuccess: false, message: "Post not found to publish" }
    }

    return {
      isSuccess: true,
      message: "Post published successfully",
      data: publishedPost
    }
  } catch (error) {
    console.error("Error publishing post:", error)
    return { isSuccess: false, message: "Failed to publish post" }
  }
}

export async function unpublishPostAction(
  id: string
): Promise<ActionState<SelectPost>> {
  try {
    const [unpublishedPost] = await db
      .update(postsTable)
      .set({
        status: "draft"
      })
      .where(eq(postsTable.id, id))
      .returning()

    if (!unpublishedPost) {
      return { isSuccess: false, message: "Post not found to unpublish" }
    }

    return {
      isSuccess: true,
      message: "Post unpublished successfully",
      data: unpublishedPost
    }
  } catch (error) {
    console.error("Error unpublishing post:", error)
    return { isSuccess: false, message: "Failed to unpublish post" }
  }
}

export async function deletePostAction(id: string): Promise<ActionState<void>> {
  try {
    await db.delete(postsTable).where(eq(postsTable.id, id))
    return {
      isSuccess: true,
      message: "Post deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting post:", error)
    return { isSuccess: false, message: "Failed to delete post" }
  }
}

export async function searchPostsAction(
  query: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: or(
        like(postsTable.title, `%${query}%`),
        like(postsTable.content, `%${query}%`),
        like(postsTable.excerpt, `%${query}%`)
      ),
      orderBy: [desc(postsTable.createdAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Posts search completed successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error searching posts:", error)
    return { isSuccess: false, message: "Failed to search posts" }
  }
}

export async function searchPublishedPostsAction(
  query: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: and(
        eq(postsTable.status, "published"),
        or(
          like(postsTable.title, `%${query}%`),
          like(postsTable.content, `%${query}%`),
          like(postsTable.excerpt, `%${query}%`)
        )
      ),
      orderBy: [desc(postsTable.publishedAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Published posts search completed successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error searching published posts:", error)
    return { isSuccess: false, message: "Failed to search published posts" }
  }
}

export async function getPostsByTagAction(
  tag: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: sql`${tag} = ANY(${postsTable.tags})`,
      orderBy: [desc(postsTable.createdAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Posts by tag retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting posts by tag:", error)
    return { isSuccess: false, message: "Failed to get posts by tag" }
  }
}

export async function getPublishedPostsByTagAction(
  tag: string,
  limit = 10,
  offset = 0
): Promise<ActionState<SelectPost[]>> {
  try {
    const posts = await db.query.posts.findMany({
      where: and(
        eq(postsTable.status, "published"),
        sql`${tag} = ANY(${postsTable.tags})`
      ),
      orderBy: [desc(postsTable.publishedAt)],
      limit,
      offset
    })

    return {
      isSuccess: true,
      message: "Published posts by tag retrieved successfully",
      data: posts
    }
  } catch (error) {
    console.error("Error getting published posts by tag:", error)
    return { isSuccess: false, message: "Failed to get published posts by tag" }
  }
}
