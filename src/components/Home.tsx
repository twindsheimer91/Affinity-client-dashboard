import { useState, useEffect } from "react";
import { Profile, AmbiRecord } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  Star, 
  Layers, 
  Activity, 
  Brain, 
  CheckCircle2, 
  HeartHandshake, 
  Users, 
  ArrowRight,
  BookOpen,
  X,
  Flame,
  Award,
  Calendar as CalendarIcon,
  Dna
} from "lucide-react";
import { generatePersonalizedEssay, PersonalizedEssay } from "../utils/personalizedEssays";
import { LIFE_PATH_KNOWLEDGE } from "../data/knowledge";
import { getDailyTransitData } from "../utils/cosmicCalendar";

interface HomeProps {
  profile: Profile;
  token?: string;
  onNavigate: (tab: string) => void;
}

export default function Home({ profile, token, onNavigate }: HomeProps) {
  const comp = getProfileComputed(profile);
  const todayTransit = getDailyTransitData(new Date(), profile);
  const [latestAmbi, setLatestAmbi] = useState<AmbiRecord | null>(null);
  const [activeEssay, setActiveEssay] = useState<PersonalizedEssay | null>(null);

  const lp = comp.numerology.lifePath;
  const lpInfo = (LIFE_PATH_KNOWLEDGE as any)[lp] || {
    talents: ["Visionary Intuition", "Strategic Sovereignty", "Effortless Manifestation"],
    lessons: ["Transcending self-doubt", "Anchoring power in stillness", "Releasing control"]
  };

  useEffect(() => {
    if (token) {
      fetch("/api/ambi-history", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.history && data.history.length > 0) {
            setLatestAmbi(data.history[data.history.length - 1]);
          }
        })
        .catch((err) => console.error("Error loading AMBI history on Home", err));
    }
  }, [token]);

  const handleOpenEssay = (
    type: "talent" | "lesson" | "sun" | "moon" | "rising" | "lifepath" | "strength",
    keyName: string
  ) => {
    const essay = generatePersonalizedEssay(profile, type, keyName);
    setActiveEssay(essay);
  };

  return (
    <div className="space-y-8 slide-in" id="home-dashboard">
      {/* HERO SECTION MATCHING AFFINITY SITE THEME & SCREENSHOT */}
      <div 
        className="relative rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden border border-teal-500/25 bg-gradient-to-b from-[#081525]/90 via-[#060e1a]/85 to-[#040812]/95 shadow-2xl"
        id="affinity-hero-banner"
      >
        {/* Ambient starfield background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          {/* Exact Pill from User's Screenshot: PRECISION CONSULTING */}
          <div 
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/40 text-teal-300 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_15px_rgba(45,212,191,0.25)]"
            id="hero-precision-pill"
          >
            PRECISION CONSULTING
          </div>

          {/* Exact Headline from User's Screenshot */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Multi–level understanding.<br />
            <span className="text-[#2dd4bf] drop-shadow-[0_0_24px_rgba(45,212,191,0.4)]">
              Bridging the esoteric with the psychometric.
            </span>
          </h1>

          {/* Subtitle from User's Screenshot */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
            From written assessments to high-dimensional cosmic reading. Illuminating who you truly are beneath conditioning, transforming internal friction into soul gifts, and guiding you to deep, enduring contentment.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate("chat")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult Elara Oracle</span>
            </button>
            <button
              onClick={() => onNavigate("synergy")}
              className="px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 text-purple-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              <span>Compare Charts</span>
            </button>
            <button
              onClick={() => onNavigate("blueprint")}
              className="px-6 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-teal-500/30 text-teal-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-teal-400" />
              <span>Full Soul Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAILORED COSMIC TALENTS & EARTHLY LESSONS (CLICK TO OPEN ESSAYS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="home-talents-lessons">
        {/* Cosmic Talents Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/25 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                  Tailored to {profile.firstName}
                </span>
                <h3 className="text-xl font-bold text-white">Cosmic Talents</h3>
              </div>
            </div>
            <span className="text-[10px] text-teal-400 font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
              Life Path {lp}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Intrinsic soul channels where your energy flows with zero friction. Click any talent below to open a profound, personalized narrative essay tailored specifically to your profile:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {(lpInfo.talents || ["Visionary Intuition", "Strategic Sovereignty", "Effortless Manifestation"]).map((talent: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleOpenEssay("talent", talent)}
                className="px-4 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-400 text-teal-200 font-semibold text-xs transition-all flex items-center gap-2 group cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span>{talent}</span>
                <ArrowRight className="w-3 h-3 text-teal-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Earthly Lessons Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-amber-500/25 space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  Evolutionary Curriculum
                </span>
                <h3 className="text-xl font-bold text-white">Earthly Lessons</h3>
              </div>
            </div>
            <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Point Zero Catalyst
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Sacred friction points chosen by your higher self to awaken mastery and emotional contentment. Click any lesson below to view its deep readout:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {(lpInfo.lessons || ["Transcending self-doubt", "Anchoring power in stillness", "Releasing control"]).map((lesson: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleOpenEssay("lesson", lesson)}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-200 font-semibold text-xs transition-all flex items-center gap-2 group cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{lesson}</span>
                <ArrowRight className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BENTO GRID: HIGH-DIMENSIONAL READING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bento-grid">
        {/* Numerology Core Card */}
        <div 
          onClick={() => handleOpenEssay("lifepath", `Life Path ${comp.numerology.lifePath}`)}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
          id="bento-numerology"
        >
          <div className="space-y-4" id="numerology-header">
            <div className="flex justify-between items-start" id="num-icon-row">
              <span className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                <Star className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest bg-amber-500/5 px-2 py-1 rounded">Numerology</span>
            </div>
            <div className="space-y-1" id="num-titles">
              <h3 className="text-2xl font-light text-white font-serif">Life Path {comp.numerology.lifePath}</h3>
              <p className="text-xs text-slate-400">Your sovereign soul path of evolutionary realization.</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="num-footer">
            <span className="text-slate-500">Destiny: {comp.numerology.expression}</span>
            <span className="text-amber-400 hover:underline">Read Sovereign Essay →</span>
          </div>
        </div>

        {/* Astrology Map Card */}
        <div 
          onClick={() => handleOpenEssay("sun", `${comp.astrology.sunSign} Sun`)}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
          id="bento-astrology"
        >
          <div className="space-y-4" id="astrology-header">
            <div className="flex justify-between items-start" id="astro-icon-row">
              <span className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
                <Compass className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-sky-500 font-bold uppercase tracking-widest bg-sky-500/5 px-2 py-1 rounded">Astrology</span>
            </div>
            <div className="space-y-1" id="astro-titles">
              <h3 className="text-2xl font-light text-white font-serif">{comp.astrology.sunSign} Sun</h3>
              <p className="text-xs text-slate-400">Ascendant: {comp.astrology.risingSign} • Moon: {comp.astrology.moonSign}</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="astro-footer">
            <span className="text-slate-500">Dominant Planet: {comp.astrology.dominantPlanet}</span>
            <span className="text-sky-400 hover:underline">Read Solar Essay →</span>
          </div>
        </div>

        {/* Human Design Card */}
        <div 
          onClick={() => onNavigate("humandesign")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
          id="bento-humandesign"
        >
          <div className="space-y-4" id="hd-header">
            <div className="flex justify-between items-start" id="hd-icon-row">
              <span className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
                <Layers className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">Human Design</span>
            </div>
            <div className="space-y-1" id="hd-titles">
              <h3 className="text-2xl font-light text-white font-serif">{comp.humanDesign.type}</h3>
              <p className="text-xs text-slate-400">Authority: {comp.humanDesign.authority} • Profile {comp.humanDesign.profile}</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="hd-footer">
            <span className="text-slate-500">{comp.humanDesign.definedCenters.length} Defined Centers</span>
            <span className="text-purple-400 hover:underline">View Bodygraph Art →</span>
          </div>
        </div>

        {/* Ancestral Lineage & Somatics Card */}
        <div 
          onClick={() => onNavigate("lineage")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-teal-950/40 via-slate-900 to-transparent border border-teal-500/30"
          id="bento-lineage"
        >
          <div className="space-y-4" id="lineage-header">
            <div className="flex justify-between items-start" id="lineage-icon-row">
              <span className="p-3 bg-teal-500/15 border border-teal-500/30 rounded-xl text-teal-300">
                <Dna className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-teal-300 font-bold uppercase tracking-widest bg-teal-500/15 px-2 py-1 rounded border border-teal-500/30">Ancestral Science</span>
            </div>
            <div className="space-y-1" id="lineage-titles">
              <h3 className="text-2xl font-light text-white font-serif">Ancestral Lineage</h3>
              <p className="text-xs text-slate-300">Circular geometric matrix connecting 12 neuro-somatic markers to classical ancient wisdom canons (I-Ching, Vedic Marmas, Ptolemaic Ecliptic).</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="lineage-footer">
            <span className="text-teal-300 font-mono">12 Bio-Wisdom Rays</span>
            <span className="text-teal-400 hover:underline font-semibold">Explore Lineage Mandala →</span>
          </div>
        </div>

        {/* Cosmic Calendar & Transits Card */}
        <div 
          onClick={() => onNavigate("calendar")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-teal-500/10 via-slate-900 to-transparent border border-teal-500/30"
          id="bento-calendar"
        >
          <div className="space-y-4" id="calendar-header">
            <div className="flex justify-between items-start" id="calendar-icon-row">
              <span className="p-3 bg-teal-500/15 border border-teal-500/30 rounded-xl text-teal-400">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-teal-300 font-bold uppercase tracking-widest bg-teal-500/15 px-2 py-1 rounded border border-teal-500/30">Cosmic Calendar</span>
            </div>
            <div className="space-y-1" id="calendar-titles">
              <h3 className="text-2xl font-light text-white font-serif">{todayTransit.lunarPhase.emoji} {todayTransit.lunarPhase.phaseName}</h3>
              <p className="text-xs text-slate-300">Moon in {todayTransit.lunarPhase.moonSign} • {todayTransit.energyVibe}</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="calendar-footer">
            <span className="text-teal-300 font-mono">
              {todayTransit.isOptimalMeditation ? "🧘 Optimal Meditation Day" : todayTransit.isOptimalGoalSetting ? "🎯 Optimal Goal Setting Day" : "Daily Ephemeris"}
            </span>
            <span className="text-teal-400 hover:underline">Open Calendar & Reading →</span>
          </div>
        </div>

        {/* Compare Charts & Synastry Card */}
        <div 
          onClick={() => onNavigate("synergy")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-rose-500/10 via-purple-500/5 to-transparent border border-rose-500/20"
          id="bento-synergy"
        >
          <div className="space-y-4" id="synergy-header">
            <div className="flex justify-between items-start" id="synergy-icon-row">
              <span className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-400">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">Synastry Matrix</span>
            </div>
            <div className="space-y-1" id="synergy-titles">
              <h3 className="text-2xl font-light text-white font-serif">Compare Charts</h3>
              <p className="text-xs text-slate-300">Compare your profile with someone else (partner, coworker, friend) with blended dual-mandala art, longevity, and cheat sheets.</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="synergy-footer">
            <span className="text-slate-400">Blended Dual Chart</span>
            <span className="text-rose-400 font-semibold hover:underline">Compare Now →</span>
          </div>
        </div>

        {/* Psychometrics AMBI Card */}
        <div 
          onClick={() => onNavigate("psychometric")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
          id="bento-psychometric"
        >
          <div className="space-y-4" id="psycho-header">
            <div className="flex justify-between items-start" id="psycho-icon-row">
              <span className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Brain className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded">Psychometrics</span>
            </div>
            <div className="space-y-1" id="psycho-titles">
              <h3 className="text-2xl font-light text-white font-serif">
                {latestAmbi ? "AMBI Calibrated" : "AMBI Mindscape"}
              </h3>
              <p className="text-xs text-slate-400">
                {latestAmbi 
                  ? `Stability: ${latestAmbi.scores.N}% • Openness: ${latestAmbi.scores.O}%`
                  : "Calibrate your cosmic-psychometric factors across Point Zero balance states."}
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="psycho-footer">
            <span className="text-slate-500">
              {latestAmbi ? `Calibrated ${new Date(latestAmbi.date).toLocaleDateString()}` : "Comprehensive Alignment"}
            </span>
            <span className="text-indigo-400 hover:underline">
              {latestAmbi ? "View Mindscape →" : "Take AMBI Scan →"}
            </span>
          </div>
        </div>

        {/* Chat with Ela Card */}
        <div 
          onClick={() => onNavigate("chat")}
          className="glass-card p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-teal-500/5 to-transparent"
          id="bento-chat"
        >
          <div className="space-y-4" id="chat-header">
            <div className="flex justify-between items-start" id="chat-icon-row">
              <span className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded">Stellar Oracle</span>
            </div>
            <div className="space-y-1" id="chat-titles">
              <h3 className="text-2xl font-light text-white font-serif">Chat with Ela</h3>
              <p className="text-xs text-slate-400">Converse in Solo Oracle or Compare With mode. Ela reads your questions with deep personalized essays.</p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs" id="chat-footer">
            <span className="text-slate-500">Solo & Compare Modes</span>
            <span className="text-emerald-400 hover:underline">Converse Now →</span>
          </div>
        </div>
      </div>

      {/* CONTINUOUS PERSONALIZED ESSAY MODAL */}
      {activeEssay && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveEssay(null)}
          id="home-essay-modal-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative text-slate-100 animate-scale-up"
            id="home-essay-modal-card"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveEssay(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              id="close-home-essay-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8 border-b border-slate-800 pb-5">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${activeEssay.badgeColor}`}>
                {activeEssay.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                {activeEssay.title}
              </h2>
              <p className="text-xs text-teal-300 font-mono">
                {activeEssay.subtitle}
              </p>
            </div>

            {/* Continuous Essay Body */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {activeEssay.essayParagraphs.map((para, i) => (
                <p key={i} className="text-justify leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Distilled Soul Insight */}
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-mono">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>Distilled Soul Insight</span>
              </div>
              <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed italic">
                "{activeEssay.distilledInsight}"
              </p>
            </div>

            {/* Sovereign Affirmation */}
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
              <div className="font-bold text-purple-300 flex items-center gap-1.5 uppercase text-[10px] tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Sovereign Affirmation</span>
              </div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium leading-relaxed font-serif">
                "{activeEssay.sovereignAffirmation}"
              </p>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Affinity Lifestyle Consulting • Intellectual Property
              </span>
              <button
                onClick={() => setActiveEssay(null)}
                className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-colors"
              >
                Close Readout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
