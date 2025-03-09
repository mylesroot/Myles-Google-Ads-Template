"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import { CopyDisplay } from "@/components/rsa-writer/copy-display"
import { GenerateCopyButton } from "@/components/rsa-writer/generate-copy-button"
import { CopyEditor } from "@/components/rsa-writer/copy-editor"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const projectsResult = await getProjectsByUserIdAction(userId)
  if (!projectsResult.isSuccess) throw new Error("Failed to load projects")
  const projects = projectsResult.data

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center p-6 pt-16">
      <div className="w-full max-w-4xl">
        {projects.map(project => (
          <div key={project.id} className="mb-8 rounded-lg border p-4">
            <h2 className="text-xl font-semibold">Project: {project.id}</h2>
            <p>Status: {project.status}</p>
            <GenerateCopyButton projectId={project.id} />
            <CopyDisplay project={project} />
            <CopyEditor project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}
