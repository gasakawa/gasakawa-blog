import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n/dictionaries";

const paragraphs: Record<Locale, string[]> = {
  pt: [
    "Oi, eu sou o Gabriel! Trabalho com tecnologia há mais de 20 anos, passando por setores bem diferentes — de bancos a indústria, óleo e gás, logística e até projetos de impacto social. Ao longo do caminho, fui me apaixonando cada vez mais por arquitetura de sistemas e, mais recentemente, por inteligência artificial.",
    "Hoje sou fundador da AG7 Digital Business, onde curto transformar problemas complexos em soluções que realmente funcionam. Fora do trabalho, meu escape é o basquete — nada como uma quadra pra desligar a cabeça depois de um dia de código.",
    "Esse blog é um espaço pra compartilhar um pouco desse caminho, os aprendizados e as ideias que vou tendo pelo meio.",
  ],
  en: [
    "Hi, I'm Gabriel! I've been working in tech for over 20 years, across pretty different industries — from banking to manufacturing, oil and gas, logistics, and even social impact projects. Along the way, I grew more and more passionate about systems architecture and, more recently, artificial intelligence.",
    "Today I'm the founder of AG7 Digital Business, where I enjoy turning complex problems into solutions that actually work. Outside of work, my escape is basketball — nothing like a court to clear my head after a day of code.",
    "This blog is a space to share a bit of that journey, the things I've learned, and the ideas I pick up along the way.",
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return { title: dict.about.title };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale: Locale = lang;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-2xl mb-8">{dict.about.title}</h1>
      <div className="prose">
        {paragraphs[locale].map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
