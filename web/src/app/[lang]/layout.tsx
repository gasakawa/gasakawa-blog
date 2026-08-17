import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/locales";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);

  return {
    title: {
      default: dict.meta.title,
      template: `%s · ${dict.meta.title}`,
    },
    description: dict.meta.description,
    alternates: {
      types: {
        "application/rss+xml": [
          { url: "/en/rss.xml", title: "gasakawa blog (EN)" },
          { url: "/pt/rss.xml", title: "gasakawa blog (PT)" },
        ],
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <SetHtmlLang lang={locale} />
      <Nav lang={locale} />
      <main className="flex-1 w-full">{children}</main>
      <Footer lang={locale} dict={dict.footer} />
    </>
  );
}
