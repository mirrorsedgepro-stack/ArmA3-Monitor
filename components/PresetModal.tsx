'use client';

import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertCircle, Info } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Arma 3 Launcher Preset</h3>
              <p className="text-xs text-zinc-500">Download or import official BI Launcher .html preset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 px-4 text-center font-medium transition-colors border-b-2 ${
              activeTab === 'download'
                ? 'border-zinc-200 text-zinc-100 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Download Preset (.html)
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2.5 px-4 text-center font-medium transition-colors border-b-2 ${
              activeTab === 'import'
                ? 'border-zinc-200 text-zinc-100 bg-zinc-900'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Import Custom Preset
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'download' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Synchronized Modpack</span>
                  <span className="text-zinc-500 font-mono">{currentMods.length} mods</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Bohemia Interactive standard HTML preset format. Drag and drop into your Arma 3 Launcher to subscribe and load.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Preset (.html)</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-zinc-400">Quick Guide:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-300 font-medium block mb-0.5">1. Download</span>
                    <p className="text-zinc-500 leading-normal text-[11px]">Save the .html file</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-300 font-medium block mb-0.5">2. Drag &amp; Drop</span>
                    <p className="text-zinc-500 leading-normal text-[11px]">Drop into Arma 3 Launcher</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-300 font-medium block mb-0.5">3. Play</span>
                    <p className="text-zinc-500 leading-normal text-[11px]">Steam syncs all mods</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Upload your Arma 3 Launcher HTML preset or paste raw content:
              </p>

              {/* File upload zone */}
              <label className="flex flex-col items-center justify-center p-5 border border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg bg-zinc-950 cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                <span className="text-xs font-medium text-zinc-300">Choose .html preset file</span>
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
                className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-zinc-700"
              />

              <button
                onClick={handleTextImport}
                className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors"
              >
                Parse &amp; Apply Mods
              </button>

              {importStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
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
