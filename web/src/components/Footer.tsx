import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["footer"];
}) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} Gabriel Asakawa</span>
        <Link href={`/${lang}/rss.xml`} className="hover:text-foreground">
          {dict.rss}
        </Link>
      </div>
    </footer>
  );
}
