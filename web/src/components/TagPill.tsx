import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";

export function TagPill({ tag, lang }: { tag: string; lang: Locale }) {
  return (
    <Link
      href={`/${lang}/tags/${encodeURIComponent(tag)}`}
      className="inline-block rounded-full bg-pill px-2.5 py-0.5 text-xs text-muted hover:text-foreground transition-colors"
    >
      {tag}
    </Link>
  );
}
