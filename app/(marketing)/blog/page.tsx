"use server"

import { BlogCard } from "@/components/blog/BlogCard"
import { CategoryList } from "@/components/blog/CategoryList"
import { BlogHeader } from "@/components/blog/BlogHeader"
import { Metadata } from "next"
import {
  getCategoriesAction,
  getPublishedPostsAction
} from "@/actions/db/blog-actions"
import { formatDate } from "@/lib/utils"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Ad Conversions",
    description:
      "Expert insights on Google Ads, PPC, and digital marketing strategies to boost your conversions.",
    openGraph: {
      type: "website",
      title: "Blog | Ad Conversions",
      description:
        "Expert insights on Google Ads, PPC, and digital marketing strategies to boost your conversions.",
      url: "https://adconversions.net/blog"
    }
  }
}

export default async function BlogPage() {
  const { data: categories = [] } = await getCategoriesAction()
  const { data: posts = [] } = await getPublishedPostsAction(10, 0)

  const formattedPosts = posts.map(post => ({
    slug: post.slug,
    title: post.title,
    description: post.excerpt || post.seoDescription || "",
    coverImage: post.featuredImage || "/placeholder.png",
    date: post.publishedAt ? formatDate(post.publishedAt) : "No date",
    readingTime: `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
    author: {
      name: "Myles" // You can update this with actual author data if available
    },
    categories: post.tags || []
  }))

  const featuredPost = formattedPosts[0]
  const regularPosts = formattedPosts.slice(1)

  return (
    <div className="container max-w-7xl py-12">
      <h1 className="mb-16 text-5xl font-medium">Ad Conversions Blog</h1>

      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-medium">Categories</h2>
          <CategoryList categories={categories.map(cat => cat.name)} />
        </div>
      )}

      {featuredPost && (
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-medium">Featured Article</h2>
          <BlogCard post={featuredPost} featured />
        </div>
      )}

      {regularPosts.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-medium">Latest Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
