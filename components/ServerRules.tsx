'use client';

import React, { useState } from 'react';
import { Shield, Keyboard, Radio, FileText } from 'lucide-react';

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
    <section id="rules" className="space-y-4">
      <div className="rounded-lg bg-arma-surface border border-arma-border overflow-hidden">
        {/* Tactical Header Tabs */}
        <div className="flex border-b border-arma-border bg-[#0e1116] text-xs font-mono">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-3 transition-colors border-b-2 font-bold uppercase ${
              activeTab === 'rules'
                ? 'border-arma-amber text-arma-amber bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>RULES OF ENGAGEMENT (ROE)</span>
          </button>

          <button
            onClick={() => setActiveTab('keybinds')}
            className={`flex items-center gap-2 px-4 py-3 transition-colors border-b-2 font-bold uppercase ${
              activeTab === 'keybinds'
                ? 'border-arma-amber text-arma-amber bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>ACE3 &amp; COMBAT CONTROLS</span>
          </button>

          <button
            onClick={() => setActiveTab('comms')}
            className={`flex items-center gap-2 px-4 py-3 transition-colors border-b-2 font-bold uppercase ${
              activeTab === 'comms'
                ? 'border-arma-amber text-arma-amber bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>VOIP &amp; RADIO NETS</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase">STANDARD OPERATING DIRECTIVES</span>
                <span>6 PROTOCOLS ACTIVE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
                {defaultRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded bg-arma-card border border-arma-border"
                  >
                    <span className="text-arma-amber font-bold shrink-0">
                      [{String(idx + 1).padStart(2, '0')}]
                    </span>
                    <span className="text-arma-text leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keybinds' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase">ACE3 MODULAR INTERACTION MAPPING</span>
                <span>STANDARD KEYBINDS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">ACE Interaction</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-amber">
                    Left Windows
                  </kbd>
                </div>

                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">ACE Self Interact</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-amber">
                    Ctrl + Left Win
                  </kbd>
                </div>

                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">Climb / Mantle</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-khaki">
                    User 1 (V)
                  </kbd>
                </div>

                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">Combat Earplugs</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text">
                    End
                  </kbd>
                </div>

                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">Direct VOIP</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text">
                    Caps Lock
                  </kbd>
                </div>

                <div className="p-3 rounded bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-textMuted">Voice Volume</span>
                  <kbd className="px-2 py-0.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text">
                    Ctrl + Tab
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase">COMMUNICATIONS &amp; SQUAD CHANNELS</span>
                <span>DIRECT AUDIO NET</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded bg-arma-card border border-arma-border space-y-1">
                  <div className="font-bold text-arma-text uppercase">IN-GAME POSITIONAL DIRECT VOICE</div>
                  <p className="text-arma-textMuted text-[11px] leading-relaxed">
                    Arma 3 Von voice system with terrain occlusion and direct speech volume modes. Toggle whisper/normal/shout with <kbd className="text-arma-amber">Ctrl + Tab</kbd>.
                  </p>
                </div>

                <div className="p-3.5 rounded bg-arma-card border border-arma-border space-y-1">
                  <div className="font-bold text-arma-text uppercase">COMMUNITY DISCORD OPERATIONS</div>
                  <p className="text-arma-textMuted text-[11px] leading-relaxed">
                    Squad briefing and platoon coordination. Connect prior to mission deployment for operational tasking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
