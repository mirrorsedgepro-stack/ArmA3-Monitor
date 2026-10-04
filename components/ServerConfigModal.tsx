'use client';

import React, { useState } from 'react';
import { X, Settings, Server, Globe, HelpCircle, Save, RotateCcw, Check } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-xl bg-tactical-900 border border-tactical-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-tactical-700 bg-tactical-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Target Server Configuration</h3>
              <p className="text-xs text-zinc-400">Configure your Arma 3 server IP &amp; query settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
              Community / Server Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 77th JSOC | Public Server 1"
              className="w-full p-2.5 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
                Server IP or Domain
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="127.0.0.1 or arma.myserver.com"
                className="w-full p-2.5 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-zinc-300 uppercase mb-1">
                Game Port
              </label>
              <input
                type="number"
                required
                value={port}
                onChange={(e) => {
                  setPort(e.target.value);
                  // Default query port in Arma 3 is GamePort + 1
                  const num = parseInt(e.target.value, 10);
                  if (num) setQueryPort((num + 1).toString());
                }}
                placeholder="2302"
                className="w-full p-2.5 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-zinc-300 uppercase">
                Query Port (Steam A2S)
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">Usually Game Port + 1 (2303)</span>
            </div>
            <input
              type="number"
              value={queryPort}
              onChange={(e) => setQueryPort(e.target.value)}
              placeholder="2303"
              className="w-full p-2.5 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-zinc-300 uppercase">
                BattleMetrics Server ID (Optional)
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">For cloud querying</span>
            </div>
            <input
              type="text"
              value={bmId}
              onChange={(e) => setBmId(e.target.value)}
              placeholder="e.g. 2351240"
              className="w-full p-2.5 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              If your server is listed on BattleMetrics, adding the ID guarantees real-time queries even on restrictive cloud serverless networks.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-tactical-950 border border-tactical-800 hover:bg-tactical-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs shadow-tactical-glow transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>SAVED &amp; CONNECTING...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>APPLY &amp; QUERY SERVER</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
