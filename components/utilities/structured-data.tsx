"use client"

import { useEffect } from "react"

interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // We use useEffect to ensure this only runs on the client
    const script = document.createElement("script")
    script.setAttribute("type", "application/ld+json")
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      // Clean up when the component unmounts
      document.head.removeChild(script)
    }
  }, [data])

  // This component doesn't render anything
  return null
}
