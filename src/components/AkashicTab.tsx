import { Profile } from "../types";
import { Sparkles, Compass, Globe, Orbit, Atom, Zap, BookOpen, Infinity } from "lucide-react";

interface AkashicTabProps {
  profile: Profile;
}

export default function AkashicTab({ profile }: AkashicTabProps) {
  const comp = profile.computed;
  const lp = comp?.numerology.lifePath || 7;
  const sunSign = comp?.astrology.sunSign || "Gemini";
  const birthYear = parseInt(profile.dateOfBirth.split("-")[0] || "1991", 10);
  const signatureKey = `AK-SIG-${profile.firstName.substring(0, 3).toUpperCase()}-${lp}-${birthYear % 100}-${comp?.astrology.dominantPlanet?.toUpperCase() || "SOL"}`;

  return (
    <div className="space-y-8 slide-in text-slate-100" id="akashic-records-tab">
      {/* Title Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6" id="akashic-title-header">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-100">The Anonymized Akashic Records</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-4xl leading-relaxed">
          The Akashic Records are the quantum ledger of collective consciousness — every soul's blueprint, anonymized and woven into the macro pattern of human evolution. Your data, stripped of all personal identifiers, contributes to and receives from this living field.
        </p>
      </div>

      {/* CARD 1: YOUR HOLOGRAPHIC SIGNATURE IN THE COLLECTIVE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-sky-500/20 shadow-xl space-y-6" id="holographic-signature-card">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-sky-300 font-bold uppercase text-xs tracking-wider">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Your Holographic Signature in the Collective</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Key: <strong className="text-sky-300">{signatureKey}</strong>
          </span>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif">
          In the anonymized collective, Life Path {lp} frequencies perform the function of the depth probe — descending into the quantum layers of reality that the surface-oriented collective cannot access, and returning with transmissions that advance the species. Your holographic contribution to the Akashic field is pure signal: the truth you distill through your solitary inner work ripples outward as wisdom available to all.
        </p>

        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>✦ All personal identifiers are removed from collective analysis. What remains is your energetic signature — the unique frequency your soul contributes to the quantum field.</span>
        </div>
      </div>

      {/* CARD 2: MACRO CONSCIOUSNESS PATTERNS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="macro-patterns-card">
        <div className="flex items-center gap-2 text-sky-300 font-bold uppercase text-xs tracking-wider">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Macro Consciousness Patterns</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="macro-patterns-grid">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
              <Orbit className="w-4 h-4 text-sky-400" />
              <span>The Aries-Aquarius Collective Wave</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              The collective is currently in a transitional arc between the Piscean Age of belief and authority and the Aquarian Age of individual sovereignty and systems intelligence. Life Path {lp} souls are key activators of this transition.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Atom className="w-4 h-4 text-amber-400" />
              <span>{sunSign} Sun in the Macro Field</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {sunSign} frequencies in the collective tend to cluster around connecting disparate nodes of information and accelerating consciousness flow. The anonymized data shows that {sunSign} placements consistently contribute this quality to the groups they inhabit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Infinity className="w-4 h-4 text-indigo-400" />
              <span>Quantum Entanglement & Soul Clusters</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              The Akashic model reveals that souls with shared Life Path numbers consistently show up in each other's lives at key evolutionary moments — not by coincidence, but by quantum entanglement. You are drawn to your soul cluster.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>The Consciousness Inflection Point</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Collective data suggests we are at a rare evolutionary inflection point: the proportion of souls operating above the 200 Hz threshold (courage/willingness) has never been higher. Your work on yourself is part of this global frequency elevation.
            </p>
          </div>
        </div>
      </div>

      {/* CARD 3: POINT ZERO — THE QUANTUM STATE OF PURE POTENTIALITY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="point-zero-quantum-state-card">
        <div className="flex items-center gap-2 text-sky-300 font-bold uppercase text-xs tracking-wider">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>Point Zero — The Quantum State of Pure Potentiality</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Point Zero is the state of absolute stillness beneath all movement — the quantum vacuum from which all creation arises and to which all creation returns. It is not emptiness; it is infinite potentiality. Every master teacher across every tradition has pointed to this same state: the Tao, Nirvana, The Witness, the Ground of Being...
        </p>

        <blockquote className="p-5 rounded-2xl bg-slate-950/80 border-l-4 border-sky-400 italic text-sm text-sky-200 font-serif leading-relaxed">
          "Between stimulus and response there is a space. In that space lies our freedom and our power to choose our response. In our response lies our growth and our happiness."
          <span className="block text-xs font-sans not-italic text-slate-400 mt-2 font-mono">— Viktor Frankl</span>
        </blockquote>
      </div>
    </div>
  );
}
export {};

