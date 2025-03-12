import { MetadataRoute } from "next"
import { getPublishedPostsAction } from "@/actions/db/blog-posts-actions"
import { getCategoriesAction } from "@/actions/db/blog-categories-actions"

// Fetch posts from the database
const getAllPosts = async () => {
  const { isSuccess, data } = await getPublishedPostsAction(100, 0)

  if (!isSuccess || !data) {
    console.error("Failed to fetch posts for sitemap")
    return []
  }

  return data.map(post => ({
    slug: post.slug,
    publishedDate:
      post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    modifiedDate: post.updatedAt.toISOString()
  }))
}

// Fetch categories from the database
const getAllCategories = async () => {
  const { isSuccess, data } = await getCategoriesAction()

  if (!isSuccess || !data) {
    console.error("Failed to fetch categories for sitemap")
    return []
  }

  return data.map(category => category.slug)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://adconversions.net"

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.9
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.7
    },
    {
      url: `${baseUrl}/rsa-writer`,
      lastModified: new Date(),
      priority: 0.9
    }
  ]

  // Blog posts
  const posts = await getAllPosts()
  const blogPostsPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate),
    priority: 0.8
  }))

  // Categories
  const categories = await getAllCategories()
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/blog/categories/${category}`,
    lastModified: new Date(),
    priority: 0.7
  }))

  return [...mainPages, ...blogPostsPages, ...categoryPages]
}
