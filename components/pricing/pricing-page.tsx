"use client"

import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from "@/lib/hooks/use-profile"

interface PlanFeature {
  text: string
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

const plans: PlanTier[] = [
  {
    name: "Free",
    description: "Basic functionality",
    price: "$0",
    period: "forever",
    credits: 5,
    planId: "free",
    buttonText: "Current Plan",
    features: [
      { text: "5 credits/month" },
      { text: "Basic functionality" },
      { text: "No rollover of unused credits" },
      { text: "Community support only" }
    ]
  },
  {
    name: "Starter",
    description: "For individuals getting started",
    price: "$5",
    period: "per month",
    credits: 50,
    planId: "starter",
    buttonText: "Upgrade",
    features: [
      { text: "50 credits/month" },
      { text: "Generate Ads From URLs" },
      { text: "No rollover of unused credits" },
      { text: "Email support" }
    ]
  },
  {
    name: "Pro",
    description: "For professionals",
    price: "$19",
    period: "per month",
    credits: 250,
    planId: "pro",
    buttonText: "Upgrade",
    highlighted: true,
    features: [
      { text: "250 credits/month" },
      { text: "Publish Ads Via Google Ads API" },
      { text: "Rollover up to 100 unused credits" },
      { text: "Priority email support" }
    ]
  },
  {
    name: "Agency",
    description: "For teams and businesses",
    price: "$25",
    period: "per month",
    credits: 500,
    planId: "agency",
    buttonText: "Upgrade",
    features: [
      { text: "500 credits/month" },
      { text: "All features + API access" },
      { text: "Rollover up to 300 unused credits" },
      { text: "Priority support with 24-hour response time" },
      { text: "Team collaboration features" },
      { text: "Advanced analytics" }
    ]
  }
]

export function PricingPage() {
  const { profile } = useProfile()
  const currentPlan = profile?.membership || "free"

  const handleUpgrade = (planId: string) => {
    // Here you would integrate with your payment system
    console.log(`Upgrading to ${planId}`)
  }

  return (
    <div className="container py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pricing Plans</h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-xl">
          Choose the plan that works best for you. All plans include access to
          our core features.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map(plan => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
              plan.highlighted
                ? "border-primary ring-primary ring-1"
                : "border-border"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 right-6">
                <div className="bg-primary text-primary-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="mb-5 text-left">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="mb-5">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">
                  {plan.period}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 text-sm">
                {plan.credits} credits included monthly
              </div>
            </div>

            <div className="mb-6 grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="text-primary mr-3 size-5 shrink-0" />
                    <span className="text-muted-foreground">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <Button
                className={cn(
                  "w-full",
                  currentPlan === plan.planId
                    ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                    : ""
                )}
                onClick={() => handleUpgrade(plan.planId)}
                disabled={currentPlan === plan.planId}
                variant={
                  plan.highlighted
                    ? "default"
                    : currentPlan === plan.planId
                      ? "outline"
                      : "outline"
                }
                size="lg"
              >
                {currentPlan === plan.planId ? "Current Plan" : plan.buttonText}
                {currentPlan !== plan.planId && (
                  <ArrowRight className="ml-2 size-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t pt-10">
        <h2 className="mb-6 text-2xl font-bold">Need More Credits?</h2>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          <div className="rounded-xl border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">20 additional credits</h3>
                <p className="text-muted-foreground">
                  $2.99 (≈ $0.15 per credit)
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Perfect for smaller projects or occasional use
                </p>
              </div>
              <Button size="lg" variant="outline">
                Buy Credits
              </Button>
            </div>
          </div>
          <div className="rounded-xl border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold">100 additional credits</h3>
                <p className="text-muted-foreground">
                  $12.99 (≈ $0.13 per credit)
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Best value for larger projects and frequent use
                </p>
              </div>
              <Button size="lg" variant="outline">
                Buy Credits
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
