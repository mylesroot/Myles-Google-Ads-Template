"use server"

import { Metadata } from "next"

interface BlogSeoProps {
  title: string
  description: string
  canonicalUrl: string
  ogImage?: string
  articleProps?: {
    publishedTime: string
    modifiedTime: string
    authors: string[]
    tags: string[]
  }
}

export async function generateBlogMetadata({
  title,
  description,
  canonicalUrl,
  ogImage,
  articleProps
}: BlogSeoProps): Promise<Metadata> {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
      ...(articleProps && {
        publishedTime: articleProps.publishedTime,
        modifiedTime: articleProps.modifiedTime,
        authors: articleProps.authors,
        tags: articleProps.tags
      })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined
    }
  }
}
