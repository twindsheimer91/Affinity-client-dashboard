import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Briefcase, 
  Users, 
  Sparkles, 
  Download, 
  Flame, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Compass, 
  ArrowRight, 
  RefreshCw,
  Plus,
  MessageSquare,
  BookOpen,
  HelpCircle,
  Search,
  UserCheck,
  AlertTriangle,
  Sun,
  Brain,
  X
} from "lucide-react";
import { Profile, RelationshipCategory, RelationshipSynergyResult, CompareCandidate } from "../types";
import { calculateBlueprint, getProfileComputed } from "../utils/calculations";
import { calculateRelationshipSynergy } from "../utils/synastryCalculator";
import { downloadRelationshipSynergyPDF } from "../utils/pdfGenerator";
import { BlendedSynergyChartSVG } from "./BlendedSynergyChartSVG";
import { GENE_KEYS } from "../data/knowledge";

interface RelationshipCompareTabProps {
  currentProfile: Profile;
  token?: string | null;
}

export default function RelationshipCompareTab({
  currentProfile,
  token,
}: RelationshipCompareTabProps) {
  const [category, setCategory] = useState<RelationshipCategory>("partner");
  
  // Person 1 (default to active profile)
  const [profileA, setProfileA] = useState<Profile>(currentProfile);
  
  // Person 2
  const [profileB, setProfileB] = useState<Profile | null>(null);

  // Available compare candidates fetched from server (all registered users, usernames & subjects)
  const [candidates, setCandidates] = useState<CompareCandidate[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [person2SearchQuery, setPerson2SearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Manual entry modal or form
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualFirstName, setManualFirstName] = useState("");
  const [manualLastName, setManualLastName] = useState("");
  const [manualDob, setManualDob] = useState("");
  const [manualTob, setManualTob] = useState("12:00");
  const [manualPob, setManualPob] = useState("");

  // AI Synergy reading state
  const [elaReading, setElaReading] = useState<string | null>(null);
  const [loadingEla, setLoadingEla] = useState(false);

  // Fetch available compare candidates (all users, usernames, and guest profiles)
  useEffect(() => {
    setLoadingCandidates(true);
    fetch("/api/profiles/compare-candidates")
      .then((res) => res.json())
      .then((data) => {
        if (data.candidates && Array.isArray(data.candidates)) {
          setCandidates(data.candidates);
          // Do not auto-compare: let profileB remain null by default for singular view
        }
      })
      .catch((err) => console.error("Error fetching compare candidates", err))
      .finally(() => setLoadingCandidates(false));
  }, [currentProfile]);

  // Update profileA if currentProfile changes
  useEffect(() => {
    setProfileA(currentProfile);
  }, [currentProfile]);

  // Active Profile B is only what the user explicitly chooses
  const activeProfileB = profileB;

  // Filter candidates matching search query as user types
  const filteredCandidates = candidates.filter((c) => {
    if (!person2SearchQuery.trim()) return true;
    const q = person2SearchQuery.toLowerCase().trim();
    const matchName = c.name.toLowerCase().includes(q);
    const matchUser = c.username ? c.username.toLowerCase().includes(q) : false;
    const matchDob = c.dateOfBirth.includes(q);
    return matchName || matchUser || matchDob;
  });

  // Calculate synergy matrix only if activeProfileB exists
  const synergy: RelationshipSynergyResult | null = activeProfileB 
    ? calculateRelationshipSynergy(profileA, activeProfileB, category)
    : null;

  // Attach elaReading if fetched
  if (synergy && elaReading) {
    synergy.elaSynthesis = elaReading;
  }

  // Handle manual profile creation
  const handleSaveManualPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualFirstName.trim() || !manualDob) return;

    const computed = calculateBlueprint(
      manualFirstName.trim(),
      manualLastName.trim(),
      manualDob,
      manualTob || "12:00",
      manualPob.trim()
    );

    const newPerson: Profile = {
      firstName: manualFirstName.trim(),
      lastName: manualLastName.trim(),
      dateOfBirth: manualDob,
      timeOfBirth: manualTob || "12:00",
      placeOfBirth: manualPob.trim(),
      computed,
    };

    setProfileB(newPerson);
    setShowManualForm(false);

    // Also persist to guest subjects in background so it can be re-used
    try {
      await fetch("/api/profiles/guest-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: newPerson }),
      });
      setCandidates((prev) => [
        {
          id: crypto.randomUUID(),
          name: `${newPerson.firstName} ${newPerson.lastName}`.trim(),
          dateOfBirth: newPerson.dateOfBirth,
          source: "Inputted Subject",
          profile: newPerson,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error persisting guest person", err);
    }
  };

  // Call Ela AI for Deep Synergy Synthesis
  const handleAskElaSynergy = async () => {
    if (!activeProfileB) return;
    setLoadingEla(true);
    setElaReading(null);
    try {
      const res = await fetch("/api/gemini/synergy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileA,
          profileB: activeProfileB,
          category,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI synergy reading");
      setElaReading(data.synergyAnalysis);
    } catch (err: any) {
      console.error("Ela synergy error:", err);
      setElaReading("Ela could not connect to the quantum stream right now. Please try again in a moment.");
    } finally {
      setLoadingEla(false);
    }
  };

  const compA = getProfileComputed(profileA);
  const compB = activeProfileB ? getProfileComputed(activeProfileB) : null;

  return (
    <div className="space-y-8 animate-fade-in pb-16" id="relationship-compare-container">
      {/* HEADER BANNER WITH AFFINITY LIFESTYLE CONSULTING BRANDING */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-purple-950/30 to-slate-950/60 border border-teal-500/25 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
                alt="Affinity Lifestyle Consulting" 
                className="h-10 md:h-12 w-auto object-contain bg-white/95 p-1 rounded-xl border border-teal-500/30 shadow-md"
              />
              <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
                Affinity Lifestyle Consulting
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-wide">
              Relationship Synergy Matrix
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore how two sovereign souls interact across Human Design electromagnetic bridges, astrological synastry, psychological blend, and longevity dynamics in clear, plain English.
            </p>
          </div>

          {/* Action buttons (Synergy PDF download when comparing, or Singular status indicator) */}
          <div className="flex flex-wrap items-center gap-3">
            {activeProfileB && synergy ? (
              <>
                <button
                  onClick={() => downloadRelationshipSynergyPDF(profileA, activeProfileB, synergy)}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Synergy PDF</span>
                </button>

                <button
                  onClick={() => {
                    setProfileB(null);
                    setPerson2SearchQuery("");
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-500/60 font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  title="Switch to Singular View"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>Do Not Compare (Singular View)</span>
                </button>
              </>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs flex items-center gap-2 shadow-sm">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Singular Chart View Active</span>
              </div>
            )}
          </div>
        </div>

        {/* RELATIONSHIP CONTEXT SELECTOR */}
        <div className="mt-6 pt-6 border-t border-teal-500/15 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Select Interaction Context:
          </span>
          <div className="flex rounded-xl bg-slate-950 p-1 border border-teal-500/20 shadow-inner">
            <button
              onClick={() => setCategory("partner")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                category === "partner"
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${category === "partner" ? "text-rose-400 fill-rose-400/20" : ""}`} />
              <span>Partner / Romantic</span>
            </button>
            <button
              onClick={() => setCategory("coworker")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                category === "coworker"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Coworker / Business</span>
            </button>
            <button
              onClick={() => setCategory("friend")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                category === "friend"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friendship / Ally</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO PROFILES COMPARISON CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile 1 */}
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-teal-500/30 space-y-4 shadow-xl relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
              Person 1 (Your Profile)
            </span>
            <span className="text-xs font-mono text-slate-400">
              {compA.humanDesign.type}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {profileA.firstName} {profileA.lastName}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              DOB: {profileA.dateOfBirth} • {compA.astrology.sunSign} Sun / {compA.astrology.moonSign} Moon
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Life Path</span>
              <span className="font-bold text-teal-300 text-sm">{compA.numerology.lifePath}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Authority</span>
              <span className="font-bold text-teal-300 text-sm truncate block">{compA.humanDesign.authority}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Aura Hz</span>
              <span className="font-bold text-teal-300 text-sm">{compA.aura.frequency}Hz</span>
            </div>
          </div>
        </div>

        {/* Profile 2 (Select or Enter) */}
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-4 shadow-xl relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              Person 2 ({category.toUpperCase()})
            </span>
            
            {/* Quick person selector toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-all font-mono flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{showManualForm ? "Select Existing" : "Custom Person"}</span>
              </button>
            </div>
          </div>

          {showManualForm ? (
            <form onSubmit={handleSaveManualPerson} className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={manualFirstName}
                  onChange={(e) => setManualFirstName(e.target.value)}
                  className="cosmic-input text-xs w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={manualLastName}
                  onChange={(e) => setManualLastName(e.target.value)}
                  className="cosmic-input text-xs w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={manualDob}
                  onChange={(e) => setManualDob(e.target.value)}
                  className="cosmic-input text-xs w-full"
                  required
                />
                <input
                  type="time"
                  value={manualTob}
                  onChange={(e) => setManualTob(e.target.value)}
                  className="cosmic-input text-xs w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Place of Birth (City, Country)"
                value={manualPob}
                onChange={(e) => setManualPob(e.target.value)}
                className="cosmic-input text-xs w-full"
              />
              <button
                type="submit"
                className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl transition-all shadow-md"
              >
                Calculate & Compare Person
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {/* Live Autocomplete Search Input for Person 2 */}
              <div className="relative">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Choose Profile for Person 2 (Auto-generates as you type):
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={person2SearchQuery}
                    onChange={(e) => {
                      setPerson2SearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Type name, username (@user), or DOB..."
                    className="cosmic-input text-xs w-full pl-8 pr-8 py-2 border-purple-500/40 focus:border-purple-400"
                  />
                  {person2SearchQuery && (
                    <button
                      onClick={() => setPerson2SearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Dropdown list of matching candidates */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-xl bg-slate-950/95 border border-purple-500/40 shadow-2xl backdrop-blur-xl divide-y divide-slate-800">
                    {/* Top Pinned: Do Not Compare Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setProfileB(null);
                        setPerson2SearchQuery("");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full p-2.5 text-left bg-rose-950/30 hover:bg-rose-900/40 flex items-center justify-between gap-3 transition-colors text-xs border-b border-rose-500/20 text-rose-300 font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <X className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-semibold">✦ Do Not Compare (Singular Chart View)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Reset</span>
                    </button>

                    {loadingCandidates ? (
                      <div className="p-3 text-center text-xs text-slate-400">Loading candidate profiles...</div>
                    ) : filteredCandidates.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400">
                        No matches found for &quot;{person2SearchQuery}&quot;. Click &quot;Custom Person&quot; above to add.
                      </div>
                    ) : (
                      filteredCandidates.map((cand) => (
                        <button
                          key={cand.id}
                          type="button"
                          onClick={() => {
                            setProfileB(cand.profile);
                            setIsDropdownOpen(false);
                            setPerson2SearchQuery(cand.name);
                          }}
                          className="w-full p-2.5 text-left hover:bg-purple-500/15 flex items-center justify-between gap-3 transition-colors text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white truncate">{cand.name}</span>
                              {cand.username && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  @{cand.username}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              DOB: {cand.dateOfBirth} • {cand.source}
                            </span>
                          </div>
                          <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Active Profile B Summary Card or Singular State */}
              {activeProfileB && compB ? (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          {activeProfileB.firstName} {activeProfileB.lastName}
                        </h2>
                        <p className="text-xs text-slate-400 font-mono">
                          DOB: {activeProfileB.dateOfBirth} • {compB.astrology.sunSign} Sun / {compB.astrology.moonSign} Moon
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-purple-300 px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                          {compB.humanDesign.type}
                        </span>
                        <button
                          onClick={() => {
                            setProfileB(null);
                            setPerson2SearchQuery("");
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Do Not Compare (Reset to Singular View)"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Life Path</span>
                      <span className="font-bold text-purple-300 text-sm">{compB.numerology.lifePath}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Authority</span>
                      <span className="font-bold text-purple-300 text-sm truncate block">{compB.humanDesign.authority}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-mono">Aura Hz</span>
                      <span className="font-bold text-purple-300 text-sm">{compB.aura.frequency}Hz</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-dashed border-purple-500/30 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-purple-200">Singular Mode Active</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Compare charts start off singular. Search above to choose a partner, friend, or colleague, or remain in singular view.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONDITIONAL RENDER: COMPARISON VS SINGULAR CHART */}
      {activeProfileB && synergy && compB ? (
        <>
          {/* ARTISTIC BLENDED SYNERGY CHART */}
          <BlendedSynergyChartSVG 
            profileA={profileA} 
            profileB={activeProfileB} 
            synergy={synergy} 
          />

      {/* CORE SYNERGY DASHBOARD: LONGEVITY & RESONANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Longevity Index Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-teal-500/25 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                Connection Longevity
              </span>
              <ShieldAlert className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">{synergy.longevityScore}%</span>
              <span className="text-xs text-teal-300 font-medium">Sustainable Horizon</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${synergy.longevityScore}%` }} 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
            Grounded in elemental harmony ({synergy.elementalHarmony.title}), electromagnetic channel anchoring, and balanced energetic endurance.
          </p>
        </div>

        {/* Resonance & Chemistry */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/25 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
                Resonance & Spark
              </span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white font-mono">{synergy.resonanceScore}%</span>
              <span className="text-xs text-purple-300 font-medium">Kinetic Resonance</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-rose-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${synergy.resonanceScore}%` }} 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
            Driven by {synergy.electromagneticBridges.length} electromagnetic channel completions and magnetic auric alignment.
          </p>
        </div>

        {/* Overarching Dynamic */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-teal-500/25 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                Interaction Archetype
              </span>
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
            <div className="mt-3">
              <h3 className="text-base font-bold text-teal-200">
                {synergy.interactionDynamic}
              </h3>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
            {synergy.dynamicSummary}
          </p>
        </div>
      </div>

      {/* 1. RELATIONAL ALCHEMY & DYNAMICS SYNTHESIS */}
      {synergy.basicPlainEnglishTranslation && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/30 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                Relational Alchemy & Behavioral Synthesis
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {synergy.basicPlainEnglishTranslation.headline}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-xs md:text-sm text-teal-100 font-medium leading-relaxed">
            <strong className="text-teal-300 block mb-1 uppercase font-mono text-[11px]">Core Resonance Verdict:</strong>
            {synergy.basicPlainEnglishTranslation.verdict}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* How You Get Along */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-bold font-mono text-xs">
                <Heart className="w-4 h-4 text-teal-400" />
                <span>How You Get Along</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {synergy.basicPlainEnglishTranslation.howYouGetAlong}
              </p>
            </div>

            {/* Why You Fight & How to Fix It */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold font-mono text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Why You Fight &amp; Fix</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {synergy.basicPlainEnglishTranslation.howYouFightAndHowToFixIt}
              </p>
            </div>

            {/* Longevity Outlook */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-bold font-mono text-xs">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Longevity Outlook</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {synergy.basicPlainEnglishTranslation.longevityOutlook}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONALITY & PSYCHOMETRICS BLEND: TOXICITY VS HARMONY GAUGE */}
      {synergy.personalityPsychometricsBlend && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-purple-500/30 space-y-6 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                  Psychometric &amp; Personality Blend
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {synergy.personalityPsychometricsBlend.blendTitle}
                </h2>
              </div>
            </div>

            {/* Toxicity vs Harmony Risk Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Toxicity Assessment:</span>
              <span className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 shadow-sm ${
                synergy.personalityPsychometricsBlend.toxicityColor === "emerald"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                  : synergy.personalityPsychometricsBlend.toxicityColor === "amber"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                  : "bg-rose-500/15 text-rose-300 border-rose-500/40 animate-pulse"
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{synergy.personalityPsychometricsBlend.toxicityRiskLevel}</span>
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {synergy.personalityPsychometricsBlend.blendSummary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personality Compliments */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs">
              <span className="text-xs font-bold text-emerald-300 font-mono uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Complementary Strengths (How You Blend)</span>
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.personalityPsychometricsBlend.compliments.map((comp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personality Contrasts */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2 text-xs">
              <span className="text-xs font-bold text-purple-300 font-mono uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Friction Points &amp; Personality Contrasts</span>
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.personalityPsychometricsBlend.contrasts.map((contra, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Toxic Pitfalls To Avoid */}
          <div className="p-4 rounded-2xl bg-rose-950/25 border border-rose-500/35 space-y-2 text-xs">
            <span className="text-xs font-bold text-rose-300 font-mono uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Toxic Pitfalls &amp; Negative Feedback Loops to Avoid</span>
            </span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-200">
              {synergy.personalityPsychometricsBlend.toxicTriggersToAvoid.map((trigger, i) => (
                <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-rose-950/30 border border-rose-900/50">
                  <span className="text-rose-400 font-bold">⚠</span>
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300">
            <strong className="text-purple-300 font-mono block mb-1">Plain-English Psychometrics Takeaway:</strong>
            <p>{synergy.personalityPsychometricsBlend.plainEnglishTranslation}</p>
          </div>
        </div>
      )}

      {/* 3. BIRTH CHARTS & ASTROLOGY: COMPLIMENTS & CONTRASTS */}
      {synergy.astrologyComplimentsContrasts && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-amber-500/25 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                Astrological Synastry &amp; Natal Charts
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Birth Charts: Compliments &amp; Contrasts
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold text-amber-300 font-mono uppercase block">
                ✨ Celestial Compliments:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.astrologyComplimentsContrasts.compliments.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-2">
              <span className="text-xs font-bold text-amber-300 font-mono uppercase block">
                ⚡ Dynamic Contrasts:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.astrologyComplimentsContrasts.contrasts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300">
            <strong className="text-amber-300 font-mono block mb-1">Plain-English Astrological Translation:</strong>
            <p>{synergy.astrologyComplimentsContrasts.plainEnglishTranslation}</p>
          </div>
        </div>
      )}

      {/* 4. HUMAN DESIGN & GENE KEYS: COMPLIMENTS & CONTRASTS */}
      {synergy.humanDesignGeneKeysComplimentsContrasts && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/25 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                Energetic Blueprints &amp; Gene Keys
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Human Design &amp; Gene Keys: Compliments &amp; Contrasts
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/20 space-y-2">
              <span className="text-xs font-bold text-teal-300 font-mono uppercase block">
                🌱 Energetic Compliments &amp; Gifts:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.humanDesignGeneKeysComplimentsContrasts.compliments.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/20 space-y-2">
              <span className="text-xs font-bold text-teal-300 font-mono uppercase block">
                🧭 Contrasting Mechanics &amp; Shadow Friction:
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {synergy.humanDesignGeneKeysComplimentsContrasts.contrasts.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-teal-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300">
            <strong className="text-teal-300 font-mono block mb-1">Plain-English Blueprint Translation:</strong>
            <p>{synergy.humanDesignGeneKeysComplimentsContrasts.plainEnglishTranslation}</p>
          </div>
        </div>
      )}

      {/* HUMAN DESIGN ELECTROMAGNETIC BRIDGES (HOW YOU INTERACT) */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-teal-500/20 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-teal-400 font-mono uppercase font-bold tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Quantum Channel Completions</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Electromagnetic Bridges ({synergy.electromagneticBridges.length} Active)
            </h2>
            <p className="text-xs text-slate-400">
              When one person carries Gate A and the other carries Gate B, an electric bridge is formed where neither can create this energy in isolation.
            </p>
          </div>
        </div>

        {synergy.electromagneticBridges.length === 0 ? (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-300 font-medium">No direct electromagnetic gate hookups found.</p>
            <p className="text-[11px] text-slate-500">
              Your relationship is defined more by companionship channels and calm, non-volatile companionship rather than turbulent magnetic hookups.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synergy.electromagneticBridges.map((bridge, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/25 space-y-2.5 shadow-md hover:border-teal-400/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 font-mono">
                    {bridge.channelName}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/30">
                    Electromagnetic
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">
                  Theme: {bridge.keyTheme}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {bridge.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Defined vs Undefined Centers Conditioning Map */}
        <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-200">
            Center Interplay & Conditioning Flows
          </h3>
          <p className="text-xs text-slate-400">
            Where one has a Defined center (broadcaster) and the other has an Undefined center (receiver/amplifier):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {synergy.centersInterplay.slice(0, 6).map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.center}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    item.interactionType === "Conditioning Flow" 
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      : item.interactionType === "Mutual Definition"
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}>
                    {item.interactionType}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {item.guidance}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FIGHTING STYLES, SHADOW CLASHES & TRIGGER POINTS */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-rose-500/25 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Fighting Styles & Shadow Clashes
            </h2>
            <p className="text-xs text-slate-400">
              Understanding each other's defensive biology prevents emotional casualties and transforms conflict into sacred deepening.
            </p>
          </div>
        </div>

        {/* Two Fighting Styles Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold block">
              {profileA.firstName}&apos;s Reactive / Defense Style
            </span>
            <h4 className="text-sm font-bold text-white">
              {synergy.fightingStyles.p1StyleName}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {synergy.fightingStyles.p1Description}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300 font-bold block">
              {activeProfileB.firstName}&apos;s Reactive / Defense Style
            </span>
            <h4 className="text-sm font-bold text-white">
              {synergy.fightingStyles.p2StyleName}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {synergy.fightingStyles.p2Description}
            </p>
          </div>
        </div>

        {/* Clash Triggers & Shadow Hooks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono block">
              ⚡ Primary Clash Triggers:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {synergy.fightingStyles.coreClashTriggers.map((trig, i) => (
                <li key={i}>{trig}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-mono block">
              🌑 Gene Key Shadow Hooks:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {synergy.fightingStyles.shadowHooks.map((sh, i) => (
                <li key={i}>{sh}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* De-escalation Blueprint */}
        <div className="p-4 md:p-5 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-2">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>THE SACRED DE-ESCALATION BLUEPRINT (CIRCUIT BREAKER)</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {synergy.fightingStyles.deEscalationBlueprint}
          </p>
        </div>
      </div>

      {/* CHEAT SHEET TO BETTERING THE RELATIONSHIP */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-emerald-500/25 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Cheat Sheet for Bettering the Relationship
            </h2>
            <p className="text-xs text-slate-400">
              Turnkey communication scripts, proven dos and don&apos;ts, and precise appreciation languages.
            </p>
          </div>
        </div>

        {/* Communication Scripts */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            High-Impact Communication Scripts:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {synergy.cheatSheet.communicationScripts.map((scr, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                <span className="font-bold text-teal-300 block">{scr.situation}</span>
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold block">✓ Say This:</span>
                  <p className="text-slate-200 italic">&ldquo;{scr.whatToSay}&rdquo;</p>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-rose-400 uppercase font-mono font-bold block">✗ Avoid This:</span>
                  <p className="text-slate-400 text-[11px]">&ldquo;{scr.whatToAvoid}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vital Relationship Dos</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {synergy.cheatSheet.vitalDos.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Vital Relationship Don&apos;ts</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {synergy.cheatSheet.vitalDonts.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Appreciation blueprint */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <strong className="text-teal-300 font-mono block mb-1">Appreciation & Recognition Language:</strong>
          <p>{synergy.cheatSheet.appreciationBlueprint}</p>
        </div>
      </div>

      {/* WORK ON SELF VS WORK TOGETHER (SOVEREIGN FULFILLMENT DIVISION) */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-950/70 border border-teal-500/25 space-y-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-teal-400 font-mono uppercase font-bold tracking-wider">
            <Compass className="w-4 h-4" />
            <span>The Fulfillment Division</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Things to Work on: Self vs Together
          </h2>
          <p className="text-xs text-slate-400">
            True harmony is born when both people take 100% responsibility for their inner sovereign light, never burdening the relationship to fix their internal voids.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work on Self */}
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                Work on Self (Individual Sovereignty)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              {synergy.growthWork.workOnSelf.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-indigo-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Work Together */}
          <div className="p-6 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-4">
            <div className="flex items-center gap-2 text-teal-300">
              <Users className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
                Work Together (Relational Growth)
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-300">
              {synergy.growthWork.workTogether.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span className="text-teal-400 font-mono font-bold shrink-0">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ELA DEEP AI ORACLE SYNERGY SYNTHESIS */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-950/30 via-slate-950 to-teal-950/30 border border-purple-500/30 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>ELA QUANTUM RELATIONSHIP ORACLE</span>
            </div>
            <h3 className="text-xl font-bold text-white font-serif">
              Ela Deep Relationship Synthesis
            </h3>
            <p className="text-xs text-slate-400">
              Generate an in-depth AI oracle reading tailored specifically to {profileA.firstName} and {activeProfileB.firstName}&apos;s combined celestial blueprints.
            </p>
          </div>

          <button
            onClick={handleAskElaSynergy}
            disabled={loadingEla}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 shrink-0"
          >
            {loadingEla ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Weaving Cosmic Currents...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{elaReading ? "Regenerate Ela's Reading" : "Ask Ela to Analyze Connection"}</span>
              </>
            )}
          </button>
        </div>

        {elaReading && (
          <div className="mt-4 p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-xs md:text-sm text-slate-200 leading-relaxed space-y-4 shadow-inner whitespace-pre-line animate-fade-in font-serif">
            {elaReading}
          </div>
        )}
      </div>
    </>
      ) : (
        /* SINGULAR CHART VIEW: DEDICATED SOVEREIGN READOUT */
        <div className="space-y-8 animate-fade-in">
          {/* Singular Hero Notice */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-teal-950/30 via-slate-900 to-indigo-950/30 border border-teal-500/20 text-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-300">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-serif text-white">
              Singular Energy Matrix: {profileA.firstName} {profileA.lastName}
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              You are currently viewing your singular blueprint. All comparison charts start off singular to honor each soul&apos;s distinct mechanics first. Whenever you wish to explore a relationship, choose a connection above.
            </p>
          </div>

          {/* Core Archetype Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-teal-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">Human Design</span>
              <p className="text-lg font-bold text-white">{compA.humanDesign.type}</p>
              <p className="text-xs text-slate-400 font-mono">Authority: {compA.humanDesign.authority}</p>
              <p className="text-xs text-teal-300 font-mono">Profile: {compA.humanDesign.profile}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">Gene Keys Genius</span>
              <p className="text-lg font-bold text-white">Gate {compA.geneKeys.lifesWork.keyNumber}.{compA.geneKeys.lifesWork.line}</p>
              <p className="text-xs text-slate-400">Gift: <span className="text-amber-300 font-bold">{GENE_KEYS[compA.geneKeys.lifesWork.keyNumber - 1]?.gift || "Sovereignty"}</span></p>
              <p className="text-xs text-slate-400">Siddhi: <span className="text-teal-300 font-bold">{GENE_KEYS[compA.geneKeys.lifesWork.keyNumber - 1]?.siddhi || "Awakening"}</span></p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-sky-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">Astrological Trinity</span>
              <p className="text-lg font-bold text-white">{compA.astrology.sunSign} Sun</p>
              <p className="text-xs text-slate-400">{compA.astrology.moonSign} Moon</p>
              <p className="text-xs text-sky-300 font-mono">{compA.astrology.risingSign} Rising (Ascendant)</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Numerology &amp; Aura</span>
              <p className="text-lg font-bold text-white">Life Path {compA.numerology.lifePath}</p>
              <p className="text-xs text-slate-400">Frequency: <span className="text-purple-300 font-bold font-mono">{compA.aura.frequency}Hz</span></p>
              <p className="text-xs text-slate-400">Hawkins: <span className="text-teal-300 font-bold font-mono">{compA.aura.consciousnessScale}</span></p>
            </div>
          </div>

          {/* Defined vs Open Centers Snapshot */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-5">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Somatic Energy Centers Mechanics</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {["Head", "Ajna", "Throat", "G/Self", "Heart/Ego", "Sacral", "Solar Plexus", "Spleen", "Root"].map((center) => {
                const isDefined = (compA.humanDesign.definedCenters || []).includes(center);
                return (
                  <div 
                    key={center} 
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDefined 
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-200" 
                        : "bg-slate-900/50 border-slate-800 text-slate-400"
                    }`}
                  >
                    <span className="font-semibold">{center} Center</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isDefined ? "bg-teal-500/20 text-teal-300" : "bg-slate-800 text-slate-400"
                    }`}>
                      {isDefined ? "Defined (Consistent)" : "Open (Receptive)"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

