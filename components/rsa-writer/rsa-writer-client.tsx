"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProfileCard } from "@/components/rsa-writer/profile-card"
import { UrlInputForm } from "@/components/rsa-writer/url-input-form"
import { ScrapingStatus } from "@/components/rsa-writer/scraping-status"
import { ProjectList } from "@/components/rsa-writer/project-list"
import { getProjectsByUserIdAction } from "@/actions/db/projects-actions"
import { SelectProfile, SelectProject } from "@/db/schema"

interface DashboardClientProps {
  profile: SelectProfile
  initialProjects: SelectProject[]
  userId: string
}

export default function DashboardClient({
  profile,
  initialProjects,
  userId
}: DashboardClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState<SelectProject[]>(initialProjects)
  const [isLoading, setIsLoading] = useState(false)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [invalidUrls, setInvalidUrls] = useState<string[]>([])

  // Set up polling for projects in scraping status
  useEffect(() => {
    // Check if any project is in scraping status
    const hasScrapingProject = projects.some(
      p => p.status === "pending" || p.status?.startsWith("scraping")
    )

    // If there's a project in scraping status, set up polling
    if (hasScrapingProject) {
      const intervalId = setInterval(() => {
        fetchProjects()
      }, 5000) // Poll every 5 seconds

      return () => clearInterval(intervalId)
    }
  }, [projects, userId])

  // Function to fetch projects
  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      const result = await getProjectsByUserIdAction(userId)
      if (result.isSuccess) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Find the active project
  const activeProject = activeProjectId
    ? projects.find(p => p.id === activeProjectId)
    : projects.length > 0
      ? projects[0]
      : undefined

  // Handle URL submission success
  const handleUrlSubmitSuccess = (projectId: string, invalidUrls: string[]) => {
    setActiveProjectId(projectId)
    setInvalidUrls(invalidUrls)
    fetchProjects()
  }

  // Handle refresh button click
  const handleRefresh = () => {
    fetchProjects()
  }

  // Handle view project button click
  const handleViewProject = (projectId: string) => {
    setActiveProjectId(projectId)
    // Clear invalid URLs when switching projects
    setInvalidUrls([])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">RSA Writer Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <UrlInputForm onSuccess={handleUrlSubmitSuccess} />
        </div>
        <div>
          <ProfileCard profile={profile} />
        </div>
      </div>

      <ScrapingStatus
        project={activeProject}
        invalidUrls={activeProject?.id === activeProjectId ? invalidUrls : []}
      />

      <ProjectList
        projects={projects}
        isLoading={isLoading}
        onRefresh={handleRefresh}
        onViewProject={handleViewProject}
      />
    </div>
  )
}
