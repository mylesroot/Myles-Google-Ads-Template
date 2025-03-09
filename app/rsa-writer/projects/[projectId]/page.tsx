"use server"

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { ProjectDetail } from "@/components/rsa-writer/project-detail"
import { Skeleton } from "@/components/ui/skeleton"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params

  return (
    <div className="container py-6">
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailContent projectId={projectId} />
      </Suspense>
    </div>
  )
}

async function ProjectDetailContent({ projectId }: { projectId: string }) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const projects = await getProjectsByUserIdAction(userId)

  if (!projects) {
    throw new Error("Failed to fetch projects")
  }

  const project = projects.data?.find(project => project.id === projectId)

  if (!project) {
    notFound()
  }

  return <ProjectDetail project={project} />
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* URL list skeleton */}
        <div className="md:col-span-1">
          <Skeleton className="mb-4 h-10 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        {/* Content area skeleton */}
        <div className="md:col-span-2">
          <Skeleton className="mb-4 h-10 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
