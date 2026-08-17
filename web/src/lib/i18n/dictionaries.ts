import type { Locale } from "./locales";

const dictionaries = {
  en: {
    nav: {
      home: "Posts",
      tags: "Tags",
      about: "About",
    },
    about: {
      title: "About me",
    },
    home: {
      featured: "Featured",
      onThisPage: "On this page",
      searchPlaceholder: "Search by title or tag…",
      noResults: "No posts match your search.",
      noPosts: "No posts yet.",
    },
    post: {
      readIn: "Read in Portuguese",
      backToPosts: "← Back to posts",
    },
    tag: {
      postsTagged: "Posts tagged",
    },
    notFound: {
      title: "Not found",
      description: "This page doesn't exist.",
      backHome: "← Back home",
    },
    footer: {
      rss: "RSS",
    },
  },
  pt: {
    nav: {
      home: "Posts",
      tags: "Tags",
      about: "Sobre",
    },
    about: {
      title: "Sobre mim",
    },
    home: {
      featured: "Destaques",
      onThisPage: "Nesta página",
      searchPlaceholder: "Buscar por título ou tag…",
      noResults: "Nenhum post encontrado.",
      noPosts: "Ainda não há posts.",
    },
    post: {
      readIn: "Ler em inglês",
      backToPosts: "← Voltar aos posts",
    },
    tag: {
      postsTagged: "Posts marcados com",
    },
    notFound: {
      title: "Não encontrado",
      description: "Esta página não existe.",
      backHome: "← Voltar ao início",
    },
    footer: {
      rss: "RSS",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
