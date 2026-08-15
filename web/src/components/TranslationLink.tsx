import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";

export function TranslationLink({
  lang,
  slug,
  label,
}: {
  lang: Locale;
  slug: string;
  label: string;
}) {
  return (
    <Link
      href={`/${lang}/${slug}`}
      className="text-sm underline underline-offset-4 text-muted hover:text-foreground transition-colors"
    >
      {label}
    </Link>
  );
}
