'use client';

import React, { useState } from 'react';
import { Shield, Keyboard, Radio, CheckCircle, Volume2, Users, AlertTriangle } from 'lucide-react';

interface ServerRulesProps {
  rules?: string[];
}

export function ServerRules({ rules }: ServerRulesProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'keybinds' | 'comms'>('rules');

  const defaultRules = [
    { title: "Cooperative Guerrilla Ops", desc: "Coordinate strikes with platoon lead before engaging major military bases." },
    { title: "Asset & Fuel Seizure", desc: "Capture enemy supply trucks and repair vehicles to fortify rebel garrisons." },
    { title: "Positive Identification (PID)", desc: "Verify civilian presence in towns. Collateral damage diminishes regional support." },
    { title: "Tactical ACE Interactions", desc: "Use the Windows Key for quick medical triage, equipment inspection, and logistics." },
    { title: "HQ Protection Protocol", desc: "No reckless exposure or intentional destruction of HQ assets." }
  ];

  return (
    <section id="rules" className="space-y-4 sm:space-y-6 scroll-mt-20 sm:scroll-mt-24">
      <div className="rounded-xl bg-arma-surface border border-arma-border overflow-hidden shadow-lg">
        {/* Tactical Header Tabs - Mobile Touch Scrollable */}
        <div className="flex border-b border-arma-border bg-[#090b0e] text-xs font-mono overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-4 transition-all border-b-2 font-bold uppercase text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'rules'
                ? 'border-arma-red text-arma-red bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text hover:bg-arma-card/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>RULES OF ENGAGEMENT</span>
          </button>

          <button
            onClick={() => setActiveTab('keybinds')}
            className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-4 transition-all border-b-2 font-bold uppercase text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'keybinds'
                ? 'border-arma-red text-arma-red bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text hover:bg-arma-card/50'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>ACE3 &amp; CONTROLS</span>
          </button>

          <button
            onClick={() => setActiveTab('comms')}
            className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-3 sm:py-4 transition-all border-b-2 font-bold uppercase text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'comms'
                ? 'border-arma-red text-arma-red bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text hover:bg-arma-card/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>VOIP &amp; COMMS</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-8">
          {activeTab === 'rules' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase tracking-wider text-[11px] sm:text-xs">STANDARD OPERATING DIRECTIVES</span>
                <span className="px-2 py-0.5 rounded bg-arma-card border border-arma-border text-arma-red font-bold text-[10px] sm:text-xs">5 DIRECTIVES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
                {defaultRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-lg bg-arma-card border border-arma-border hover:border-arma-red/40 transition-colors space-y-1.5 sm:space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-arma-red font-black text-xs">
                          PROTOCOL [0{idx + 1}]
                        </span>
                        <CheckCircle className="w-3.5 h-3.5 text-arma-green" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-arma-text uppercase mt-1.5 sm:mt-2">
                        {rule.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-arma-textMuted leading-relaxed mt-1">
                        {rule.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keybinds' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase tracking-wider text-[11px] sm:text-xs">ACE3 &amp; COMBAT CONTROLS MAPPING</span>
                <span className="text-arma-khaki font-bold text-[10px] sm:text-xs">DEFAULT CLIENT</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">ACE Interaction</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-red text-xs shadow-inner">
                    Left Windows
                  </kbd>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">ACE Self-Interact</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-red text-xs shadow-inner">
                    Ctrl + Left Win
                  </kbd>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">Climb / Mantle</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-khaki text-xs shadow-inner">
                    User 1 (V)
                  </kbd>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">Combat Earplugs</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text text-xs shadow-inner">
                    End
                  </kbd>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">Direct VOIP Talk</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text text-xs shadow-inner">
                    Caps Lock
                  </kbd>
                </div>

                <div className="p-3.5 sm:p-4 rounded-lg bg-arma-card border border-arma-border flex justify-between items-center">
                  <span className="text-arma-text font-bold text-xs sm:text-sm">Voice Volume</span>
                  <kbd className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-arma-surface border border-arma-border font-bold text-arma-text text-xs shadow-inner">
                    Ctrl + Tab
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comms' && (
            <div className="space-y-3 sm:space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-arma-textMuted">
                <span className="font-bold text-arma-text uppercase tracking-wider text-[11px] sm:text-xs">TACTICAL AUDIO FREQUENCIES</span>
                <span className="text-arma-green font-bold flex items-center gap-1 text-[10px] sm:text-xs">
                  <span className="w-2 h-2 rounded-full bg-arma-green animate-pulse" />
                  VOIP READY
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 sm:p-5 rounded-lg bg-arma-card border border-arma-border space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-arma-text uppercase text-xs sm:text-sm">IN-GAME DIRECT SPEECH (VON)</span>
                    <Volume2 className="w-4 h-4 text-arma-red" />
                  </div>
                  <p className="text-arma-textMuted text-[11px] sm:text-xs leading-relaxed">
                    Arma 3 Von voice system with natural distance attenuation and 3 volume levels (Whisper, Normal, Shout). Toggle using <kbd className="text-arma-red">Ctrl + Tab</kbd>.
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-lg bg-arma-card border border-arma-border space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-arma-text uppercase text-xs sm:text-sm">PLATOON DISCORD BRIEFING</span>
                    <Users className="w-4 h-4 text-arma-khaki" />
                  </div>
                  <p className="text-arma-textMuted text-[11px] sm:text-xs leading-relaxed">
                    Team operations, pre-mission tasking, and air support coordination. Join prior to mission launch.
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
