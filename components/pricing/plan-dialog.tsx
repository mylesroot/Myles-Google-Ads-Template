"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRight, Loader2, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

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

// Define prices for each plan
const STRIPE_PRICES = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  agency: process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID
}

// Remove the free plan from the array since we'll handle it separately
const plans: PlanTier[] = [
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
      { text: "Basic features" },
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
      { text: "All features" },
      { text: "Rollover up to 100 unused credits" },
      { text: "Priority email support" },
      { text: "Analytics dashboard" }
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

interface PlanDialogProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
}

export function PlanDialog({ isOpen, onClose, currentPlan }: PlanDialogProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const isPaidPlan = ["starter", "pro", "agency"].includes(currentPlan)

  const handleBillingPortal = () => {
    const portalUrl = process.env.NEXT_PUBLIC_STRIPE_PORTAL_LINK
    if (portalUrl) {
      window.location.href = portalUrl
    } else {
      toast({
        title: "Error",
        description: "Billing portal not configured. Please contact support.",
        variant: "destructive"
      })
    }
  }

  const handleUpgrade = async (planId: string) => {
    // Skip if it's the current plan
    if (planId === currentPlan) {
      return
    }

    // Handle downgrading to free plan
    if (planId === "free") {
      // You might want to add a confirmation step here
      toast({
        title: "Downgrading to Free Plan",
        description: "Please contact support to downgrade your plan.",
        variant: "default"
      })
      return
    }

    setLoading(planId)

    try {
      const priceId = STRIPE_PRICES[planId as keyof typeof STRIPE_PRICES]

      if (!priceId) {
        throw new Error(`No price ID found for plan: ${planId}`)
      }

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
          successUrl: window.location.origin + "/rsa-writer?checkout=success",
          cancelUrl: window.location.origin + "/rsa-writer?checkout=canceled"
        })
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      // Redirect to Stripe Checkout
      router.push(data.url)
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription>
            Select the plan that works best for your needs
          </DialogDescription>
        </DialogHeader>

        {isPaidPlan && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="size-5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-300">
                  You're currently on the{" "}
                  {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}{" "}
                  plan
                </span>
              </div>
              <Button
                onClick={handleBillingPortal}
                variant="secondary"
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                Manage Your Billing
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-lg border p-5 shadow-sm",
                plan.highlighted
                  ? "border-primary ring-primary ring-1"
                  : "border-border"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground inline-flex rounded-full px-3 py-1 text-xs font-medium">
                    Popular
                  </div>
                </div>
              )}

              <div className="mb-4 text-center">
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4 text-center">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </div>

              <div className="mb-4">
                <div className="mb-2 text-sm font-medium">
                  {plan.credits} credits/month
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="text-primary mr-2 size-5 shrink-0" />
                      <span className="text-muted-foreground text-sm">
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
                  disabled={currentPlan === plan.planId || loading !== null}
                  variant={
                    plan.highlighted
                      ? "default"
                      : currentPlan === plan.planId
                        ? "outline"
                        : "outline"
                  }
                >
                  {loading === plan.planId ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : currentPlan === plan.planId ? (
                    "Current Plan"
                  ) : (
                    <>
                      {plan.buttonText}
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Free plan option at the bottom */}
        <div className="mt-4 border-t pt-4 text-center">
          <p className="text-muted-foreground mb-2 text-sm">
            Not ready for a paid plan?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUpgrade("free")}
            disabled={currentPlan === "free" || loading !== null}
            className={cn(
              currentPlan === "free" && "bg-green-50 text-green-700"
            )}
          >
            {currentPlan === "free" ? "Current Free Plan" : "Stay on Free Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
