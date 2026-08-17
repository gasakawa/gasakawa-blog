import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatFullDate } from "@/lib/date";
import { client } from "@/sanity/client";
import { POST_QUERY, POST_TRANSLATION_QUERY } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { PortableTextBody } from "@/components/PortableTextBody";
import { TagPill } from "@/components/TagPill";
import { TranslationLink } from "@/components/TranslationLink";
import { PostTocSidebar } from "@/components/PostTocSidebar";
import { extractHeadings } from "@/lib/extractHeadings";

const options = { next: { revalidate: 3600 } };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getPost(locale: Locale, slug: string) {
  return client.fetch(
    POST_QUERY,
    { lang: locale, slug },
    { ...options, next: { ...options.next, tags: [`posts:${locale}`] } },
  );
}

async function getTranslation(translationKey: string | null, locale: Locale) {
  if (!translationKey) return null;
  return client.fetch(
    POST_TRANSLATION_QUERY,
    { translationKey, language: locale },
    { ...options, next: { ...options.next, tags: [`post:${translationKey}`] } },
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};

  const post = await getPost(lang, slug);
  if (!post) return {};

  const translation = await getTranslation(post.translationKey, lang);

  const languages: Record<string, string> = {
    [lang]: `/${lang}/${slug}`,
  };
  if (translation?.slug && translation.language) {
    languages[translation.language] =
      `/${translation.language}/${translation.slug}`;
  }

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages,
      types: {
        "application/rss+xml": [
          { url: "/en/rss.xml", title: "gasakawa blog (EN)" },
          { url: "/pt/rss.xml", title: "gasakawa blog (PT)" },
        ],
      },
    },
    openGraph: {
      title: post.title ?? undefined,
      description: post.excerpt ?? undefined,
      url: `${SITE_URL}/${lang}/${slug}`,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      locale: lang,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const post = await getPost(locale, slug);
  if (!post) notFound();

  const translation = await getTranslation(post.translationKey, locale);
  const headings = extractHeadings(post.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    inLanguage: locale,
    url: `${SITE_URL}/${locale}/${slug}`,
    author: { "@type": "Person", name: "Gabriel Asakawa" },
    ...(post.coverImage?.asset && {
      image: urlFor(post.coverImage).width(1200).fit("max").url(),
    }),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-12">
      <article className="max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link
          href={`/${locale}`}
          className="text-sm text-muted hover:text-foreground"
        >
          {dict.post.backToPosts}
        </Link>

        <h1 className="font-serif text-3xl mt-6 mb-3">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted mb-6">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatFullDate(post.publishedAt, locale)}
            </time>
          )}
          {translation && (
            <>
              <span>·</span>
              <TranslationLink
                lang={translation.language as Locale}
                slug={translation.slug!}
                label={dict.post.readIn}
              />
            </>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} lang={locale} />
            ))}
          </div>
        )}

        {post.coverImage?.asset && (
          <Image
            src={urlFor(post.coverImage).width(1200).fit("max").url()}
            alt={post.coverImage.alt ?? ""}
            width={post.coverImage.dimensions?.width ?? 1200}
            height={post.coverImage.dimensions?.height ?? 800}
            placeholder={post.coverImage.lqip ? "blur" : undefined}
            blurDataURL={post.coverImage.lqip ?? undefined}
            className="w-full h-auto rounded mb-8"
          />
        )}

        {post.body && <PortableTextBody value={post.body} />}
      </article>
      <PostTocSidebar headings={headings} heading={dict.post.onThisPage} />
    </div>
  );
}
