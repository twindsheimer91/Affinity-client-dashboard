import React, { useState } from "react";
import { Profile, AmbiRecord } from "../types";
import { downloadProfileFullDossierPDF, IP_STATEMENT } from "../utils/pdfGenerator";
import { getProfileComputed } from "../utils/calculations";
import { 
  GENE_KEYS, 
  LIFE_PATH_KNOWLEDGE, 
  ZODIAC_KNOWLEDGE, 
  HD_TYPE_KNOWLEDGE, 
  AURA_KNOWLEDGE 
} from "../data/knowledge";
import { MBTI_PROFILES } from "../data/mbtiData";
import { 
  X, 
  Download, 
  Printer, 
  Eye, 
  Sparkles, 
  Layers, 
  Compass, 
  Activity, 
  KeyRound, 
  Star, 
  Brain, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface DossierPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  testHistory?: AmbiRecord[];
}

export const DossierPreviewModal: React.FC<DossierPreviewModalProps> = ({
  isOpen,
  onClose,
  profile,
  testHistory = [],
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);

  if (!isOpen) return null;

  const comp = profile.computed || getProfileComputed(profile);
  const mbti = MBTI_PROFILES[profile.mbtiType || "INFJ"] || MBTI_PROFILES["INFJ"];
  const latestTest = testHistory.length > 0 ? testHistory[testHistory.length - 1] : null;
  const scores = latestTest?.scores || {
    Openness: 88,
    Conscientiousness: 84,
    Extraversion: 72,
    Agreeableness: 86,
    EmotionalStability: 82,
    CognitiveFlexibility: 90,
    SpiritualIntuition: 94,
  };

  const sections = [
    { id: 1, label: "Coordinates & Synthesis", icon: Sparkles },
    { id: 2, label: "Astrology & Planets", icon: Compass },
    { id: 3, label: "Human Design", icon: Activity },
    { id: 4, label: "64 Gene Keys", icon: KeyRound },
    { id: 5, label: "Master Numerology", icon: Star },
    { id: 6, label: "AMBI Mindscape", icon: Brain },
    { id: 7, label: "MBTI & Sovereignty", icon: ShieldCheck },
  ];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      id="dossier-preview-backdrop"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-slate-100"
        id="dossier-preview-modal-card"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-bold text-white">Full Soul Dossier — Live Document Preview</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 font-semibold">
                  7 Official Pages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official certified print & PDF replica for {profile.firstName} {profile.lastName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-8">
            <button
              onClick={() => downloadProfileFullDossierPDF(profile, testHistory)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20"
              title="Download Pristine PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>

          {/* Close button in top-right corner */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors z-30"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-900 border-b border-slate-800/80 overflow-x-auto scrollbar-none shrink-0">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isSel = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSel 
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-xs" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>Page {sec.id}: {sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Document Canvas - Designed as Pristine Letterhead Paper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950 flex justify-center">
          <div className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 md:p-10 border border-slate-200 min-h-[700px] flex flex-col justify-between">
            {/* Document Header with Real Logo & Typography */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
                    alt="Affinity Logo" 
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <span className="font-script text-2xl text-black leading-none block">Affinity</span>
                    <span className="font-brand-sub text-[7px] text-teal-700 uppercase font-bold tracking-[0.25em] block">
                      LIFESTYLE CONSULTING
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Page {activeSection} of 7 • Confidential Dossier
                  </span>
                  <span className="text-xs font-mono font-semibold text-teal-700">
                    ID: AFC-{profile.id?.slice(0, 8) || "SOVEREIGN"}
                  </span>
                </div>
              </div>

              {/* DYNAMIC PAGE CONTENT BASED ON SELECTED SECTION */}
              {activeSection === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-teal-400 font-bold">
                      Master Incarnation Architecture
                    </span>
                    <h3 className="text-xl font-bold">
                      {profile.firstName} {profile.lastName}'s Sovereign Coordinates
                    </h3>
                    <p className="text-xs text-slate-300">
                      Born on {profile.dateOfBirth} at {profile.timeOfBirth || "12:00 PM"} in {profile.placeOfBirth || "Earth Coordinates"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Sun Sign</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{comp.astrology.sunSign}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Life Path</span>
                      <span className="font-bold text-teal-700 text-sm mt-0.5 block">Number {comp.numerology.lifePath}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Human Design</span>
                      <span className="font-bold text-indigo-700 text-sm mt-0.5 block">{comp.humanDesign.type}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Aura Field</span>
                      <span className="font-bold text-amber-700 text-sm mt-0.5 block">{comp.aura.color} ({comp.aura.frequency} Hz)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Hawkins Scale</span>
                      <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{comp.aura.consciousnessScale} / 1000</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Inner Authority</span>
                      <span className="font-bold text-purple-700 text-sm mt-0.5 block">{comp.humanDesign.authority}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-3">
                    <h4 className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      Executive Sovereign Synthesis Essay
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {profile.firstName} {profile.lastName} operates from a deeply centered quantum baseline. Your incarnation mandate unites the electric pioneering momentum of a {comp.humanDesign.type} with the spiritual frequency of {comp.aura.color} light. Operating along Life Path {comp.numerology.lifePath}, you are called to transcend reactive survival conditioning and step forward into conscious sovereign creation.
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      With an inner authority rooted in {comp.humanDesign.authority} intelligence, fulfillment is achieved by respecting somatic truth over cognitive overwhelm. On the Hawkins scale of consciousness, anchoring at {comp.aura.consciousnessScale}/1000 reflects an innate capacity for compassion, emotional resilience, and visionary leadership.
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 2 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">Astrological Architecture & Natal Celestial Placements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Sun in {comp.astrology.sunSign}</span>
                        <span className="text-[10px] font-mono text-teal-700 font-semibold">Core Radiance</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ZODIAC_KNOWLEDGE[comp.astrology.sunSign]?.subtitle || "The radiant core of divine identity."}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Moon in {comp.astrology.moonSign}</span>
                        <span className="text-[10px] font-mono text-teal-700 font-semibold">Subconscious Sanctuary</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{ZODIAC_KNOWLEDGE[comp.astrology.moonSign]?.subtitle || "The emotional wellspring and inner truth."}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Rising in {comp.astrology.risingSign}</span>
                        <span className="text-[10px] font-mono text-teal-700 font-semibold">The Social Prism</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">The filter through which you project your sovereign intentions into society.</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Dominant Planet: {comp.astrology.dominantPlanet}</span>
                        <span className="text-[10px] font-mono text-teal-700 font-semibold">Planetary Governor</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">The cosmic governor directing your most prominent evolutionary transformations.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Karmic Nodes & Eastern Zodiac</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                      <div><strong className="text-teal-800">North Node:</strong> {comp.astrology.northNode} (Destiny Heading)</div>
                      <div><strong className="text-amber-800">South Node:</strong> {comp.astrology.southNode} (Innate Mastery)</div>
                      <div><strong className="text-indigo-800">Chinese Zodiac:</strong> {comp.astrology.chineseZodiac}</div>
                      <div><strong className="text-rose-800">Element:</strong> {comp.astrology.chineseElement}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 3 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">Human Design Quantum Circuitry</h3>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Energy Type</span>
                        <span className="font-bold text-slate-900">{comp.humanDesign.type}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Authority</span>
                        <span className="font-bold text-teal-700">{comp.humanDesign.authority}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Profile</span>
                        <span className="font-bold text-indigo-700">{comp.humanDesign.profile}</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[9px] text-slate-500 uppercase font-mono block">Definition</span>
                        <span className="font-bold text-purple-700">{comp.humanDesign.definitionType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 block">The 9 Energy Centers Status</span>
                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      {["Head", "Ajna", "Throat", "G-Center", "Heart", "Sacral", "Solar Plexus", "Spleen", "Root"].map((name) => {
                        const isDef = (comp.humanDesign.definedCenters || []).includes(name);
                        return (
                          <div 
                            key={name}
                            className={`p-2 rounded-lg border flex items-center justify-between ${
                              isDef ? "bg-teal-50 border-teal-200 text-teal-900 font-semibold" : "bg-slate-50 border-slate-200 text-slate-500"
                            }`}
                          >
                            <span>{name}</span>
                            <span className="text-[9px] font-mono">{isDef ? "Defined" : "Open"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">Active Quantum Channels</span>
                    <p className="text-slate-600 text-[11px]">
                      {(comp.humanDesign.channels || []).join(" • ") || "Single definition channeled consciousness"}
                    </p>
                  </div>
                </div>
              )}

              {activeSection === 4 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">The 64 Gene Keys Golden Path</h3>
                  <p className="text-slate-600 text-[11px]">
                    Transmuting internal shadows into radiant creative genius and highest spiritual siddhis.
                  </p>

                  <div className="space-y-2">
                    {[
                      { name: "Life's Work (Activation)", key: comp.geneKeys?.lifesWork?.keyNumber || 1, line: comp.geneKeys?.lifesWork?.line || 1 },
                      { name: "Evolution (Activation)", key: comp.geneKeys?.evolution?.keyNumber || 2, line: comp.geneKeys?.evolution?.line || 1 },
                      { name: "Radiance (Activation)", key: comp.geneKeys?.radiance?.keyNumber || 3, line: comp.geneKeys?.radiance?.line || 1 },
                      { name: "Purpose (Activation)", key: comp.geneKeys?.purpose?.keyNumber || 4, line: comp.geneKeys?.purpose?.line || 1 },
                      { name: "Attraction (Venus)", key: comp.geneKeys?.attraction?.keyNumber || 5, line: comp.geneKeys?.attraction?.line || 1 },
                      { name: "Core Wound / Vocation", key: comp.geneKeys?.coreWound?.keyNumber || 9, line: comp.geneKeys?.coreWound?.line || 1 },
                      { name: "Pearl (Prosperity)", key: comp.geneKeys?.pearl?.keyNumber || 13, line: comp.geneKeys?.pearl?.line || 1 },
                    ].map((sph, idx) => {
                      const gk = GENE_KEYS[(sph.key - 1) % GENE_KEYS.length] || GENE_KEYS[0];
                      return (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block">{sph.name}: #{sph.key}.{sph.line} "{gk.name}"</span>
                            <span className="text-[10px] text-slate-500">{gk.description?.slice(0, 70)}...</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                            <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">S: {gk.shadow}</span>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">G: {gk.gift}</span>
                            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">Si: {gk.siddhi}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeSection === 5 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">Master Numerology Arc & Pythagorean Blueprint</h3>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Life Path: {comp.numerology.lifePath}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">{LIFE_PATH_KNOWLEDGE[comp.numerology.lifePath]?.subtitle || "Primary Vibration"}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">{LIFE_PATH_KNOWLEDGE[comp.numerology.lifePath]?.body?.[0] || "Your foundational life theme and path."}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Expression / Destiny: {comp.numerology.expression}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">Manifestation Channel</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">Calculated from full legal name, revealing inherent executive abilities and creative style.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Soul Urge: {comp.numerology.soulUrge}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">Subconscious Desire</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">What your soul hungers for in complete intimacy and spiritual truth.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">Personality Vibration: {comp.numerology.personality}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">Outer Field</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1">The external magnetism and charismatic presence perceived by others.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 6 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">AMBI 203 Psychometric Mindscape Scores</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Spiritual Intuition & Sovereignty", score: scores.SpiritualIntuition || 94 },
                      { name: "Cognitive Agility & Synthesis", score: scores.CognitiveFlexibility || 90 },
                      { name: "Openness to Mystical Expansion", score: scores.Openness || 88 },
                      { name: "Interpersonal Coherence & Empathy", score: scores.Agreeableness || 86 },
                      { name: "Sovereign Focus & Manifestation", score: scores.Conscientiousness || 84 },
                      { name: "Emotional & Nervous System Stability", score: scores.EmotionalStability || 82 },
                      { name: "Energetic Radiance & Magnetism", score: scores.Extraversion || 72 },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="font-mono font-bold text-teal-700">{item.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-600 rounded-full" style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 7 && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <h3 className="text-base font-bold text-slate-900">Myers-Briggs (MBTI) & Sovereign Integration Protocol</h3>
                  
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-700">Cognitive Profile</span>
                    <h4 className="text-sm font-bold text-purple-950">
                      {profile.mbtiType || "INFJ"} — {mbti.title} ("{mbti.nickname}")
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{mbti.description}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-teal-800">Daily Contemplation Micro-Rituals</span>
                    <ul className="space-y-1 text-[11px] text-slate-700 list-disc list-inside">
                      <li>Point Zero Reset: 7 minutes quiet nervous system stillness at sunrise.</li>
                      <li>Authority Check: Pause before saying yes to confirm visceral alignment.</li>
                      <li>Shadow Transmutation: Welcome frustration as the doorway to creative gifts.</li>
                      <li>Radiant Sovereignty: Speak your truth with measured elegance and conviction.</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 text-teal-300 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      <span>Certified Sovereign Dossier — Affinity Lifestyle Consulting</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-400">Verified & Sealed</span>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer with Mandatory Intellectual Property Statement */}
            <div className="pt-4 border-t border-slate-200 mt-6 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 gap-2">
              <span className="italic font-medium text-slate-600">
                {IP_STATEMENT}
              </span>
              <span className="font-mono font-semibold text-slate-400">
                Document Generated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
