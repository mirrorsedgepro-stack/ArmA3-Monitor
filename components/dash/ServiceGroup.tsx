import React from 'react';

interface ServiceGroupProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  /** Tailwind grid-cols classes for the cards; omit for free-form content. */
  columns?: string;
  className?: string;
  children: React.ReactNode;
}

/** homepage's service group: a plain heading over a grid of cards. */
export function ServiceGroup({ id, title, icon, columns, className = '', children }: ServiceGroupProps) {
  return (
    <section id={id} className={`scroll-mt-6 ${className}`}>
      <h2 className="mb-2 flex items-center gap-2 text-lg font-medium text-slate-300">
        {icon}
        {title}
      </h2>
      {columns ? <ul className={`grid gap-2 ${columns}`}>{children}</ul> : children}
    </section>
  );
}
