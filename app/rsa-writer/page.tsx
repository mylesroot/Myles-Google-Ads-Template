"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import RsaWriterClient from "@/components/rsa-writer/rsa-writer-client"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get user profile
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess) {
    throw new Error("Failed to load profile")
  }

  // Get user projects
  const projectsResult = await getProjectsByUserIdAction(userId)
  const projects = projectsResult.isSuccess ? projectsResult.data : []

  return (
    <div className="p-6">
      <RsaWriterClient
        profile={profileResult.data}
        initialProjects={projects}
        userId={userId}
      />
    </div>
  )
}
