import { useState } from "react";
import { Profile } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { Sparkles, Shield, Compass, Activity, Brain, Heart, Zap, Layers, ChevronRight, CheckCircle2, Flame, RefreshCw } from "lucide-react";
import { AURA_KNOWLEDGE } from "../data/knowledge";

interface AuraTabProps {
  profile: Profile;
}

interface HawkinsLevel {
  level: number;
  name: string;
  emotion: string;
  process: string;
  viewOfGod: string;
  viewOfLife: string;
  attractorField: "Power" | "Force";
  polyvagalState: string;
  description: string;
  color: string;
}

const HAWKINS_LEVELS: HawkinsLevel[] = [
  {
    level: 1000,
    name: "Enlightenment / Non-Duality",
    emotion: "Ineffable Peace",
    process: "Pure Awareness",
    viewOfGod: "Self / All-That-Is",
    viewOfLife: "Is",
    attractorField: "Power",
    polyvagalState: "Supraconscious Unified Field",
    description: "The ultimate pinnacle of human consciousness. Subject and object merge entirely into boundless awareness. No personal 'I' exists separate from the cosmos.",
    color: "#ffffff"
  },
  {
    level: 600,
    name: "Peace / Illumination",
    emotion: "Bliss / Stillness",
    process: "Illumination",
    viewOfGod: "All-Being",
    viewOfLife: "Perfect",
    attractorField: "Power",
    polyvagalState: "Deep Point-Zero Stillness",
    description: "The experience of transcendence and silent radiance. The nervous system settles into complete non-reactivity. Spontaneous healing and miracles occur naturally.",
    color: "#c084fc"
  },
  {
    level: 540,
    name: "Unconditional Joy",
    emotion: "Serenity",
    process: "Transfiguration",
    viewOfGod: "One",
    viewOfLife: "Complete",
    attractorField: "Power",
    polyvagalState: "Deep Heart-Brain Coherence",
    description: "Inner joy that arises from within rather than from external circumstances. A state of healing presence where one's field uplifts and calms everyone nearby.",
    color: "#a855f7"
  },
  {
    level: 500,
    name: "Unconditional Love",
    emotion: "Reverence",
    process: "Revelation",
    viewOfGod: "Loving",
    viewOfLife: "Benign",
    attractorField: "Power",
    polyvagalState: "Ventral Vagal Heart Field Expansion",
    description: "Permanent shift from intellectual perception to the heart. Love is not a fluctuating sentiment, but an unchanging state of being that holds all creation in compassion.",
    color: "#ec4899"
  },
  {
    level: 400,
    name: "Reason & Understanding",
    emotion: "Understanding",
    process: "Abstraction",
    viewOfGod: "Wise",
    viewOfLife: "Meaningful",
    attractorField: "Power",
    polyvagalState: "Prefrontal Cortical Synthesis",
    description: "Mastery of science, medicine, philosophy, and systematic intellect. Ability to conceptualize vast amounts of information and recognize universal patterns.",
    color: "#38bdf8"
  },
  {
    level: 350,
    name: "Acceptance & Forgiveness",
    emotion: "Forgiveness",
    process: "Transcendence",
    viewOfGod: "Merciful",
    viewOfLife: "Harmonious",
    attractorField: "Power",
    polyvagalState: "Somatic Emotional Accountability",
    description: "Recognition that you are the creator of your own experience of reality. Emotional sovereignty is established: blame and external victimhood dissolve.",
    color: "#2dd4bf"
  },
  {
    level: 310,
    name: "Willingness",
    emotion: "Optimism",
    process: "Intention",
    viewOfGod: "Inspiring",
    viewOfLife: "Hopeful",
    attractorField: "Power",
    polyvagalState: "Neuroplastic Openness",
    description: "Openness to learning, growing, and serving. Pride and rigidity yield to collaborative flow and rapid spiritual advancement.",
    color: "#34d399"
  },
  {
    level: 250,
    name: "Neutrality",
    emotion: "Trust",
    process: "Release",
    viewOfGod: "Enabling",
    viewOfLife: "Satisfactory",
    attractorField: "Power",
    polyvagalState: "Relaxed Ventral Safety",
    description: "Freedom from rigid positions, dualistic righteousness, and judgmental defensiveness. Life is accepted with equanimity and emotional resilience.",
    color: "#a3e635"
  },
  {
    level: 200,
    name: "Courage (The Critical Fulcrum)",
    emotion: "Affirmation",
    process: "Empowerment",
    viewOfGod: "Permissive",
    viewOfLife: "Feasible",
    attractorField: "Power",
    polyvagalState: "First Stage Ventral Vagal Emergence",
    description: "The Great Threshold between Force (<200) and Power (≥200). Here, integrity emerges, fear is faced, and truth becomes more important than survival illusions.",
    color: "#facc15"
  },
  {
    level: 175,
    name: "Pride",
    emotion: "Scorn",
    process: "Inflation",
    viewOfGod: "Indifferent",
    viewOfLife: "Demanding",
    attractorField: "Force",
    polyvagalState: "Defensive Sympathetic Posturing",
    description: "Dependent on external status, dogmas, and superiority over others. Highly fragile and defensive against criticism.",
    color: "#f59e0b"
  },
  {
    level: 150,
    name: "Anger",
    emotion: "Hate / Resentment",
    process: "Aggression",
    viewOfGod: "Vengeful",
    viewOfLife: "Frustrating",
    attractorField: "Force",
    polyvagalState: "Sympathetic Fight Mechanism",
    description: "Mobilizing kinetic energy born from blocked desire. Can lead to destruction or be channeled upward into the courage to break free.",
    color: "#f97316"
  },
  {
    level: 125,
    name: "Desire",
    emotion: "Craving",
    process: "Enslavement",
    viewOfGod: "Denying",
    viewOfLife: "Disappointing",
    attractorField: "Force",
    polyvagalState: "Dopaminergic Compulsion",
    description: "Incessant wanting, greed, and addictive accumulation. The illusion that external objects or validation will finally bring peace.",
    color: "#fb7185"
  },
  {
    level: 100,
    name: "Fear",
    emotion: "Anxiety",
    process: "Withdrawal",
    viewOfGod: "Punitive",
    viewOfLife: "Frightening",
    attractorField: "Force",
    polyvagalState: "Sympathetic Flight / Panic",
    description: "Hypervigilance and dread. The world is seen as dangerous, predatory, and threatening, paralyzing genuine creative expansion.",
    color: "#f43f5e"
  },
  {
    level: 75,
    name: "Grief",
    emotion: "Regret",
    process: "Despondency",
    viewOfGod: "Disdainful",
    viewOfLife: "Tragic",
    attractorField: "Force",
    polyvagalState: "Prolonged Melancholic Mourning",
    description: "Chronic sadness, mourning what was lost, and belief that joy is permanently gone. Living in the shadow of past pain.",
    color: "#94a3b8"
  },
  {
    level: 50,
    name: "Apathy",
    emotion: "Despair",
    process: "Abdication",
    viewOfGod: "Condemning",
    viewOfLife: "Hopeless",
    attractorField: "Force",
    polyvagalState: "Dorsal Vagal Freeze / Helplessness",
    description: "Hopelessness and complete immobilization. Belief that nothing can ever change, resulting in energetic paralysis.",
    color: "#64748b"
  },
  {
    level: 30,
    name: "Guilt",
    emotion: "Blame / Remorse",
    process: "Destruction",
    viewOfGod: "Vindictive",
    viewOfLife: "Evil",
    attractorField: "Force",
    polyvagalState: "Internalized Self-Aggression",
    description: "Self-recrimination, unworthiness, and victim/perpetrator dynamics. Often projects outward as punishment or inward as psychosomatic illness.",
    color: "#475569"
  },
  {
    level: 20,
    name: "Shame",
    emotion: "Humiliation",
    process: "Elimination",
    viewOfGod: "Despising",
    viewOfLife: "Miserable",
    attractorField: "Force",
    polyvagalState: "Dorsal Vagal Collapse / Dissociation",
    description: "Dangerously close to death. The belief that one's very existence is flawed and unworthy. Accompanied by acute somatic withdrawal.",
    color: "#334155"
  }
];

export default function AuraTab({ profile }: AuraTabProps) {
  const comp = getProfileComputed(profile);
  const aura = comp.aura;

  const [selectedHawkinsLevel, setSelectedHawkinsLevel] = useState<HawkinsLevel>(() => {
    const score = aura.consciousnessScale;
    const found = HAWKINS_LEVELS.find((h) => score >= h.level) || HAWKINS_LEVELS[HAWKINS_LEVELS.length - 1];
    return found;
  });

  // Safe static database retrieval
  const auraInfo = (AURA_KNOWLEDGE as any)[aura.color] || {
    archetype: `${aura.color} Bio-Field Resonance`,
    description: `Your energy field is characterized by a strong ${aura.color} frequency. This indicates that your auric field acts as a natural beacon of deep intuition, sovereign wisdom, and healing frequency.`,
    frequencyFocus: "Cellular renewal, meditative alignment, thyroid balancing",
    invitation: "Embody your truth unconditionally and allow your aura to expand to inspire other systems."
  };

  const currentLevelMatch = HAWKINS_LEVELS.find((h) => aura.consciousnessScale >= h.level) || HAWKINS_LEVELS[8];

  return (
    <div className="space-y-10 animate-fade-in pb-16" id="aura-tab">
      {/* 1. TOP DUAL AURIC SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="aura-grid">
        {/* Immersive Halo Orb visualizer */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl" id="aura-visualizer-card">
          <div className="absolute top-0 right-0 w-full h-full bg-slate-900/40 -z-10" />
          
          {/* Main pulsing orb container */}
          <div className="relative w-48 h-48 flex items-center justify-center my-6" id="orb-halo-container">
            <div 
              className="absolute rounded-full animate-ping opacity-15"
              style={{ 
                width: "180px", 
                height: "180px", 
                backgroundColor: aura.hex,
                animationDuration: "4s"
              }}
              id="orb-ring-1"
            />
            <div 
              className="absolute rounded-full animate-pulse opacity-25"
              style={{ 
                width: "140px", 
                height: "140px", 
                backgroundColor: aura.hex,
                boxShadow: `0 0 50px 15px ${aura.hex}66`,
                animationDuration: "3s"
              }}
              id="orb-ring-2"
            />
            <div 
              className="absolute rounded-full opacity-40"
              style={{ 
                width: "100px", 
                height: "100px", 
                backgroundColor: aura.hex,
                boxShadow: `0 0 70px 25px ${aura.hex}88`
              }}
              id="orb-ring-3"
            />
            <div className="absolute font-mono font-bold text-slate-950 text-sm bg-white/95 px-3.5 py-1.5 rounded-full shadow-xl border border-white/40" id="orb-frequency-badge">
              {aura.frequency} Hz
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Auric Resonance Spectrum</span>
          <h3 className="text-3xl font-light text-white font-serif mt-2" style={{ color: aura.hex }}>
            {aura.color} Ray
          </h3>
          <p className="text-xs text-slate-300 mt-2 max-w-xs leading-normal">
            Your bio-field vibrates naturally at the Solfeggio frequency of <span className="font-semibold text-white font-mono">{aura.frequency} Hz</span>, synchronizing cellular regeneration with cosmic harmonics.
          </p>
        </div>

        {/* Aura Details card */}
        <div className="lg:col-span-2 space-y-6" id="aura-details">
          <div className="glass-card p-8 space-y-5 relative overflow-hidden shadow-2xl" id="aura-details-box">
            <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100/5 rounded-full blur-3xl -z-10" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                Emanation Properties
              </span>
              <span className="text-xs font-mono text-teal-300">
                Calibrated Level: {aura.consciousnessScale}
              </span>
            </div>
            
            <h4 className="text-2xl font-light text-white font-serif" id="aura-archetype-title">
              {auraInfo.archetype || `${aura.color} Frequency Ray`}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed" id="aura-description">
              {auraInfo.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" id="aura-properties-grid">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800" id="aura-focus">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Somatic Energy Focus</span>
                <p className="text-xs text-teal-200 font-semibold mt-1 leading-relaxed">{auraInfo.frequencyFocus || "Vocal center, nervous system, creative glands"}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800" id="aura-invitation">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Evolutionary Invitation</span>
                <p className="text-xs text-amber-200 font-semibold mt-1 leading-relaxed">{auraInfo.invitation || "Practice stillness and speak your authentic voice."}</p>
              </div>
            </div>
          </div>

          {/* Active Hawkins Quick Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-purple-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-300 font-bold">
                  Active Logarithmic Calibration
                </span>
              </div>
              <h4 className="text-xl font-bold font-serif text-white">
                Hawkins Level {aura.consciousnessScale}: {currentLevelMatch.name}
              </h4>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                Operating within the <strong className="text-teal-300 uppercase font-mono">{currentLevelMatch.attractorField}</strong> attractor field. Primary nervous system state: <span className="text-purple-300 italic">{currentLevelMatch.polyvagalState}</span>.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-950 border border-teal-500/40 shrink-0">
              <span className="text-3xl font-extrabold text-teal-300 font-mono">{aura.consciousnessScale}</span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Scale (20-1000)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. IN-DEPTH HAWKINS MAP OF CONSCIOUSNESS HIERARCHY */}
      <div className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">
              Dr. David R. Hawkins Scientific Map of Consciousness
            </span>
            <h3 className="text-2xl font-bold font-serif text-white mt-1">
              The Spectrum of Human Awareness &amp; Somatic Frequency
            </h3>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
              Calibrated logarithmically on a scale from 20 to 1,000. Frequencies below 200 operate on contractive Force (fight/flight/freeze), while frequencies from 200 upward operate on expansive Power (life-supportive, generative coherence).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Click any level to inspect:</span>
          </div>
        </div>

        {/* Hawkins Grid: Left is Ladder, Right is Deep Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LADDER OF 17 LEVELS (7 cols) */}
          <div className="lg:col-span-7 space-y-2 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar">
            {HAWKINS_LEVELS.map((hl) => {
              const isUserCurrent = aura.consciousnessScale >= hl.level && 
                (hl.level === 1000 || aura.consciousnessScale < (HAWKINS_LEVELS[HAWKINS_LEVELS.indexOf(hl) - 1]?.level || 1001));
              const isSelected = selectedHawkinsLevel.level === hl.level;
              const isPower = hl.attractorField === "Power";

              return (
                <button
                  key={hl.level}
                  onClick={() => setSelectedHawkinsLevel(hl)}
                  className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-slate-900 border-teal-400 shadow-lg shadow-teal-500/20 scale-[1.01]"
                      : "bg-slate-950/70 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span 
                      className="font-mono text-xs font-bold w-12 px-2 py-1 rounded-lg text-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${hl.color}15`, 
                        borderColor: `${hl.color}40`,
                        color: hl.color 
                      }}
                    >
                      {hl.level}
                    </span>

                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-slate-100 truncate">
                          {hl.name}
                        </span>
                        {isUserCurrent && (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold shrink-0">
                            Your Level
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">
                        Emotion: <strong className="text-slate-200">{hl.emotion}</strong> • View: <span className="italic">{hl.viewOfLife}</span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-bold ${
                      isPower ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    }`}>
                      {hl.attractorField}
                    </span>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? "text-teal-300 translate-x-1" : ""}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: DEEP INSPECTOR CARD (5 cols) */}
          <div className="lg:col-span-5 sticky top-6 space-y-5">
            <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-teal-500/35 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold"
                      style={{ 
                        backgroundColor: `${selectedHawkinsLevel.color}20`, 
                        color: selectedHawkinsLevel.color 
                      }}
                    >
                      Frequency {selectedHawkinsLevel.level}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      selectedHawkinsLevel.attractorField === "Power" 
                        ? "bg-emerald-500/20 text-emerald-300" 
                        : "bg-rose-500/20 text-rose-300"
                    }`}>
                      Attractor: {selectedHawkinsLevel.attractorField}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-serif text-white pt-1">
                    {selectedHawkinsLevel.name}
                  </h4>
                </div>
              </div>

              {/* Matrix Pillars */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Dominant Emotion</span>
                  <span className="font-bold text-teal-300">{selectedHawkinsLevel.emotion}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Evolutionary Process</span>
                  <span className="font-bold text-amber-300">{selectedHawkinsLevel.process}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Perception of Divine</span>
                  <span className="font-bold text-sky-300">{selectedHawkinsLevel.viewOfGod}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Experience of Life</span>
                  <span className="font-bold text-purple-300">{selectedHawkinsLevel.viewOfLife}</span>
                </div>
              </div>

              {/* Polyvagal & Nervous System State */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span>Somatic Nervous System Correlation</span>
                </span>
                <p className="text-slate-200 leading-relaxed font-sans font-medium">
                  {selectedHawkinsLevel.polyvagalState}
                </p>
              </div>

              {/* Deep Narrative Description */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p>{selectedHawkinsLevel.description}</p>
              </div>

              {/* Practical Elevation Practice */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Somatic Elevation Practice for Level {selectedHawkinsLevel.level}</span>
                </span>
                <p className="text-teal-100 leading-relaxed italic">
                  {selectedHawkinsLevel.level >= 500
                    ? "Practice resting in silent open heart presence. Cultivate non-attachment to outcomes and allow all life to unfold without personal judgment."
                    : selectedHawkinsLevel.level >= 350
                    ? "Deepen forgiveness of past narratives. Anchor into 5-minute coherence breathing (5s inhale, 5s exhale) whenever emotional friction arises."
                    : selectedHawkinsLevel.level >= 200
                    ? "Celebrate taking constructive risks in service of your authentic truth. Replace self-doubt with sovereign determination."
                    : "Somatic release work: focus on shaking, vagus nerve humming, diaphragmatic exhalations, and grounding barefoot into the earth to exit freeze/flight cycles."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
