"use client"

import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import posthog from "posthog-js"

interface CategoryListProps {
  categories: string[]
  className?: string
}

// Helper function to normalize slugs
function normalizeSlug(slug: string): string {
  // Replace spaces with hyphens and ensure lowercase
  return slug.replace(/\s+/g, "-").toLowerCase()
}

export function CategoryList({
  categories,
  className = ""
}: CategoryListProps) {
  const handleCategoryClick = (category: string) => {
    posthog.capture("clicked_blog_category", { category })
  }

  if (!categories.length) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map(category => (
        <Link
          href={`/blog/categories/${normalizeSlug(category)}`}
          key={category}
          onClick={() => handleCategoryClick(category)}
        >
          <Badge
            variant="outline"
            className="hover:bg-secondary transition-colors"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
