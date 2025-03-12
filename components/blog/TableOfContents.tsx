"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  className?: string
}

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Find all headings in the article
    const articleHeadings = Array.from(
      document.querySelectorAll(
        "article h1, article h2, article h3, article h4"
      )
    )
      .map(heading => {
        // Get the ID - either from the heading itself or from its parent if it's wrapped by rehype-autolink-headings
        const id = heading.id || heading.querySelector("a.anchor")?.id || ""

        return {
          id,
          text: heading.textContent || "",
          level: parseInt(heading.tagName.substring(1))
        }
      })
      .filter(heading => heading.id) // Only include headings with IDs

    setHeadings(articleHeadings)

    // Set up intersection observer to track active heading
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" }
    )

    // Observe all headings
    document
      .querySelectorAll("article h1, article h2, article h3, article h4")
      .forEach(heading => {
        if (heading.id) {
          observer.observe(heading)
        } else {
          // If the heading itself doesn't have an ID, it might be wrapped by rehype-autolink-headings
          const anchor = heading.querySelector("a.anchor")
          if (anchor && anchor.id) {
            observer.observe(heading)
          }
        }
      })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!headings.length) return null

  return (
    <div className={cn("mb-8", className)}>
      <h3 className="mb-4 text-lg font-medium">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          {headings.map(heading => (
            <li
              key={heading.id}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                {
                  "pl-0": heading.level === 1,
                  "pl-2": heading.level === 2,
                  "pl-4": heading.level === 3,
                  "pl-6": heading.level === 4,
                  "text-foreground font-medium": activeId === heading.id
                }
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block py-1",
                  activeId === heading.id &&
                    "border-primary -ml-2 border-l-2 pl-2"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
