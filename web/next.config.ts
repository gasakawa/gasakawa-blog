import type { NextConfig } from "next";

// Posts were indexed by Google at flat, unprefixed URLs before the site
// gained /pt//en/ locale prefixes. Permanent redirects preserve that
// ranking signal instead of letting the old indexed URLs 404.
const OLD_POST_SLUGS = [
  "desestruturacao-de-objetos-e-arrays-em-javascript",
  "ferramentas-que-uso-para-trabalhar",
  "meu-primeiro-post",
  "otimizando-imagens-com-nodejs",
  "salvando-alteracoes-locais-com-o-devtools-do-browser",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return OLD_POST_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/pt/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
