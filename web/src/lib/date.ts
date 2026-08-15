import type { Locale } from "./i18n/locales";

const localeTag: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
};

export function monthYearKey(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthYear(iso: string, locale: Locale): string {
  const date = new Date(iso);
  const month = new Intl.DateTimeFormat(localeTag[locale], {
    month: "long",
  }).format(date);
  const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
  return `${date.getFullYear()} - ${capitalized}`;
}

export function formatFullDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag[locale], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
