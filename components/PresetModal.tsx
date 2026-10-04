'use client';

import React, { useState } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-xl bg-tactical-900 border border-tactical-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-tactical-700 bg-tactical-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Arma 3 Launcher Preset Manager</h3>
              <p className="text-xs text-zinc-400">Export or import official BI Launcher .html presets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-tactical-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-tactical-800 bg-tactical-900/60 font-mono text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 px-4 text-center font-bold transition-all border-b-2 ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400 bg-tactical-850/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Download Preset (.html)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-3 px-4 text-center font-bold transition-all border-b-2 ${
              activeTab === 'import'
                ? 'border-emerald-500 text-emerald-400 bg-tactical-850/50'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Import Custom Preset
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {activeTab === 'download' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-tactical-950 border border-tactical-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Preset Summary</span>
                  <span className="text-xs font-mono text-zinc-400">{currentMods.length} Mods Included</span>
                </div>
                <p className="text-xs text-zinc-300">
                  This file uses the official Bohemia Interactive XML/HTML preset structure supported natively by the Arma 3 Launcher.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-sm tracking-wide shadow-tactical-glow transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD ARMA 3 PRESET (.HTML)</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  How to use with Arma 3 Launcher
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-tactical-950 border border-tactical-800">
                    <span className="font-mono text-emerald-400 font-bold block mb-1">01. DOWNLOAD</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Click the download button above to save the <code className="text-zinc-200">.html</code> preset.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-tactical-950 border border-tactical-800">
                    <span className="font-mono text-emerald-400 font-bold block mb-1">02. DRAG &amp; DROP</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Open your standard Arma 3 Launcher, go to <strong>MODS</strong>, and drop the file onto the window.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-tactical-950 border border-tactical-800">
                    <span className="font-mono text-emerald-400 font-bold block mb-1">03. AUTO-SUBSCRIBE</span>
                    <p className="text-zinc-400 leading-relaxed">
                      Steam will automatically subscribe and download any missing mods before launching!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Want to display your own custom server modpack? Upload your exported Arma 3 Launcher preset HTML file or paste its contents below.
              </p>

              {/* File upload zone */}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-tactical-700 hover:border-emerald-500/50 rounded-xl bg-tactical-950/60 cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                <span className="text-xs font-mono font-bold text-zinc-200">Choose .html Preset File</span>
                <span className="text-[11px] text-zinc-500 mt-1">Exported directly from Arma 3 Launcher</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-tactical-800"></div>
                <span className="flex-shrink mx-4 text-xs font-mono text-zinc-500 uppercase">Or Paste Preset Content</span>
                <div className="flex-grow border-t border-tactical-800"></div>
              </div>

              {/* Textarea */}
              <textarea
                rows={5}
                placeholder="Paste HTML code from your Arma 3 preset or Steam workshop links..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full p-3 rounded-lg bg-tactical-950 border border-tactical-700 text-zinc-200 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleTextImport}
                className="w-full py-2.5 rounded-lg bg-tactical-800 hover:bg-emerald-600 hover:text-black text-zinc-200 font-mono font-bold text-xs transition-colors"
              >
                Parse &amp; Load Mods Into Portal
              </button>

              {importStatus && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                    importStatus.isError
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
