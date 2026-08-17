import { client } from "@/sanity/client";
import { POSTS_BY_LANG_QUERY } from "@/sanity/queries";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const SECTION_TITLE: Record<Locale, string> = {
  en: "Posts (English)",
  pt: "Posts (Portuguese)",
};

export async function GET() {
  const sections = await Promise.all(
    SUPPORTED_LOCALES.map(async (lang) => {
      const posts = await client.fetch(
        POSTS_BY_LANG_QUERY,
        { lang },
        { next: { revalidate: 3600, tags: [`posts:${lang}`] } }
      );

      const links = posts
        .map((post) => {
          const url = `${SITE_URL}/${lang}/${post.slug}`;
          const summary = post.excerpt ? `: ${post.excerpt}` : "";
          return `- [${post.title}](${url})${summary}`;
        })
        .join("\n");

      return `## ${SECTION_TITLE[lang]}\n\n${links}`;
    })
  );

  const body = `# gasakawa blog

> Personal, bilingual (English/Portuguese) blog by Gabriel Asakawa covering software development, tooling, and career reflections.

${sections.join("\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
