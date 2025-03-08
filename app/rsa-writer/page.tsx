// app/rsa-writer/page.tsx
"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import { UrlInputForm } from "@/components/rsa-writer/url-input-form"

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
      <div className="mb-8 max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">RSA Writer</h1>
        <p className="text-muted-foreground text-lg">
          Membership: {profile.membership} | Credits:{" "}
          {profile.credits ?? "Unlimited"}
        </p>
      </div>
      <div className="mb-8 w-full max-w-2xl">
        <UrlInputForm />
      </div>
    </div>
  )
}
