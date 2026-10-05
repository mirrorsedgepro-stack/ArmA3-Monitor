'use client';

import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check, Save } from 'lucide-react';
import { DEFAULT_SERVER_CONFIG, SERVERS_LIST } from '@/data/defaultServer';

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

  React.useEffect(() => {
    if (isOpen) {
      setName(currentConfig.name);
      setIp(currentConfig.ip);
      setPort(currentConfig.port.toString());
      setQueryPort(currentConfig.queryPort.toString());
      setBmId(currentConfig.bmId || '');
    }
  }, [isOpen, currentConfig]);

  if (!isOpen) return null;

  const applyPreset = (srv: typeof SERVERS_LIST[0]) => {
    setName(srv.name);
    setIp(srv.ip);
    setPort(srv.port.toString());
    setQueryPort(srv.queryPort.toString());
    setBmId(srv.bmId || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      name: name.trim().length > 2 ? name.trim() : DEFAULT_SERVER_CONFIG.name,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div 
        className="w-full max-w-md rounded-xl bg-arma-surface border border-arma-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-red shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-arma-text uppercase truncate">HOST SETTINGS</h3>
              <p className="text-[10px] sm:text-[11px] text-arma-textMuted truncate">Server address and query parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-arma-text uppercase mb-1.5">
              QUICK SERVER PRESETS
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SERVERS_LIST.map((srv) => (
                <button
                  type="button"
                  key={srv.id}
                  onClick={() => applyPreset(srv)}
                  className="px-2.5 py-1.5 rounded bg-arma-card hover:bg-arma-cardHover border border-arma-border hover:border-arma-red/40 text-[11px] text-left transition-colors"
                >
                  <div className="font-bold text-arma-text truncate">{srv.mode}</div>
                  <div className="text-[10px] text-arma-khaki">Port {srv.port}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-arma-text uppercase mb-1">
              COMMUNITY / SERVER NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frenchy's Antistasi Ultimate"
              className="w-full p-2.5 rounded-lg bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-red uppercase"
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
                className="w-full p-2.5 rounded-lg bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-red"
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
                className="w-full p-2.5 rounded-lg bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-red"
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
              className="w-full p-2.5 rounded-lg bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-red"
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
              className="w-full p-2.5 rounded-lg bg-arma-card border border-arma-border text-arma-text text-xs focus:outline-none focus:border-arma-red"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-lg arma-btn-secondary text-xs font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg arma-btn-primary text-xs font-bold shadow-arma-red"
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
