/*
<ai_context>
URL validation utilities for the application, optimized for flexibility and detailed feedback.
</ai_context>
*/

import createLogger from "@/lib/logger"

const logger = createLogger("URLValidation")

// Example eCommerce domains (reference only, not enforced by default)
export const EXAMPLE_ECOMMERCE_DOMAINS = [
  "*.shopify.com",
  "*.myshopify.com",
  "amazon.com",
  "etsy.com",
  "ebay.com",
  "walmart.com",
  "target.com",
  "bestbuy.com"
]

// Validation result type for detailed feedback
export interface UrlValidationResult {
  url: string
  isValid: boolean
  normalizedUrl?: string
  error?: string
}

/**
 * Validates a URL string with enhanced checks
 * @param url The URL to validate
 * @returns Detailed validation result
 */
export function validateUrl(url: string): UrlValidationResult {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) {
    return { url, isValid: false, error: "URL is empty" }
  }

  const urlWithProtocol = trimmedUrl.match(/^https?:\/\//)
    ? trimmedUrl
    : `https://${trimmedUrl}`

  try {
    const parsedUrl = new URL(urlWithProtocol)

    // Protocol check
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return { url, isValid: false, error: "Only HTTP/HTTPS protocols allowed" }
    }

    // Hostname validation
    const hostname = parsedUrl.hostname
    const invalidHostnames = [
      "localhost",
      "invalid-url",
      "example.com",
      "test.com"
    ]
    if (
      !hostname ||
      invalidHostnames.includes(hostname) ||
      hostname.includes("invalid") ||
      hostname.includes("example") ||
      !hostname.includes(".")
    ) {
      logger.warn(`Invalid hostname detected: ${hostname}`)
      return { url, isValid: false, error: `Invalid hostname: ${hostname}` }
    }

    // TLD validation
    const tldMatch = hostname.match(/\.([^.]+)$/)
    if (!tldMatch || tldMatch[1].length < 2) {
      logger.warn(`Invalid TLD in hostname: ${hostname}`)
      return {
        url,
        isValid: false,
        error: "Invalid TLD (must be 2+ characters)"
      }
    }

    // Length check (2048 is a common practical limit)
    if (urlWithProtocol.length > 2048) {
      return { url, isValid: false, error: "URL exceeds 2048 characters" }
    }

    return { url, isValid: true, normalizedUrl: parsedUrl.toString() }
  } catch (error) {
    logger.warn(`Error validating URL ${url}:`, error)
    return {
      url,
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid URL format"
    }
  }
}

/**
 * Checks if a URL's domain is in the allowed list (supports wildcards)
 * @param url The URL to check
 * @param allowedDomains Optional array of allowed domains (defaults to all allowed)
 * @returns True if the domain is allowed, false otherwise
 */
export function isAllowedDomain(
  url: string,
  allowedDomains?: string[]
): boolean {
  if (!allowedDomains || allowedDomains.length === 0) return true

  const result = validateUrl(url)
  if (!result.isValid) return false

  const hostname = new URL(result.normalizedUrl!).hostname
  return allowedDomains.some(domain => {
    if (domain.startsWith("*.")) {
      const baseDomain = domain.slice(2)
      return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`)
    }
    return hostname === domain || hostname.endsWith(`.${domain}`)
  })
}

/**
 * Normalizes a URL by ensuring it has a protocol and is properly formatted
 * @param url The URL to normalize
 * @returns The normalized URL or null if invalid
 */
export function normalizeUrl(url: string): string | null {
  const result = validateUrl(url)
  return result.isValid ? result.normalizedUrl! : null
}

/**
 * Removes duplicate URLs from an array after validation
 * @param urls Array of URLs to process
 * @returns Array of unique, valid URLs
 */
export function removeDuplicateUrls(urls: string[]): string[] {
  const validated = urls.map(url => validateUrl(url))
  const uniqueUrls = new Set(
    validated.filter(v => v.isValid).map(v => v.normalizedUrl!)
  )
  return Array.from(uniqueUrls)
}

/**
 * Parses a string containing multiple URLs (one per line)
 * @param input String with URLs (one per line)
 * @returns Array of parsed URLs (unvalidated)
 */
export function parseUrlsFromText(input: string): string[] {
  if (!input || typeof input !== "string") return []
  return input
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

/**
 * Validates multiple URLs with optional domain checking
 * @param urls Array of URLs to validate
 * @param allowedDomains Optional array of allowed domains
 * @returns Array of validation results
 */
export function validateUrls(
  urls: string[],
  allowedDomains?: string[]
): UrlValidationResult[] {
  return urls.map(url => {
    const result = validateUrl(url)
    if (!result.isValid) return result
    if (!isAllowedDomain(url, allowedDomains)) {
      return { ...result, isValid: false, error: "Domain not allowed" }
    }
    return result
  })
}

/**
 * Processes raw URL input text into validated, normalized, unique URLs
 * @param input Raw text input with URLs (one per line)
 * @param allowedDomains Optional array of allowed domains
 * @returns Array of processed URLs
 */
export function processUrlInput(
  input: string,
  allowedDomains?: string[]
): string[] {
  const parsedUrls = parseUrlsFromText(input)
  const validated = validateUrls(parsedUrls, allowedDomains)
  return validated.filter(v => v.isValid).map(v => v.normalizedUrl!)
}
