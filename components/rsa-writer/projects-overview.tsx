"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, Trash2, Download, FileText } from "lucide-react"
import { SelectProject } from "@/db/schema/projects-schema"
import { deleteProjectAction } from "@/actions/db/projects-actions"
import { toast } from "@/components/ui/use-toast"

interface ProjectsOverviewProps {
  projects: SelectProject[]
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleViewProject = (projectId: string) => {
    router.push(`/rsa-writer/projects/${projectId}`)
  }

  const handleDeleteProject = async (projectId: string) => {
    if (isDeleting) return

    setIsDeleting(projectId)
    try {
      const result = await deleteProjectAction(projectId)
      if (result.isSuccess) {
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted."
        })
        router.refresh()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting project",
        description:
          error instanceof Error ? error.message : "An unknown error occurred"
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline"
        label: string
      }
    > = {
      pending: { variant: "outline", label: "Pending" },
      scraping: { variant: "secondary", label: "Scraping" },
      generating: { variant: "secondary", label: "Generating" },
      completed: { variant: "default", label: "Completed" },
      review: { variant: "default", label: "Review" },
      failed: { variant: "destructive", label: "Failed" }
    }

    const statusInfo = statusMap[status] || {
      variant: "outline",
      label: status
    }

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button onClick={() => router.push("/rsa-writer")}>
          Create New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-muted/10 flex flex-col items-center justify-center rounded-lg border p-8 text-center">
          <FileText className="text-muted-foreground mb-4 size-12" />
          <h3 className="text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started with RSA generation.
          </p>
          <Button onClick={() => router.push("/rsa-writer")}>
            Create New Project
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>URLs</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map(project => (
              <TableRow
                key={project.id}
                className="cursor-pointer"
                onClick={() => handleViewProject(project.id)}
              >
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>
                  {getStatusBadge(project.status || "pending")}
                </TableCell>
                <TableCell>{project.urls.length}</TableCell>
                <TableCell>
                  {project.createdAt
                    ? format(new Date(project.createdAt), "MMM d, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={e => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={e => e.stopPropagation()}
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleViewProject(project.id)}
                      >
                        <Eye className="mr-2 size-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={project.status !== "completed"}
                      >
                        <Download className="mr-2 size-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={isDeleting === project.id}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        {isDeleting === project.id ? "Deleting..." : "Delete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
