import { client } from "@/sanity/client";
import { TRANSLATED_SLUG_QUERY } from "@/sanity/queries";
import { isLocale } from "@/lib/i18n/locales";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") ?? "";
  const slug = searchParams.get("slug") ?? "";
  const targetLang = searchParams.get("targetLang") ?? "";

  if (!isLocale(lang) || !isLocale(targetLang) || !slug) {
    return Response.json({ slug: null }, { status: 400 });
  }

  const translatedSlug = await client.fetch(TRANSLATED_SLUG_QUERY, {
    lang,
    slug,
    targetLang,
  });

  return Response.json({ slug: translatedSlug ?? null });
}
