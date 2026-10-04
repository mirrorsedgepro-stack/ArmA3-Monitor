'use client';

import React, { useState } from 'react';
import { BookOpen, Radio, Keyboard, ShieldAlert, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';

interface ServerRulesProps {
  rules?: string[];
}

export function ServerRules({ rules }: ServerRulesProps) {
  const [activeTab, setActiveTab] = useState<'rules' | 'keybinds' | 'comms'>('rules');

  const defaultRules = rules || [
    "Strict Roleplay / MilSim communication over TFAR radio frequencies. Maintain radio discipline.",
    "Positive ID required prior to weapons release. Friendly fire will result in an immediate kick/ban.",
    "Armor, Fixed-Wing, and Rotary assets require proper crew certification and JTAC clearance.",
    "All infantry squads must embed at least 1 certified Combat Life Saver (CLS) or Medic.",
    "Zeus Game Masters have final authority on mission scenario flow and live ordnance drops.",
    "No trolling, griefing, or unauthorized asset destruction in Base Operations Area (FOB)."
  ];

  return (
    <div className="rounded-xl bg-tactical-900 border border-tactical-700 shadow-md overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b border-tactical-800 bg-tactical-950 font-mono text-xs">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-5 py-3.5 font-bold transition-all border-b-2 ${
            activeTab === 'rules'
              ? 'border-emerald-500 text-emerald-400 bg-tactical-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Rules of Engagement (ROE)</span>
        </button>

        <button
          onClick={() => setActiveTab('keybinds')}
          className={`flex items-center gap-2 px-5 py-3.5 font-bold transition-all border-b-2 ${
            activeTab === 'keybinds'
              ? 'border-emerald-500 text-emerald-400 bg-tactical-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>ACE3 &amp; Essential Keybinds</span>
        </button>

        <button
          onClick={() => setActiveTab('comms')}
          className={`flex items-center gap-2 px-5 py-3.5 font-bold transition-all border-b-2 ${
            activeTab === 'comms'
              ? 'border-emerald-500 text-emerald-400 bg-tactical-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>TFAR Comms &amp; Frequencies</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'rules' && (
          <div className="space-y-4">
            <h4 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Operational Protocol &amp; Server Rules
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {defaultRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-lg bg-tactical-950 border border-tactical-800 text-xs leading-relaxed"
                >
                  <span className="font-mono font-bold text-emerald-400 bg-tactical-900 px-2 py-0.5 rounded border border-tactical-700 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-300 font-medium">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'keybinds' && (
          <div className="space-y-4">
            <h4 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              Tactical Keyboard Shortcuts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">ACE Interaction</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-emerald-400 font-mono font-bold">
                  Left Windows
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">ACE Self Interaction</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-emerald-400 font-mono font-bold">
                  Ctrl + Left Windows
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">TFAR Short-Range Radio</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-cyan-400 font-mono font-bold">
                  Caps Lock
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">TFAR Long-Range Radio</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-cyan-400 font-mono font-bold">
                  Ctrl + Caps Lock
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">Voice Volume (Whisper/Shout)</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-zinc-300 font-mono font-bold">
                  Ctrl + Tab
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-tactical-950 border border-tactical-800 flex justify-between items-center">
                <span className="text-zinc-300">Enhanced Mantling / Climb</span>
                <kbd className="px-2 py-1 rounded bg-tactical-850 border border-tactical-700 text-amber-400 font-mono font-bold">
                  Custom User 1 (V)
                </kbd>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comms' && (
          <div className="space-y-4">
            <h4 className="text-sm font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              Standard Task Force Radio Net Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-lg bg-tactical-950 border border-tactical-800 space-y-1.5">
                <div className="font-mono text-cyan-400 font-bold">ALPHA SQUAD (1-1)</div>
                <div className="text-zinc-400">SR: <strong className="text-zinc-200 font-mono">110.0 MHz</strong></div>
                <div className="text-zinc-500 text-[11px]">Primary Infantry Assault Net</div>
              </div>

              <div className="p-4 rounded-lg bg-tactical-950 border border-tactical-800 space-y-1.5">
                <div className="font-mono text-cyan-400 font-bold">BRAVO SQUAD (1-2)</div>
                <div className="text-zinc-400">SR: <strong className="text-zinc-200 font-mono">120.0 MHz</strong></div>
                <div className="text-zinc-500 text-[11px]">Weapons &amp; Support Squad</div>
              </div>

              <div className="p-4 rounded-lg bg-tactical-950 border border-tactical-800 space-y-1.5">
                <div className="font-mono text-cyan-400 font-bold">VIPER / CAS / MEDEVAC</div>
                <div className="text-zinc-400">LR: <strong className="text-zinc-200 font-mono">30.0 MHz</strong></div>
                <div className="text-zinc-500 text-[11px]">Platoon &amp; Rotary Operations Net</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
