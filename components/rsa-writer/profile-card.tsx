"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SelectProfile } from "@/db/schema"
import { CreditCard, Star, Zap } from "lucide-react"

interface ProfileCardProps {
  profile: SelectProfile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const getMembershipBadge = (membership: string) => {
    switch (membership) {
      case "pro":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            <Star className="mr-1 size-3" />
            Pro
          </Badge>
        )
      case "basic":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Zap className="mr-1 size-3" />
            Basic
          </Badge>
        )
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  const getCreditsDisplay = () => {
    if (profile.membership === "pro") {
      return "Unlimited"
    } else if (profile.membership === "basic") {
      return profile.credits?.toString() || "0"
    } else {
      return "5 per day"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Your Account</CardTitle>
          {getMembershipBadge(profile.membership)}
        </div>
        <CardDescription>Manage your account and subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Membership</p>
            <p className="text-muted-foreground text-sm capitalize">
              {profile.membership} Plan
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Credits</p>
            <p className="text-muted-foreground text-sm">
              {getCreditsDisplay()}
            </p>
          </div>
          {profile.membership !== "pro" && (
            <div className="col-span-2 mt-2">
              <p className="text-muted-foreground text-sm">
                {profile.membership === "free"
                  ? "Upgrade to Basic or Pro for more credits and features."
                  : "Upgrade to Pro for unlimited credits and advanced features."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
