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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Server Settings</h3>
              <p className="text-xs text-zinc-500">Configure target server IP and query parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Server Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frenchy's Antistasi"
              className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Server IP
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="180.181.238.103"
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
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
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Steam A2S Query Port
            </label>
            <input
              type="number"
              value={queryPort}
              onChange={(e) => setQueryPort(e.target.value)}
              placeholder="2303"
              className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              BattleMetrics ID <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={bmId}
              onChange={(e) => setBmId(e.target.value)}
              placeholder="e.g. 2351240"
              className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
