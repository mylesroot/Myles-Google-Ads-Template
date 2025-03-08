"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"

export function Pricing() {
  const handlePricingClick = () => {
    posthog.capture("clicked_buy_pricing")
  }

  return (
    <div className="mx-auto mt-32 max-w-2xl">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
          Get Started
        </div>
        <h2 className="mt-6 text-4xl font-medium tracking-tight">
          Ready to build your Google Ads app?
        </h2>
        <p className="text-muted-foreground text-l mt-4">
          Everything you need to launch your next Google Ads project
        </p>
      </div>

      <div className="mt-10">
        <div className="relative mx-auto max-w-md rounded-2xl border p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="inline-flex rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
              FREE
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-medium">Open Source Template</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Start building right away
            </p>

            <div className="mt-8 flex items-baseline justify-center">
              <span className="text-6xl font-bold">$0</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={handlePricingClick}
              asChild
            >
              <Link href="https://github.com/mylesroot/Myles-Google-Ads-Template">
                Clone Repository <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <ul className="mt-10 space-y-4 text-left">
              <li className="flex items-start">
                <svg
                  className="mr-3 size-5 shrink-0 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-muted-foreground text-base">
                  Complete Next.js Google Ads application template
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 size-5 shrink-0 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-muted-foreground text-base">
                  Frontend, backend, auth, payments, and analytics
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 size-5 shrink-0 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-muted-foreground text-base">
                  Ready for AI integration with Cursor, V0, and Perplexity
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 size-5 shrink-0 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-muted-foreground text-base">
                  Community support
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 flex items-center justify-center gap-2 text-sm">
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          Set up your own accounts for Supabase, Clerk, Stripe, and PostHog
        </div>
      </div>
    </div>
  )
}
