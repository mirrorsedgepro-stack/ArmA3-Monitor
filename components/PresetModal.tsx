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
    const html = generateArma3PresetHtml('FAS', currentMods);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FAS_Preset.html';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl rounded-md bg-slate-800 ring-1 ring-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-arma-border bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-arma-card border border-arma-border flex items-center justify-center text-arma-red shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-arma-text uppercase truncate">ARMA 3 LAUNCHER PRESET</h3>
              <p className="text-[10px] sm:text-[11px] text-arma-textMuted truncate">Bohemia Interactive XML/HTML preset sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-arma-textMuted hover:text-arma-text hover:bg-arma-card transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-arma-border bg-black/20 text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-3 text-center font-bold uppercase transition-colors border-b-2 text-xs ${
              activeTab === 'download'
                ? 'border-arma-red text-arma-red bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            EXPORT PRESET
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 px-3 text-center font-bold uppercase transition-colors border-b-2 text-xs ${
              activeTab === 'import'
                ? 'border-arma-red text-arma-red bg-arma-card'
                : 'border-transparent text-arma-textMuted hover:text-arma-text'
            }`}
          >
            IMPORT PRESET
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'download' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-black/20 ring-1 ring-white/5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-arma-text uppercase">OPERATION LOADOUT</span>
                  <span className="text-arma-red font-bold">{currentMods.length} MODS</span>
                </div>
                <p className="text-xs text-arma-textMuted leading-relaxed">
                  Drop this file directly onto your official Bohemia Interactive Arma 3 Launcher. Steam will automatically subscribe, verify, and order each addon.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg arma-btn-primary text-xs font-bold shadow-arma-red"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>DOWNLOAD ARMA 3 PRESET (.HTML)</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-arma-text uppercase">INSTRUCTIONS:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-md bg-black/20 ring-1 ring-white/5">
                    <span className="text-arma-red font-bold block mb-1">01. EXPORT</span>
                    <p className="text-arma-textMuted text-[11px]">Save the .html preset</p>
                  </div>
                  <div className="p-3 rounded-md bg-black/20 ring-1 ring-white/5">
                    <span className="text-arma-khaki font-bold block mb-1">02. DRAG &amp; DROP</span>
                    <p className="text-arma-textMuted text-[11px]">Drop into Arma 3 Launcher</p>
                  </div>
                  <div className="p-3 rounded-md bg-black/20 ring-1 ring-white/5">
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
              <label className="flex flex-col items-center justify-center p-5 border border-dashed border-arma-border hover:border-arma-red/50 rounded-lg bg-arma-card cursor-pointer transition-colors">
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
                className="w-full p-2.5 rounded-md bg-black/20 ring-1 ring-white/5 text-arma-text placeholder-arma-textDim text-xs focus:outline-none focus:border-arma-red"
              />

              <button
                onClick={handleTextImport}
                className="w-full py-2.5 rounded-lg arma-btn-secondary text-xs font-bold uppercase"
              >
                PARSE &amp; APPLY MODPACK
              </button>

              {importStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    importStatus.isError
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-arma-redDim text-arma-red border border-arma-red/30'
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
