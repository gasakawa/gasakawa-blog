import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import type { ComponentProps } from "react";
import { codeToHtml } from "shiki";
import { urlFor } from "@/sanity/image";

const SHIKI_THEME = "github-dark";
const SHIKI_LANGS = new Set([
  "javascript",
  "typescript",
  "json",
  "html",
  "css",
  "bash",
]);

type PortableTextValue = ComponentProps<typeof PortableText>["value"];

type SanityImageBlock = {
  alt?: string | null;
  lqip?: string | null;
  dimensions?: { width: number; height: number } | null;
  asset?: { _ref?: string; _type?: string } | null;
  hotspot?: unknown;
  crop?: unknown;
};

type SanityCodeBlock = {
  _key: string;
  code?: string | null;
  language?: string | null;
  filename?: string | null;
};

export async function PortableTextBody({ value }: { value: PortableTextValue }) {
  const nodes = Array.isArray(value) ? (value as unknown[]) : [];

  const highlighted = new Map<string, string>();
  await Promise.all(
    nodes.map(async (node) => {
      const block = node as Partial<SanityCodeBlock> & { _type?: string };
      if (block._type !== "code" || typeof block.code !== "string" || !block._key) return;
      const lang = SHIKI_LANGS.has(block.language ?? "") ? block.language! : "text";
      const html = await codeToHtml(block.code, { lang, theme: SHIKI_THEME });
      highlighted.set(block._key, html);
    }),
  );

  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value }) => <h2 id={value._key}>{children}</h2>,
      h3: ({ children, value }) => <h3 id={value._key}>{children}</h3>,
      h4: ({ children, value }) => <h4 id={value._key}>{children}</h4>,
    },
    types: {
      image: ({ value }: { value: SanityImageBlock }) => {
        if (!value?.asset) return null;
        const width = value.dimensions?.width ?? 1200;
        const height = value.dimensions?.height ?? 800;
        return (
          <Image
            src={urlFor(value).width(1200).fit("max").url()}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            placeholder={value.lqip ? "blur" : undefined}
            blurDataURL={value.lqip ?? undefined}
            className="w-full h-auto"
          />
        );
      },
      code: ({ value }: { value: SanityCodeBlock }) => {
        const html = highlighted.get(value._key);
        if (!html) return null;
        return (
          <div
            className="overflow-x-auto rounded text-sm [&>pre]:p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      },
    },
  };

  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
