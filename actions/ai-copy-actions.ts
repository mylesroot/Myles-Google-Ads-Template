"use server"

import { auth } from "@clerk/nextjs/server"
import { openAIService } from "@/lib/services/openai-service"
import {
  getProfileByUserIdAction,
  updateProfileAction
} from "@/actions/db/profiles-actions"
import {
  getProjectsByUserIdAction,
  updateProjectAction
} from "@/actions/db/projects-actions"
import { ActionState } from "@/types"
import createLogger from "@/lib/logger"
import { revalidatePath } from "next/cache"

const logger = createLogger("AICopyActions")

interface GenerateCopyResult {
  projectId: string
  generatedCount: number
}

export async function generateCopyAction(
  projectId: string
): Promise<ActionState<GenerateCopyResult>> {
  try {
    const { userId } = await auth()
    if (!userId) return { isSuccess: false, message: "Unauthorized" }

    const profileResult = await getProfileByUserIdAction(userId)
    if (!profileResult.isSuccess)
      return { isSuccess: false, message: profileResult.message }
    const profile = profileResult.data

    const projectsResult = await getProjectsByUserIdAction(userId)
    if (!projectsResult.isSuccess)
      return { isSuccess: false, message: projectsResult.message }
    const project = projectsResult.data.find(p => p.id === projectId)
    if (!project) return { isSuccess: false, message: "Project not found" }
    if (!project.scrapedData)
      return { isSuccess: false, message: "No scraped data available" }

    const urlCount = Object.keys(project.scrapedData).length

    if (profile.membership === "free" && urlCount > 5) {
      return { isSuccess: false, message: "Free tier limited to 5 URLs" }
    }
    if (profile.membership === "basic") {
      const credits = profile.credits ?? 0
      if (credits < urlCount) {
        return {
          isSuccess: false,
          message: `Insufficient credits: ${credits} available, ${urlCount} needed`
        }
      }
    }

    await updateProjectAction(projectId, { status: "generating" })

    const generatedCopy: Record<
      string,
      { headlines: string[]; descriptions: string[] }
    > = {}
    for (const [url, data] of Object.entries(project.scrapedData)) {
      const copy = await openAIService.generateAdCopy({
        scrapedData: data,
        url
      })
      generatedCopy[url] = copy
    }

    await updateProjectAction(projectId, { generatedCopy, status: "completed" })

    if (profile.membership === "basic" && profile.credits !== null) {
      await updateProfileAction(userId, { credits: profile.credits - urlCount })
    }

    revalidatePath("/rsa-writer")

    return {
      isSuccess: true,
      message: `Generated copy for ${urlCount} URLs`,
      data: { projectId, generatedCount: urlCount }
    }
  } catch (error) {
    logger.error("Error generating copy:", error)
    await updateProjectAction(projectId, { status: "failed" })
    return {
      isSuccess: false,
      message:
        error instanceof Error ? error.message : "Failed to generate copy"
    }
  }
}
