"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostSummary } from "@/sanity/types";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { groupPostsByMonth } from "@/lib/groupPosts";
import { SearchBox } from "./SearchBox";
import { TagPill } from "./TagPill";

export function PostListView({
  posts,
  lang,
  dict,
}: {
  posts: PostSummary[];
  lang: Locale;
  dict: Dictionary["home"];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() ?? "";
      const tags = post.tags ?? [];
      return (
        title.includes(q) || tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [posts, query]);

  const groups = groupPostsByMonth(filtered, lang);

  return (
    <div>
      <div className="mb-6">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={dict.searchPlaceholder}
        />
      </div>

      {groups.length === 0 && (
        <p className="text-muted text-sm">
          {query ? dict.noResults : dict.noPosts}
        </p>
      )}

      {groups.map((group) => (
        <section key={group.key} id={group.key} className="mb-10 scroll-mt-24">
          <h2 className="font-serif text-lg mb-4 text-muted">
            {group.label}
          </h2>
          <ul className="flex flex-col gap-5">
            {group.posts.map((post) => (
              <li key={post._id}>
                <Link
                  href={`/${lang}/${post.slug}`}
                  className="font-serif text-lg hover:underline"
                >
                  {post.title}
                </Link>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {post.tags.map((tag) => (
                      <TagPill key={tag} tag={tag} lang={lang} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
