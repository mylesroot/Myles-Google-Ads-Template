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

interface GenerateSingleCopyResult {
  projectId: string
  url: string
  copy: {
    headlines: string[]
    descriptions: string[]
  }
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

    const scrapedDataObj = project.scrapedData as Record<string, any>
    const urlCount = Object.keys(scrapedDataObj).length

    if (profile.membership === "free" && urlCount > 5) {
      return { isSuccess: false, message: "Free tier limited to 5 URLs" }
    }
    if (profile.membership === "free" || profile.membership === "starter") {
      const credits = profile.credits ?? 0
      const requiredCredits = urlCount * 0.5

      if (credits < requiredCredits) {
        return {
          isSuccess: false,
          message: `Insufficient credits: You need ${requiredCredits} credits for ${urlCount} URLs`
        }
      }
    }

    await updateProjectAction(projectId, { status: "generating" })

    const generatedCopy: Record<
      string,
      { headlines: string[]; descriptions: string[] }
    > = {}

    for (const url of Object.keys(scrapedDataObj)) {
      const urlData = scrapedDataObj[url]
      if (!urlData || urlData.success !== true) {
        logger.warn(`Skipping URL with missing or invalid data: ${url}`)
        continue
      }

      try {
        const copy = await openAIService.generateAdCopy({
          scrapedData: urlData,
          url
        })
        generatedCopy[url] = copy
      } catch (error) {
        logger.error(`Error generating copy for URL ${url}:`, error)
        // Continue with other URLs even if one fails
      }
    }

    await updateProjectAction(projectId, { generatedCopy, status: "completed" })

    if (
      (profile.membership === "free" || profile.membership === "starter") &&
      profile.credits !== null
    ) {
      await updateProfileAction(userId, {
        credits: profile.credits - urlCount * 0.5
      })
    }

    revalidatePath("/rsa-writer")

    return {
      isSuccess: true,
      message: `Generated copy for ${Object.keys(generatedCopy).length} URLs`,
      data: { projectId, generatedCount: Object.keys(generatedCopy).length }
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

export async function generateSingleCopyAction(
  projectId: string,
  url: string
): Promise<ActionState<GenerateSingleCopyResult>> {
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

    const scrapedDataObj = project.scrapedData as Record<string, any>
    if (!scrapedDataObj[url]) {
      return { isSuccess: false, message: "URL not found in scraped data" }
    }

    if (profile.membership === "free" || profile.membership === "starter") {
      const credits = profile.credits ?? 0
      if (credits < 0.5) {
        return {
          isSuccess: false,
          message: "Insufficient credits: You need at least 0.5 credits"
        }
      }
    }

    const urlData = scrapedDataObj[url]
    if (!urlData || urlData.success !== true) {
      return { isSuccess: false, message: "Invalid data for the URL" }
    }

    const copy = await openAIService.generateAdCopy({
      scrapedData: urlData,
      url
    })

    const generatedCopy = {
      ...((project.generatedCopy as Record<string, any>) || {}),
      [url]: copy
    }

    await updateProjectAction(projectId, { generatedCopy })

    if (
      (profile.membership === "free" || profile.membership === "starter") &&
      profile.credits !== null
    ) {
      await updateProfileAction(userId, { credits: profile.credits - 0.5 })
    }

    revalidatePath("/rsa-writer")

    return {
      isSuccess: true,
      message: "Generated copy for URL",
      data: { projectId, url, copy }
    }
  } catch (error) {
    logger.error(`Error generating copy for URL ${url}:`, error)
    return {
      isSuccess: false,
      message:
        error instanceof Error ? error.message : "Failed to generate copy"
    }
  }
}
