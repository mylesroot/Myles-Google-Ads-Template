"use client"

import { Button } from "@/components/ui/button"
import { Code, Database, Lock, CreditCard, BarChart, Cpu } from "lucide-react"
import Link from "next/link"

export function Features() {
  return (
    <div className="mx-auto mt-32 max-w-5xl">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Complete tech stack for Google Ads applications
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Everything you need to build, deploy, and scale your Google Ads
          application
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/mylesroot/Myles-Google-Ads-Template">
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Frontend Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <Code className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">Next.js & Tailwind</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Build beautiful, responsive UIs with Next.js, Tailwind CSS, and
            Shadcn components.
          </p>
        </div>

        {/* Backend Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <Database className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">
            PostgreSQL & Supabase
          </h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Powerful database with Supabase hosting and Drizzle ORM for
            type-safe queries.
          </p>
        </div>

        {/* Auth Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <Lock className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">Clerk Authentication</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Secure authentication with support for multiple providers and user
            management.
          </p>
        </div>

        {/* Payments Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <CreditCard className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">Stripe Payments</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Integrated payment processing with Stripe for subscriptions and
            one-time payments.
          </p>
        </div>

        {/* Analytics Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <BarChart className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">PostHog Analytics</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Track user behavior and gain insights with PostHog's powerful
            analytics platform.
          </p>
        </div>

        {/* AI Tools Card */}
        <div className="flex flex-col rounded-xl border p-6">
          <Cpu className="size-4 text-gray-500" />
          <h3 className="mt-4 text-base font-semibold">Google Ads API</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Ready for Google Ads API integration with Cursor IDE, V0 for UI
            generation, and Perplexity for research.
          </p>
        </div>
      </div>
    </div>
  )
}
