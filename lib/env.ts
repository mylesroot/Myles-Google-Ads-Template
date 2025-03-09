/*
<ai_context>
Environment configuration with zod validation.
</ai_context>
*/

import { z } from "zod"

// Create a more flexible schema for development/testing
const envSchema = z.object({
  // In development, allow a placeholder API key
  FIRECRAWL_API_KEY:
    process.env.NODE_ENV === "production"
      ? z.string().min(1, "FIRECRAWL_API_KEY is required in production")
      : z.string().default("test-api-key"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development")
})

// This function validates the environment variables and returns them
// with proper TypeScript types
function validateEnv() {
  const env = {
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
    NODE_ENV: process.env.NODE_ENV
  }

  try {
    return envSchema.parse(env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join(".")).join(", ")
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}`
      )
    }
    throw error
  }
}

export const env = validateEnv()
