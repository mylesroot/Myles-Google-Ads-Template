/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

"use server"

import { LandingPage } from "@/components/landing"

export default async function HomePage() {
  return (
    <div className="pb-20">
      <LandingPage />
    </div>
  )
}
