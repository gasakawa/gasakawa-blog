import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";
import type { ComponentProps } from "react";
import { urlFor } from "@/sanity/image";

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
  code?: string | null;
  language?: string | null;
  filename?: string | null;
};

const components: PortableTextComponents = {
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
      if (!value?.code) return null;
      return (
        <pre className="overflow-x-auto rounded bg-zinc-900 p-4 text-sm text-zinc-100">
          <code>{value.code}</code>
        </pre>
      );
    },
  },
};

export function PortableTextBody({ value }: { value: PortableTextValue }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
