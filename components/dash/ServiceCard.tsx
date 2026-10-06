import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  description?: React.ReactNode;
  status?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  title?: string;
  children?: React.ReactNode;
}

/**
 * homepage's service card: icon, name and description in a clickable header,
 * a status pill top-right, and an optional row of stat blocks underneath.
 */
export function ServiceCard({ icon, name, description, status, href, onClick, title, children }: ServiceCardProps) {
  const header = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-300">{icon}</div>
      <div className="min-w-0 flex-1 py-2 pr-2 text-left">
        <div className="truncate text-sm font-medium text-slate-200">{name}</div>
        {description && <div className="truncate text-xs font-light text-slate-400">{description}</div>}
      </div>
      {status && <div className="shrink-0 self-start pt-2 pr-2">{status}</div>}
    </>
  );

  const headerClass = 'flex w-full items-center gap-1 pl-2 rounded-md';
  let clickable: React.ReactNode;
  if (href) {
    clickable = (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" title={title} className={headerClass}>
        {header}
      </a>
    );
  } else if (onClick) {
    clickable = (
      <button type="button" onClick={onClick} title={title} className={headerClass}>
        {header}
      </button>
    );
  } else {
    clickable = <div className={headerClass}>{header}</div>;
  }

  return (
    <li className={`hp-card list-none flex flex-col ${href || onClick ? 'hp-card-hover cursor-pointer' : ''}`}>
      {clickable}
      {children}
    </li>
  );
}
