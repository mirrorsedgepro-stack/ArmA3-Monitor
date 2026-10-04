'use client';

import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check, Save } from 'lucide-react';
import { DEFAULT_SERVER_CONFIG } from '@/data/defaultServer';

interface ServerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: {
    name: string;
    ip: string;
    port: number;
    queryPort: number;
    bmId?: string;
  };
  onSaveConfig: (config: {
    name: string;
    ip: string;
    port: number;
    queryPort: number;
    bmId?: string;
  }) => void;
}

export function ServerConfigModal({
  isOpen,
  onClose,
  currentConfig,
  onSaveConfig,
}: ServerConfigModalProps) {
  const [name, setName] = useState(currentConfig.name);
  const [ip, setIp] = useState(currentConfig.ip);
  const [port, setPort] = useState(currentConfig.port.toString());
  const [queryPort, setQueryPort] = useState(currentConfig.queryPort.toString());
  const [bmId, setBmId] = useState(currentConfig.bmId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      name: name.trim() || DEFAULT_SERVER_CONFIG.name,
      ip: ip.trim() || DEFAULT_SERVER_CONFIG.ip,
      port: parseInt(port, 10) || 2302,
      queryPort: parseInt(queryPort, 10) || (parseInt(port, 10) ? parseInt(port, 10) + 1 : 2303),
      bmId: bmId.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setName(DEFAULT_SERVER_CONFIG.name);
    setIp(DEFAULT_SERVER_CONFIG.ip);
    setPort(DEFAULT_SERVER_CONFIG.port.toString());
    setQueryPort(DEFAULT_SERVER_CONFIG.queryPort.toString());
    setBmId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md rounded-2xl bg-[#101320] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0E101D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ga-indigo/20 border border-ga-indigo/30 flex items-center justify-center text-ga-blue">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Target Server Configuration</h3>
              <p className="text-xs text-zinc-400">Configure target server IP &amp; query parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Community / Server Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frenchy's Antistasi Ultimate"
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-ga-mint/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Server IP
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="180.181.238.103"
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-ga-mint/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Port
              </label>
              <input
                type="number"
                required
                value={port}
                onChange={(e) => {
                  setPort(e.target.value);
                  const num = parseInt(e.target.value, 10);
                  if (num) setQueryPort((num + 1).toString());
                }}
                placeholder="2302"
                className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-ga-mint/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Steam A2S Query Port
            </label>
            <input
              type="number"
              value={queryPort}
              onChange={(e) => setQueryPort(e.target.value)}
              placeholder="2303"
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-ga-mint/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              BattleMetrics Server ID <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={bmId}
              onChange={(e) => setBmId(e.target.value)}
              placeholder="e.g. 2351240"
              className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-ga-mint/50"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg ga-btn-secondary text-xs text-zinc-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg ga-btn-primary text-xs font-semibold shadow-ga-mint"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Saved &amp; Updated</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply Settings</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
