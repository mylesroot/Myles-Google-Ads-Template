# Phase 2: Bulk URL Input & Scraping Implementation Plan (Updated)

## Overview

This phase enables users to submit multiple URLs, scrape data using the Firecrawl API via the implemented `FirecrawlService`, and store results in Supabase, respecting pricing limits based on membership tiers. Steps 1–3 are complete, so the focus shifts to integrating the scraping service into the remaining steps.

---

## Step 1: Set Up Environment Variables ✅

1. Added Firecrawl API key to `.env.local`:
   ```
   FIRECRAWL_API_KEY=your_api_key_here
   ```
2. Updated `.env.example` to include this variable (without the actual key).

**Status**: Complete.

---

## Step 2: Utilize Existing Database Actions ✅

1. Using profile-related actions from `actions/db/profiles-actions.ts`:
   - `getProfileByUserIdAction`: Retrieves user profile.
   - `updateProfileAction`: Updates profile, including credit deduction for basic tier users.
2. Using project-related actions from `actions/db/projects-actions.ts`:
   - `createProjectAction`: Creates a new project with URLs.
   - `updateProjectAction`: Updates project status and scraped data.
   - `getProjectsByUserIdAction`: Retrieves user’s projects for display.

**Status**: Complete.

---

## Step 3: Create Scraping Service ✅

1. **Setup and Installation**:
   - Installed `@mendable/firecrawl-js` via `npm install @mendable/firecrawl-js`.
   - Configured `FIRECRAWL_API_KEY` in `.env.local`, accessed via `lib/env.ts` with `zod` for type safety.
   - Assumes a logger utility (e.g., `console.log` if not implemented).
2. **Key Features**:
   - **Class-Based Design**: `FirecrawlService` encapsulates the SDK, reusable with custom configs (e.g., `new FirecrawlService("key", { maxConcurrentRequests: 10 })`).
   - **URL Validation**: `validateUrl` ensures URLs are valid, with optional eCommerce domain restriction.
   - **Single URL Scraping**: `scrapeUrl` uses the SDK’s `scrapeUrl` method, supporting `AbortSignal`.
   - **Batch Scraping**: `batchScrapeUrls` processes URLs in chunks (default 5), with progress callbacks.

**Status**: Complete. The service is implemented in `lib/services/firecrawl-service.ts`.

---

## Step 4: Create Scraping Action (Updated)

1. Create `actions/scrape-actions.ts` with the main scraping logic:
   - **Parse Input**: Use `parseUrlsFromText` from `lib/utils/url-validation.ts` to split textarea input.
   - **Validate URLs**: Leverage `FirecrawlService.validateUrl` for each URL, filtering invalid ones.
   - **Check Credits**: Use `getProfileByUserIdAction` and `updateProfileAction` to enforce limits (free: 5 URLs, basic: 1 credit/URL, pro: unlimited).
   - **Create Project**: Call `createProjectAction` with a "pending" status.
   - **Scrape URLs**: Use `FirecrawlService.batchScrapeUrls` with progress callbacks to scrape in batches.
   - **Update Project**: Use `updateProjectAction` to store scraped data and set status to "completed".
   - **Error Handling**: Return detailed errors (e.g., invalid URLs, insufficient credits) for UI feedback.

**Updated Details**:

- Integrate the completed `FirecrawlService` instead of raw API calls.
- Use the service’s progress callback to update project status incrementally (e.g., "scraping 3/10").

**Example**:

```ts
"use server"

import { db } from "@/lib/db"
import { profiles, projects } from "@/lib/db/schema"
import { auth } from "@clerk/nextjs/server"
import { firecrawlService } from "@/lib/services/firecrawl-service"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { parseUrlsFromText } from "@/lib/utils/url-validation"

export async function scrapeURLs(rawInput: string) {
  const { userId } = auth()
  if (!userId) throw new Error("Unauthorized")

  const urls = parseUrlsFromText(rawInput)
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.user_id, userId))
    .limit(1)
    .then(r => r[0])
  if (!profile) throw new Error("Profile not found")

  const urlCount = urls.length
  if (profile.membership === "free" && urlCount > 5)
    throw new Error("Free tier limited to 5 URLs")
  if (profile.membership === "basic" && profile.credits < urlCount)
    throw new Error("Insufficient credits")

  const project = await db
    .insert(projects)
    .values({ user_id: userId, urls, status: "pending" })
    .returning()
    .then(r => r[0])

  if (profile.membership === "basic") {
    await db
      .update(profiles)
      .set({ credits: profile.credits - urlCount })
      .where(eq(profiles.user_id, userId))
  }

  await db
    .update(projects)
    .set({ status: "scraping" })
    .where(eq(projects.id, project.id))
  const scrapeResults = await firecrawlService.batchScrapeUrls(
    urls,
    (completed, total) => {
      console.log(`Scraping progress: ${completed}/${total}`)
    }
  )

  const scrapedData = scrapeResults.reduce(
    (acc, { url, result }) => {
      acc[url] = result
      return acc
    },
    {} as Record<string, any>
  )

  await db
    .update(projects)
    .set({ scraped_data: scrapedData, status: "completed" })
    .where(eq(projects.id, project.id))
  revalidatePath("/dashboard")
  return {
    success: true,
    projectId: project.id,
    invalidUrls: scrapeResults.filter(r => !r.result.success).map(r => r.url)
  }
}
```

---

## Step 5: Build UI Components (Updated)

1. **URL Input Form (`app/dashboard/_components/url-input-form.tsx`)**:
   - Textarea for bulk URL input (one per line).
   - Submit button with loading state using `isPending` from TanStack Query.
   - Display errors for invalid URLs returned from `scrapeURLs`.
2. **Scraping Status (`app/dashboard/_components/scraping-status.tsx`)**:
   - Progress indicator using `FirecrawlService`’s `onProgress` callback data.
   - Show failed URLs with error messages from `scrapeResults`.
   - Success confirmation with project ID link.

**Updated Details**:

- Use the `invalidUrls` array from `scrapeURLs` to highlight specific failures.
- Leverage the service’s progress callback for real-time UI updates.

---

## Step 6: Implement Dashboard Page (Updated)

1. Update `app/dashboard/page.tsx` to:
   - Check authentication with Clerk’s `useUser`.
   - Display profile info (membership, credits) via `getProfileByUserIdAction`.
   - Integrate `UrlInputForm` and `ScrapingStatus`.
   - List projects with TanStack Query, adjusting `refetchInterval` to leverage service progress:
     ```tsx
     const { data: projects, isLoading } = useQuery({
       queryKey: ["projects", userId],
       queryFn: () => getProjectsByUserIdAction(userId),
       staleTime: 1000 * 60 * 5, // 5 minutes
       refetchInterval: data =>
         data?.some(p => p.status === "scraping") ? 1000 * 5 : false // 5s if scraping
     })
     ```
   - **Why**: Dynamic refetching based on scraping status improves UX without over-polling.

---

## Step 7: Add URL Validation (Updated)

1. Use `lib/utils/url-validation.ts` from your latest improved version:
   - Already integrated into `FirecrawlService.validateUrl`, so no separate implementation needed here.
   - `processUrlInput` can be used in the UI for pre-submission validation if desired.
   - Remove the redundant example since `FirecrawlService` handles validation.

**Updated Details**:

- Rely on the service’s built-in validation; adjust `EXAMPLE_ECOMMERCE_DOMAINS` in `firecrawl-service.ts` if domain restriction is needed.

---

## Step 8: Implement Error Handling (Updated)

1. Update error handling to:
   - Use `FirecrawlService`’s error responses (e.g., `error` in `FirecrawlResponse`).
   - Enhance `scrapeURLs` to return specific failure reasons (e.g., API errors, invalid URLs).
   - Keep the global error boundary and toast notifications as planned.

**Updated Example**:

```tsx
// In UrlInputForm
onError: (e) => {
  toast({ variant: "destructive", title: "Scraping Failed", description: e.message });
  if (result.invalidUrls?.length) {
    toast({ description: `Invalid URLs: ${result.invalidUrls.join(", ")}` });
  }
},
```

---

## Step 9: Add Loading States and Animations (No Change)

- Remains as planned, with `AnimatePresence` for smooth transitions. Use scraping progress from `batchScrapeUrls` to animate the `ScrapingStatus` component.

---

## Step 10: Testing (Updated)

1. Test the flow with the new service:
   - Validate URLs via `FirecrawlService.validateUrl`.
   - Check credit deduction and unlimited usage.
   - Verify scraped data storage in `projects.scraped_data`.
   - Test progress callbacks and error recovery (e.g., retrying failed URLs).

**Updated Details**:

- Add tests for `FirecrawlService`’s batch scraping and cancellation features.

---

## Implementation Details (Updated)

### URL Input Form Component

- Uses `parseUrlsFromText` to preprocess input.
- Shows loading state and invalid URL feedback.

### Scraping Process

1. User submits URLs via textarea.
2. `scrapeURLs` validates and checks permissions.
3. Project starts with "pending", shifts to "scraping" during `batchScrapeUrls`.
4. Progress updates UI via callbacks.
5. Stores results and sets "completed".

### Credit Management

- Unchanged, enforced in `scrapeURLs`.

### Error Recovery

- Failed URLs from `batchScrapeUrls` are tracked and retryable without extra credits.

---

## Next Steps After Completion

Move to Phase 3: AI Copy Generation, using `projects.scraped_data` from this phase.

---

### Key Changes

- **Step 4**: Updated to use `FirecrawlService`’s `batchScrapeUrls` and progress callbacks, enhancing integration with the completed service.
- **Step 5**: Adjusted UI components to leverage service features (progress, errors).
- **Step 6**: Tweaked TanStack Query for dynamic refetching based on scraping status.
- **Step 7**: Simplified by relying on the service’s validation, removing redundant code.

This updated plan ensures seamless integration of your completed `FirecrawlService`, maintaining your project’s goals while leveraging its capabilities. Let me know if you need code for Steps 4–10!
