"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { cn } from "@/lib/utils"
import { Components } from "react-markdown"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn("prose prose-gray dark:prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"]
              }
            }
          ]
        ]}
        components={{
          // Customize heading rendering
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="mb-4 mt-8 text-3xl font-bold tracking-tight"
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="mb-4 mt-8 text-2xl font-bold tracking-tight"
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              {...props}
              className="mb-3 mt-6 text-xl font-bold tracking-tight"
            />
          ),
          // Customize link rendering
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-primary hover:underline"
              target={props.href?.startsWith("http") ? "_blank" : undefined}
              rel={
                props.href?.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            />
          ),
          // Customize code blocks
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "")
            const inline = !match && (props.inline || false)

            if (inline) {
              return (
                <code
                  className="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <pre className="overflow-x-auto rounded-lg bg-slate-200 p-4 dark:bg-slate-800">
                <code
                  className={`${className} text-slate-900 dark:text-slate-100`}
                  {...props}
                >
                  {children}
                </code>
              </pre>
            )
          },
          // Customize blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-muted-foreground/30 my-6 border-l-4 pl-4 italic"
              {...props}
            />
          ),
          // Customize images
          img: ({ node, ...props }) => (
            <img
              className="my-8 w-full rounded-lg"
              {...props}
              alt={props.alt || "Blog image"}
            />
          ),
          // Customize lists
          ul: ({ node, ...props }) => (
            <ul className="my-4 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-4 list-decimal pl-6" {...props} />
          ),
          // Customize table
          table: ({ node, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border-muted-foreground/20 bg-muted border px-4 py-2 text-left font-bold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border-muted-foreground/20 border px-4 py-2"
              {...props}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
