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
  const other: Locale = lang === "en" ? "pt" : "en";
  const href = swapLocale(pathname, other);

  function handleClick() {
    document.cookie = `locale=${other}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="text-sm text-muted hover:text-foreground transition-colors"
    >
      {other.toUpperCase()}
    </Link>
  );
}
