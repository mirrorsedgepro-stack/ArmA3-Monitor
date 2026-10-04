'use client';

import React, { useState } from 'react';
import { Shield, Keyboard, Radio, CheckCircle, ChevronRight, Zap } from 'lucide-react';

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
    <section id="rules" className="space-y-4 pt-4">
      <div className="rounded-2xl bg-gradient-to-b from-ga-surface to-ga-card border border-white/[0.08] shadow-ga-card overflow-hidden">
        {/* Header Tabs */}
        <div className="flex border-b border-white/[0.08] bg-[#0E101D] text-xs font-medium">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-5 py-3.5 transition-colors border-b-2 ${
              activeTab === 'rules'
                ? 'border-ga-mint text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-ga-mint" />
            <span>Operational SOP &amp; Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('keybinds')}
            className={`flex items-center gap-2 px-5 py-3.5 transition-colors border-b-2 ${
              activeTab === 'keybinds'
                ? 'border-ga-blue text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4 text-ga-blue" />
            <span>ACE3 &amp; Combat Keybinds</span>
          </button>

          <button
            onClick={() => setActiveTab('comms')}
            className={`flex items-center gap-2 px-5 py-3.5 transition-colors border-b-2 ${
              activeTab === 'comms'
                ? 'border-purple-400 text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Voice &amp; Communications</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Server Guidelines &amp; Code of Conduct
                </h3>
                <span className="text-xs text-zinc-500 font-mono">6 Core Directives</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {defaultRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <span className="font-mono text-ga-mint font-semibold text-xs shrink-0 mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="text-zinc-300 leading-relaxed">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keybinds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Essential Gameplay &amp; Interaction Keybinds
                </h3>
                <span className="text-xs text-zinc-500 font-mono">Default Mapping</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">ACE Interaction</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-ga-mint">
                    Left Windows
                  </kbd>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">ACE Self Interaction</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-ga-mint">
                    Ctrl + Left Win
                  </kbd>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">Climb &amp; Mantle</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-ga-blue">
                    Custom User 1 (V)
                  </kbd>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">Combat Earplugs</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-zinc-300">
                    End
                  </kbd>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">Direct Comms</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-purple-400">
                    Caps Lock
                  </kbd>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex justify-between items-center">
                  <span className="text-zinc-300">Whisper / Shout</span>
                  <kbd className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] font-mono text-[11px] text-zinc-300">
                    Ctrl + Tab
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Audio &amp; Voice Channels
                </h3>
                <span className="text-xs text-zinc-500 font-mono">Communications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="font-semibold text-white">In-Game Proximity VOIP</div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Arma 3 standard high-fidelity voice transmission with dynamic terrain occlusion and realistic acoustic reverberation. Press <kbd className="text-ga-mint">Caps Lock</kbd> to speak.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="font-semibold text-white">Squad Discord Server</div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Join mission briefings, recruit rebel squadmates, and post operation feedback on the community Discord channel.
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
