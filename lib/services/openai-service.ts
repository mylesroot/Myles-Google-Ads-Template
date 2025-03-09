/*
<ai_context>
OpenAI service for generating ad copy.
</ai_context>
*/

import OpenAI from "openai"
import { env } from "@/lib/env"
import createLogger from "@/lib/logger"

const logger = createLogger("OpenAIService")

interface GenerateCopyOptions {
  scrapedData: Record<string, any>
  url: string
  maxHeadlines?: number
  maxDescriptions?: number
}

export class OpenAIService {
  private client: OpenAI

  constructor(apiKey: string = env.OPENAI_API_KEY) {
    this.client = new OpenAI({ apiKey })
    logger.info("OpenAI service initialized")
  }

  async generateAdCopy({
    scrapedData,
    url,
    maxHeadlines = 15,
    maxDescriptions = 4
  }: GenerateCopyOptions): Promise<{
    headlines: string[]
    descriptions: string[]
  }> {
    try {
      logger.info(`Generating ad copy for URL: ${url}`)

      // Extract relevant data from the scraped data structure
      // The actual structure is { success: boolean, markdown: string, metadata: {...} }
      let markdownContent = scrapedData.markdown || ""
      let metadata = scrapedData.metadata || {}

      // Ensure we have data to work with
      if (!markdownContent && !metadata) {
        logger.warn(`No usable content found for URL: ${url}`)
        // Return empty arrays if no data is available
        return { headlines: [], descriptions: [] }
      }

      const prompt = `
        Given the following scraped data from the URL ${url} for an eCommerce product or collection:

Markdown Content:
${markdownContent}

Metadata:
${JSON.stringify(metadata, null, 2)}

Generate 15 Google Ads headlines (max 30 characters each) and 4 descriptions (max 90 characters each) tailored to this content. Follow these instructions to create compelling, clear ad copy for an eCommerce audience:

### Context
- The ad targets searchers looking for products/collections like those on the page.
- Searchers may use queries reflecting: 
  1. Direct questions (e.g., "Where to buy [product]?")
  2. Desired answers (e.g., "[Product] for sale")
  3. Problems (e.g., "Need [product] fast")
  4. Symptoms (e.g., "No [product] nearby")
  5. Causes (e.g., "Pet stores near me")
- Focus on info-gathering searchers in the research or purchase phase.

### Ad Copy Goals
- Attract the "perfect searcher" who wants this product/collection.
- Repel irrelevant searchers with specific, qualifying language.
- Stand out with clear benefits, not features, using simple words (6-year-old level).
- Align with searcher intent from the data (e.g., title, description, markdown).

### Headline Instructions (15 total)
- **Headlines 1-5**: Should contain any unique value proposition, offer, and brand name. E.g. "[Brand Name] [Product Name]" Use keywords from metadata if relevant.
- **Headlines 6-10**: Highlight key benefits and trust factors (e.g., "Fast Shipping, 5-Star Rated"). Add qualifying details to filter searchers. Make sure to include specific numbers, shipping times, etc...
- **Headlines 11-15**: Use strong, action-oriented CTAs. Ensure variety. Don't just use "Buy Now" or "Shop Now", use something that makes sense for the product and make it different.
- Keep each headline under 30 characters.
- Use specific numbers (e.g., "57% Off"), times (e.g., "Ships in 24 Hrs"), or locations if in data.
- Add social proof (e.g., "1000+ Happy Buyers") where possible if there's data.

### Description Instructions (4 total)
- Write 4 descriptions, each under 90 characters.
- Focus on benefits (e.g., "Solve [problem] with [product]").
- Include a CTA in at least one description (e.g., "Order Today!").
- Use simple words, urgency (e.g., "Limited Stock"), and trust (e.g., "Top-Rated"). But again be specific, and use the data provided.
- Pull from markdown or metadata for inspiration, but prioritize searcher needs.

### Tone & Style
- Clear and direct, not creative or "on-brand."
- Urgent, helpful, and benefit-focused.
- Avoid jargon or vague promises.

### Output Format
Return ONLY a JSON object with this format:
{
    "headlines": ["headline1", "headline2", ...],
    "descriptions": ["description1", "description2", ...]
}

IMPORTANT: Return the raw JSON object WITHOUT markdown formatting (no \`\`\`json or \`\`\` tags). The response should start with { and end with }.
      `

      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      })

      const result = response.choices[0]?.message?.content
      if (!result) {
        logger.error("No response content from OpenAI")
        throw new Error("No response from OpenAI")
      }

      // Parse the response
      try {
        // Clean the response if it's wrapped in markdown code blocks
        let cleanedResult = result.trim()

        // Handle various ways the model might format JSON responses

        // Case 1: Response is wrapped in markdown code blocks
        if (cleanedResult.includes("```")) {
          // Try to extract JSON between code blocks
          const jsonMatch = cleanedResult.match(
            /```(?:json)?\s*({[\s\S]*?})\s*```/
          )
          if (jsonMatch && jsonMatch[1]) {
            cleanedResult = jsonMatch[1].trim()
          }
        }

        // Case 2: Find any JSON object in the response as a fallback
        if (!cleanedResult.startsWith("{") || !cleanedResult.endsWith("}")) {
          const jsonObjectMatch = cleanedResult.match(
            /{[\s\S]*?headlines[\s\S]*?descriptions[\s\S]*?}/
          )
          if (jsonObjectMatch) {
            cleanedResult = jsonObjectMatch[0].trim()
          }
        }

        const parsed = JSON.parse(cleanedResult) as {
          headlines: string[]
          descriptions: string[]
        }

        // Validate the response format
        if (
          !Array.isArray(parsed.headlines) ||
          !Array.isArray(parsed.descriptions)
        ) {
          logger.error("Invalid response format from OpenAI", parsed)
          throw new Error("Invalid response format from OpenAI")
        }

        logger.info(
          `Successfully generated ${parsed.headlines.length} headlines and ${parsed.descriptions.length} descriptions`
        )

        return {
          headlines: parsed.headlines.slice(0, maxHeadlines),
          descriptions: parsed.descriptions.slice(0, maxDescriptions)
        }
      } catch (parseError) {
        logger.error(
          "Failed to parse OpenAI response:",
          parseError,
          "Raw response:",
          result
        )
        throw new Error("Failed to parse OpenAI response")
      }
    } catch (error) {
      logger.error(`Error generating ad copy for ${url}:`, error)
      throw error
    }
  }
}

export const openAIService = new OpenAIService()
