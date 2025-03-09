/*
<ai_context>
Test script for the scrapeUrlsAction.
</ai_context>
*/

import { firecrawlService } from "@/lib/services/firecrawl-service"
import { parseUrlsFromText } from "@/lib/utils/url-validation"
import { ActionState } from "@/types"
import {
  getProfileByUserIdAction,
  updateProfileAction
} from "@/actions/db/profiles-actions"
import {
  createProjectAction,
  getProjectsByUserIdAction,
  updateProjectAction
} from "@/actions/db/projects-actions"
import createLogger from "@/lib/logger"

const logger = createLogger("TestScrapeAction")

// Mock user ID for testing
const TEST_USER_ID = "user_2NNKtQxYnrTFvDsRjNMJGxcjABC"

// Test URLs - using real domains instead of example.com which is rejected
const TEST_URLS = `
example.com
bob
`

interface ScrapeResult {
  projectId: string
  invalidUrls: string[]
}

// Custom type for test script that allows data to be returned even on failure
type TestActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: T }

/**
 * Direct implementation of scraping logic for testing
 * This avoids the server-only modules that cause issues in the test environment
 */
async function scrapeUrlsForTest(
  rawInput: string
): Promise<TestActionState<ScrapeResult>> {
  try {
    // Parse URLs from the raw input
    const urls = parseUrlsFromText(rawInput)
    if (!urls.length) {
      return { isSuccess: false, message: "No URLs provided" }
    }

    logger.info(`Processing ${urls.length} URLs for user ${TEST_USER_ID}`)

    // Validate URLs first
    const validUrls = urls.filter(url => firecrawlService.validateUrl(url))
    const invalidUrls = urls.filter(url => !firecrawlService.validateUrl(url))

    if (validUrls.length === 0) {
      return {
        isSuccess: false,
        message: "All URLs are invalid",
        data: {
          projectId: "",
          invalidUrls
        }
      }
    }

    // Get the user's profile to check membership and credits
    const profileResult = await getProfileByUserIdAction(TEST_USER_ID)
    if (!profileResult.isSuccess) {
      return { isSuccess: false, message: profileResult.message }
    }

    const profile = profileResult.data
    const urlCount = validUrls.length

    // Check if the user has enough credits based on their membership
    if (profile.membership === "free" && urlCount > 5) {
      return {
        isSuccess: false,
        message: `Free tier is limited to 5 URLs. You provided ${urlCount} URLs.`,
        data: {
          projectId: "",
          invalidUrls
        }
      }
    }

    // Check if basic tier user has enough credits
    if (profile.membership === "starter") {
      const credits = profile.credits ?? 0
      if (Number(credits) < urlCount) {
        return {
          isSuccess: false,
          message: `Insufficient credits. You need ${urlCount} credits but have ${credits}.`,
          data: {
            projectId: "",
            invalidUrls
          }
        }
      }
    }

    // Create a new project with the URLs
    const projectResult = await createProjectAction({
      id: crypto.randomUUID(),
      userId: TEST_USER_ID,
      urls: validUrls, // Only store valid URLs
      status: "pending"
    })

    if (!projectResult.isSuccess) {
      return { isSuccess: false, message: projectResult.message }
    }

    const project = projectResult.data

    // Update the project status to "scraping"
    await updateProjectAction(project.id, { status: "scraping" })

    // Deduct credits for basic tier users
    if (profile.membership === "starter" && profile.credits !== null) {
      await updateProfileAction(TEST_USER_ID, {
        credits: String(Number(profile.credits) - urlCount)
      })
    }

    // Scrape the URLs in batches
    const scrapeResults = await firecrawlService.batchScrapeUrls(
      validUrls,
      progress => {
        // Update the project with progress information
        updateProjectAction(project.id, {
          status: `scraping ${progress.completed}/${progress.total}`
        }).catch((error: Error) => {
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

      // Return failure but with the project ID
      return {
        isSuccess: false,
        message: "Failed to scrape any URLs successfully",
        data: {
          projectId: project.id,
          invalidUrls: [...invalidUrls, ...scrapeResults.map(r => r.url)]
        }
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

    return {
      isSuccess: true,
      message: `URLs scraped successfully. ${successfulResults.length}/${validUrls.length} URLs were scraped successfully.`,
      data: {
        projectId: project.id,
        invalidUrls: [...invalidUrls, ...failedScrapeUrls]
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

async function testScrapeAction() {
  logger.info("Starting test for scrapeUrlsAction")

  // Get the user's profile before scraping
  const profileBefore = await getProfileByUserIdAction(TEST_USER_ID)
  if (!profileBefore.isSuccess) {
    logger.error("Failed to get profile:", profileBefore.message)
    return
  }

  logger.info(
    `User profile before scraping: membership=${profileBefore.data.membership}, credits=${profileBefore.data.credits}`
  )

  // Execute the scrape action
  logger.info("Executing scrapeUrlsAction with test URLs")
  const result = await scrapeUrlsForTest(TEST_URLS)

  if (!result.isSuccess) {
    logger.error("Scrape action failed:", result.message)
    if (result.data) {
      logger.warn("Invalid URLs:", result.data.invalidUrls)
    }
    return
  }

  logger.info("Scrape action succeeded:", result.message)
  logger.info(`Project ID: ${result.data.projectId}`)

  if (result.data.invalidUrls.length > 0) {
    logger.warn("Invalid URLs:", result.data.invalidUrls)
  } else {
    logger.info("All URLs were valid and scraped successfully")
  }

  // Get the user's profile after scraping
  const profileAfter = await getProfileByUserIdAction(TEST_USER_ID)
  if (!profileAfter.isSuccess) {
    logger.error("Failed to get profile after scraping:", profileAfter.message)
    return
  }

  logger.info(
    `User profile after scraping: membership=${profileAfter.data.membership}, credits=${profileAfter.data.credits}`
  )

  // Get the project to verify the scraped data
  const projectsResult = await getProjectsByUserIdAction(TEST_USER_ID)
  if (!projectsResult.isSuccess) {
    logger.error("Failed to get projects:", projectsResult.message)
    return
  }

  const project = projectsResult.data.find(p => p.id === result.data.projectId)
  if (!project) {
    logger.error("Project not found")
    return
  }

  logger.info(`Project status: ${project.status}`)
  logger.info(`Project URLs: ${project.urls.join(", ")}`)

  const scrapedDataCount = Object.keys(project.scrapedData || {}).length
  logger.info(`Scraped data count: ${scrapedDataCount} URLs`)
  if (scrapedDataCount > 0) {
    logger.info("Sample scraped data:", Object.keys(project.scrapedData || {}))
  }
}

// Run the test
testScrapeAction()
  .then(() => {
    logger.info("Test completed")
    process.exit(0)
  })
  .catch(error => {
    logger.error("Test failed with error:", error)
    process.exit(1)
  })
