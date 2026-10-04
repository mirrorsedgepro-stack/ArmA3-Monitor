'use client';

import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
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
      setImportStatus({ message: 'Please paste preset HTML content or workshop links', isError: true });
      return;
    }
    parseAndApply(importText);
  };

  const parseAndApply = (content: string) => {
    try {
      const parsed = parseArma3PresetHtml(content);
      if (parsed.length === 0) {
        setImportStatus({
          message: 'No valid Arma 3 mods or Steam Workshop links were found in this file.',
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
        message: `Successfully loaded ${fullMods.length} mods from preset!`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#101320] border border-white/[0.1] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0E101D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ga-mint/10 border border-ga-mint/20 flex items-center justify-center text-ga-mint">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Arma 3 Launcher Preset Manager</h3>
              <p className="text-xs text-zinc-400">Download or import official Bohemia Interactive XML/HTML presets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/[0.08] bg-[#0E101D]/60 text-xs font-medium">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'download'
                ? 'border-ga-mint text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Download Preset (.html)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 text-center transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-ga-mint text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Import Custom Preset
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'download' ? (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Synchronized Modpack</span>
                  <span className="text-ga-mint font-mono font-semibold">{currentMods.length} Mods</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Drag and drop this downloaded preset file directly into the official Bohemia Interactive Arma 3 Launcher to automatically subscribe, download, and configure load order.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg ga-btn-primary text-xs font-semibold shadow-ga-mint"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Launcher Preset (.html)</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">How it works:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-ga-mint font-semibold block mb-1">01. DOWNLOAD</span>
                    <p className="text-zinc-400 leading-normal text-[11px]">Save the .html preset file</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-ga-blue font-semibold block mb-1">02. DRAG &amp; DROP</span>
                    <p className="text-zinc-400 leading-normal text-[11px]">Drop file into Arma 3 Launcher</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-purple-400 font-semibold block mb-1">03. AUTO SYNC</span>
                    <p className="text-zinc-400 leading-normal text-[11px]">Steam automatically downloads</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <p className="text-xs text-zinc-400">
                Upload your Arma 3 Launcher HTML preset or paste raw content:
              </p>

              {/* File upload zone */}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/[0.1] hover:border-ga-mint/50 rounded-xl bg-white/[0.02] cursor-pointer transition-colors">
                <Upload className="w-6 h-6 text-zinc-400 mb-1.5" />
                <span className="text-xs font-semibold text-white">Choose .html preset file</span>
                <span className="text-[11px] text-zinc-500 mt-0.5">Exported from Arma 3 Launcher</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <textarea
                rows={4}
                placeholder="Or paste HTML preset code..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-ga-mint/50"
              />

              <button
                onClick={handleTextImport}
                className="w-full py-2.5 rounded-lg ga-btn-secondary text-xs font-semibold hover:border-white/[0.25]"
              >
                Parse &amp; Synchronize Modpack
              </button>

              {importStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    importStatus.isError
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-ga-mint/10 text-ga-mint border border-ga-mint/20'
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
