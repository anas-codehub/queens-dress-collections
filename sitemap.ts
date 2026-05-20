import { MetadataRoute } from "next"
import { db } from "@/lib/db"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://queensdresscollection.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:              BASE_URL,
      lastModified:     new Date(),
      changeFrequency:  "daily",
      priority:         1,
    },
    {
      url:              `${BASE_URL}/shop`,
      lastModified:     new Date(),
      changeFrequency:  "daily",
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/search`,
      lastModified:     new Date(),
      changeFrequency:  "weekly",
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/about`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.5,
    },
    {
      url:              `${BASE_URL}/contact`,
      lastModified:     new Date(),
      changeFrequency:  "monthly",
      priority:         0.5,
    },
  ]

  // Product pages
  const products = await db.product.findMany({
    where:    { isActive: true },
    select:   { slug: true, updatedAt: true },
    orderBy:  { updatedAt: "desc" },
  })

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url:             `${BASE_URL}/product/${product.slug}`,
    lastModified:    product.updatedAt,
    changeFrequency: "weekly",
    priority:        0.8,
  }))

  // Category pages
  const categories = await db.category.findMany({
    where:  { isActive: true },
    select: { slug: true },
  })

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url:             `${BASE_URL}/shop?categories=${cat.slug}`,
    lastModified:    new Date(),
    changeFrequency: "weekly",
    priority:        0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}