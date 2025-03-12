"use client"

interface BlogPostStructuredDataProps {
  title: string
  description: string
  publishedDate: string
  modifiedDate: string
  author: {
    name: string
    url: string
  }
  imageUrl: string
  url: string
}

export default function BlogPostStructuredData({
  title,
  description,
  publishedDate,
  modifiedDate,
  author,
  imageUrl,
  url
}: BlogPostStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: imageUrl,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: "Myles",
      url: "https://www.linkedin.com/in/myles-r-097705a3/"
    },
    publisher: {
      "@type": "Organization",
      name: "Ad Conversions",
      logo: {
        "@type": "ImageObject",
        url: "https://adconversions.net/logo.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
