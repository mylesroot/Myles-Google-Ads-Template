/*
<ai_context>
This server page is the marketing homepage.
</ai_context>
*/

import { LandingPage } from "@/components/landing"
import { Metadata } from "next"
import StructuredData from "@/components/utilities/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ad Conversions | Powerful Google Ads Tools for Better Campaigns",
    description:
      "Improve your Google Ads performance with our RSA writer and optimization tools. Boost conversions and lower CPA in minutes.",
    alternates: {
      canonical: "/"
    }
  }
}

export default async function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Ad Conversions",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    operatingSystem: "Web",
    description:
      "A swiss-army toolbox for Google Ads. Build, test, and optimize your ads with ease."
  }

  return (
    <div className="pb-20">
      <StructuredData data={structuredData} />
      <LandingPage />
    </div>
  )
}
