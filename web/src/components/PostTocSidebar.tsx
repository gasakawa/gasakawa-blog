import type { Heading } from "@/lib/extractHeadings";

const INDENT: Record<number, string> = { 2: "", 3: "pl-3", 4: "pl-6" };

export function PostTocSidebar({
  headings,
  heading,
}: {
  headings: Heading[];
  heading: string;
}) {
  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-8 hidden lg:block text-sm">
      <h2 className="text-muted mb-3 text-xs uppercase tracking-wide">
        {heading}
      </h2>
      <ul className="flex flex-col gap-1.5">
        {headings.map((item) => (
          <li key={item.id} className={INDENT[item.level] ?? ""}>
            <a
              href={`#${item.id}`}
              className="text-muted hover:text-foreground transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
