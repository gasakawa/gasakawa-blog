import Link from "next/link";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  const dict = getDictionary(DEFAULT_LOCALE);

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-2xl mb-3">{dict.notFound.title}</h1>
      <p className="text-muted mb-6">{dict.notFound.description}</p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="underline underline-offset-4"
      >
        {dict.notFound.backHome}
      </Link>
    </div>
  );
}
