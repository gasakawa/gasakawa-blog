"use client";

import { useState, type ReactNode } from "react";

export function FeaturedCollapsible({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-10 border-b border-border pb-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-serif text-lg mb-4"
      >
        <span className="text-muted text-sm">{open ? "▾" : "▸"}</span>
        {title}
      </button>
      {open && children}
    </section>
  );
}
