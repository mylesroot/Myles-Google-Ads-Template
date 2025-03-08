"use client"

import { Hero } from "./hero"
import { StatsCard } from "./stats-card"
import { Features } from "./features"
import { Pricing } from "./pricing"

export function LandingPage() {
  return (
    <div>
      <Hero />
      <StatsCard />
      <Features />
      <Pricing />
    </div>
  )
}
