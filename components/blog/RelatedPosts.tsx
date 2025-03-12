"use server"

import { BlogCard } from "./BlogCard"

interface RelatedPostsProps {
  posts: Array<{
    slug: string
    title: string
    description: string
    coverImage: string
    date: string
    readingTime: string
    author: {
      name: string
      image?: string
    }
    categories: string[]
  }>
  currentPostSlug: string
  className?: string
}

export async function RelatedPosts({
  posts,
  currentPostSlug,
  className = ""
}: RelatedPostsProps) {
  // Filter out the current post and limit to 3 related posts
  const relatedPosts = posts
    .filter(post => post.slug !== currentPostSlug)
    .slice(0, 3)

  if (!relatedPosts.length) return null

  return (
    <div className={className}>
      <h2 className="mb-6 text-2xl font-medium tracking-tight">
        <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
          Related Articles
        </span>
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
