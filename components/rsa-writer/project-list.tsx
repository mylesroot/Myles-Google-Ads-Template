"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw } from "lucide-react"
import { SelectProject } from "@/db/schema"
import { formatDistanceToNow } from "date-fns"

interface ProjectListProps {
  projects: SelectProject[]
  isLoading: boolean
  onRefresh: () => void
  onViewProject: (projectId: string) => void
}

export function ProjectList({
  projects,
  isLoading,
  onRefresh,
  onViewProject
}: ProjectListProps) {
  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    if (status === "completed") {
      return <Badge className="bg-green-500">Completed</Badge>
    } else if (status === "failed") {
      return <Badge variant="destructive">Failed</Badge>
    } else if (status.startsWith("scraping") || status === "pending") {
      return <Badge className="bg-blue-500">In Progress</Badge>
    } else {
      return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            View and manage your URL scraping projects
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-2">No projects found</p>
            <p className="text-muted-foreground text-sm">
              Submit URLs above to create your first project
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>URLs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map(project => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {formatDistanceToNow(new Date(project.createdAt), {
                        addSuffix: true
                      })}
                    </TableCell>
                    <TableCell>{project.urls.length}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProject(project.id)}
                        disabled={
                          project.status === "pending" ||
                          project.status?.startsWith("scraping")
                        }
                      >
                        <Eye className="mr-1 size-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
