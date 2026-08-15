import { isLocale, type Locale } from "@/lib/i18n/locales";
import { client } from "@/sanity/client";
import { RSS_POSTS_QUERY } from "@/sanity/queries";

const SITE_TITLE = "gasakawa blog";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return new Response("Not found", { status: 404 });
  }

  const locale: Locale = lang;
  const origin = new URL(request.url).origin;

  const posts = await client.fetch(
    RSS_POSTS_QUERY,
    { lang: locale },
    { next: { revalidate: 3600, tags: [`posts:${locale}`] } }
  );

  const items = posts
    .map((post) => {
      const link = `${origin}/${locale}/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : undefined;
      return `
    <item>
      <title>${escapeXml(post.title ?? "")}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_TITLE} (${locale.toUpperCase()})</title>
    <link>${origin}/${locale}</link>
    <description>${SITE_TITLE}</description>
    <language>${locale}</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
