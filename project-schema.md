# Database Schema Summary for SaaS Ad Copy Tool

## Project Overview

This SaaS tool allows users to input eCommerce product or collection page URLs (in bulk), scrape data using the Firecrawl API, generate ad copy (15 headlines, 4 descriptions) via OpenAI, and export results to Google Ads Editor (`.csv`) or Google Ads API (draft campaigns). Users can save, edit, and review copy before exporting. The pricing model is £5/month for 100 ad generations (`basic`) or £20/month unlimited (`pro`), with a free tier for trials.

The database schema is designed to support bulk processing, persistence for editing/review, export tracking, and monetization, while keeping the structure flexible and scalable.

---

## Schema Overview

### 1. `profiles` Table

**Purpose**: Manages user authentication, membership tiers, and credits for pricing enforcement.

| Column                   | Type        | Description                             | Constraints           |
| ------------------------ | ----------- | --------------------------------------- | --------------------- |
| `user_id`                | `text`      | Clerk user ID                           | Primary Key, Not Null |
| `membership`             | `enum`      | `free`, `basic` (£5/mo), `pro` (£20/mo) | Default: `free`       |
| `credits`                | `integer`   | Remaining credits (100 for `basic`)     | Default: 100          |
| `stripe_customer_id`     | `text`      | Stripe customer ID                      | Nullable              |
| `stripe_subscription_id` | `text`      | Stripe subscription ID                  | Nullable              |
| `created_at`             | `timestamp` | Creation timestamp                      | Default: `now()`      |
| `updated_at`             | `timestamp` | Last update timestamp                   | Default: `now()`      |

**Why This Way?**

- Ties to Clerk auth via `user_id` (text-based for compatibility).
- `membership` enum enforces pricing tiers: `free` (trial, e.g., 5 generations), `basic` (100 credits), `pro` (unlimited).
- `credits` tracks usage for `basic` users (1 credit per URL processed or regenerated; ignored for `pro`).
- Stripe fields enable subscription management via webhooks.
- Built on an existing `profiles` table, extended for this app's needs.

---

### 2. `projects` Table

**Purpose**: Stores bulk URL submissions, scraped data, and generated copy, with persistence for editing and review.

| Column           | Type        | Description                                                | Constraints           |
| ---------------- | ----------- | ---------------------------------------------------------- | --------------------- |
| `id`             | `uuid`      | Unique project ID                                          | Primary Key           |
| `user_id`        | `text`      | Links to `profiles`                                        | Foreign Key, Not Null |
| `name`           | `text`      | Project name (e.g., "Socks & Shoes Ads")                   | Not Null              |
| `urls`           | `text[]`    | Array of input URLs                                        | Not Null              |
| `scraped_data`   | `jsonb`     | Scraped data per URL                                       | Nullable              |
| `generated_copy` | `jsonb`     | Ad copy (15 headlines, 4 descriptions)                     | Nullable              |
| `status`         | `varchar`   | `pending`, `scraping`, `generating`, `completed`, `review` | Default: `pending`    |
| `created_at`     | `timestamp` | Creation timestamp                                         | Default: `now()`      |
| `updated_at`     | `timestamp` | Last update timestamp                                      | Default: `now()`      |

**Example `generated_copy`**:

```json
{
  "url1": [
    { "version": 1, "headlines": ["Buy Now!", ...], "descriptions": ["Get it fast...", ...], "generated_at": "2025-03-09" }
  ]
}
```

**Why This Way?**

- **Bulk Processing**: `urls` as `text[]` supports multiple URLs in one project (e.g., 10 at once), a key differentiator from competitors.
- **Flexibility**: `jsonb` for `scraped_data` and `generated_copy` handles variable page structures and multiple copy versions (e.g., after regeneration with user instructions).
- **Persistence**: Stores projects indefinitely, so users can save, edit, and revisit later.
- **Review Workflow**: `status` includes `review` for projects awaiting approval before export.
- **Simplicity**: Arrays and JSONB avoid over-normalization for initial scale, though a separate `urls` table could be added later.

---

### 3. `exports` Table

**Purpose**: Tracks export actions (`.csv` or Google Ads API) for history and user reference.

| Column        | Type        | Description                  | Constraints           |
| ------------- | ----------- | ---------------------------- | --------------------- |
| `id`          | `uuid`      | Unique export ID             | Primary Key           |
| `project_id`  | `uuid`      | Links to `projects`          | Foreign Key, Not Null |
| `export_type` | `varchar`   | `csv` or `google_ads_api`    | Not Null              |
| `file_url`    | `varchar`   | URL to `.csv` file           | Nullable              |
| `campaign_id` | `varchar`   | Google Ads draft campaign ID | Nullable              |
| `created_at`  | `timestamp` | Export timestamp             | Default: `now()`      |

**Why This Way?**

- **History**: Logs each export, so users can track multiple attempts (e.g., `.csv` for review, then API for publishing).
- **Separation**: Keeps export data distinct from `projects`, avoiding clutter and enabling multiple exports per project.
- **User Value**: Supports a UI feature showing export history (e.g., "Exported as CSV [date]" or "Draft Campaign [ID]").
- **Scalability**: Easily extends to new export types (e.g., Meta Ads) via `export_type`.

---

## Design Reasoning

### Core Goals

- **Bulk Processing**: `projects.urls` as an array supports submitting multiple URLs, a competitive edge.
- **Save & Edit**: `projects.generated_copy` persists copy, allowing edits and version tracking (via JSONB).
- **Review Before Publishing**: `projects.status` with `review` state enables a draft → review → export workflow.
- **Pricing Enforcement**: `profiles.membership` and `credits` tie to £5 (100 credits) and £20 (unlimited) plans.
- **Export Tracking**: `exports` provides an audit trail and supports multiple export formats.

### Trade-offs

- **JSONB vs. Normalized Tables**: Used `jsonb` for `scraped_data` and `generated_copy` to keep things flexible and simple. For high scale (e.g., thousands of URLs), we could normalize into separate tables (e.g., `project_urls`, `copy_versions`).
- **Array for URLs**: `text[]` in `projects.urls` is lightweight for small batches (e.g., 10 URLs). A separate `urls` table might be better for larger batches or complex queries.
- **Exports Table**: Separate table vs. embedding in `projects` prioritizes history over simplicity. Could simplify if single exports suffice.

### Why This Works

- **Simplicity**: Balances structure and flexibility for a fast MVP.
- **User Needs**: Supports bulk input, editing, review, and exports—solving a real pain point (faster ad creation).
- **Monetization**: Ties directly to the pricing model via credits and tiers.
- **Future-Proofing**: JSONB and `exports` allow easy feature additions (e.g., new export types, copy versioning).

---

## Developer Notes

- **Tech Stack**: Supabase (Postgres) with Drizzle ORM, Next.js, Clerk auth, Stripe payments.
- **Migrations**: Update existing `profiles` (add `credits`, tweak `membership` enum), create `projects` and `exports`.
- **Workflow**: Users submit URLs → scrape → generate copy → save/edit/review → export, with credits deducted for `basic` tier.
- **UI Hint**: Show project history (via `projects`) and export history (via `exports`) in the dashboard.

This schema sets up a solid foundation for an MVP that's both functional and marketable. Let me know if you need code snippets or deeper dives into any part!

---

Hope this summary nails it for your developer! Let me know if you'd like any tweaks.
