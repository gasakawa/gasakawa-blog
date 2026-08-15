"use client";

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground transition-colors"
    />
  );
}
