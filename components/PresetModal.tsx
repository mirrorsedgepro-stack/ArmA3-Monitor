'use client';

import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseArma3PresetHtml, generateArma3PresetHtml } from '@/lib/presetGenerator';
import { ArmaMod } from '@/data/defaultMods';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  currentMods: ArmaMod[];
  onApplyCustomMods: (newMods: ArmaMod[]) => void;
}

export function PresetModal({
  isOpen,
  onClose,
  serverName,
  currentMods,
  onApplyCustomMods,
}: PresetModalProps) {
  const [activeTab, setActiveTab] = useState<'download' | 'import'>('download');
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ message: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const html = generateArma3PresetHtml(serverName, currentMods);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${serverName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Preset.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseAndApply(content);
      }
    };
    reader.readAsText(file);
  };

  const handleTextImport = () => {
    if (!importText.trim()) {
      setImportStatus({ message: 'Paste preset HTML content or workshop links', isError: true });
      return;
    }
    parseAndApply(importText);
  };

  const parseAndApply = (content: string) => {
    try {
      const parsed = parseArma3PresetHtml(content);
      if (parsed.length === 0) {
        setImportStatus({
          message: 'No valid Arma 3 mods or Steam Workshop links were found.',
          isError: true,
        });
        return;
      }

      const fullMods: ArmaMod[] = parsed.map((p, idx) => ({
        id: p.id || `custom-${idx}`,
        name: p.name || `Custom Mod ${idx + 1}`,
        category: p.category || 'core',
        required: true,
        steamUrl: p.steamUrl || `https://steamcommunity.com/sharedfiles/filedetails/?id=${p.id}`,
      }));

      onApplyCustomMods(fullMods);
      setImportStatus({
        message: `Successfully loaded ${fullMods.length} mods into manifest!`,
        isError: false,
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setImportStatus({
        message: `Error parsing preset: ${(err as Error).message}`,
        isError: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div 
        className="w-full max-w-xl rounded-lg bg-arma-surface border border-arma-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-amber">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-arma-text uppercase">ARMA 3 LAUNCHER PRESET</h3>
              <p className="text-[11px] text-arma-textMuted">Bohemia Interactive XML/HTML preset synchronization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-arma-border bg-[#0e1116] text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-4 text-center font-bold uppercase transition-colors border-b-2 ${
              activeTab === 'download'
                ? 'border-arma-amber text-arma-amber bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            EXPORT PRESET (.HTML)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 px-4 text-center font-bold uppercase transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-arma-amber text-arma-amber bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            IMPORT CUSTOM PRESET
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'download' ? (
            <div className="space-y-4">
              <div className="p-4 rounded bg-arma-card border border-arma-border space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-arma-text uppercase">OPERATION LOADOUT</span>
                  <span className="text-arma-amber font-bold">{currentMods.length} MODS</span>
                </div>
                <p className="text-xs text-arma-textMuted leading-relaxed">
                  Drop this file directly onto your official Bohemia Interactive Arma 3 Launcher. Steam will automatically subscribe, verify, and order each addon.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded arma-btn-primary text-xs font-bold shadow-arma-amber"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD ARMA 3 PRESET (.HTML)</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-arma-text uppercase">INSTRUCTIONS:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded bg-arma-card border border-arma-border">
                    <span className="text-arma-amber font-bold block mb-1">01. EXPORT</span>
                    <p className="text-arma-textMuted text-[11px]">Save the .html preset</p>
                  </div>
                  <div className="p-3 rounded bg-arma-card border border-arma-border">
                    <span className="text-arma-khaki font-bold block mb-1">02. DRAG &amp; DROP</span>
                    <p className="text-arma-textMuted text-[11px]">Drop into Arma 3 Launcher</p>
                  </div>
                  <div className="p-3 rounded bg-arma-card border border-arma-border">
                    <span className="text-arma-green font-bold block mb-1">03. DEPLOY</span>
                    <p className="text-arma-textMuted text-[11px]">Steam synchronizes</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-arma-textMuted">
                Select your exported Arma 3 Launcher .html preset or paste contents below:
              </p>

              {/* File upload zone */}
              <label className="flex flex-col items-center justify-center p-5 border border-dashed border-arma-border hover:border-arma-amber/50 rounded bg-arma-card cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-arma-textMuted mb-1" />
                <span className="text-xs font-bold text-arma-text uppercase">CHOOSE .HTML PRESET FILE</span>
                <span className="text-[10px] text-arma-textDim mt-0.5">EXPORTED FROM ARMA 3 LAUNCHER</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <textarea
                rows={4}
                placeholder="OR PASTE PRESET HTML CODE..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-2.5 rounded bg-arma-card border border-arma-border text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-amber"
              />

              <button
                onClick={handleTextImport}
                className="w-full py-2 rounded arma-btn-secondary text-xs font-bold uppercase"
              >
                PARSE &amp; APPLY MODPACK
              </button>

              {importStatus && (
                <div
                  className={`p-2.5 rounded text-xs flex items-center gap-2 ${
                    importStatus.isError
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-arma-amberDim text-arma-amber border border-arma-amber/30'
                  }`}
                >
                  {importStatus.isError ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
