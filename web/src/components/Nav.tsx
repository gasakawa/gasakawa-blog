import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Nav({ lang }: { lang: Locale }) {
  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href={`/${lang}`} className="font-serif text-lg">
          gasakawa
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher lang={lang} />
          <DarkModeToggle />
        </div>
      </nav>
    </header>
  );
}
