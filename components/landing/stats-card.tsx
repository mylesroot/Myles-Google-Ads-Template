"use client"

export function StatsCard() {
  return (
    <div className="mx-auto mt-16 max-w-5xl">
      <div className="rounded-3xl bg-gray-100 p-8 sm:p-12">
        <div className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
          Complete Tech Stack
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          Everything you need for Google Ads, in one place.
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          This template includes all the tools you need to build a modern Google
          Ads application, from frontend to backend, authentication to payments,
          and analytics.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Frontend</dt>
            <dd className="text-sm font-semibold">Modern & Responsive</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              Built with Next.js, Tailwind CSS, Shadcn UI components, and Framer
              Motion for animations.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Backend</dt>
            <dd className="text-sm font-semibold">Powerful & Scalable</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              PostgreSQL database with Supabase, Drizzle ORM, and Next.js Server
              Actions.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Auth</dt>
            <dd className="text-sm font-semibold">Secure & Simple</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              Authentication handled by Clerk with support for multiple
              providers.
            </p>
          </div>
          <div className="items-left flex flex-col">
            <dt className="text-3xl font-bold text-[#3ECF8E]">Google Ads</dt>
            <dd className="text-sm font-semibold">API Integration</dd>
            <p className="text-muted-foreground mt-2 text-left text-sm">
              Ready for Google Ads API integration with Stripe for payments and
              PostHog for analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
