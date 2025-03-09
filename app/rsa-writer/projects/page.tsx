"use server"

import { Suspense } from "react"
import { auth } from "@clerk/nextjs/server"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import { ProjectsOverview } from "@/components/rsa-writer/projects-overview"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ProjectsPage() {
  return (
    <div className="container py-6">
      <Suspense fallback={<ProjectsOverviewSkeleton />}>
        <ProjectsOverviewContent />
      </Suspense>
    </div>
  )
}

async function ProjectsOverviewContent() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const projectsResult = await getProjectsByUserIdAction(userId)

  if (!projectsResult.isSuccess) {
    throw new Error(projectsResult.message)
  }

  return <ProjectsOverview projects={projectsResult.data} />
}

function ProjectsOverviewSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-5 w-1/6" />
            <Skeleton className="h-5 w-1/6" />
            <Skeleton className="h-5 w-1/6" />
            <Skeleton className="h-5 w-1/12" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-5 w-1/12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
