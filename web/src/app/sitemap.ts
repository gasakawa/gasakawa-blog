import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/queries";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeRoots: MetadataRoute.Sitemap = SUPPORTED_LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  try {
    const posts = await client.fetch(
      SITEMAP_POSTS_QUERY,
      {},
      { next: { revalidate: 3600, tags: ["posts:en", "posts:pt"] } }
    );

    const postEntries: MetadataRoute.Sitemap = posts
      .filter((post) => post.slug && post.language)
      .map((post) => ({
        url: `${SITE_URL}/${post.language}/${post.slug}`,
        lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
        changeFrequency: "monthly",
        priority: 0.6,
      }));

    return [...localeRoots, ...postEntries];
  } catch {
    return localeRoots;
  }
}
