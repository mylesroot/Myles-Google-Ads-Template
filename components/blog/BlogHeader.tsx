"use server"

import { CalendarIcon, Clock, User } from "lucide-react"
import Image from "next/image"
import { CategoryList } from "@/components/blog/CategoryList"
import { BackButton } from "@/components/blog/BackButton"

interface BlogHeaderProps {
  title: string
  description?: string
  coverImage?: string
  date?: string
  readingTime?: string
  author?: {
    name: string
    image?: string
  }
  categories?: string[]
  showBackButton?: boolean
  backButtonLabel?: string
  backButtonHref?: string
}

export async function BlogHeader({
  title,
  description,
  coverImage,
  date,
  readingTime,
  author,
  categories = [],
  showBackButton = true,
  backButtonLabel = "Back to Blog",
  backButtonHref
}: BlogHeaderProps) {
  return (
    <div className="relative isolate mb-10">
      {/* Background gradient similar to hero */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="from-primary to-primary-foreground relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        {showBackButton && (
          <div className="mb-6">
            <BackButton label={backButtonLabel} href={backButtonHref} />
          </div>
        )}

        {categories && categories.length > 0 && (
          <div className="mb-6">
            <CategoryList categories={categories} />
          </div>
        )}

        <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">
          <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {description && (
          <p className="text-muted-foreground mb-8 text-xl leading-8">
            {description}
          </p>
        )}

        {(date || readingTime || author) && (
          <div className="text-muted-foreground border-border flex flex-wrap items-center gap-6 border-y py-4 text-sm">
            {date && (
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} />
                <span>{date}</span>
              </div>
            )}

            {readingTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{readingTime}</span>
              </div>
            )}

            {author && (
              <div className="flex items-center gap-2">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User size={16} />
                )}
                <span>{author.name}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
