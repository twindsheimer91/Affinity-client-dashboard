import { useState } from "react";
import { Profile } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { 
  Star, 
  Compass, 
  Sparkles, 
  Sun, 
  Moon, 
  Map, 
  X, 
  Check, 
  Zap, 
  Flame, 
  ShieldAlert, 
  Award, 
  BookOpen, 
  Heart, 
  Info, 
  ArrowRight 
} from "lucide-react";
import { 
  LIFE_PATH_KNOWLEDGE, 
  ZODIAC_KNOWLEDGE, 
  PLANET_KNOWLEDGE, 
  LIFE_PATH_ARCHETYPES, 
  NUMBER_KNOWLEDGE 
} from "../data/knowledge";
import { generatePersonalizedEssay, PersonalizedEssay } from "../utils/personalizedEssays";
import { AstrologyMandalaSVG } from "./AstrologyMandalaSVG";

interface SoulBlueprintProps {
  profile: Profile;
}

export default function SoulBlueprint({ profile }: SoulBlueprintProps) {
  const [subTab, setSubTab] = useState<"numerology" | "astrology">("numerology");
  const [activeEssay, setActiveEssay] = useState<PersonalizedEssay | null>(null);

  const comp = getProfileComputed(profile);
  const lp = comp.numerology.lifePath;
  const name = profile.firstName || "Seeker";

  // Retrieve Life Path knowledge (safely falling back if needed)
  const lpInfo = (LIFE_PATH_KNOWLEDGE as any)[lp] || {
    title: `Life Path ${lp}`,
    subtitle: "Sovereign Alignment",
    archetype: (LIFE_PATH_ARCHETYPES as any)[lp] || "The Sovereign Pioneer",
    description: `As a Life Path ${lp}, your cosmic path is centered on mastery, sovereign expression, and alignment with high-vibrational Point Zero stillness. You possess immense leadership, intuition, and creation potential.`,
    talents: ["Visionary Insight", "Resilient Manifestation", "Creative Sovereignty"],
    lessons: ["Overcoming self-doubt", "Aligning power with wisdom", "Cultivating inner silence"]
  };

  const sunInfo = (ZODIAC_KNOWLEDGE as any)[comp.astrology.sunSign] || {
    title: `${comp.astrology.sunSign} Sun`,
    subtitle: "Solar Core",
    element: "Fire",
    modality: "Cardinal",
    ruler: "Mars",
    strengths: ["Courageous", "Pioneering", "Dynamic", "Authentic"],
    weaknesses: ["Impatient", "Impulsive", "Rebellious"],
    description: `Your Sun in ${comp.astrology.sunSign} shines with sovereign brilliance. This represents your core vitality, conscious ego, and the light you radiate onto the universe.`
  };

  const planetInfo = (PLANET_KNOWLEDGE as any)[comp.astrology.dominantPlanet] || {
    title: `${comp.astrology.dominantPlanet}`,
    keywords: ["Expansion", "Wisdom", "Benevolence", "Sovereign Law"],
    description: `${comp.astrology.dominantPlanet} governs your Rising Sign and serves as your primary stellar driver, channeling higher cosmic currents into your physical incarnation.`
  };

  const handleOpenEssay = (
    itemType: "talent" | "lesson" | "sun" | "moon" | "rising" | "planet" | "lifepath" | "strength",
    keyName: string
  ) => {
    const essay = generatePersonalizedEssay(profile, itemType, keyName);
    setActiveEssay(essay);
  };

  return (
    <div className="space-y-8 slide-in" id="soul-blueprint-container">
      {/* Sub-navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-teal-500/15 pb-4" id="blueprint-controls">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Cosmic Blueprint Matrix</h2>
            <p className="text-xs text-slate-400">Interactive Sacred Geometric Readouts for {name}</p>
          </div>
        </div>

        <div className="flex bg-slate-900/80 p-1 rounded-xl border border-teal-500/20 text-xs font-mono" id="subtab-toggle-group">
          <button
            onClick={() => setSubTab("numerology")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              subTab === "numerology"
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-numerology-btn"
          >
            <Star className="w-3.5 h-3.5" />
            <span>Numerology Arc</span>
          </button>
          <button
            onClick={() => setSubTab("astrology")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              subTab === "astrology"
                ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shadow-[0_0_12px_rgba(45,212,191,0.2)]"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-astrology-btn"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Sacred Astrology Mandala</span>
          </button>
        </div>
      </div>

      {subTab === "numerology" ? (
        /* NUMEROLOGY VIEW */
        <div className="space-y-8" id="numerology-view">
          {/* Main Life Path Hero Card */}
          <div 
            onClick={() => handleOpenEssay("lifepath", `Life Path ${lp}`)}
            className="glass-card p-8 md:p-10 relative overflow-hidden group cursor-pointer hover:border-amber-400/50 transition-all shadow-xl"
            id="lp-hero-card"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Primary Sovereign Axis
                  </span>
                  <span className="text-xs text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Click for Deep Personalized Essay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-light text-white font-serif tracking-tight" id="lp-title">
                  Life Path <span className="text-amber-400 font-bold">{lp}</span>: {lpInfo.archetype}
                </h3>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed" id="lp-desc">
                  {lpInfo.description}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shrink-0">
                <span className="text-5xl font-extrabold text-amber-400 font-serif group-hover:scale-110 transition-transform">{lp}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-mono font-bold">Frequency {lp}</span>
              </div>
            </div>
          </div>

          {/* Cosmic Talents and Earthly Lessons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="talents-lessons-grid">
            {/* Cosmic Talents */}
            <div className="glass-card p-6 md:p-8 space-y-4" id="talents-card">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold tracking-wider text-teal-400 uppercase flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Cosmic Talents (Innate Gifts)</span>
                </h4>
                <span className="text-[10px] text-teal-400/80 font-mono">Click to Read Essay</span>
              </div>
              <p className="text-xs text-slate-400">
                Effortless flow channels where your energy expresses without friction:
              </p>
              <div className="space-y-2.5">
                {(lpInfo.talents || ["Visionary Insight", "Resilient Manifestation", "Creative Sovereignty"]).map((talent: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenEssay("talent", talent)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-teal-500/20 hover:border-teal-400 hover:bg-teal-500/10 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-teal-200 transition-colors">
                        {talent}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Earthly Lessons */}
            <div className="glass-card p-6 md:p-8 space-y-4" id="lessons-card">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="text-xs font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Earthly Lessons (Growth Catalysts)</span>
                </h4>
                <span className="text-[10px] text-amber-400/80 font-mono">Click to Read Essay</span>
              </div>
              <p className="text-xs text-slate-400">
                Evolutionary friction points chosen by your soul to awaken sovereign mastery:
              </p>
              <div className="space-y-2.5">
                {(lpInfo.lessons || ["Overcoming self-doubt", "Aligning power with wisdom", "Cultivating inner silence"]).map((lesson: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenEssay("lesson", lesson)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 hover:border-amber-400 hover:bg-amber-500/10 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-200 transition-colors">
                        {lesson}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Auxiliary Core Vibrations */}
          <div className="glass-card p-6 md:p-8 space-y-4">
            <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase border-b border-white/5 pb-3 font-mono">
              Auxiliary Numerical Vibrations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => handleOpenEssay("strength", `Destiny Expression: Number ${comp.numerology.expression}`)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition-all space-y-1 group"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Destiny / Expression</span>
                <span className="text-2xl font-bold text-amber-300 font-mono group-hover:scale-105 transition-transform inline-block">
                  {comp.numerology.expression}
                </span>
                <p className="text-[11px] text-slate-400">Physical vocation and outward creation.</p>
              </div>

              <div 
                onClick={() => handleOpenEssay("strength", `Soul Urge / Heart's Desire: Number ${comp.numerology.soulUrge}`)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition-all space-y-1 group"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Soul Urge / Heart</span>
                <span className="text-2xl font-bold text-amber-300 font-mono group-hover:scale-105 transition-transform inline-block">
                  {comp.numerology.soulUrge}
                </span>
                <p className="text-[11px] text-slate-400">Subconscious longing and inner fulfillment.</p>
              </div>

              <div 
                onClick={() => handleOpenEssay("strength", `Personality Aura: Number ${comp.numerology.personality}`)}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 cursor-pointer transition-all space-y-1 group"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Personality Aura</span>
                <span className="text-2xl font-bold text-amber-300 font-mono group-hover:scale-105 transition-transform inline-block">
                  {comp.numerology.personality}
                </span>
                <p className="text-[11px] text-slate-400">First impressions and social projection.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ASTROLOGY VIEW */
        <div className="space-y-8" id="astrology-view">
          {/* SACRED ASTROLOGY NATAL MANDALA ART */}
          <AstrologyMandalaSVG 
            profile={profile} 
            onSelectPlacement={(planet, sign) => handleOpenEssay("sun", `${planet} in ${sign}`)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stellar Placements Banner */}
            <div className="lg:col-span-2 space-y-6" id="astro-main-col">
              <div 
                onClick={() => handleOpenEssay("sun", `${comp.astrology.sunSign} Sun`)}
                className="glass-card p-8 relative overflow-hidden group cursor-pointer hover:border-sky-400/50 transition-all shadow-xl" 
                id="astro-profile-banner"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl -z-10" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-full">Solar Core</span>
                  <span className="text-xs text-sky-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Solar Essay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-light text-white font-serif mt-3" id="astro-sun-title">
                  Sun in <span className="text-sky-300">{comp.astrology.sunSign}</span>
                </h3>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed" id="astro-sun-desc">
                  {sunInfo.description}
                </p>
              </div>

              {/* Active Strengths Badges */}
              <div className="glass-card p-6 space-y-4" id="astro-strengths">
                <h4 className="text-xs font-bold tracking-wider text-sky-400 uppercase flex items-center gap-1.5 border-b border-white/5 pb-3 font-mono">
                  <Sun className="w-4 h-4 text-sky-400" /> Active Strengths ({comp.astrology.sunSign})
                </h4>
                <div className="flex flex-wrap gap-2.5" id="strengths-badges">
                  {(sunInfo.strengths || ["Pioneering Courage", "Direct Execution", "Infectious Initiative", "Unflinching Authenticity"]).map((str: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleOpenEssay("strength", str)}
                      className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300 font-semibold hover:border-sky-400 hover:bg-sky-500/20 cursor-pointer transition-all flex items-center gap-2 group shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span>{str}</span>
                      <ArrowRight className="w-3 h-3 text-sky-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Matrix Properties */}
              <div className="glass-card p-6 space-y-4" id="astro-properties">
                <h4 className="text-xs font-bold tracking-wider text-sky-400 uppercase flex items-center gap-1.5 border-b border-white/5 pb-3 font-mono">
                  <Map className="w-4 h-4 text-sky-400" /> Sign Matrix Properties
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" id="properties-list">
                  <div 
                    onClick={() => handleOpenEssay("strength", `${sunInfo.element} Element Mastery`)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all flex justify-between items-center" 
                  >
                    <span className="text-slate-400">Zodiac Element:</span>
                    <span className="font-bold text-amber-300 font-mono">{sunInfo.element}</span>
                  </div>

                  <div 
                    onClick={() => handleOpenEssay("strength", `${sunInfo.modality} Modality Flow`)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all flex justify-between items-center" 
                  >
                    <span className="text-slate-400">Modality:</span>
                    <span className="font-bold text-sky-300 font-mono">{sunInfo.modality}</span>
                  </div>

                  <div 
                    onClick={() => handleOpenEssay("strength", `Ruler Planet: ${sunInfo.ruler}`)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all flex justify-between items-center" 
                  >
                    <span className="text-slate-400">Governing Ruler:</span>
                    <span className="font-bold text-purple-300 font-mono">{sunInfo.ruler}</span>
                  </div>

                  <div 
                    onClick={() => handleOpenEssay("rising", `${comp.astrology.risingSign} Rising Lens`)}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-all flex justify-between items-center" 
                  >
                    <span className="text-slate-400">Rising Sign (Lens):</span>
                    <span className="font-bold text-teal-300 font-mono">{comp.astrology.risingSign}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Placements Sidebar */}
            <div className="space-y-6" id="astro-sidebar">
              <div className="glass-card p-6" id="secondary-placements-card">
                <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 border-b border-white/5 pb-3 flex justify-between items-center font-mono">
                  <span>Incarnation Placements</span>
                  <span className="text-[10px] text-teal-400 font-mono">Click to read</span>
                </h4>

                <div className="space-y-3" id="secondary-placements-list">
                  {/* Ascendant */}
                  <div 
                    onClick={() => handleOpenEssay("rising", `${comp.astrology.risingSign} Ascendant`)}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-400/40 hover:bg-teal-500/5 cursor-pointer transition-all flex items-start gap-3 group" 
                  >
                    <span className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                      <Sun className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-teal-300 transition-colors">Rising Sign (Ascendant)</h5>
                      <p className="text-sm font-bold text-white mt-0.5">{comp.astrology.risingSign}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Physical aura projection and space-time lens.</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-1" />
                  </div>

                  {/* Moon */}
                  <div 
                    onClick={() => handleOpenEssay("moon", `${comp.astrology.moonSign} Moon`)}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-400/40 hover:bg-purple-500/5 cursor-pointer transition-all flex items-start gap-3 group" 
                  >
                    <span className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                      <Moon className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-300 transition-colors">Moon Sign Sanctuary</h5>
                      <p className="text-sm font-bold text-white mt-0.5">{comp.astrology.moonSign}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Subconscious waters, emotional safety, and intuition.</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-1" />
                  </div>

                  {/* Dominant Planet */}
                  <div 
                    onClick={() => handleOpenEssay("strength", `Dominant Planet: ${comp.astrology.dominantPlanet}`)}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-400/40 hover:bg-amber-500/5 cursor-pointer transition-all flex items-start gap-3 group" 
                  >
                    <span className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                      <Star className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-300 transition-colors">Dominant Stellar Driver</h5>
                      <p className="text-sm font-bold text-white mt-0.5">{comp.astrology.dominantPlanet}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{planetInfo.keywords.slice(0, 2).join(" • ")}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTINUOUS PERSONALIZED ESSAY MODAL (NO MECHANICAL BOXES) */}
      {activeEssay && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveEssay(null)}
          id="soul-blueprint-modal-backdrop"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 sm:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative text-slate-100 animate-scale-up"
            id="soul-blueprint-modal-card"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setActiveEssay(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              id="close-blueprint-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8 border-b border-slate-800 pb-5">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border inline-block ${activeEssay.badgeColor}`}>
                {activeEssay.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
                {activeEssay.title}
              </h3>
              <p className="text-xs text-teal-300 font-mono">
                {activeEssay.subtitle}
              </p>
            </div>

            {/* Continuous Narrative Essay Paragraphs */}
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

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Affinity Lifestyle Consulting • Intellectual Property
              </span>
              <button
                onClick={() => setActiveEssay(null)}
                className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-colors"
                id="modal-dismiss-btn"
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
export {};
