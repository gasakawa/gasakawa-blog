"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/locales";

const NON_POST_SEGMENTS = new Set(["about", "tags"]);

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  segments[1] = target;
  return segments.join("/") || `/${target}`;
}

// Post pages are language-specific documents with their own slug (e.g.
// /pt/meu-primeiro-post vs /en/my-first-post), so a plain locale-segment
// swap 404s. Everything else (home, about, tags) shares the same path
// shape across languages, so only post pages need the lookup below.
function postSlugFromPathname(pathname: string): string | null {
  const [, , segment] = pathname.split("/");
  if (!segment || NON_POST_SEGMENTS.has(segment)) return null;
  return segment;
}

export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const postSlug = postSlugFromPathname(pathname);
  const [translatedSlug, setTranslatedSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!postSlug) return;

    const targetLang: Locale = lang === "pt" ? "en" : "pt";
    let cancelled = false;

    fetch(
      `/api/translated-slug?lang=${lang}&slug=${encodeURIComponent(postSlug)}&targetLang=${targetLang}`,
    )
      .then((res) => (res.ok ? res.json() : { slug: null }))
      .then((data: { slug: string | null }) => {
        if (!cancelled) setTranslatedSlug(data.slug ?? null);
      })
      .catch(() => {
        if (!cancelled) setTranslatedSlug(null);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, lang, postSlug]);

  function setCookie(target: Locale) {
    document.cookie = `locale=${target}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  function hrefFor(target: Locale): string {
    if (postSlug) {
      if (target === lang) return pathname;
      return translatedSlug ? `/${target}/${translatedSlug}` : `/${target}`;
    }
    return swapLocale(pathname, target);
  }

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Link
        href={hrefFor("pt")}
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
        href={hrefFor("en")}
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
