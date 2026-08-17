type BodyBlock = {
  _type?: string;
  _key: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

const HEADING_STYLES = new Set(["h2", "h3", "h4"]);

export function extractHeadings(body: unknown): Heading[] {
  if (!Array.isArray(body)) return [];

  return body
    .filter(
      (block): block is BodyBlock =>
        typeof block === "object" &&
        block !== null &&
        (block as BodyBlock)._type === "block" &&
        HEADING_STYLES.has((block as BodyBlock).style ?? ""),
    )
    .map((block) => ({
      id: block._key,
      text: (block.children ?? []).map((span) => span.text ?? "").join(""),
      level: Number(block.style!.slice(1)) as 2 | 3 | 4,
    }))
    .filter((heading) => heading.text.length > 0);
}
