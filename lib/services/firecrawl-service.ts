/*
<ai_context>
Firecrawl service for scraping URLs.
</ai_context>
*/

"use server"

import FirecrawlApp from "@mendable/firecrawl-js"
import { env } from "@/lib/env"
import createLogger from "@/lib/logger"
import { validateUrl, isAllowedDomain } from "@/lib/utils/url-validation"

const logger = createLogger("FirecrawlService")

// Check if we're using a test API key
const isTestMode = env.FIRECRAWL_API_KEY === "test-api-key"

export interface FirecrawlConfig {
  maxConcurrentRequests?: number
  allowedDomains?: string[]
}

export interface ScrapeResult {
  url: string
  success: boolean
  data?: any
  error?: string
}

export interface BatchScrapeProgress {
  completed: number
  total: number
  results: ScrapeResult[]
}

export type ProgressCallback = (progress: BatchScrapeProgress) => void

export class FirecrawlService {
  private client: FirecrawlApp | null
  private config: FirecrawlConfig

  constructor(
    apiKey: string = env.FIRECRAWL_API_KEY,
    config: FirecrawlConfig = {}
  ) {
    // Only initialize the client if we're not in test mode
    this.client = isTestMode ? null : new FirecrawlApp({ apiKey })
    this.config = {
      maxConcurrentRequests: 5,
      allowedDomains: [],
      ...config
    }

    if (isTestMode) {
      logger.warn(
        "Running in test mode with mock data. No actual API calls will be made."
      )
    }
  }

  /**
   * Validates a URL
   * @param url The URL to validate
   * @returns True if the URL is valid, false otherwise
   */
  validateUrl(url: string): boolean {
    try {
      // Use the imported validation utilities
      const validationResult = validateUrl(url)
      if (!validationResult.isValid) {
        logger.warn(`Invalid URL format: ${url} - ${validationResult.error}`)
        return false
      }

      // Check if the domain is allowed (if domains are specified)
      if (!isAllowedDomain(url, this.config.allowedDomains)) {
        logger.warn(`Domain not allowed for URL: ${url}`)
        return false
      }

      return true
    } catch (error) {
      logger.error(`Error validating URL ${url}:`, error)
      return false
    }
  }

  /**
   * Generates mock data for testing
   * @param url The URL to generate mock data for
   * @returns A mock scrape result
   */
  private generateMockData(url: string): any {
    try {
      const validationResult = validateUrl(url)
      if (!validationResult.isValid) {
        throw new Error(`Invalid URL: ${validationResult.error}`)
      }

      const parsedUrl = new URL(validationResult.normalizedUrl!)

      return {
        success: true,
        data: {
          content: `# Mock Product Page for ${url}\n\nThis is mock content for testing purposes.\n\n## Product Description\n\nThis is a fantastic product that solves all your problems.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Price\n\n$99.99`,
          metadata: {
            title: `Mock Product - ${parsedUrl.hostname}`,
            description:
              "This is a mock product description for testing purposes.",
            price: "$99.99",
            currency: "USD",
            images: ["https://example.com/mock-image.jpg"]
          },
          url
        }
      }
    } catch (error) {
      logger.error(`Error generating mock data for ${url}:`, error)
      return {
        success: true,
        data: {
          content:
            "# Mock Product\n\nThis is mock content for testing purposes.",
          metadata: {
            title: "Mock Product",
            description: "Mock description"
          },
          url
        }
      }
    }
  }

  /**
   * Scrapes a single URL
   * @param url The URL to scrape
   * @param abortSignal Optional AbortSignal to cancel the request
   * @returns The scrape result
   */
  async scrapeUrl(
    url: string,
    abortSignal?: AbortSignal
  ): Promise<ScrapeResult> {
    try {
      // Validate the URL first - this is important even in test mode
      if (!this.validateUrl(url)) {
        return {
          url,
          success: false,
          error: "Invalid URL"
        }
      }

      logger.info(`Scraping URL: ${url}`)

      // If in test mode, return mock data
      if (isTestMode) {
        logger.info(`[TEST MODE] Returning mock data for: ${url}`)
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        return {
          url,
          success: true,
          data: this.generateMockData(url)
        }
      }

      // Call the Firecrawl API
      const response = await this.client!.scrapeUrl(url, {
        formats: ["markdown"]
        // Note: The SDK doesn't support AbortSignal directly
      })

      if (!response.success) {
        logger.error(`Failed to scrape URL ${url}:`, response.error)
        return {
          url,
          success: false,
          error: response.error || "Failed to scrape URL"
        }
      }

      logger.info(`Successfully scraped URL: ${url}`)
      return {
        url,
        success: true,
        data: response
      }
    } catch (error) {
      logger.error(`Error scraping URL ${url}:`, error)
      return {
        url,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  /**
   * Processes URLs in batches to avoid overwhelming the API
   * @param urls The URLs to scrape
   * @param onProgress Optional callback for progress updates
   * @param batchSize The number of URLs to process concurrently
   * @returns The scrape results
   */
  async batchScrapeUrls(
    urls: string[],
    onProgress?: ProgressCallback,
    batchSize: number = this.config.maxConcurrentRequests || 5
  ): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = []

    // Filter out invalid URLs using our service's validateUrl method
    // which checks both URL validity and allowed domains
    const validUrls = urls.filter(url => this.validateUrl(url))

    if (validUrls.length === 0) {
      logger.warn("No valid URLs to scrape")
      return []
    }

    logger.info(
      `Starting batch scrape of ${validUrls.length} URLs (${urls.length - validUrls.length} URLs were filtered out as invalid)`
    )

    // Process URLs in batches
    for (let i = 0; i < validUrls.length; i += batchSize) {
      const batch = validUrls.slice(i, i + batchSize)

      // Process each URL in the current batch concurrently
      const batchPromises = batch.map(url => this.scrapeUrl(url))
      const batchResults = await Promise.all(batchPromises)

      // Add batch results to the overall results
      results.push(...batchResults)

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          completed: results.length,
          total: validUrls.length,
          results: [...results] // Create a copy to avoid reference issues
        })
      }

      logger.info(
        `Completed batch ${i / batchSize + 1}/${Math.ceil(validUrls.length / batchSize)}`
      )
    }

    logger.info(
      `Batch scrape completed. Success: ${results.filter(r => r.success).length}/${results.length}`
    )
    return results
  }
}

// Export a singleton instance for convenience
export const firecrawlService = new FirecrawlService()
