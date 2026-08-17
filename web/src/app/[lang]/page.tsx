import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { client } from "@/sanity/client";
import { POSTS_BY_LANG_QUERY } from "@/sanity/queries";
import { PostListView } from "@/components/PostListView";
import { FeaturedCollapsible } from "@/components/FeaturedCollapsible";
import { TocSidebar } from "@/components/TocSidebar";
import { TagPill } from "@/components/TagPill";
import Link from "next/link";

const options = { next: { revalidate: 3600 } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.nav.home,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", pt: "/pt" },
      types: {
        "application/rss+xml": [
          { url: "/en/rss.xml", title: "gasakawa blog (EN)" },
          { url: "/pt/rss.xml", title: "gasakawa blog (PT)" },
        ],
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dict = getDictionary(locale);

  const posts = await client.fetch(
    POSTS_BY_LANG_QUERY,
    { lang: locale },
    { ...options, next: { ...options.next, tags: [`posts:${locale}`] } }
  );

  const featured = posts.filter((post) => post.featured);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-12">
      <div>
        {featured.length > 0 && (
          <FeaturedCollapsible title={dict.home.featured}>
            <ul className="flex flex-col gap-4">
              {featured.map((post) => (
                <li key={post._id}>
                  <Link
                    href={`/${locale}/${post.slug}`}
                    className="font-serif text-lg hover:underline"
                  >
                    {post.title}
                  </Link>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {post.tags.map((tag) => (
                        <TagPill key={tag} tag={tag} lang={locale} />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </FeaturedCollapsible>
        )}
        <PostListView posts={posts} lang={locale} dict={dict.home} />
      </div>
      <TocSidebar posts={posts} locale={locale} heading={dict.home.onThisPage} />
    </div>
  );
}
