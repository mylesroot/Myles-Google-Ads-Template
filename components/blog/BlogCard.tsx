"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import posthog from "posthog-js"

interface BlogCardProps {
  post: {
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
  }
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const handleCardClick = () => {
    posthog.capture("clicked_blog_card", {
      post_title: post.title,
      post_slug: post.slug
    })
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${featured ? "lg:flex" : ""}`}
    >
      <div className={`relative ${featured ? "lg:w-2/5" : "h-48"}`}>
        <Link href={`/blog/${post.slug}`} onClick={handleCardClick}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </Link>
      </div>

      <div className={featured ? "lg:w-3/5" : ""}>
        <CardHeader>
          <div className="mb-2 flex flex-wrap gap-2">
            {post.categories.map(category => (
              <Link
                href={`/blog/categories/${category.toLowerCase()}`}
                key={category}
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
          <CardTitle className="hover:text-primary text-xl font-medium tracking-tight transition-colors">
            <Link href={`/blog/${post.slug}`} onClick={handleCardClick}>
              {post.title}
            </Link>
          </CardTitle>
          <CardDescription>{post.description}</CardDescription>
        </CardHeader>

        <CardFooter className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <CalendarIcon size={14} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.readingTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{post.author.name}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
