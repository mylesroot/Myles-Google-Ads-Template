/*
<ai_context>
Contains server actions related to scraping URLs using the FirecrawlService.
</ai_context>
*/

"use server"

import { auth } from "@clerk/nextjs/server"
import { firecrawlService } from "@/lib/services/firecrawl-service"
import { parseUrlsFromText } from "@/lib/utils/url-validation"
import { ActionState } from "@/types"
import { revalidatePath } from "next/cache"
import {
  getProfileByUserIdAction,
  updateProfileAction
} from "@/actions/db/profiles-actions"
import {
  createProjectAction,
  updateProjectAction
} from "@/actions/db/projects-actions"
import createLogger from "@/lib/logger"

const logger = createLogger("ScrapeActions")

interface ScrapeResult {
  projectId: string
  invalidUrls: string[]
}

/**
 * Scrapes URLs from raw text input, creates a project, and stores the scraped data
 * @param projectName Name of the project
 * @param rawInput Raw text input with URLs (one per line)
 * @returns ActionState with project ID and invalid URLs
 */
export async function scrapeUrlsAction(
  projectName: string,
  rawInput: string
): Promise<ActionState<ScrapeResult>> {
  try {
    // Get the current user
    const { userId } = await auth()
    if (!userId) {
      return { isSuccess: false, message: "Unauthorized" }
    }

    // Parse URLs from the raw input
    const urls = parseUrlsFromText(rawInput)
    if (!urls.length) {
      return { isSuccess: false, message: "No URLs provided" }
    }

    logger.info(`Processing ${urls.length} URLs for user ${userId}`)

    // Validate URLs first
    const validUrls = urls.filter(url => firecrawlService.validateUrl(url))
    const invalidUrls = urls.filter(url => !firecrawlService.validateUrl(url))

    if (validUrls.length === 0) {
      return {
        isSuccess: false,
        message: "All URLs are invalid. Please provide valid URLs."
      }
    }

    // Get the user's profile to check membership and credits
    const profileResult = await getProfileByUserIdAction(userId)
    if (!profileResult.isSuccess) {
      return { isSuccess: false, message: profileResult.message }
    }

    const profile = profileResult.data
    const urlCount = validUrls.length

    // Check if free or starter tier user has enough credits
    if (profile.membership === "free" || profile.membership === "starter") {
      const credits = profile.credits ?? 0
      // Each URL requires 0.5 credits
      const requiredCredits = urlCount * 0.5

      if (Number(credits) < requiredCredits) {
        return {
          isSuccess: false,
          message: `Insufficient credits: You need ${requiredCredits} credits for ${urlCount} URLs`
        }
      }
    }

    // Create a new project with the valid URLs
    const projectResult = await createProjectAction({
      id: crypto.randomUUID(),
      userId,
      name: projectName,
      urls: validUrls, // Only store valid URLs
      status: "pending"
    })

    if (!projectResult.isSuccess) {
      return { isSuccess: false, message: projectResult.message }
    }

    const project = projectResult.data

    // Update the project status to "scraping"
    await updateProjectAction(project.id, { status: "scraping" })

    // Deduct credits for free and starter tier users
    if (
      (profile.membership === "free" || profile.membership === "starter") &&
      profile.credits !== null
    ) {
      await updateProfileAction(userId, {
        credits: String(Number(profile.credits) - urlCount * 0.5)
      })
    }

    // Scrape the URLs in batches
    const scrapeResults = await firecrawlService.batchScrapeUrls(
      validUrls,
      progress => {
        // Update the project with progress information
        updateProjectAction(project.id, {
          status: `scraping ${progress.completed}/${progress.total}`
        }).catch(error => {
          logger.error(
            `Failed to update project ${project.id} with progress:`,
            error
          )
        })
      }
    )

    // Check if we got any successful results
    const successfulResults = scrapeResults.filter(result => result.success)
    if (successfulResults.length === 0 && scrapeResults.length > 0) {
      // All scraping attempts failed
      await updateProjectAction(project.id, {
        status: "failed",
        scrapedData: {}
      })

      return {
        isSuccess: false,
        message:
          "Failed to scrape any URLs successfully. Please try again with different URLs."
      }
    }

    // Process the scrape results
    const scrapedData = scrapeResults.reduce(
      (acc, result) => {
        if (result.success && result.data) {
          acc[result.url] = result.data
        }
        return acc
      },
      {} as Record<string, any>
    )

    // Update the project with the scraped data and set status to "completed"
    await updateProjectAction(project.id, {
      scrapedData,
      status: "completed"
    })

    // Get the list of invalid URLs from both validation and scraping
    const failedScrapeUrls = scrapeResults
      .filter(result => !result.success)
      .map(result => result.url)

    const allInvalidUrls = [...invalidUrls, ...failedScrapeUrls]
    const successMessage =
      allInvalidUrls.length > 0
        ? `URLs scraped successfully. ${successfulResults.length}/${urls.length} URLs were scraped successfully.`
        : "All URLs were scraped successfully."

    // Revalidate the dashboard page to show the updated data
    revalidatePath("/dashboard")

    return {
      isSuccess: true,
      message: successMessage,
      data: {
        projectId: project.id,
        invalidUrls: allInvalidUrls
      }
    }
  } catch (error) {
    logger.error("Error scraping URLs:", error)
    return {
      isSuccess: false,
      message:
        error instanceof Error
          ? `Failed to scrape URLs: ${error.message}`
          : "Failed to scrape URLs"
    }
  }
}
