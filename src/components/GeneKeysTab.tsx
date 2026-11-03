import React, { useState } from "react";
import { Profile, HologeneticSphere } from "../types";
import { GENE_KEYS } from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { GeneKeysMapSVG } from "./GeneKeysMapSVG";
import { 
  Sparkles, 
  Search, 
  BookOpen, 
  Compass, 
  Heart, 
  Coins, 
  ChevronRight, 
  X, 
  HelpCircle, 
  Info, 
  Layers, 
  Zap, 
  Brain,
  Scale,
  Sun, 
  ShieldAlert, 
  Award, 
  Eye, 
  KeyRound,
  Filter,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface GeneKeysTabProps {
  profile: Profile;
}

export const GeneKeysTab: React.FC<GeneKeysTabProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<"profile" | "library">("profile");
  const [activeSequence, setActiveSequence] = useState<"activation" | "venus" | "pearl" | "all19">("activation");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<any | null>(null);
  const [selectedSphere, setSelectedSphere] = useState<{ sphere: any; keyData: any } | null>(null);
  const [filterCodon, setFilterCodon] = useState<string>("all");

  const comp = getProfileComputed(profile);
  const geneKeysData = comp.geneKeys;
  const hd = comp.humanDesign;
  const pers = hd?.personalityPositions || {};
  const des = hd?.designPositions || {};

  // 19 Primary Holographic Keys in Profile
  const all19KeysList = [
    { id: "lifesWork", name: "Life's Work (Genius)", pos: pers["Sun"] || { gate: 16, line: 1 }, sequence: "activation", desc: "Your primary creative expression, conscious gifts, and core purpose." },
    { id: "evolution", name: "Evolution", pos: pers["Earth"] || { gate: 9, line: 1 }, sequence: "activation", desc: "Your greatest challenge, shadow trigger, and growth soil." },
    { id: "radiance", name: "Radiance", pos: des["Sun"] || { gate: 49, line: 4 }, sequence: "activation", desc: "Your physical health, bodily vitality, and aura brilliance." },
    { id: "purpose", name: "Purpose", pos: des["Earth"] || { gate: 40, line: 4 }, sequence: "activation", desc: "Your deep soul stability and ancestral physical embodiment." },
    { id: "attraction", name: "Attraction (Relationship Field)", pos: des["Moon"] || { gate: 55, line: 3 }, sequence: "venus", desc: "The relationship field drawing karmic soul connections." },
    { id: "iq", name: "IQ (Mental Defense)", pos: pers["Venus"] || { gate: 63, line: 2 }, sequence: "venus", desc: "Intellectual defensive patterns and mental surrender." },
    { id: "eq", name: "EQ (Emotional Mind)", pos: pers["Mars"] || { gate: 37, line: 5 }, sequence: "venus", desc: "Emotional reactivity patterns and open-hearted compassion." },
    { id: "sq", name: "SQ (Spiritual Innocence)", pos: des["Venus"] || { gate: 22, line: 6 }, sequence: "venus", desc: "Core childhood innocence and link to divine grace." },
    { id: "coreWound", name: "Core Wound / Vocation", pos: des["Mars"] || { gate: 51, line: 1 }, sequence: "venus", desc: "Human collective wound transformed into your core calling." },
    { id: "vocation", name: "Vocation (Service)", pos: des["Mars"] || { gate: 51, line: 1 }, sequence: "pearl", desc: "How your Core Wound converts into practical creative service." },
    { id: "culture", name: "Culture (Group Synergy)", pos: des["Jupiter"] || { gate: 45, line: 2 }, sequence: "pearl", desc: "Your natural role in community, network, and collective flow." },
    { id: "brand", name: "Brand / Outer Expression", pos: pers["Sun"] || { gate: 16, line: 1 }, sequence: "pearl", desc: "The authentic frequency you broadcast outwardly into the world." },
    { id: "pearl", name: "The Pearl (Abundance)", pos: pers["Jupiter"] || { gate: 35, line: 4 }, sequence: "pearl", desc: "The harvest of your soul journey and effortless prosperity." },
    { id: "mindFilter", name: "Mind Filter (Conscious Mercury)", pos: pers["Mercury"] || { gate: 12, line: 1 }, sequence: "harmony", desc: "How your conscious mind communicates and filters truth." },
    { id: "bodyIntelligence", name: "Body Intelligence (Design Mercury)", pos: des["Mercury"] || { gate: 25, line: 3 }, sequence: "harmony", desc: "Unconscious bodily signals and somatic intelligence." },
    { id: "discipline", name: "Discipline & Boundaries (Conscious Saturn)", pos: pers["Saturn"] || { gate: 60, line: 5 }, sequence: "harmony", desc: "Conscious boundaries, structural order, and spiritual focus." },
    { id: "ancestralFoundation", name: "Ancestral Lineage (Design Saturn)", pos: des["Saturn"] || { gate: 52, line: 2 }, sequence: "harmony", desc: "Unconscious ancestral lineage memory and physical stillness." },
    { id: "destinyPath", name: "Destiny Trajectory (Conscious North Node)", pos: pers["North Node"] || { gate: 30, line: 4 }, sequence: "harmony", desc: "The future direction of your soul's growth trajectory." },
    { id: "pastMastery", name: "Past Mastery (Conscious South Node)", pos: pers["South Node"] || { gate: 29, line: 4 }, sequence: "harmony", desc: "Inherited wisdom and accumulated karmic mastery." },
  ];

  // Codon rings list
  const codonRings = Array.from(new Set(GENE_KEYS.map((k) => k.codon || "General"))).sort();

  // Filtered gene keys library
  const filteredKeys = GENE_KEYS.filter((key, idx) => {
    const keyNum = idx + 1;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      keyNum.toString().includes(q) ||
      key.name.toLowerCase().includes(q) ||
      key.shadow.toLowerCase().includes(q) ||
      key.gift.toLowerCase().includes(q) ||
      key.siddhi.toLowerCase().includes(q) ||
      (key.codon && key.codon.toLowerCase().includes(q));

    const matchesCodon = filterCodon === "all" || key.codon === filterCodon;

    return matchesSearch && matchesCodon;
  });

  // Spheres helper
  const getSphereKeyData = (keyNumber: number) => {
    return GENE_KEYS[keyNumber - 1] || GENE_KEYS[0];
  };

  const lineMeanings: Record<number, string> = {
    1: "Line 1 — Author / Foundation (Physical Root, Instability vs Grounding)",
    2: "Line 2 — Dancer / Passion (Natural Genius, Reaction vs Fluidity)",
    3: "Line 3 — Change Agent / Strategy (Humor, Trial & Error vs Mastery)",
    4: "Line 4 — Server / Community (Heart Connection, Isolation vs Influence)",
    5: "Line 5 — Leader / Practicality (Universal Projection, Pressure vs Leadership)",
    6: "Line 6 — Educator / Visionary (Surrender, Disconnection vs Embodiment)",
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1 uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>The Gene Keys Codex & Hologenetic Field</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            64 Gene Keys & Hologenetic Profile
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Explore your personal holographic sequence of evolution, love, and prosperity — or browse the complete 64 Gene Keys Codex with plain-English guides and deep esoteric mechanics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1.5 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            id="gene-keys-tab-profile-btn"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>My Hologenetic Profile</span>
          </button>

          <button
            id="gene-keys-tab-library-btn"
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "library"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>64 Codex Library</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MY HOLOGENETIC PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-8">
          {/* Interactive Gene Keys Hologenetic Map SVG */}
          <GeneKeysMapSVG profile={profile} />

          {/* Sequence Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              id="gene-keys-seq-activation-btn"
              onClick={() => setActiveSequence("activation")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activeSequence === "activation"
                  ? "bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-500/50 ring-2 ring-amber-500/20 shadow-lg shadow-amber-950/20"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-amber-400/80 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Genius (4 Spheres)
                </span>
              </div>
              <h3 className="text-base font-bold text-amber-200">Activation Sequence</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your Primary Genius · Life's Work, Evolution, Radiance & Purpose
              </p>
            </button>

            <button
              id="gene-keys-seq-venus-btn"
              onClick={() => setActiveSequence("venus")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activeSequence === "venus"
                  ? "bg-gradient-to-br from-rose-950/60 to-slate-900 border-rose-500/50 ring-2 ring-rose-500/20 shadow-lg shadow-rose-950/20"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Heart className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-rose-400/80 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/20">
                  Love (5 Spheres)
                </span>
              </div>
              <h3 className="text-base font-bold text-rose-200">Venus Sequence</h3>
              <p className="text-xs text-slate-400 mt-1">
                Unlocking the Heart · Attraction, Mind (IQ, EQ, SQ) & Core Wound
              </p>
            </button>

            <button
              id="gene-keys-seq-pearl-btn"
              onClick={() => setActiveSequence("pearl")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activeSequence === "pearl"
                  ? "bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/50 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/20"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Prosperity (4 Spheres)
                </span>
              </div>
              <h3 className="text-base font-bold text-emerald-200">Pearl Sequence</h3>
              <p className="text-xs text-slate-400 mt-1">
                Abundance & Contribution · Vocation, Culture, Brand & Pearl
              </p>
            </button>

            <button
              id="gene-keys-seq-all19-btn"
              onClick={() => setActiveSequence("all19")}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activeSequence === "all19"
                  ? "bg-gradient-to-br from-sky-950/60 to-slate-900 border-sky-500/50 ring-2 ring-sky-500/20 shadow-lg shadow-sky-950/20"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-sky-400/80 bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-500/20">
                  Harmony (19 Keys)
                </span>
              </div>
              <h3 className="text-base font-bold text-sky-200">All 19 Profile Keys</h3>
              <p className="text-xs text-slate-400 mt-1">
                Full Interactive Field · All 19 planetary gateways in your blueprint
              </p>
            </button>
          </div>

          {/* Sequence Detail Map */}
          {geneKeysData && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    activeSequence === "activation" ? "bg-amber-500/20 text-amber-400" :
                    activeSequence === "venus" ? "bg-rose-500/20 text-rose-400" :
                    activeSequence === "pearl" ? "bg-emerald-500/20 text-emerald-400" : "bg-sky-500/20 text-sky-400"
                  }`}>
                    {activeSequence === "activation" && <Brain className="w-6 h-6" />}
                    {activeSequence === "venus" && <Heart className="w-6 h-6" />}
                    {activeSequence === "pearl" && <Coins className="w-6 h-6" />}
                    {activeSequence === "all19" && <Scale className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold capitalize text-slate-100">
                      {activeSequence === "activation" ? "Genius (Activation) Sequence Pathway" :
                       activeSequence === "venus" ? "Love (Venus) Sequence Pathway" :
                       activeSequence === "pearl" ? "Prosperity (Pearl) Sequence Pathway" :
                       "Full 19 Interactive Profile Keys (Harmony)"}
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Click any key card to open plain-English frequency transmute guides & personal contemplation.
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive 19-key field active</span>
                </div>
              </div>

              {/* Sphere Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(activeSequence === "all19" 
                  ? all19KeysList 
                  : all19KeysList.filter(k => k.sequence === activeSequence)
                ).map((item) => {
                  const keyData = getSphereKeyData(item.pos.gate);
                  const mockSphere = {
                    name: item.name,
                    keyNumber: item.pos.gate,
                    line: item.pos.line,
                    sequence: item.sequence,
                    description: item.desc
                  };
                  return (
                    <div
                      key={item.id}
                      id={`profile-key-card-${item.id}`}
                      onClick={() => setSelectedSphere({ sphere: mockSphere, keyData })}
                      className="group bg-slate-950/60 border border-slate-800/90 hover:border-amber-500/50 rounded-2xl p-5 transition-all cursor-pointer hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 relative flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                            Key #{item.pos.gate}.{item.pos.line}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                        </div>

                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-rose-400/80 font-medium">Shadow:</span>
                          <span className="font-semibold text-rose-300">{keyData.shadow}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-emerald-400/80 font-medium">Gift:</span>
                          <span className="font-semibold text-emerald-300">{keyData.gift}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400">
                          <span className="text-amber-400/80 font-medium">Siddhi:</span>
                          <span className="font-semibold text-amber-300">{keyData.siddhi}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 64 CODEX LIBRARY */}
      {activeTab === "library" && (
        <div className="space-y-6">
          {/* Controls: Search and Filters */}
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="gene-key-search-input"
                type="text"
                placeholder="Search key #, name, shadow, gift, siddhi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Codon Ring Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                id="codon-ring-filter"
                value={filterCodon}
                onChange={(e) => setFilterCodon(e.target.value)}
                className="w-full md:w-60 bg-slate-950/80 border border-slate-800 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">All Codon Rings (64 Keys)</option>
                {codonRings.map((codon) => (
                  <option key={codon} value={codon}>
                    Ring of {codon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Library Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredKeys.map((key) => {
              const keyIndex = GENE_KEYS.indexOf(key) + 1;
              return (
                <div
                  key={keyIndex}
                  id={`gene-key-card-${keyIndex}`}
                  onClick={() => setSelectedKey({ ...key, number: keyIndex })}
                  className="group bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-5 transition-all cursor-pointer hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                        Gene Key #{keyIndex}
                      </span>
                      {key.codon && (
                        <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                          {key.codon}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors mt-2">
                      {key.name || `Gene Key ${keyIndex}`}
                    </h3>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-rose-400/90 font-medium">Shadow</span>
                        <span className="text-slate-200 font-semibold">{key.shadow}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-emerald-400/90 font-medium">Gift</span>
                        <span className="text-slate-200 font-semibold">{key.gift}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-amber-400/90 font-medium">Siddhi</span>
                        <span className="text-slate-200 font-semibold">{key.siddhi}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-400 transition-colors">
                    <span>Inspect Codex</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredKeys.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-300">No Gene Keys Found</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms or filter selection.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCodon("all");
                }}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: GENE KEY CODEX INSPECTOR */}
      {selectedKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative space-y-6">
            <button
              id="close-gene-key-modal-btn"
              onClick={() => setSelectedKey(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                  Gene Key #{selectedKey.number}
                </span>
                {selectedKey.codon && (
                  <span className="text-xs text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                    Codon Ring of {selectedKey.codon}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
                {selectedKey.name || `Gene Key ${selectedKey.number}`}
              </h2>
            </div>

            {/* Frequency Triad Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
                <div className="text-xs font-mono uppercase text-rose-400 font-semibold mb-1">Shadow</div>
                <div className="text-lg font-bold text-rose-200">{selectedKey.shadow}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                  {selectedKey.shadowDesc || "Fear-based contraction pattern of the reactive or repressive mind."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                <div className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-1">Gift</div>
                <div className="text-lg font-bold text-emerald-200">{selectedKey.gift}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                  {selectedKey.giftDesc || "Creative genius unlocked through awareness and non-judgmental embrace."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold mb-1">Siddhi</div>
                <div className="text-lg font-bold text-amber-200">{selectedKey.siddhi}</div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                  {selectedKey.siddhiDesc || "Divine realization state when self-identity dissolves into pure presence."}
                </p>
              </div>
            </div>

            {/* Sovereign Synthesis */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Sovereign Synthesis</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                When operating at the <strong className="text-rose-300">Shadow ({selectedKey.shadow})</strong>, you might feel stuck in contraction or fear. This is completely normal and human. The secret of Gene Key #{selectedKey.number} is that the Shadow is not a flaw — it is the exact fuel for your personal growth.
              </p>
              <p className="text-xs text-slate-200 leading-relaxed">
                By acknowledging this feeling without self-criticism, your frequency naturally elevates into the <strong className="text-emerald-300">Gift ({selectedKey.gift})</strong>, where your natural talent blossoms and inspires others.
              </p>
            </div>

            {/* How This Translates to You */}
            <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>How This Translates to {name}</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                For you, {name}, Gene Key #{selectedKey.number} ({selectedKey.name}) is a core pillar of your genetic blueprint. When you catch yourself slipping into {selectedKey.shadow.toLowerCase()}, pause and remind yourself that you hold the innate ability to express {selectedKey.gift.toLowerCase()} in your daily life.
              </p>
            </div>

            {/* Contemplation Prompt */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold uppercase text-amber-300 tracking-wider">Daily Contemplation Practice</h5>
                <p className="text-xs text-slate-300 mt-1">
                  "Where in my life am I resisting {selectedKey.shadow.toLowerCase()}? How can I invite {selectedKey.gift.toLowerCase()} into my daily routine today?"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HOLOGENETIC SPHERE INSPECTOR */}
      {selectedSphere && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative space-y-6">
            <button
              id="close-sphere-modal-btn"
              onClick={() => setSelectedSphere(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                Sphere: {selectedSphere.sphere.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
                Gene Key #{selectedSphere.sphere.keyNumber}.{selectedSphere.sphere.line} — {selectedSphere.keyData.name}
              </h2>
            </div>

            {/* Line Meaning */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200">
              <span className="font-bold">Line Expression: </span>
              {lineMeanings[selectedSphere.sphere.line] || `Line ${selectedSphere.sphere.line}`}
            </div>

            {/* Triad */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <span className="text-[10px] uppercase font-mono text-rose-400">Shadow</span>
                <p className="font-bold text-rose-200 text-sm mt-1">{selectedSphere.keyData.shadow}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-mono text-emerald-400">Gift</span>
                <p className="font-bold text-emerald-200 text-sm mt-1">{selectedSphere.keyData.gift}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span className="text-[10px] uppercase font-mono text-amber-400">Siddhi</span>
                <p className="font-bold text-amber-200 text-sm mt-1">{selectedSphere.keyData.siddhi}</p>
              </div>
            </div>

            {/* Sovereign Synthesis */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <h4 className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Sovereign Synthesis</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                The {selectedSphere.sphere.name} sphere anchors a specific aspect of your consciousness. When unintegrated, it triggers the shadow of <strong className="text-rose-300">{selectedSphere.keyData.shadow}</strong>. When embraced, it unfolds into the gift of <strong className="text-emerald-300">{selectedSphere.keyData.gift}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
              <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>How This Translates to {name}</span>
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                For you, {name}, this sphere governs {selectedSphere.sphere.description.toLowerCase()} expressing through Line {selectedSphere.sphere.line}. Focus on shifting from {selectedSphere.keyData.shadow.toLowerCase()} into {selectedSphere.keyData.gift.toLowerCase()} in your daily interactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
