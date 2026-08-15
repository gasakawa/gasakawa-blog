import type { PostSummary } from "@/sanity/types";
import type { Locale } from "@/lib/i18n/locales";
import { formatMonthYear, monthYearKey } from "@/lib/date";

export type PostGroup = {
  key: string;
  label: string;
  posts: PostSummary[];
};

export function groupPostsByMonth(
  posts: PostSummary[],
  locale: Locale
): PostGroup[] {
  const map = new Map<string, PostGroup>();

  for (const post of posts) {
    if (!post.publishedAt) continue;
    const key = monthYearKey(post.publishedAt);
    if (!map.has(key)) {
      map.set(key, {
        key,
        label: formatMonthYear(post.publishedAt, locale),
        posts: [],
      });
    }
    map.get(key)!.posts.push(post);
  }

  return Array.from(map.values());
}
