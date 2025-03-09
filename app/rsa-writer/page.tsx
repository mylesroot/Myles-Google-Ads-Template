// app/rsa-writer/page.tsx
"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import { UrlInputForm } from "@/components/rsa-writer/url-input-form"
import { CreditsDisplay } from "@/components/rsa-writer/credits-display"
import { CheckoutSuccess } from "@/components/rsa-writer/checkout-success"
import { Suspense } from "react"

// A client component wrapper specifically for the checkout status
function CheckoutStatusWrapper() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccess />
    </Suspense>
  )
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess) throw new Error("Failed to load profile")
  const profile = profileResult.data

  const projectsResult = await getProjectsByUserIdAction(userId)
  if (!projectsResult.isSuccess) throw new Error("Failed to load projects")
  const projects = projectsResult.data

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-6 pt-16">
      <div className="mb-8 w-full max-w-2xl">
        <CheckoutStatusWrapper />
      </div>

      <div className="mb-8 max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">RSA Writer</h1>
        <p className="text-muted-foreground mb-3 text-lg">
          Membership: {profile.membership}
        </p>

        <CreditsDisplay
          credits={profile.credits}
          membership={profile.membership}
        />
      </div>
      <div className="mb-8 w-full max-w-2xl">
        <UrlInputForm />
      </div>
    </div>
  )
}
