"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const handleUpgrade = (planId: string) => {
    // Here you would integrate with your payment system
    console.log(`Upgrading to ${planId}`)
    // For now, we'll just close the dialog
    onClose()
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

        <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-4">
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
                  disabled={currentPlan === plan.planId}
                  variant={
                    plan.highlighted
                      ? "default"
                      : currentPlan === plan.planId
                        ? "outline"
                        : "outline"
                  }
                >
                  {currentPlan === plan.planId
                    ? "Current Plan"
                    : plan.buttonText}
                  {currentPlan !== plan.planId && (
                    <ArrowRight className="ml-2 size-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-4">
          <h4 className="mb-2 font-medium">Credit Top-ups</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">20 additional credits</h5>
                  <p className="text-muted-foreground text-sm">
                    $2.99 (≈ $0.15 per credit)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Buy Credits
                </Button>
              </div>
            </div>
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">100 additional credits</h5>
                  <p className="text-muted-foreground text-sm">
                    $12.99 (≈ $0.13 per credit)
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Buy Credits
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
