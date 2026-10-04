'use client';

import React, { useState } from 'react';
import { Shield, Keyboard, Radio, ChevronRight } from 'lucide-react';

interface ServerRulesProps {
  rules?: string[];
}

export function ServerRules({ rules }: ServerRulesProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'keybinds' | 'comms'>('rules');

  const defaultRules = rules || [
    "Cooperative Guerrilla Campaign: Coordinate with squad members before initiating outpost assaults.",
    "Capture and secure enemy munitions, fuel trucks, and communication towers to build rebel support.",
    "Positive ID on non-combatants and civilians. Civilian casualties lower rebel town support.",
    "Use ACE interaction (Windows Key) for equipment handling, medical care, and logistics.",
    "Maintain respect and tactical communications on server voice or Discord.",
    "No deliberate destruction of rebel headquarters (HQ) or team assets."
  ];

  return (
    <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/80 overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-800/80 bg-zinc-900/60 text-xs font-medium">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-4 py-3 transition-colors border-b-2 ${
            activeTab === 'rules'
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/80'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Server Guidelines</span>
        </button>

        <button
          onClick={() => setActiveTab('keybinds')}
          className={`flex items-center gap-1.5 px-4 py-3 transition-colors border-b-2 ${
            activeTab === 'keybinds'
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/80'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Keybindings</span>
        </button>

        <button
          onClick={() => setActiveTab('comms')}
          className={`flex items-center gap-1.5 px-4 py-3 transition-colors border-b-2 ${
            activeTab === 'comms'
              ? 'border-zinc-200 text-zinc-100 bg-zinc-900/80'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Comms &amp; Radio</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-zinc-300">
            {defaultRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60"
              >
                <span className="font-mono text-zinc-500 font-medium shrink-0">
                  {String(idx + 1).padStart(2, '0')}.
                </span>
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keybinds' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">ACE Interaction</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                Left Windows
              </kbd>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">ACE Self Interaction</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                Ctrl + Left Win
              </kbd>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">Climb / Mantle</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                Custom User 1 (V)
              </kbd>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">Earplugs</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                End
              </kbd>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">Direct Comms</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                Caps Lock
              </kbd>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center">
              <span className="text-zinc-400">Voice Volume</span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-zinc-200">
                Ctrl + Tab
              </kbd>
            </div>
          </div>
        )}

        {activeTab === 'comms' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-1">
              <div className="font-medium text-zinc-200">In-Game Direct Voice</div>
              <p className="text-zinc-400 text-[11px]">
                Built-in positional VOIP with acoustic obstruction and distance falloff. Use <kbd className="text-zinc-300">Caps Lock</kbd>.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60 space-y-1">
              <div className="font-medium text-zinc-200">Community Discord</div>
              <p className="text-zinc-400 text-[11px]">
                Join squad briefing and coordination voice channels prior to mission deployment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
