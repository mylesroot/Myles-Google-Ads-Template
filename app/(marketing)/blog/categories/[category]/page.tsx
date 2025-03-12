"use server"

import { BlogCard } from "@/components/blog/BlogCard"
import { CategoryList } from "@/components/blog/CategoryList"
import { BlogHeader } from "@/components/blog/BlogHeader"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getCategoriesAction,
  getCategoryBySlugAction,
  getPublishedPostsByCategorySlugAction
} from "@/actions/db/blog-actions"
import { formatDate } from "@/lib/utils"

// Helper function to normalize slugs
function normalizeSlug(slug: string): string {
  // Replace spaces with hyphens and ensure lowercase
  return slug.replace(/\s+/g, "-").toLowerCase()
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const categorySlug = normalizeSlug(decodedCategory)

  const { data: categoryData, isSuccess } =
    await getCategoryBySlugAction(categorySlug)

  if (!isSuccess || !categoryData) {
    return {}
  }

  return {
    title: `${categoryData.name} Articles | Ad Conversions Blog`,
    description: `Expert insights and articles about ${categoryData.name} to help boost your digital marketing performance.`,
    openGraph: {
      type: "website",
      title: `${categoryData.name} Articles | Ad Conversions Blog`,
      description: `Expert insights and articles about ${categoryData.name} to help boost your digital marketing performance.`,
      url: `https://adconversions.net/blog/categories/${categorySlug}`
    }
  }
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  const categorySlug = normalizeSlug(decodedCategory)

  // Get the category
  const { data: categoryData, isSuccess: categorySuccess } =
    await getCategoryBySlugAction(categorySlug)

  // If category doesn't exist, show 404
  if (!categorySuccess || !categoryData) {
    notFound()
  }

  // Get all categories for the navigation
  const { data: categories = [] } = await getCategoriesAction()

  // Get posts for this category
  const { data: categoryPosts = [] } =
    await getPublishedPostsByCategorySlugAction(categorySlug, 20, 0)

  // Format posts for display
  const posts = categoryPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.excerpt || post.seoDescription || "",
    coverImage: post.featuredImage || "/placeholder.png",
    date: post.publishedAt ? formatDate(post.publishedAt) : "No date",
    readingTime: `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
    author: {
      name: "Myles" // Update with actual author data if available
    },
    categories: post.tags || []
  }))

  return (
    <div className="container py-12">
      <BlogHeader
        title={`${categoryData.name} Articles`}
        description={
          categoryData.description ||
          `Expert insights and articles about ${categoryData.name.toLowerCase()} to help boost your digital marketing performance.`
        }
        showBackButton={true}
        backButtonLabel="Back to Blog"
        backButtonHref="/blog"
      />

      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-medium">Categories</h2>
          <CategoryList categories={categories.map(cat => cat.name)} />
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-xl font-medium">No articles found</h3>
          <p className="text-muted-foreground">
            We couldn't find any articles in this category. Please check back
            later.
          </p>
        </div>
      )}
    </div>
  )
}
