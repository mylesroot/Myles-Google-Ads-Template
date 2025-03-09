/*
<ai_context>
Test script for the Firecrawl service.
Run with: npx tsx scripts/test-firecrawl.ts
</ai_context>
*/

import {
  firecrawlService,
  FirecrawlService
} from "../lib/services/firecrawl-service"
import {
  processUrlInput,
  validateUrl,
  validateUrls,
  EXAMPLE_ECOMMERCE_DOMAINS
} from "../lib/utils/url-validation"
import createLogger from "../lib/logger"

const logger = createLogger("TestFirecrawl")

async function main() {
  try {
    // Test URL validation with a mix of valid and invalid URLs
    const testUrls = `
      https://www.amazon.ben/dp/B07ZPML7NP
      invalid-url
      https://invalid-url.com/product
      https://www.etsy.com/listing/123456789/test-product
      https://example.com/product-page
      http://some-ecommerce-store.com/products/12345
      https://homeandroost.co.uk/collections/rabbits
      https://homeandroost.co.uk/collections/quality-rabbit-hutches/products/hutch-4ft-chartwell-single
    `

    logger.info("Processing URLs...")

    // First, show detailed validation results for each URL
    const parsedUrls = testUrls
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
    logger.info("\nDetailed URL validation results:")

    const validationResults = validateUrls(parsedUrls)
    validationResults.forEach(result => {
      logger.info(
        `${result.url}: ${result.isValid ? "✅ VALID" : "❌ INVALID"} ${result.error ? `- ${result.error}` : ""}`
      )
      if (result.isValid) {
        logger.info(`  Normalized: ${result.normalizedUrl}`)
      }
    })

    // Now process URLs with the utility function
    const validUrls = processUrlInput(testUrls)
    logger.info(`\nValid URLs after processing: ${validUrls.length}`)
    validUrls.forEach(url => logger.info(`- ${url}`))

    // Test domain restrictions
    logger.info("\nTesting domain restrictions with example eCommerce domains:")
    const restrictedService = new FirecrawlService("test-api-key", {
      allowedDomains: EXAMPLE_ECOMMERCE_DOMAINS
    })

    validUrls.forEach(url => {
      const isAllowed = restrictedService.validateUrl(url)
      logger.info(`${url}: ${isAllowed ? "✅ ALLOWED" : "❌ RESTRICTED"}`)
    })

    // Test invalid URLs to make sure they're rejected
    const invalidUrls = [
      "invalid-url",
      "https://invalid-url/",
      "https://example.com",
      "not a url at all"
    ]

    logger.info("\nTesting invalid URL detection:")
    invalidUrls.forEach(url => {
      const validationResult = validateUrl(url)
      const serviceValidation = firecrawlService.validateUrl(url)
      logger.info(
        `${url}: ${serviceValidation ? "❌ INCORRECTLY VALIDATED" : "✅ CORRECTLY REJECTED"} - ${validationResult.error || "No error"}`
      )
    })

    // Test single URL scraping
    if (validUrls.length > 0) {
      logger.info("\nTesting single URL scraping...")
      const result = await firecrawlService.scrapeUrl(validUrls[0])

      if (result.success) {
        logger.info(`Successfully scraped: ${result.url}`)
        logger.info(
          "Data sample:",
          result.data.data?.content?.substring(0, 100) + "..."
        )
      } else {
        logger.error(`Failed to scrape: ${result.url}`)
        logger.error("Error:", result.error)
      }
    }

    // Test batch URL scraping
    if (validUrls.length > 0) {
      logger.info("\nTesting batch URL scraping...")
      const results = await firecrawlService.batchScrapeUrls(
        validUrls,
        progress => {
          logger.info(`Progress: ${progress.completed}/${progress.total}`)
        }
      )

      logger.info(
        `Batch scraping completed. Success: ${results.filter(r => r.success).length}/${results.length}`
      )

      // Log results
      results.forEach(result => {
        if (result.success) {
          logger.info(`✅ ${result.url}`)
        } else {
          logger.error(`❌ ${result.url}: ${result.error}`)
        }
      })
    }
  } catch (error) {
    logger.error("Test failed:", error)
  }
}

main().catch(error => {
  logger.error("Unhandled error:", error)
  process.exit(1)
})
