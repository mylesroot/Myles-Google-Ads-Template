"use server"

import { BlogHeader } from "@/components/blog/BlogHeader"
import { ShareButtons } from "@/components/blog/ShareButtons"
import { TableOfContents } from "@/components/blog/TableOfContents"
import { RelatedPosts } from "@/components/blog/RelatedPosts"
import BlogPostStructuredData from "@/components/blog/BlogStructuredData"
import { generateBlogMetadata } from "@/components/blog/BlogSeo"
import { MarkdownContent } from "@/components/blog/MarkdownContent"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getPublishedPostBySlugAction,
  getPublishedPostsAction
} from "@/actions/db/blog-actions"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: post, isSuccess } = await getPublishedPostBySlugAction(slug)

  if (!isSuccess || !post) {
    return {}
  }

  return generateBlogMetadata({
    title: `${post.title} | Ad Conversions Blog`,
    description: post.excerpt || post.seoDescription || "",
    canonicalUrl: `https://adconversions.net/blog/${post.slug}`,
    ogImage: post.featuredImage || "",
    articleProps: {
      publishedTime:
        post.publishedAt?.toISOString() || new Date().toISOString(),
      modifiedTime: post.updatedAt?.toISOString() || new Date().toISOString(),
      authors: ["Myles"], // Update with actual author data if available
      tags: post.tags || []
    }
  })
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: post, isSuccess } = await getPublishedPostBySlugAction(slug)

  if (!isSuccess || !post) {
    notFound()
  }

  // Get related posts (for this example, just get the latest posts)
  const { data: relatedPostsData = [] } = await getPublishedPostsAction(4, 0)

  // Filter out the current post
  const relatedPosts = relatedPostsData
    .filter(p => p.slug !== post.slug)
    .slice(0, 3)
    .map(p => ({
      slug: p.slug,
      title: p.title,
      description: p.excerpt || p.seoDescription || "",
      coverImage: p.featuredImage || "/placeholder.png",
      date: p.publishedAt ? formatDate(p.publishedAt) : "No date",
      readingTime: `${Math.ceil((p.content?.length || 0) / 1000)} min read`,
      author: {
        name: "Myles" // Update with actual author data if available
      },
      categories: p.tags || []
    }))

  const formattedPost = {
    title: post.title,
    description: post.excerpt || post.seoDescription || "",
    coverImage: post.featuredImage || "/placeholder.png",
    date: post.publishedAt ? formatDate(post.publishedAt) : "No date",
    readingTime: `${Math.ceil((post.content?.length || 0) / 1000)} min read`,
    author: {
      name: "Myles", // Update with actual author data if available
      image: "/placeholder.png" // Update with actual author image if available
    },
    categories: post.tags || [],
    content: post.content || "",
    publishedDate: post.publishedAt?.toISOString() || new Date().toISOString(),
    modifiedDate: post.updatedAt?.toISOString() || new Date().toISOString()
  }

  return (
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.excerpt || post.seoDescription || ""}
        publishedDate={
          post.publishedAt?.toISOString() || new Date().toISOString()
        }
        modifiedDate={post.updatedAt?.toISOString() || new Date().toISOString()}
        author={{
          name: "Myles", // Update with actual author data if available
          url: "https://www.linkedin.com/in/myles-r-097705a3/"
        }}
        imageUrl={post.featuredImage || "/placeholder.png"}
        url={`https://adconversions.net/blog/${post.slug}`}
      />

      <div className="container mx-auto max-w-5xl px-6 py-8 lg:px-8">
        <BlogHeader
          title={formattedPost.title}
          description={formattedPost.description}
          date={formattedPost.date}
          readingTime={formattedPost.readingTime}
          author={formattedPost.author}
          categories={formattedPost.categories}
          showBackButton={true}
          backButtonLabel="Back to Blog"
          backButtonHref="/blog"
        />

        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="lg:w-4/5">
            <article className="prose prose-gray max-w-none">
              <MarkdownContent content={formattedPost.content} />
            </article>

            <div className="mt-8 border-t pt-8">
              <ShareButtons
                title={formattedPost.title}
                url={`https://adconversions.net/blog/${post.slug}`}
              />
            </div>
          </div>

          <div className="lg:w-1/5">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-8">
          <RelatedPosts posts={relatedPosts} currentPostSlug={post.slug} />
        </div>
      </div>
    </>
  )
}
