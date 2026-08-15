import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { client } from "@/sanity/client";
import { POSTS_BY_TAG_QUERY } from "@/sanity/queries";
import { PostListView } from "@/components/PostListView";

const options = { next: { revalidate: 3600 } };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}): Promise<Metadata> {
  const { lang, tag } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: `${dict.tag.postsTagged} “${decodeURIComponent(tag)}”` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}) {
  const { lang, tag } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dict = getDictionary(locale);
  const decodedTag = decodeURIComponent(tag);

  const posts = await client.fetch(
    POSTS_BY_TAG_QUERY,
    { lang: locale, tagName: decodedTag },
    { ...options, next: { ...options.next, tags: [`posts:${locale}`] } }
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-2xl mb-8">
        {dict.tag.postsTagged} “{decodedTag}”
      </h1>
      <PostListView posts={posts} lang={locale} dict={dict.home} />
    </div>
  );
}
