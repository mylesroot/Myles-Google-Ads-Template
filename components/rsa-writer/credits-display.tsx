"use client"

import { useState } from "react"
import { PlanDialog } from "@/components/pricing/plan-dialog"

interface CreditsDisplayProps {
  credits: string | null
  membership: string
}

export function CreditsDisplay({ credits, membership }: CreditsDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const hasNoCredits = !credits || credits === "0" || credits === "0.0"

  return (
    <>
      <div className="flex items-center justify-center gap-4">
        <div className="bg-background flex items-center rounded-full border px-4 py-2 shadow-sm">
          <div className="mr-2 size-3 rounded-full bg-[#E87B35]" />
          <span className="font-medium">
            {hasNoCredits ? "No credits" : `${credits ?? "Unlimited"} credits`}
          </span>
        </div>

        {hasNoCredits && (
          <button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-full bg-[#3ECF8E] px-4 py-2 text-white transition-colors hover:bg-opacity-90"
          >
            Get More To Save Time
          </button>
        )}
      </div>

      <PlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentPlan={membership}
      />
    </>
  )
}
