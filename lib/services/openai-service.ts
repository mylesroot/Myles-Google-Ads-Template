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

Your Main Goal

You are an expert copywriter, and your job is to generate 15 Google Ads headlines (max 30 characters each) and 4 descriptions (max 90 characters each) from the above information in markdown that I've provided.

Don't be lazy, you must read all of the information, and follow all of these instructions exactly.

Keep working until you have read all the instructions, and generated 15 headlines, and 4 descriptions.

Context On Product/Service

Converting Search Terms: 

rabbit hutch, outdoor rabbit hutch

Target Audience

Families with kids and pets, rabbit enthusiasts, or first-time rabbit owners looking for durable outdoor solutions.

General Instructions

Attract the "perfect searcher" in our target audience who wants this product/collection by being specific, and answering their question with information. What are their pain points and desires.

Emphasize unique features like the natural wood design, spacious layout for multiple rabbits, or the free rain cover’s weatherproofing. Avoid generic adjectives (e.g., ‘great,’ ‘best’) unless tied to a specific proof point.

For ‘Problems,’ address specific rabbit owner pain points (e.g., ‘rabbits escaping,’ ‘wet hutches,’ ‘cramped cages’, 'predators getting in'). For ‘Desired Answers,’ tie to emotional outcomes (e.g., ‘happy rabbits,’ ‘proud kids’).

Use review quotes creatively (e.g., ‘Rabbits Are Happy!’) and weave specific numbers into benefits (e.g., ‘56 Bunny Owners Agree’). Avoid repeating exact phrases like ‘Ships in 48 Hrs’ across headlines or descriptions.

Ensure variety. Don’t just use ‘Buy Now’” with “Craft CTAs that evoke urgency and excitement tied to the product (e.g., ‘Save Your Hutch Spot,’ ‘Snag the Rain Cover Deal’

Incorporate emotional triggers (e.g., joy, relief, pride) in at least 5 headlines and 2 descriptions, based on customer reviews or product benefits.

Use clear, simple language, and speak like a human.

Use benefits, not features, in the copy.

Don't over-rely on basic benefits. Terms like “sturdy,” “spacious,” and “fast shipping” are common in e-commerce ads and don’t differentiate from competitors. Use specific information, that's different.

How People Search On Google

The ad targets searchers looking for products/collections like those on the page.

Searchers may use queries reflecting:

Direct (e.g., "Buy [product] near me", "[product] for sale", "[product]" )

You would answer this search with a headline like ("[product/service name] in [location]", "[brand] [product/service]", "[feature][product] for sale")

Desired answers (e.g., "Best [product/service] for [problem or goal]", "[Product/service] that [delivers specific result]", "Where to find [product/service] to fix [issue]", "Where to buy [product]?", "How does [product/service] work?", "What is the best [product/service] for [desired outcome]?", "Why does [product/service] help with [specific issue]?")

You would answer this search with a headline like, ("[product] for [problem]", "fix [problem] with [product]", "best [product] for [problem]"

Problems (e.g., "How to fix [problem] with [product category/service]?", "Solutions for [problem description] near me", "Why do I keep having [problem] and how to stop it?")

Symptoms (e.g., "[Symptom] after using [product category]", "How to stop [symptom] with [product/service]?", "What causes [symptom] and how to fix it?")

Causes of the problem. Think about the root issue that would lead people to search for the solution.

Headline Instructions (15 total)

Keep each headline under 30 characters. This is very important.

Headlines 1-5: Should contain any unique value proposition, offer, and brand name. E.g. "[Brand Name] [Product Name]" Use keywords from metadata if relevant. Example formats ("[product/service name] in [location]", "[brand] [product/service]", "[unique value proposition][product] for sale"). 

Headlines 6-10: Highlight key benefits and trust factors (e.g., "Fast Shipping, 5-Star Rated"). Add qualifying details to filter searchers. Make sure to include specific numbers, shipping times, service details.

Headlines 11-15: Use strong, action-oriented CTAs. Ensure variety. Don't just use "Buy Now" or "Shop Now", use something that makes sense for the product and make it different.


Use specific numbers (e.g., "57% Off"), times (e.g., "Ships in 24 Hrs"), or locations if in context.

Add social proof (e.g., "1000+ Happy Buyers") where possible if there's data.

Don't include any exclamation marks or capitalisation of words.

Description Instructions (4 total)

Write 4 descriptions, each under 90 characters but more than 70 characters.

Focus on describing how the benefits in the headlines are achieved. 

Focus on one 'benefit' in each description. E.g. Description 1: Free shipping, Description 2: High Quality. These benefits and descriptions should be specific to the 'context' you were given.

Include a CTA in at least one description (e.g., "Order Today!").

Use simple words.

Don't include any exclamation marks or capitalisation of words.

Tone & Style

Clear and direct, not creative or "on-brand."

Urgent, helpful, and benefit-focused.

Avoid jargon or vague promises.

Output Format

Keep each headline under 30 characters. This is very important.

Don't include any exclamation marks or capitalisation of words.

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
