import React from 'react';
import { Users } from 'lucide-react';
import { ServiceGroup } from './ServiceGroup';

/**
 * The Activity group. Its children (graph, players, event feed) each render
 * nothing without data, so the heading hides itself when no card is left.
 */
export function ActivitySection({ children }: { children: React.ReactNode }) {
  return (
    <ServiceGroup title="Activity" icon={<Users className="h-5 w-5 text-slate-400" />} className="[&:not(:has(.hp-card))]:hidden">
      {children}
    </ServiceGroup>
  );
}
