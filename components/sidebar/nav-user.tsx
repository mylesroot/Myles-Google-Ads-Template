/*
<ai_context>
This client component provides a user button for the sidebar via Clerk.
</ai_context>
*/

"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { PlanDialog } from "@/components/pricing/plan-dialog"
import { useState } from "react"
import { useProfile } from "@/lib/hooks/use-profile"
import { Crown, Star, Sparkles } from "lucide-react"

export function NavUser() {
  const { user } = useUser()
  const { profile } = useProfile()
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)

  // Helper function to format membership name for display
  const formatMembership = (membership: string) => {
    return membership.charAt(0).toUpperCase() + membership.slice(1)
  }

  // Get plan-specific styles and icons
  const getPlanStyles = (membership: string = "free") => {
    switch (membership) {
      case "starter":
        return {
          bgColor: "bg-gradient-to-r from-blue-500/80 to-blue-600/80",
          textColor: "text-white",
          icon: Star,
          iconColor: "text-white"
        }
      case "pro":
        return {
          bgColor: "bg-gradient-to-r from-violet-500/90 to-purple-600/90",
          textColor: "text-white",
          icon: Crown,
          iconColor: "text-amber-300"
        }
      case "agency":
        return {
          bgColor: "bg-gradient-to-r from-indigo-600/90 to-blue-700/90",
          textColor: "text-white",
          icon: Sparkles,
          iconColor: "text-blue-200"
        }
      default:
        return {
          bgColor: "bg-muted/50",
          textColor: "text-muted-foreground",
          icon: Crown,
          iconColor: "text-amber-500/50"
        }
    }
  }

  const membership = profile?.membership || "free"
  const {
    bgColor,
    textColor,
    icon: PlanIcon,
    iconColor
  } = getPlanStyles(membership)

  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-2">
        <div className="flex w-full flex-col gap-2">
          <div
            className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 shadow-sm ${bgColor} ring-1 ring-white/10`}
          >
            <div className="flex items-center gap-2">
              <PlanIcon className={`size-4 ${iconColor}`} />
              <span className={`text-sm font-medium ${textColor}`}>
                {formatMembership(membership)} Plan
              </span>
            </div>
            <Button
              variant={membership === "free" ? "secondary" : "outline"}
              size="sm"
              className={`h-7 px-2 text-xs font-medium ${membership !== "free" ? "border-white/30 bg-white/20 text-white hover:bg-white/30" : ""}`}
              onClick={() => setIsPlanDialogOpen(true)}
            >
              {membership === "free" ? "Upgrade" : "Change"}
            </Button>
          </div>

          <div className="flex items-center gap-2 px-2 font-medium">
            <UserButton afterSignOutUrl="/" />
            <span className="group-data-[collapsible=icon]:hidden">
              {user?.fullName}
            </span>
          </div>
        </div>
      </SidebarMenuItem>

      <PlanDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        currentPlan={membership}
      />
    </SidebarMenu>
  )
}
