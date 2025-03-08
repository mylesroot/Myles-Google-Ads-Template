"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  DollarSign,
  Globe,
  Users,
  Settings,
  Newspaper
} from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"

export function Hero() {
  const handleHeroClick = () => {
    posthog.capture("clicked_buy_hero")
  }

  const handlePricingClick = () => {
    posthog.capture("clicked_buy_pricing")
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
              Find Decision-Maker Emails From Over{" "}
              <span className="inline-block bg-gradient-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                10,000+ Biotech Companies
              </span>
            </h1>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              Unlock 30,000+ verified emails & contact info from 10,000+ biotech
              companies around the world, without the hefty monthly costs. Get
              the entire database for $149.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Button size="lg" onClick={handleHeroClick} asChild>
                <Link href="https://buy.stripe.com/7sIaFs9RgeIt2nm7st">
                  Early Bird Access: $149
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats card section */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-3xl bg-gray-100 p-8 sm:p-12">
              <div className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
                15+ Data Filters
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight">
                Unlimited data, one price.
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Instead of charging you into oblivion for incomplete data, you
                unlock the entire database for just $149. That way, you can
                spend more on marketing & less on data.
              </p>

              <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-4">
                <div className="items-left flex flex-col">
                  <dt className="text-3xl font-bold text-[#3ECF8E]">10,000+</dt>
                  <dd className="text-sm font-semibold">Biotech Companies</dd>
                  <p className="text-muted-foreground mt-2 text-left text-sm">
                    It took us hundreds of hours & $30,000+ to secure this
                    amount of data. Then, we verified every email address.
                  </p>
                </div>
                <div className="items-left flex flex-col">
                  <dt className="text-3xl font-bold text-[#3ECF8E]">15+</dt>
                  <dd className="text-sm font-semibold">Data Filters</dd>
                  <p className="text-muted-foreground mt-2 text-left text-sm">
                    We hate skin-deep databases. Use 15+ filters like
                    therapeutic area, pipeline, platform, region, funding,
                    revenue, & more.
                  </p>
                </div>
                <div className="items-left flex flex-col">
                  <dt className="text-3xl font-bold text-[#3ECF8E]">#1</dt>
                  <dd className="text-sm font-semibold">for email accuracy</dd>
                  <p className="text-muted-foreground mt-2 text-left text-sm">
                    Dirty data sucks. So we made sure every email is 2X
                    verified.
                  </p>
                </div>
                <div className="items-left flex flex-col">
                  <dt className="text-3xl font-bold text-[#3ECF8E]">
                    Unlimited
                  </dt>
                  <dd className="text-sm font-semibold">Lists & Updates</dd>
                  <p className="text-muted-foreground mt-2 text-left text-sm">
                    Our biotech database is getting constantly updated so
                    everything is accurate. Plus, you can create as many lists
                    as you like.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features section */}
          <div className="mx-auto mt-32 max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                A dozen filters to build the perfect list
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Filter by revenue, funding, web traffic & more
              </p>
              <div className="mt-6 flex items-center justify-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Ask us anything</Link>
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Revenue Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <DollarSign className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">
                  Accurate Revenue
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  We pull from multiple sources to get accurate, up-to-date
                  revenue data.
                </p>
              </div>

              {/* Technologies Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <Settings className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">
                  Therapeutic Area
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Find the companies focused on therapeutic areas that you
                  specialise in.
                </p>
              </div>

              {/* Funding Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <DollarSign className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">
                  Funding & Investments
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Funded companies love buying your stuff. Filter by funding
                  rounds & find investors who've backed them.
                </p>
              </div>

              {/* Web Traffic Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <Globe className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">Pipeline</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  See what drugs are in development. Filter by phase, indicator,
                  platform, & more.
                </p>
              </div>

              {/* Employee Count Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <Users className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">Employee Count</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Find companies based on their team size. Filter and segment
                  your leads by company size for better targeting.
                </p>
              </div>

              {/* News Card */}
              <div className="flex flex-col rounded-xl border p-6">
                <Newspaper className="size-4 text-gray-500" />
                <h3 className="mt-4 text-base font-semibold">News (soon)</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Stay ahead of the competition. Use our AI Agent to research
                  the latest news and updates on any biotech company.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing section */}
          <div className="mx-auto mt-32 max-w-2xl">
            <div className="text-center">
              <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                Pricing
              </div>
              <h2 className="mt-6 text-4xl font-medium tracking-tight">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground text-l mt-4">
                Choose the plan that works best for you
              </p>
            </div>

            <div className="mt-10">
              <div className="relative mx-auto max-w-md rounded-2xl border p-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex rounded-full bg-black px-4 py-1 text-sm font-medium text-white">
                    SAVE 63%
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-medium">Early Bird Yearly</h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Our most popular plan
                  </p>

                  <div className="mt-8 flex items-baseline justify-center">
                    <span className="text-muted-foreground text-2xl line-through">
                      $250
                    </span>
                    <span className="ml-2 text-6xl font-bold">$149</span>
                    <span className="text-muted-foreground ml-2">per year</span>
                  </div>

                  <Button
                    size="lg"
                    className="mt-8 w-full"
                    onClick={handlePricingClick}
                    asChild
                  >
                    <Link href="https://buy.stripe.com/7sIaFs9RgeIt2nm7st">
                      Get Started <ArrowRight className="ml-2 size-4" />
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
                        Full access to the entire database of 10,000+ biotech
                        companies.
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
                        30,000+ verified emails, pipeline data, & more.
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
                        Unlimited access to future data we add (leadership
                        changes, funding rounds, pipeline phases etc...)
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
                        Priority support
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
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
                Payments are secure & encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
