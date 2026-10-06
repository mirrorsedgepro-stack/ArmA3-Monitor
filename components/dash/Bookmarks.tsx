import React from 'react';

export interface Bookmark {
  abbr: string;
  name: string;
  description: string;
  href: string;
}

/** homepage's bookmarks: two-letter tile, name and a muted host/description. */
export function Bookmarks({ title, items }: { title: string; items: Bookmark[] }) {
  return (
    <section>
      <h2 className="mb-2 text-lg font-medium text-slate-300">{title}</h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <li key={b.href}>
            <a
              href={b.href}
              target={b.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="hp-card hp-card-hover flex items-center overflow-hidden text-xs"
            >
              <span className="flex h-8 w-11 shrink-0 items-center justify-center bg-black/20 font-medium text-slate-300">
                {b.abbr}
              </span>
              <span className="flex min-w-0 flex-1 items-center justify-between gap-2 px-2">
                <span className="truncate text-slate-200">{b.name}</span>
                <span className="truncate font-light text-slate-500">{b.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
