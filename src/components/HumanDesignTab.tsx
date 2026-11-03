import React, { useState } from "react";
import { Profile } from "../types";
import { 
  Layers, 
  Activity, 
  Sparkles, 
  Compass, 
  Info, 
  X, 
  Shield, 
  Eye, 
  HelpCircle, 
  ArrowUpRight,
  Sun,
  Globe,
  Zap,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { HD_TYPE_KNOWLEDGE, GENE_KEYS } from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { BodyGraphSVG } from "./BodyGraphSVG";

interface HumanDesignTabProps {
  profile: Profile;
}

interface CoordinateModal {
  title: string;
  category: string;
  plainEnglish: string;
  personalTranslation: string;
  takeaway: string;
}

export default function HumanDesignTab({ profile }: HumanDesignTabProps) {
  const comp = getProfileComputed(profile);
  const [selectedCenter, setSelectedCenter] = useState<string | null>(null);
  const [selectedGate, setSelectedGate] = useState<number | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<CoordinateModal | null>(null);

  const name = profile.firstName || "Seeker";
  const hd = comp.humanDesign;

  const persSun = hd.personalityPositions?.["Sun"] || { gate: 16, line: 1 };
  const persEarth = hd.personalityPositions?.["Earth"] || { gate: 9, line: 1 };
  const desSun = hd.designPositions?.["Sun"] || { gate: 49, line: 4 };
  const desEarth = hd.designPositions?.["Earth"] || { gate: 40, line: 4 };

  let angleType = "Right Angle";
  if (hd.profile === "4/1") angleType = "Juxtaposition";
  else if (["5/1", "5/2", "6/2", "6/3"].includes(hd.profile)) angleType = "Left Angle";

  const crossTitle = `${angleType} Cross of Gates ${persSun.gate}/${persEarth.gate} • ${desSun.gate}/${desEarth.gate}`;

  const typeInfo = (HD_TYPE_KNOWLEDGE as any)[hd.type] || {
    strategy: hd.type.includes("Generator") ? "To Respond" : hd.type === "Projector" ? "Wait for the Invitation" : hd.type === "Manifestor" ? "To Inform" : "Wait a Lunar Cycle",
    signature: hd.type.includes("Generator") ? "Satisfaction & Peace" : hd.type === "Projector" ? "Success" : hd.type === "Manifestor" ? "Peace" : "Surprise",
    nonSelf: hd.type.includes("Generator") ? "Frustration & Anger" : hd.type === "Projector" ? "Bitterness" : hd.type === "Manifestor" ? "Anger" : "Disappointment",
    description: `As a ${hd.type}, you possess a unique aura mechanics structure.`
  };

  const lineArchetypes: Record<number, { title: string; subtitle: string; desc: string }> = {
    1: {
      title: "Line 1 - Investigator",
      subtitle: "Foundation & Security",
      desc: "You need to study, research, and build a solid foundation before you can move forward. Your security comes from knowledge. When you know enough, you are unshakeable."
    },
    2: {
      title: "Line 2 - Hermit",
      subtitle: "Natural Talent & Projection",
      desc: "Gifts emerge in solitude. You are naturally gifted without trying, but need alone time to recharge until others call you out to share your genius."
    },
    3: {
      title: "Line 3 - Martyr",
      subtitle: "Trial & Error & Adaptation",
      desc: "Wisdom through experiment and lived experience. Bonds that break and reform. What doesn't work teaches you how to adapt quickly and build resilience."
    },
    4: {
      title: "Line 4 - Opportunist",
      subtitle: "Network & Community",
      desc: "Life works through existing connections and trusted friendships. Doors open through people you know and your impact is felt in your community."
    },
    5: {
      title: "Line 5 - Heretic",
      subtitle: "Practical Solutions & Universal Impact",
      desc: "Projected upon by others as a problem solver. When you offer practical, universal solutions, your impact is profound across wider networks."
    },
    6: {
      title: "Line 6 - Role Model",
      subtitle: "Three Life Phases & Transcendent Authority",
      desc: "Earns wisdom through three distinct life phases: trial & error in youth, stepping back to observe, and becoming the living embodiment of wisdom after age 50."
    }
  };

  const planetList = ["Sun", "Earth", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node", "South Node"];

  const openCoordModal = (title: string, category: string, plainEnglish: string, personalTranslation: string, takeaway: string) => {
    setSelectedCoord({
      title,
      category,
      plainEnglish,
      personalTranslation,
      takeaway
    });
  };

  const getCircuitType = (channelName: string) => {
    if (channelName.includes("61-24") || channelName.includes("43-23") || channelName.includes("8-1") || channelName.includes("20-10") || channelName.includes("25-51") || channelName.includes("2-14") || channelName.includes("28-38") || channelName.includes("57-20") || channelName.includes("57-34") || channelName.includes("12-22") || channelName.includes("55-39") || channelName.includes("60-3") || channelName.includes("3-60")) return "Individual Circuit";
    if (channelName.includes("45-21") || channelName.includes("40-37") || channelName.includes("26-44") || channelName.includes("50-27") || channelName.includes("49-19") || channelName.includes("32-54") || channelName.includes("19-49") || channelName.includes("37-40")) return "Tribal Circuit";
    return "Collective Circuit";
  };

  return (
    <div className="space-y-10 animate-fade-in text-slate-100" id="human-design-tab">
      {/* HEADER BANNER */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden" id="hd-header-card">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full border border-teal-500/20 w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Human Design Chart</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-wide" id="hd-main-title">
              {profile.firstName} {profile.lastName}'s Chart Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Calculated via Jovian Archive / MMI methodology • 88° solar arc Design layer • Historical DST-corrected UTC ({profile.dateOfBirth} @ {profile.timeOfBirth || "12:00"})
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-teal-950/60 border border-teal-500/30 font-semibold text-teal-200">
              Type: {hd.type}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-semibold text-slate-200">
              Auth: {hd.authority}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 font-semibold text-slate-200">
              Prof: {hd.profile}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION I: TYPE & STRATEGY */}
      <section className="bg-slate-950/80 border border-teal-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-type-strategy">
        <div className="flex items-center justify-between pb-4 border-b border-teal-500/20">
          <div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">I. TYPE & STRATEGY</span>
            <h3 className="text-3xl font-extrabold text-white font-serif mt-1">
              {hd.type}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">
              Authority: <strong className="text-white">{hd.authority}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
              Profile: <strong className="text-white">{hd.profile}</strong>
            </span>
          </div>
        </div>

        {/* 6 Key Points Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-teal-400 font-bold uppercase">✦ AURA MECHANICS</span>
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-slate-200 leading-relaxed">
              Open and enveloping, with a motor behind it. Your aura broadcasts at a higher frequency to attract opportunities naturally as dynamic, multi-directional force.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-teal-400 font-bold uppercase">✦ STRATEGY</span>
              <Compass className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-slate-200 leading-relaxed font-semibold">
              {typeInfo.strategy}
            </p>
            <p className="text-slate-400 text-[11px]">
              Respond first, then inform. Wait for life to present clues to your gut before initiating moves to reduce resistance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-teal-400 font-bold uppercase">✦ INNER AUTHORITY</span>
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-slate-200 leading-relaxed font-semibold">
              {hd.authority}
            </p>
            <p className="text-slate-400 text-[11px]">
              Your physical body's response ('uh-huh' / 'un-uh') is your true guidance system. Trust the gut signal over mental logic.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-rose-400 font-bold uppercase">✦ NOT-SELF THEME</span>
              <Shield className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-rose-200 font-bold text-sm">
              {typeInfo.nonSelf}
            </p>
            <p className="text-slate-300 text-[11px]">
              Arises when you bypass your gut response, overthink, or initiate without waiting for life's signal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">✦ SIGNATURE (ALIGNMENT)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-emerald-200 font-bold text-sm">
              {typeInfo.signature}
            </p>
            <p className="text-slate-300 text-[11px]">
              The satisfaction and peace you feel when engaging your energy in un-forced, aligned endeavors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">✦ LIVING YOUR DESIGN</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              You are meant to do many things at once. Fast to move, quick to quit what stops lighting you up without guilt.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION II: INCARNATION CROSS — YOUR LIFE THEME */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-incarnation-cross">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">II. INCARNATION CROSS — YOUR LIFE THEME</span>
          <h3 className="text-2xl font-bold text-white mt-1">
            {crossTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Your Incarnation Cross is the overarching theme of your life — the story you are here to live out, the purpose that drives your existence. Derived from your Sun and Earth gate positions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1">
            <span className="text-[10px] text-purple-300 font-mono font-bold uppercase block">PERSONALITY SUN</span>
            <p className="text-xl font-bold text-white font-mono">Gate {persSun.gate}.{persSun.line}</p>
            <span className="text-[11px] text-purple-200 font-semibold block">
              {GENE_KEYS[persSun.gate - 1]?.name || `Gate ${persSun.gate}`}
            </span>
            <p className="text-[10px] text-slate-400">Conscious purpose — what you radiate into the world.</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1">
            <span className="text-[10px] text-purple-300 font-mono font-bold uppercase block">PERSONALITY EARTH</span>
            <p className="text-xl font-bold text-white font-mono">Gate {persEarth.gate}.{persEarth.line}</p>
            <span className="text-[11px] text-purple-200 font-semibold block">
              {GENE_KEYS[persEarth.gate - 1]?.name || `Gate ${persEarth.gate}`}
            </span>
            <p className="text-[10px] text-slate-400">Conscious grounding — anchors your presence.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <span className="text-[10px] text-rose-300 font-mono font-bold uppercase block">DESIGN SUN</span>
            <p className="text-xl font-bold text-white font-mono">Gate {desSun.gate}.{desSun.line}</p>
            <span className="text-[11px] text-rose-200 font-semibold block">
              {GENE_KEYS[desSun.gate - 1]?.name || `Gate ${desSun.gate}`}
            </span>
            <p className="text-[10px] text-slate-400">Unconscious vitality — the body's calling.</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1">
            <span className="text-[10px] text-rose-300 font-mono font-bold uppercase block">DESIGN EARTH</span>
            <p className="text-xl font-bold text-white font-mono">Gate {desEarth.gate}.{desEarth.line}</p>
            <span className="text-[11px] text-rose-200 font-semibold block">
              {GENE_KEYS[desEarth.gate - 1]?.name || `Gate ${desEarth.gate}`}
            </span>
            <p className="text-[10px] text-slate-400">Unconscious anchor — physical stability.</p>
          </div>
        </div>
      </section>

      {/* SECTION III: YOUR BODYGRAPH */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4" id="section-bodygraph">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">III. YOUR BODYGRAPH</span>
          <p className="text-xs text-slate-400 mt-1">
            Your BodyGraph is a map of nine energy Centers connected by 36 Channels, each with a Gate at either end. Colored areas are defined — fixed and reliable in you. White areas are open — where the world enters and conditioning lives.
          </p>
        </div>

        <BodyGraphSVG profile={profile} />
      </section>

      {/* SECTION IV: DEFINITION */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-definition">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">IV. DEFINITION</span>
            <h3 className="text-2xl font-bold text-white mt-1">
              {hd.definitionType}
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 font-mono text-xs font-bold">
            {hd.definedCenters?.length || 0} Defined • {hd.undefinedCenters?.length || 0} Open/Undefined
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Definition is the foundation of your uniqueness — the consistent, reliable energy in your Design. A <strong className="text-teal-200">{hd.definitionType}</strong> means your defined centers form {hd.definitionType.includes("Split") ? "separate networks that look to bridge with other people" : "one single interconnected circuit"}.
        </p>

        {/* 9 Centers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.entries(hd.centers || {}).map(([cKey, cDetail]: [string, any]) => {
            const defined = cDetail.state === "defined";
            return (
              <div 
                key={cKey}
                onClick={() => setSelectedCenter(cKey)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                  defined 
                    ? "bg-slate-900/90 border-teal-500/30 hover:border-teal-400/60" 
                    : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-100 text-sm">{cKey} Center</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    defined ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" : "bg-slate-800 text-slate-400"
                  }`}>
                    {defined ? "Defined" : "Open"}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] line-clamp-3">
                  {defined 
                    ? `Fixed, consistent energy. You broadcast a reliable frequency from your ${cKey} Center.`
                    : `Open to environmental conditioning. You absorb and amplify others' ${cKey} energy.`}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION V: PROFILE */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-profile">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">V. PROFILE</span>
          <h3 className="text-2xl font-bold text-white mt-1">
            Profile {hd.profile}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Profiles in Human Design are like the roles you play in life — the costumes you wear on stage. Derived from Personality Sun (conscious line) and Design Sun (unconscious line).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
            <span className="text-[10px] text-purple-300 font-mono font-bold uppercase block">
              LINE {persSun.line} • PERSONALITY (CONSCIOUS)
            </span>
            <h4 className="text-lg font-bold text-white">
              {lineArchetypes[persSun.line]?.title || `Line ${persSun.line}`}
            </h4>
            <span className="text-purple-200 font-semibold block text-[11px]">
              {lineArchetypes[persSun.line]?.subtitle}
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {lineArchetypes[persSun.line]?.desc}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <span className="text-[10px] text-rose-300 font-mono font-bold uppercase block">
              LINE {desSun.line} • DESIGN (UNCONSCIOUS)
            </span>
            <h4 className="text-lg font-bold text-white">
              {lineArchetypes[desSun.line]?.title || `Line ${desSun.line}`}
            </h4>
            <span className="text-rose-200 font-semibold block text-[11px]">
              {lineArchetypes[desSun.line]?.subtitle}
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {lineArchetypes[desSun.line]?.desc}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION VI: CHANNELS & CIRCUITRY */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-channels">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">VI. CHANNELS & CIRCUITRY</span>
          <p className="text-xs text-slate-400 mt-1">
            Channels in Human Design are energetic pathways connecting Centers. When both gates are active, they create a reliable, consistent flow of energy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {hd.channels.map((chanName, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 hover:border-teal-500/40 transition-all">
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">
                {getCircuitType(chanName)}
              </span>
              <h4 className="text-base font-bold text-white">{chanName}</h4>
              <p className="text-slate-400 text-[11px]">
                Active channel connecting your defined centers with specialized life force circuitry.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION VII: PLANETARY ACTIVATIONS */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-planetary">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest font-bold block">VII. PLANETARY ACTIVATIONS</span>
          <p className="text-xs text-slate-400 mt-1">
            Exact astronomical gate and line positions for Personality (Conscious) and Design (Unconscious) layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Personality Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-purple-300 font-mono text-sm uppercase flex items-center justify-between pb-2 border-b border-slate-800">
              <span>PERSONALITY — CONSCIOUS (BLACK)</span>
              <span className="text-[10px] text-slate-500">UTC Birth Moment</span>
            </h4>
            <div className="space-y-1.5 font-mono">
              {planetList.map((p) => {
                const pos = hd.personalityPositions?.[p] || { gate: 1, line: 1 };
                return (
                  <div key={p} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 font-sans">{p}</span>
                    <button 
                      onClick={() => setSelectedGate(pos.gate)}
                      className="text-purple-300 font-bold hover:underline"
                    >
                      Gate {pos.gate}.{pos.line}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Design Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-rose-300 font-mono text-sm uppercase flex items-center justify-between pb-2 border-b border-slate-800">
              <span>DESIGN — UNCONSCIOUS (RED)</span>
              <span className="text-[10px] text-slate-500">88° Solar Arc Regression</span>
            </h4>
            <div className="space-y-1.5 font-mono">
              {planetList.map((p) => {
                const pos = hd.designPositions?.[p] || { gate: 1, line: 1 };
                return (
                  <div key={p} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-300 font-sans">{p}</span>
                    <button 
                      onClick={() => setSelectedGate(pos.gate)}
                      className="text-rose-300 font-bold hover:underline"
                    >
                      Gate {pos.gate}.{pos.line}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION VIII: THE SIX LINES OF THE HEXAGRAM */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6" id="section-six-lines">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">VIII. THE SIX LINES OF THE HEXAGRAM</span>
          <p className="text-xs text-slate-400 mt-1">
            Understanding the archetypal frequency of all six hexagram lines in the I Ching and Human Design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.entries(lineArchetypes).map(([lNum, info]) => (
            <div key={lNum} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 hover:border-amber-500/40 transition-all">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">
                {info.subtitle}
              </span>
              <h4 className="text-base font-bold text-white">{info.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {info.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GATE MODAL */}
      {selectedGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative space-y-5">
            <button
              onClick={() => setSelectedGate(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                Gate #{selectedGate} (Gene Key #{selectedGate})
              </span>
              <h2 className="text-2xl font-bold text-slate-100 mt-2">
                {GENE_KEYS[selectedGate - 1]?.name || `Gate ${selectedGate}`}
              </h2>
            </div>

            {GENE_KEYS[selectedGate - 1] && (
              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sovereign Synthesis</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Gate {selectedGate} represents a specific energetic trait in your Human Design. When unconscious, it shows up as the shadow state of <strong className="text-rose-300">{GENE_KEYS[selectedGate - 1].shadow}</strong>. When embraced with awareness, it evolves into the gift of <strong className="text-emerald-300">{GENE_KEYS[selectedGate - 1].gift}</strong>.
                  </p>
                </div>

                <div className="p-[12px] rounded-xl bg-rose-950/30 border border-rose-500/30">
                  <span className="text-xs font-mono uppercase text-rose-400 font-bold">Shadow Frequency</span>
                  <p className="font-semibold text-rose-200 mt-0.5">{GENE_KEYS[selectedGate - 1].shadow}</p>
                </div>

                <div className="p-[12px] rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Gift Frequency</span>
                  <p className="font-semibold text-emerald-200 mt-0.5">{GENE_KEYS[selectedGate - 1].gift}</p>
                </div>

                <div className="p-[12px] rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <span className="text-xs font-mono uppercase text-amber-400 font-bold">Siddhi Frequency</span>
                  <p className="font-semibold text-amber-200 mt-0.5">{GENE_KEYS[selectedGate - 1].siddhi}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
