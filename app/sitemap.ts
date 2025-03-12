import { MetadataRoute } from "next"

// This would typically come from your CMS or API
const getAllPosts = () => {
  return [
    {
      slug: "effective-google-ads-strategies",
      publishedDate: "2024-04-15T10:00:00Z",
      modifiedDate: "2024-04-16T14:30:00Z"
    },
    {
      slug: "writing-compelling-ad-copy",
      publishedDate: "2024-04-10T10:00:00Z",
      modifiedDate: "2024-04-10T10:00:00Z"
    },
    {
      slug: "ppc-campaign-optimization",
      publishedDate: "2024-04-05T10:00:00Z",
      modifiedDate: "2024-04-07T15:20:00Z"
    },
    {
      slug: "landing-page-conversion-tips",
      publishedDate: "2024-03-28T10:00:00Z",
      modifiedDate: "2024-03-30T09:15:00Z"
    }
  ]
}

// This would typically come from your CMS or API
const getAllCategories = () => {
  return [
    "google-ads",
    "ppc",
    "digital-marketing",
    "conversion-optimization",
    "ad-copy"
  ]
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://adconversions.net"

  // Main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    }
  ] as MetadataRoute.Sitemap

  // Blog posts
  const posts = getAllPosts()
  const blogPostsPages = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modifiedDate),
    changeFrequency: "monthly",
    priority: 0.8
  })) as MetadataRoute.Sitemap

  // Categories
  const categories = getAllCategories()
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/blog/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7
  })) as MetadataRoute.Sitemap

  return [...mainPages, ...blogPostsPages, ...categoryPages]
}
