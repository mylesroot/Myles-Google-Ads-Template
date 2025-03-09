/*
<ai_context>
Contains server actions related to projects in the DB.
</ai_context>
*/

"use server"

import { db } from "@/db/db"
import {
  InsertProject,
  projectsTable,
  SelectProject
} from "@/db/schema/projects-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"

// Type for generated_copy structure (assuming one version per URL for simplicity)
type GeneratedCopy = Record<
  string,
  { headlines: string[]; descriptions: string[] }
>

export async function createProjectAction(
  data: InsertProject
): Promise<ActionState<SelectProject>> {
  try {
    const [newProject] = await db.insert(projectsTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Project created successfully",
      data: newProject
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return { isSuccess: false, message: "Failed to create project" }
  }
}

export async function getProjectsByUserIdAction(
  userId: string
): Promise<ActionState<SelectProject[]>> {
  try {
    const projects = await db.query.projects.findMany({
      where: eq(projectsTable.userId, userId)
    })

    return {
      isSuccess: true,
      message: "Projects retrieved successfully",
      data: projects
    }
  } catch (error) {
    console.error("Error getting projects by user id", error)
    return { isSuccess: false, message: "Failed to get projects" }
  }
}

export async function updateProjectAction(
  id: string,
  data: Partial<InsertProject>
): Promise<ActionState<SelectProject>> {
  try {
    const [updatedProject] = await db
      .update(projectsTable)
      .set(data)
      .where(eq(projectsTable.id, id))
      .returning()

    if (!updatedProject) {
      return { isSuccess: false, message: "Project not found to update" }
    }

    return {
      isSuccess: true,
      message: "Project updated successfully",
      data: updatedProject
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return { isSuccess: false, message: "Failed to update project" }
  }
}

export async function deleteProjectAction(
  id: string
): Promise<ActionState<void>> {
  try {
    await db.delete(projectsTable).where(eq(projectsTable.id, id))
    return {
      isSuccess: true,
      message: "Project deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { isSuccess: false, message: "Failed to delete project" }
  }
}

export async function updateGeneratedCopyAction(
  projectId: string,
  generatedCopy: GeneratedCopy
): Promise<ActionState<SelectProject>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Verify the project exists and belongs to the user
    const project = await db.query.projects.findFirst({
      where: eq(projectsTable.id, projectId)
    })
    if (!project || project.userId !== userId) {
      return { isSuccess: false, message: "Project not found or unauthorized" }
    }

    // Update only the generatedCopy field
    const [updatedProject] = await db
      .update(projectsTable)
      .set({ generatedCopy, updatedAt: new Date() })
      .where(eq(projectsTable.id, projectId))
      .returning()

    return {
      isSuccess: true,
      message: "Generated copy updated successfully",
      data: updatedProject
    }
  } catch (error) {
    console.error("Error updating generated copy:", error)
    return { isSuccess: false, message: "Failed to update generated copy" }
  }
}
