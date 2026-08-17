"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  function setCookie(target: Locale) {
    document.cookie = `locale=${target}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Link
        href={swapLocale(pathname, "pt")}
        onClick={() => setCookie("pt")}
        className={
          lang === "pt"
            ? "font-medium underline underline-offset-4"
            : "text-muted hover:text-foreground transition-colors"
        }
      >
        pt
      </Link>
      <span className="text-muted">|</span>
      <Link
        href={swapLocale(pathname, "en")}
        onClick={() => setCookie("en")}
        className={
          lang === "en"
            ? "font-medium underline underline-offset-4"
            : "text-muted hover:text-foreground transition-colors"
        }
      >
        en
      </Link>
    </div>
  );
}
