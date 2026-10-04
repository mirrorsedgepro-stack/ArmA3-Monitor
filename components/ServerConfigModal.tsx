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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div 
        className="w-full max-w-md rounded-lg bg-arma-surface border border-arma-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-amber">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-arma-text uppercase">C2 HOST SETTINGS</h3>
              <p className="text-[11px] text-arma-textMuted">Target server address and query parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-arma-text uppercase mb-1">
              COMMUNITY / SERVER NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frenchy's Antistasi Ultimate"
              className="w-full p-2 rounded bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-amber uppercase"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-arma-text uppercase mb-1">
                SERVER IP / HOST
              </label>
              <input
                type="text"
                required
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="180.181.238.103"
                className="w-full p-2 rounded bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-amber"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-arma-text uppercase mb-1">
                GAME PORT
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
                className="w-full p-2 rounded bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-amber"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-arma-text uppercase mb-1">
              STEAM A2S QUERY PORT
            </label>
            <input
              type="number"
              value={queryPort}
              onChange={(e) => setQueryPort(e.target.value)}
              placeholder="2303"
              className="w-full p-2 rounded bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-amber"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-arma-text uppercase mb-1">
              BATTLEMETRICS ID (OPTIONAL)
            </label>
            <input
              type="text"
              value={bmId}
              onChange={(e) => setBmId(e.target.value)}
              placeholder="e.g. 2351240"
              className="w-full p-2 rounded bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-amber"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded arma-btn-secondary text-xs font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded arma-btn-primary text-xs font-bold shadow-arma-amber"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVED</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>APPLY HOST</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
