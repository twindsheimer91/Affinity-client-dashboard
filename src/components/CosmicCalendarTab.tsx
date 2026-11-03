import React, { useState, useMemo, useEffect } from "react";
import { Profile } from "../types";
import { 
  getDailyTransitData, 
  getMonthCalendarDays, 
  getUpcomingNotableEvents, 
  DailyTransitData 
} from "../utils/cosmicCalendar";
import { getProfileComputed } from "../utils/calculations";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Moon, 
  Sun, 
  Target, 
  Flame, 
  Compass, 
  Activity, 
  Shield, 
  Layers, 
  Copy, 
  Check, 
  ArrowRight, 
  Info,
  Clock,
  Zap,
  Volume2
} from "lucide-react";

interface CosmicCalendarTabProps {
  profile: Profile;
  token?: string | null;
  onNavigate?: (tabId: string) => void;
}

export default function CosmicCalendarTab({ profile, token, onNavigate }: CosmicCalendarTabProps) {
  // Calendar viewing state
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [filterMode, setFilterMode] = useState<"all" | "meditation" | "goals" | "lunar" | "transits">("all");
  
  // AI Deep Reading state
  const [aiReading, setAiReading] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);
  const [copiedReading, setCopiedReading] = useState<boolean>(false);

  // Compute profile data
  const comp = getProfileComputed(profile);

  // Selected Day's Transit Data
  const selectedDayData: DailyTransitData = useMemo(() => {
    return getDailyTransitData(selectedDate, profile);
  }, [selectedDate, profile]);

  // Current Month's Days
  const monthDays: DailyTransitData[] = useMemo(() => {
    return getMonthCalendarDays(currentYear, currentMonth, profile);
  }, [currentYear, currentMonth, profile]);

  // Upcoming Notable Transits Horizon
  const upcomingEvents = useMemo(() => {
    return getUpcomingNotableEvents(today, 45, profile);
  }, [today, profile]);

  // First day of current month offset (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1).getDay();
  }, [currentYear, currentMonth]);

  // Reset AI reading when selected date changes
  useEffect(() => {
    setAiReading(null);
    setAiError(null);
  }, [selectedDate]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
    setSelectedDate(today);
  };

  // Generate Deep AI Oracle Reading via backend endpoint
  const handleGenerateAiReading = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const res = await fetch("/api/calendar/daily-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          profile,
          dateStr: selectedDayData.dateStr,
          displayDate: selectedDayData.displayDate,
          lunarPhase: selectedDayData.lunarPhase,
          placements: selectedDayData.placements,
          aspects: selectedDayData.aspects,
          electromagneticChannel: selectedDayData.electromagneticChannel
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate reading");
      }
      setAiReading(data.reading);
    } catch (err: any) {
      setAiError(err.message || "Failed to connect to the cosmic oracle.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleCopyMantra = async () => {
    try {
      await navigator.clipboard.writeText(selectedDayData.personalDailyReading.mantra);
      setCopiedMantra(true);
      setTimeout(() => setCopiedMantra(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const handleCopyReading = async () => {
    const textToCopy = aiReading || selectedDayData.personalDailyReading.readingEssay;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedReading(true);
      setTimeout(() => setCopiedReading(false), 2000);
    } catch (e) {
      // fallback
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16" id="cosmic-calendar-page">
      {/* HEADER HERO */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/25 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>COSMIC CALENDAR & NATAL TRANSITS</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">
              {profile.firstName}&apos;s Sovereign Celestial Ephemeris
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time planetary transits, lunar phases, and personalized optimal days for deep meditation and strategic goal setting—synchronized directly to your {comp.astrology?.sunSign} Sun, {comp.humanDesign?.type} strategy, and Life Path {comp.numerology?.lifePath}.
            </p>
          </div>

          {/* TODAY'S LUNAR QUICK GLANCE BADGE */}
          <div className="bg-slate-950/80 border border-teal-500/30 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="text-3xl md:text-4xl filter drop-shadow-[0_0_12px_rgba(45,212,191,0.4)]">
              {selectedDayData.lunarPhase.emoji}
            </div>
            <div className="space-y-0.5 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                {selectedDayData.lunarPhase.phaseName}
              </span>
              <span className="text-white font-bold block">
                Moon in {selectedDayData.lunarPhase.moonSign} • {selectedDayData.lunarPhase.illumination}%
              </span>
              <span className="text-slate-400 text-[10.5px] block font-mono">
                Sun in Gate {selectedDayData.transitSunGate}.{selectedDayData.transitSunLine}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LARGE PROMINENT DAILY SOVEREIGN AFFIRMATION BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-teal-950/50 via-slate-900 to-teal-950/50 border-2 border-teal-500/35 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-500/20">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-teal-300 font-bold">
              Daily Sovereign Affirmation • {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
            </span>
          </div>

          <button
            onClick={handleCopyMantra}
            className="px-3.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-200 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm"
            title="Copy Daily Affirmation"
          >
            {copiedMantra ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
            <span>{copiedMantra ? "Affirmation Copied!" : "Copy Affirmation"}</span>
          </button>
        </div>

        <div className="pt-5 space-y-2">
          <p className="text-xl sm:text-2xl md:text-3xl text-teal-100 font-serif italic leading-relaxed tracking-wide font-normal">
            &ldquo;{selectedDayData.personalDailyReading.mantra}&rdquo;
          </p>
          <p className="text-xs text-slate-400 font-mono pt-1">
            Aligned to your {comp.astrology?.sunSign} Solar Core and Gate {selectedDayData.transitSunGate} Transit Stream.
          </p>
        </div>
      </div>

      {/* CALENDAR CONTROLS & MONTH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INTERACTIVE MONTH CALENDAR (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 md:p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-5">
            {/* Month & Year Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg md:text-xl font-bold font-serif text-white px-2">
                  {monthNames[currentMonth - 1]} {currentYear}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleJumpToToday}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 text-xs font-mono font-semibold transition-all shadow-xs"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {[
                { id: "all", label: "All Days" },
                { id: "meditation", label: "🧘 Meditation Days", icon: Flame },
                { id: "goals", label: "🎯 Goal Setting Days", icon: Target },
                { id: "lunar", label: "🌑 New & Full Moons", icon: Moon },
                { id: "transits", label: "⚡ Major Transits", icon: Zap }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id as any)}
                  className={`px-3 py-1 rounded-xl transition-all ${
                    filterMode === f.id
                      ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-slate-400 uppercase tracking-wider py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Day Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[64px] sm:min-h-[76px] rounded-xl bg-slate-900/20 border border-slate-900/40 opacity-40 pointer-events-none" />
              ))}

              {/* Month Days */}
              {monthDays.map((dayData) => {
                const dayNumber = parseInt(dayData.dateStr.split("-")[2]);
                const isSelected = selectedDate.getDate() === dayNumber && 
                                   selectedDate.getMonth() + 1 === currentMonth && 
                                   selectedDate.getFullYear() === currentYear;
                const isToday = today.getDate() === dayNumber && 
                                today.getMonth() + 1 === currentMonth && 
                                today.getFullYear() === currentYear;

                // Filter matching check
                let isDimmed = false;
                if (filterMode === "meditation" && !dayData.isOptimalMeditation) isDimmed = true;
                if (filterMode === "goals" && !dayData.isOptimalGoalSetting) isDimmed = true;
                if (filterMode === "lunar" && !(dayData.lunarPhase.stage === "New" || dayData.lunarPhase.stage === "Full")) isDimmed = true;
                if (filterMode === "transits" && dayData.aspects.length === 0 && !dayData.electromagneticChannel) isDimmed = true;

                return (
                  <button
                    key={dayData.dateStr}
                    onClick={() => {
                      setSelectedDate(new Date(currentYear, currentMonth - 1, dayNumber));
                    }}
                    className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between items-start transition-all relative group text-left border ${
                      isSelected
                        ? "bg-teal-950/50 border-teal-400 shadow-lg shadow-teal-500/20 scale-[1.03] z-10"
                        : isToday
                        ? "bg-slate-900 border-teal-500/50 hover:border-teal-400"
                        : "bg-slate-900/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                    } ${isDimmed ? "opacity-30" : "opacity-100"}`}
                  >
                    {/* Top Row: Date Number and Moon Phase Emoji */}
                    <div className="w-full flex items-center justify-between">
                      <span className={`font-mono text-xs font-bold ${
                        isSelected ? "text-teal-300" : isToday ? "text-amber-400 font-extrabold" : "text-slate-300"
                      }`}>
                        {dayNumber}
                      </span>
                      <span className="text-sm select-none" title={dayData.lunarPhase.phaseName}>
                        {dayData.lunarPhase.emoji}
                      </span>
                    </div>

                    {/* Moon Sign Pill */}
                    <span className="text-[9px] font-mono text-slate-400 truncate block w-full">
                      {dayData.lunarPhase.moonSign.slice(0, 3)}
                    </span>

                    {/* Bottom Badges: Meditation, Goals, Electromagnetics */}
                    <div className="w-full flex items-center gap-1 pt-0.5">
                      {dayData.isOptimalMeditation && (
                        <span 
                          className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" 
                          title="Optimal Meditation Day" 
                        />
                      )}
                      {dayData.isOptimalGoalSetting && (
                        <span 
                          className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" 
                          title="Optimal Goal Setting Day" 
                        />
                      )}
                      {dayData.electromagneticChannel && (
                        <span 
                          className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" 
                          title={`Channel ${dayData.electromagneticChannel.channelName}`} 
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>Optimal Meditation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Optimal Goal Setting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Electromagnetic Channel Activated</span>
              </div>
            </div>
          </div>

          {/* UPCOMING 45-DAY CELESTIAL TIMELINE HORIZON */}
          <div className="p-5 md:p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-400" />
                <h3 className="font-serif font-bold text-base text-white">Upcoming Celestial Gateways</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Next 45 Days</span>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {upcomingEvents.map((evt, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedDate(evt.date);
                    setCurrentYear(evt.date.getFullYear());
                    setCurrentMonth(evt.date.getMonth() + 1);
                  }}
                  className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{evt.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        evt.type === "lunar" 
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : evt.type === "gate"
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}>
                        {evt.badgeText}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{evt.description}</p>
                  </div>
                  <span className="text-[10.5px] font-mono text-slate-400 whitespace-nowrap shrink-0">
                    {evt.displayDate.split(",")[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED DAY INSPECTOR & TAILORED PERSONAL READING (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* DAY SNAPSHOT CARD */}
          <div className="p-6 rounded-3xl bg-slate-950/90 border border-teal-500/25 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                  Synchronized Daily Portal
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white mt-0.5">
                  {selectedDayData.displayDate}
                </h3>
                <span className="text-xs text-amber-300 font-medium mt-1 block">
                  {selectedDayData.energyVibe}
                </span>
              </div>
              <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">
                {selectedDayData.lunarPhase.emoji}
              </div>
            </div>

            {/* CELESTIAL METRICS CARDS */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">Lunar Coordinate</span>
                <span className="font-bold text-white block">Moon in {selectedDayData.lunarPhase.moonSign}</span>
                <span className="text-[10.5px] font-mono text-teal-300 block">{selectedDayData.lunarPhase.illumination}% Illumination • {selectedDayData.lunarPhase.phaseName}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block">Solar & Rave Coordinate</span>
                <span className="font-bold text-white block">Sun in {selectedDayData.lunarPhase.sunSign}</span>
                <span className="text-[10.5px] font-mono text-amber-300 block">Gate {selectedDayData.transitSunGate}.{selectedDayData.transitSunLine} • Earth {selectedDayData.transitEarthGate}</span>
              </div>
            </div>

            {/* OPTIMAL DAYS STATUS PILLS */}
            <div className="space-y-2.5">
              {/* Optimal Meditation Day Box */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                selectedDayData.isOptimalMeditation
                  ? "bg-teal-950/40 border-teal-500/40 text-teal-200 shadow-sm shadow-teal-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-4 h-4 ${selectedDayData.isOptimalMeditation ? "text-teal-400" : "text-slate-500"}`} />
                    <span className="font-bold font-mono text-xs uppercase tracking-wide">
                      {selectedDayData.isOptimalMeditation ? "✨ Optimal Meditation Day" : "Standard Meditation Day"}
                    </span>
                  </div>
                  {selectedDayData.isOptimalMeditation && onNavigate && (
                    <button
                      onClick={() => onNavigate("meditation")}
                      className="text-[10.5px] font-mono text-teal-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Point Zero</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  {selectedDayData.meditationReason}
                </p>
              </div>

              {/* Optimal Goal Setting Day Box */}
              <div className={`p-3.5 rounded-2xl border transition-all ${
                selectedDayData.isOptimalGoalSetting
                  ? "bg-amber-950/40 border-amber-500/40 text-amber-200 shadow-sm shadow-amber-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400"
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Target className={`w-4 h-4 ${selectedDayData.isOptimalGoalSetting ? "text-amber-400" : "text-slate-500"}`} />
                    <span className="font-bold font-mono text-xs uppercase tracking-wide">
                      {selectedDayData.isOptimalGoalSetting ? "🎯 Optimal Goal Setting Day" : "Steady Execution Day"}
                    </span>
                  </div>
                  {selectedDayData.isOptimalGoalSetting && onNavigate && (
                    <button
                      onClick={() => onNavigate("goals")}
                      className="text-[10.5px] font-mono text-amber-300 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>SMART Goals</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-[11.5px] leading-relaxed">
                  {selectedDayData.goalSettingReason}
                </p>
              </div>

              {/* ELECTROMAGNETIC CHANNEL ACTIVATION ALERT */}
              {selectedDayData.electromagneticChannel && (
                <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-purple-200 shadow-md shadow-purple-500/10 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>ELECTROMAGNETIC CHANNEL ACTIVATED</span>
                  </div>
                  <p className="text-[11px] text-purple-100 leading-relaxed">
                    {selectedDayData.electromagneticChannel.description}
                  </p>
                </div>
              )}
            </div>

            {/* TAILORED PERSONAL READING FOR TODAY */}
            <div className="pt-2 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="font-serif font-bold text-white text-base">Personal Channeled Reading</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyReading}
                    className="p-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1"
                    title="Copy reading text"
                  >
                    {copiedReading ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReading ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleGenerateAiReading}
                    disabled={isGeneratingAi}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm shadow-teal-500/20 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
                    <span>{isGeneratingAi ? "Channelling..." : "Deep AI Reading"}</span>
                  </button>
                </div>
              </div>

              {/* DAILY PROCLAMATION MANTRA */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-teal-950/40 border border-teal-500/30 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-teal-400 font-bold">
                    Daily Sovereign Affirmation
                  </span>
                  <button
                    onClick={handleCopyMantra}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy Mantra"
                  >
                    {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-base sm:text-lg text-teal-100 font-serif italic leading-relaxed font-medium pt-1">
                  &ldquo;{selectedDayData.personalDailyReading.mantra}&rdquo;
                </p>
              </div>

              {/* READING CONTENT BOX */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-3">
                {isGeneratingAi ? (
                  <div className="py-8 text-center space-y-2">
                    <Sparkles className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
                    <p className="text-xs font-mono text-teal-300 animate-pulse">
                      Synthesizing transit synastry with your {comp.astrology?.sunSign} Sun and {comp.humanDesign?.type} Blueprint...
                    </p>
                  </div>
                ) : aiReading ? (
                  <div className="prose prose-invert prose-xs max-w-none space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Ela Channeled Deep Oracle Reading</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-200 leading-relaxed font-sans text-xs">
                      {aiReading}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="whitespace-pre-line text-slate-300 leading-relaxed">
                      {selectedDayData.personalDailyReading.readingEssay}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                        <span className="text-teal-400 font-bold block flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          <span>Sound Sanctuary: {selectedDayData.personalDailyReading.recommendedHz} Hz</span>
                        </span>
                        <p className="text-slate-400 text-[10.5px]">
                          {selectedDayData.personalDailyReading.meditationProtocol}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                        <span className="text-amber-400 font-bold block flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>Decision Authority Strategy</span>
                        </span>
                        <p className="text-slate-400 text-[10.5px]">
                          {selectedDayData.personalDailyReading.goalSettingProtocol}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {aiError && (
                  <p className="text-rose-400 text-[11px] font-mono">
                    {aiError}
                  </p>
                )}
              </div>
            </div>

            {/* MAJOR TRANSIT ASPECTS FOR THE DAY */}
            {selectedDayData.aspects.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Active Planetary Aspects ({selectedDayData.aspects.length})
                </span>
                <div className="space-y-1.5">
                  {selectedDayData.aspects.map((asp, idx) => (
                    <div 
                      key={idx} 
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{asp.planet1} {asp.aspect} {asp.planet2}</span>
                        <span className="text-[10px] text-slate-500 font-mono">orb {asp.orb}°</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        asp.impact === "High" ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-400"
                      }`}>
                        {asp.impact} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
