import type { PostSummary } from "@/sanity/types";
import type { Locale } from "@/lib/i18n/locales";
import { groupPostsByMonth } from "@/lib/groupPosts";

export function TocSidebar({
  posts,
  locale,
  heading,
}: {
  posts: PostSummary[];
  locale: Locale;
  heading: string;
}) {
  const groups = groupPostsByMonth(posts, locale);

  if (groups.length === 0) return null;

  return (
    <nav className="sticky top-8 hidden lg:block text-sm">
      <h2 className="text-muted mb-3 text-xs uppercase tracking-wide">
        {heading}
      </h2>
      <ul className="flex flex-col gap-1.5">
        {groups.map((group) => (
          <li key={group.key}>
            <a
              href={`#${group.key}`}
              className="text-muted hover:text-foreground transition-colors"
            >
              {group.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
