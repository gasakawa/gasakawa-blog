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
  },
};

export function PortableTextBody({ value }: { value: PortableTextValue }) {
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}
