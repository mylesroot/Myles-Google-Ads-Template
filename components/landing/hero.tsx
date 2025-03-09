"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"

export function Hero() {
  const handleHeroClick = () => {
    posthog.capture("clicked_buy_hero")
  }

  return (
    <div className="relative isolate">
      {/* Background gradient */}
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

      {/* Hero content */}
      <div className="py-12 sm:py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">
              Create{" "}
              <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                Expert
              </span>{" "}
              Google Search Ads{" "}
              <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                In 2 Clicks
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Paste in multiple website URLs, we'll retrieve the information and
              generate copy with{" "}
              <strong>AI trained for Google Search Ads</strong>.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Button size="lg" onClick={handleHeroClick} asChild>
                <Link href="/signup">
                  Start Saving Time & Impressing Your Boss
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
