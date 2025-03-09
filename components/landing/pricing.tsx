"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckIcon } from "lucide-react"
import Link from "next/link"
import posthog from "posthog-js"
import { useState } from "react"
import { PlanDialog } from "@/components/pricing/plan-dialog"

// Plan definitions from plan-dialog.tsx
interface PlanFeature {
  text: string
  highlighted?: boolean
}

interface PlanTier {
  name: string
  description: string
  price: string
  period: string
  features: PlanFeature[]
  highlighted?: boolean
  credits: number
  buttonText: string
  planId: string
}

// Define prices for each plan (taken from plan-dialog.tsx)
const STRIPE_PRICES = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID
}

// Plans from plan-dialog.tsx for consistency
const plans: PlanTier[] = [
  {
    name: "Starter",
    description: "For small businesses",
    price: "$5",
    period: "per month",
    credits: 50,
    planId: "starter",
    buttonText: "Subscribe",
    features: [
      { text: "50 credits/month" },
      { text: "Generate Ads From URLs" },
      { text: "No rollover of unused credits" },
      { text: "Email support" }
    ]
  },
  {
    name: "Pro",
    description: "For larger businesses or small agencies",
    price: "$19",
    period: "per month",
    credits: 250,
    planId: "pro",
    buttonText: "Subscribe",
    highlighted: true,
    features: [
      { text: "250 credits/month" },
      { text: "One-Click Bulk Publish Via Google Ads API", highlighted: true },
      { text: "Rollover up to 100 unused credits" },
      { text: "Priority email support" }
    ]
  },
  {
    name: "Agency",
    description: "For large teams and businesses",
    price: "$25",
    period: "per month",
    credits: 500,
    planId: "agency",
    buttonText: "Subscribe",
    features: [
      { text: "500 credits/month" },
      { text: "All features + API access" },
      { text: "Rollover up to 300 unused credits" },
      { text: "Priority support with 24-hour response time" }
    ]
  }
]

export function Pricing() {
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)

  const handlePricingClick = (planId?: string) => {
    // Track the click event
    posthog.capture("clicked_buy_pricing", { plan: planId || "free" })
    // Open the pricing dialog
    setIsPlanDialogOpen(true)
  }

  return (
    <div id="pricing" className="mx-auto mt-32 max-w-6xl">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
          Transparent
        </div>
        <h2 className="mt-6 text-4xl font-medium tracking-tight">
          Flexible Pricing
        </h2>
        <p className="text-muted-foreground text-l mt-4">
          Start For For Free, Then Scale As Needed
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Free Plan */}
        <div className="relative rounded-2xl border p-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2"></div>

          <div className="text-center">
            <h3 className="text-2xl font-medium">Try it out</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Create 5 ads for free to see if you like it
            </p>

            <div className="mt-8 flex items-baseline justify-center">
              <span className="text-6xl font-bold">$0</span>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={() => handlePricingClick()}
              asChild
            >
              <Link href="/signup">
                Try it out free <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <ul className="mt-10 space-y-4 text-left">
              <li className="flex items-start">
                <CheckIcon className="mr-3 size-5 shrink-0 text-black" />
                <span className="text-muted-foreground text-base">
                  Create 5 ads for free
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Paid Plans */}
        {plans.map(plan => (
          <div
            key={plan.planId}
            className={`relative rounded-2xl border p-6 ${plan.highlighted ? "border-primary ring-primary ring-1" : ""}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                  Best Value
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-medium">{plan.name}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {plan.description}
              </p>

              <div className="mt-8 flex items-baseline justify-center">
                <span className="text-6xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">
                  {plan.period}
                </span>
              </div>

              <Button
                size="lg"
                className="mt-8 w-full"
                onClick={() => handlePricingClick(plan.planId)}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.buttonText} <ArrowRight className="ml-2 size-4" />
              </Button>

              <ul className="mt-10 space-y-4 text-left">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="mr-3 size-5 shrink-0 text-black" />
                    <span
                      className={`text-base ${
                        feature.highlighted
                          ? "font-semibold text-black"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature.text}
                      {feature.highlighted && (
                        <span
                          className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: "rgba(218, 129, 70, 0.1)",
                            color: "#DA8146"
                          }}
                        >
                          Speeeedy
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-muted-foreground text-sm">
          *1 credit = 1 scrape and 1 ad generation. It costs 0.5 credits to
          scrape a URL, and 0.5 to create an ad for that URL.
        </h2>
      </div>

      {/* Plan Dialog */}
      <PlanDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        currentPlan="free" // Default to free plan for visitors
      />
    </div>
  )
}
