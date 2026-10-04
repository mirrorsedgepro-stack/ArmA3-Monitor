'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  MousePointer, 
  Play, 
  CheckCircle2, 
  Terminal, 
  Activity, 
  Search, 
  Download,
  Volume2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export interface TourStep {
  targetId: string;
  title: string;
  badge: string;
  description: string;
  actionText?: string;
  simulateAction?: (helpers: {
    setSearchQuery: (q: string) => void;
    expandFolders?: () => void;
  }) => Promise<void>;
  cleanupAction?: (helpers: {
    setSearchQuery: (q: string) => void;
  }) => void;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  setSearchQuery: (q: string) => void;
}

export function OnboardingTour({ isOpen, onClose, setSearchQuery }: OnboardingTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationMessage, setSimulationMessage] = useState<string>('');
  const simulationAbortRef = useRef<boolean>(false);

  const steps: TourStep[] = [
    {
      targetId: 'tour-connect',
      title: '1-CLICK DIRECT CONNECT',
      badge: 'DEPLOYMENT',
      description: 'Zero manual IP entering required. Click "Launch Arma 3" to launch Steam and automatically join 180.181.238.103:2302, or copy the direct address with one click.',
      actionText: 'SIMULATE: Launching & IP Copy',
      simulateAction: async () => {
        setSimulationMessage('Demonstrating direct copy & Steam connect...');
        await new Promise((res) => setTimeout(res, 600));
        setSimulationMessage('Target verified: 180.181.238.103:2302 [Antistasi]');
      },
    },
    {
      targetId: 'tour-telemetry',
      title: 'LIVE VALVE A2S TELEMETRY',
      badge: 'REAL-TIME DATA',
      description: 'Synchronized directly with the dedicated Linux host via Valve UDP A2S query. View live operator count, 28ms server latency, modpack parity, and BattlEye security.',
      actionText: 'Querying Host...',
      simulateAction: async () => {
        setSimulationMessage('Querying Valve A2S UDP Port 2303...');
        await new Promise((res) => setTimeout(res, 500));
        setSimulationMessage('Response received: 28ms &bull; Linux x64 &bull; BattlEye Active');
      },
    },
    {
      targetId: 'tour-search',
      title: 'SMART ADDON FINDER & AUTO-EXPAND',
      badge: 'INTERACTIVE SEARCH',
      description: 'Watch how typing into the search bar instantly filters all 30 server mods, auto-expands the matching folder, and displays direct Steam Workshop IDs.',
      actionText: 'SIMULATING: Auto-typing "RHS"...',
      simulateAction: async ({ setSearchQuery }) => {
        setIsSimulating(true);
        simulationAbortRef.current = false;
        setSimulationMessage('Auto-typing search query: "R"');
        setSearchQuery('R');
        await new Promise((res) => setTimeout(res, 250));
        if (simulationAbortRef.current) return;

        setSimulationMessage('Auto-typing search query: "RH"');
        setSearchQuery('RH');
        await new Promise((res) => setTimeout(res, 250));
        if (simulationAbortRef.current) return;

        setSimulationMessage('Auto-typing search query: "RHS"');
        setSearchQuery('RHS');
        await new Promise((res) => setTimeout(res, 350));
        if (simulationAbortRef.current) return;

        setSimulationMessage('Folder auto-expanded: 4 RHS military mods filtered!');
        setIsSimulating(false);
      },
      cleanupAction: ({ setSearchQuery }) => {
        simulationAbortRef.current = true;
        setSearchQuery('');
      },
    },
    {
      targetId: 'tour-preset',
      title: '1-CLICK ARMA 3 LAUNCHER PRESET',
      badge: 'ZERO MANUAL WORK',
      description: 'Do not search 30 mods one-by-one on Steam. Click "Download Launcher Preset" to export the official Bohemia HTML preset, drag it into your launcher, and let Steam download everything automatically.',
      actionText: 'Ready for export',
      simulateAction: async () => {
        setSimulationMessage('Arma 3 official preset ready: 30 verified mods included.');
      },
    },
  ];

  const currentStep = steps[currentStepIndex];

  // Measure target and scroll smoothly to it
  useEffect(() => {
    if (!isOpen) return;

    const measureAndScroll = () => {
      const el = document.getElementById(currentStep.targetId);
      if (el) {
        // Smoothly scroll the element into view with comfortable breathing room
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Wait briefly for scroll to settle before snapping target rect
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
        }, 300);
      } else {
        setTargetRect(null);
      }
    };

    measureAndScroll();
    window.addEventListener('resize', measureAndScroll);
    window.addEventListener('scroll', measureAndScroll, { passive: true });

    // Run step's interactive simulation
    if (currentStep.simulateAction) {
      currentStep.simulateAction({ setSearchQuery });
    }

    return () => {
      window.removeEventListener('resize', measureAndScroll);
      window.removeEventListener('scroll', measureAndScroll);
      if (currentStep.cleanupAction) {
        currentStep.cleanupAction({ setSearchQuery });
      }
    };
  }, [isOpen, currentStepIndex, currentStep, setSearchQuery]);

  // Handle keyboard navigation (Escape to skip, Left/Right arrows to step)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep.cleanupAction) {
      currentStep.cleanupAction({ setSearchQuery });
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep.cleanupAction) {
      currentStep.cleanupAction({ setSearchQuery });
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep.cleanupAction) {
      currentStep.cleanupAction({ setSearchQuery });
    }
    try {
      localStorage.setItem('arma3_tour_completed', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  const handleComplete = () => {
    if (currentStep.cleanupAction) {
      currentStep.cleanupAction({ setSearchQuery });
    }
    try {
      localStorage.setItem('arma3_tour_completed', 'true');
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto select-none">
      {/* Darkened Opaque Backdrop Cover with Ambient Tactical Grid */}
      <div 
        className="fixed inset-0 bg-[#06080b]/85 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleSkip}
      />

      {/* Dynamic Target Spotlight Reticle */}
      {targetRect && (
        <div
          className="fixed pointer-events-none transition-all duration-300 ease-out z-[101]"
          style={{
            top: `${Math.max(10, targetRect.top - 8)}px`,
            left: `${Math.max(10, targetRect.left - 8)}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            boxShadow: '0 0 0 9999px rgba(6, 8, 11, 0.85), 0 0 25px rgba(217, 130, 43, 0.45)',
            border: '2px solid #d9822b',
            borderRadius: '10px',
          }}
        >
          {/* Tactical Corner Crosshairs */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-arma-amber" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-arma-amber" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-arma-amber" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-arma-amber" />

          {/* Active Target Pulse Badge */}
          <div className="absolute -top-7 left-2 px-2 py-0.5 rounded bg-arma-amber text-black font-mono font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            <span>FOCUS // {currentStep.badge}</span>
          </div>
        </div>
      )}

      {/* Floating Tactical Explainer HUD Card */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-[105]">
        <div className="bg-[#12151b] border-2 border-arma-amber/80 rounded-xl p-5 sm:p-6 shadow-2xl text-arma-text font-mono relative backdrop-blur-md">
          
          {/* Top Control Bar: Step Info & Skip Button */}
          <div className="flex items-center justify-between border-b border-arma-border/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-arma-amberDim text-arma-amber border border-arma-amber/30 text-[11px] font-black uppercase">
                INTERACTIVE BRIEFING
              </span>
              <span className="text-xs text-arma-textMuted font-bold">
                STEP [{currentStepIndex + 1} OF {steps.length}]
              </span>
            </div>

            {/* Skip Tour Button */}
            <button
              onClick={handleSkip}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-arma-card hover:bg-arma-surface text-arma-textDim hover:text-arma-text text-xs border border-arma-border transition-colors font-bold"
              title="Skip this walkthrough [Esc]"
            >
              <span>SKIP</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step Title & Content */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-arma-text uppercase tracking-tight flex items-center gap-2">
              <span className="text-arma-amber">&gt;</span>
              {currentStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-arma-textMuted leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Live Action Simulation Ticker */}
          {simulationMessage && (
            <div className="mt-4 p-2.5 rounded bg-[#090b0e] border border-arma-border flex items-center gap-2 text-xs">
              <MousePointer className="w-3.5 h-3.5 text-arma-amber animate-bounce shrink-0" />
              <span className="text-arma-khaki font-semibold truncate">
                {simulationMessage}
              </span>
            </div>
          )}

          {/* Progress Indicators & Navigation Controls */}
          <div className="mt-5 pt-4 border-t border-arma-border flex items-center justify-between gap-3">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-6 bg-arma-amber'
                      : 'w-2 bg-arma-border hover:bg-arma-textDim'
                  }`}
                  title={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 text-xs">
              {currentStepIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-3 py-2 rounded arma-btn-secondary text-arma-textMuted hover:text-arma-text font-bold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>PREV</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded arma-btn-primary font-black shadow-arma-amber"
              >
                <span>
                  {currentStepIndex === steps.length - 1 ? 'GOT IT &bull; FINISH' : 'NEXT STEP'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
