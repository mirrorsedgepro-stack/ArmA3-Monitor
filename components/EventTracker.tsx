'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Radio, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Share2, 
  Check, 
  AlertCircle, 
  Flame, 
  Terminal, 
  ChevronRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import { TONIGHT_EVENT, TacticalEvent } from '@/data/defaultEvents';
import { generateEventIcs, generateGoogleCalendarUrl } from '@/lib/calendarHelper';

interface EventTrackerProps {
  onOpenConnect: () => void;
  onDownloadPreset: () => void;
  event?: TacticalEvent;
}

export function EventTracker({
  onOpenConnect,
  onDownloadPreset,
  event = TONIGHT_EVENT,
}: EventTrackerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isLive: boolean;
    isEnded: boolean;
    totalMs: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
    isEnded: false,
    totalMs: 0,
  });

  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(event.initialAttendees);
  const [copiedShare, setCopiedShare] = useState(false);
  const [userLocalTimeStr, setUserLocalTimeStr] = useState('');
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  // Load RSVP state from localStorage
  useEffect(() => {
    try {
      const storedRsvp = localStorage.getItem(`arma3_event_rsvp_${event.id}`);
      if (storedRsvp === 'true') {
        setIsAttending(true);
        setAttendeeCount((prev) => prev + 1);
      }
    } catch {
      // ignore
    }
  }, [event.id]);

  // Format user's local timezone
  useEffect(() => {
    try {
      const targetDate = new Date(event.startTime);
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formatted = targetDate.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
      setUserLocalTimeStr(`${formatted} (${userTz})`);
    } catch {
      setUserLocalTimeStr('19:30 AEDT');
    }
  }, [event.startTime]);

  // Real-time countdown timer
  useEffect(() => {
    const targetDate = new Date(event.startTime).getTime();
    const durationMs = event.durationHours * 60 * 60 * 1000;
    const endDate = targetDate + durationMs;

    const updateTimer = () => {
      const now = Date.now();
      const diffToStart = targetDate - now;
      const diffToEnd = endDate - now;

      if (diffToStart > 0) {
        // Countdown to start
        const hours = Math.floor(diffToStart / (1000 * 60 * 60));
        const minutes = Math.floor((diffToStart % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffToStart % (1000 * 60)) / 1000);
        setTimeLeft({
          hours,
          minutes,
          seconds,
          isLive: false,
          isEnded: false,
          totalMs: diffToStart,
        });
      } else if (diffToEnd > 0) {
        // Event is currently live!
        const hours = Math.floor(diffToEnd / (1000 * 60 * 60));
        const minutes = Math.floor((diffToEnd % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffToEnd % (1000 * 60)) / 1000);
        setTimeLeft({
          hours,
          minutes,
          seconds,
          isLive: true,
          isEnded: false,
          totalMs: diffToEnd,
        });
      } else {
        // Event ended
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isLive: false,
          isEnded: true,
          totalMs: 0,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event.startTime, event.durationHours]);

  const toggleRsvp = () => {
    const nextState = !isAttending;
    setIsAttending(nextState);
    setAttendeeCount((prev) => (nextState ? prev + 1 : Math.max(event.initialAttendees, prev - 1)));
    try {
      localStorage.setItem(`arma3_event_rsvp_${event.id}`, nextState ? 'true' : 'false');
    } catch {
      // ignore
    }
  };

  const handleDownloadIcs = () => {
    const icsContent = generateEventIcs(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.codeName.replace(/[^a-zA-Z0-9_-]/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowCalendarMenu(false);
  };

  const handleShare = () => {
    const shareText = `[ARMA 3 EVENT] ${event.title}\nServer is 24/7 Dedicated (${event.serverIp}:${event.serverPort})\nSpecial Joint Squad Operation: Tonight @ 19:30 AEDT (Sydney Time)\nJoin the squad: ${window.location.origin}#events`;
    navigator.clipboard.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const padZero = (n: number) => n.toString().padStart(2, '0');

  return (
    <section id="events" className="scroll-mt-24 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-arma-border pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-arma-red font-bold uppercase tracking-widest">
            <Flame className="w-4 h-4 text-arma-red animate-pulse" />
            <span>24/7 DEDICATED SERVER &bull; SPECIAL DISPATCH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-arma-text uppercase font-mono tracking-tight mt-0.5">
            Labour Day Event &bull; Tonight @ 19:30 AEDT
          </h2>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2">
          {timeLeft.isLive ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500 text-red-400 font-mono text-xs font-black animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>OPERATION LIVE IN PROGRESS</span>
            </div>
          ) : timeLeft.isEnded ? (
            <div className="px-3 py-1.5 rounded-full bg-arma-card border border-arma-border text-arma-textMuted font-mono text-xs">
              OPERATION CONCLUDED // DEBRIEFING
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-arma-red/10 border border-arma-red/30 text-arma-red font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-arma-red animate-pulse" />
              <span>T-MINUS COUNTDOWN ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tactical Card */}
      <div className="border border-arma-border rounded-xl bg-gradient-to-b from-arma-card via-arma-card to-[#0d1015] shadow-xl overflow-hidden">
        
        {/* Top Highlight Banner with Live Clock Grid */}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-arma-border bg-arma-surface/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: Event Identity & Meta */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-arma-red text-white text-[11px] font-mono font-black uppercase tracking-wider shadow-sm">
                  {event.codeName}
                </span>
                <span className="px-2.5 py-1 rounded bg-arma-card border border-arma-green/40 text-arma-green text-[11px] font-mono font-bold uppercase flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                  SERVER ONLINE 24/7
                </span>
                <span className="px-2.5 py-1 rounded bg-arma-card border border-arma-border text-arma-khaki text-[11px] font-mono uppercase">
                  TONIGHT &bull; 19:30 AEDT
                </span>
                <span className="px-2.5 py-1 rounded bg-arma-card border border-arma-border text-arma-textMuted text-[11px] font-mono font-bold uppercase flex items-center gap-1">
                  <Users className="w-3 h-3 text-arma-red" />
                  {attendeeCount} / {event.slotsMax} OPERATORS
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono tracking-tight leading-tight">
                {event.title}
              </h3>

              <p className="text-xs sm:text-sm text-arma-textMuted font-sans leading-relaxed">
                {event.subtitle}
              </p>

              {/* Timezone & Venue Meta Bar */}
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-mono text-arma-textMuted pt-1">
                <div className="flex items-center gap-1.5 text-arma-khaki">
                  <Clock className="w-3.5 h-3.5 text-arma-red" />
                  <span>START: <strong className="text-white">19:30 AEDT (Sydney)</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-arma-textDim">
                  <span>LOCAL: <strong className="text-arma-text">{userLocalTimeStr}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-arma-red" />
                  <span>THEATER: <strong className="text-white">{event.theater}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Col: High-Impact Digital Countdown HUD */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-[#090b0e] border border-arma-border/80 shadow-inner">
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-arma-khaki mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-arma-red" />
                <span>{timeLeft.isLive ? 'OPERATION TIME REMAINING' : 'COUNTDOWN TO ZERO-HOUR'}</span>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <div className="w-16 sm:w-20 py-2 sm:py-3 rounded-lg bg-arma-card border border-arma-border flex items-center justify-center font-mono font-black text-2xl sm:text-4xl text-arma-red shadow-inner">
                    {padZero(timeLeft.hours)}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-arma-textMuted mt-1">
                    HOURS
                  </span>
                </div>

                <span className="font-mono text-xl sm:text-3xl text-arma-red font-bold animate-pulse -mt-4">:</span>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <div className="w-16 sm:w-20 py-2 sm:py-3 rounded-lg bg-arma-card border border-arma-border flex items-center justify-center font-mono font-black text-2xl sm:text-4xl text-white shadow-inner">
                    {padZero(timeLeft.minutes)}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-arma-textMuted mt-1">
                    MINUTES
                  </span>
                </div>

                <span className="font-mono text-xl sm:text-3xl text-arma-red font-bold animate-pulse -mt-4">:</span>

                {/* Seconds */}
                <div className="flex flex-col items-center">
                  <div className="w-16 sm:w-20 py-2 sm:py-3 rounded-lg bg-arma-card border border-arma-border flex items-center justify-center font-mono font-black text-2xl sm:text-4xl text-white shadow-inner">
                    {padZero(timeLeft.seconds)}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-arma-textMuted mt-1">
                    SECONDS
                  </span>
                </div>
              </div>

              {/* Direct Quick Action Inside HUD */}
              <div className="w-full mt-4 pt-3 border-t border-arma-border/60 flex items-center justify-between text-xs font-mono">
                <span className="text-arma-textMuted text-[11px]">
                  ENDPOINT: <strong className="text-arma-red">{event.serverIp}:{event.serverPort}</strong>
                </span>
                <button
                  onClick={onOpenConnect}
                  className="text-arma-red hover:text-arma-redHover font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>CONNECT</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Action Button Strip */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 bg-arma-surface/90 border-b border-arma-border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Primary Interactive RSVP Button */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={toggleRsvp}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-mono text-xs sm:text-sm font-black tracking-wider transition-all cursor-pointer ${
                  isAttending
                    ? 'bg-arma-green text-white shadow-lg shadow-arma-green/20'
                    : 'arma-btn-primary text-white shadow-arma-red hover:scale-105 active:scale-95'
                }`}
              >
                {isAttending ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>RSVP CONFIRMED &bull; MOBILIZED</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-white" />
                    <span>MOBILIZE &bull; RSVP TONIGHT</span>
                  </>
                )}
              </button>

              {/* Direct Server Connect Modal Button */}
              <button
                onClick={onOpenConnect}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-lg arma-btn-secondary font-mono text-xs sm:text-sm font-bold transition-all hover:bg-arma-cardHover"
              >
                <Terminal className="w-4 h-4 text-arma-red" />
                <span>DIRECT CONNECT DISPATCH</span>
              </button>
            </div>

            {/* Calendar & Share Utilities */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Calendar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg arma-btn-secondary text-xs font-mono font-bold transition-all hover:bg-arma-cardHover"
                  title="Add this event to your calendar"
                >
                  <Calendar className="w-3.5 h-3.5 text-arma-khaki" />
                  <span>ADD TO CALENDAR</span>
                </button>

                {showCalendarMenu && (
                  <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mt-2 w-48 bg-arma-card border border-arma-border rounded-lg shadow-2xl p-1.5 z-30 font-mono text-xs space-y-1">
                    <a
                      href={generateGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                      className="flex items-center justify-between px-3 py-2 rounded hover:bg-arma-surface text-arma-text hover:text-arma-red transition-colors"
                    >
                      <span>Google Calendar</span>
                      <ExternalLink className="w-3 h-3 text-arma-textMuted" />
                    </a>
                    <button
                      onClick={handleDownloadIcs}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-arma-surface text-arma-text hover:text-arma-red transition-colors text-left"
                    >
                      <span>Download .ICS (Apple/Outlook)</span>
                      <Download className="w-3 h-3 text-arma-textMuted" />
                    </button>
                  </div>
                )}
              </div>

              {/* Mod Preset Shortcut */}
              <button
                onClick={onDownloadPreset}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg arma-btn-secondary text-xs font-mono font-bold transition-all"
                title="Download required 42-mod launcher preset"
              >
                <Download className="w-3.5 h-3.5 text-arma-khaki" />
                <span>PRESET (.HTML)</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg arma-btn-secondary text-xs font-mono transition-all text-arma-textMuted hover:text-arma-text"
                title="Copy event briefing and link"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-arma-green" />
                    <span className="text-arma-green font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">SHARE</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Briefing & 3-Phase Mission Timeline */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Mission Briefing Box */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-arma-khaki flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-arma-red" />
              <span>COMMANDER&apos;S DIRECTIVE // SITUATION BRIEFING</span>
            </div>
            <p className="text-xs sm:text-sm text-arma-text leading-relaxed font-sans bg-black/30 p-4 rounded-lg border border-arma-border/60">
              {event.briefing}
            </p>
          </div>

          {/* 3-Phase Operational Timeline */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-arma-khaki flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-arma-red" />
              <span>MISSION PHASES // ZERO-HOUR TIMELINE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {event.phases.map((phase, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-lg bg-arma-surface/60 border border-arma-border hover:border-arma-red/40 transition-colors space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-arma-red font-bold">{phase.time}</span>
                      <span className="px-1.5 py-0.5 rounded bg-arma-card border border-arma-border text-arma-textMuted text-[10px]">
                        STAGE {idx + 1}
                      </span>
                    </div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase">
                      {phase.title}
                    </h4>
                    <p className="text-[11px] text-arma-textMuted font-sans leading-relaxed">
                      {phase.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-arma-border/40 text-[10px] font-mono text-arma-khaki uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-arma-green" />
                    <span>OBJECTIVE DEFINED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Equipment & Comms Manifest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-lg bg-arma-surface/40 border border-arma-border">
              <div className="text-[10px] text-arma-textMuted uppercase">SERVER PERSISTENCE</div>
              <div className="font-bold text-arma-green mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-arma-green animate-pulse" />
                <span>24/7 (Hop in anytime)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-arma-surface/40 border border-arma-border">
              <div className="text-[10px] text-arma-textMuted uppercase">RADIO COMMUNICATIONS</div>
              <div className="font-bold text-arma-text mt-0.5 truncate">{event.commsChannel}</div>
            </div>

            <div className="p-3 rounded-lg bg-arma-surface/40 border border-arma-border">
              <div className="text-[10px] text-arma-textMuted uppercase">OPERATION HOST</div>
              <div className="font-bold text-arma-text mt-0.5">{event.host}</div>
            </div>

            <div className="p-3 rounded-lg bg-arma-surface/40 border border-arma-border">
              <div className="text-[10px] text-arma-textMuted uppercase">REQUIRED MODPACK</div>
              <div className="font-bold text-arma-red mt-0.5">42 Mods Active</div>
            </div>

            <div className="p-3 rounded-lg bg-arma-surface/40 border border-arma-border">
              <div className="text-[10px] text-arma-textMuted uppercase">SLOTS AVAILABLE</div>
              <div className="font-bold text-arma-green mt-0.5">{event.slotsMax - attendeeCount} Remaining ({event.slotsMax} Total)</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
