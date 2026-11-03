import React, { useState, useEffect } from "react";
import { Profile, GeneKeysData, AmbiRecord } from "../types";
import { 
  GENE_KEYS, 
  LIFE_PATH_KNOWLEDGE, 
  NUMBER_KNOWLEDGE, 
  ZODIAC_KNOWLEDGE, 
  PLANET_KNOWLEDGE, 
  AURA_KNOWLEDGE, 
  HD_TYPE_KNOWLEDGE 
} from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { downloadProfileFullDossierPDF, downloadBlankTestQuestionsPDF, downloadEditablePsychometricPDF, downloadEditableMbtiPDF } from "../utils/pdfGenerator";
import { DossierPreviewModal } from "./DossierPreviewModal";
import { 
  FileText, 
  Printer, 
  Download, 
  Check, 
  Layers, 
  KeyRound, 
  Star, 
  Compass, 
  Sun, 
  BookOpen, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Award,
  ChevronDown,
  ChevronUp,
  Zap,
  Heart,
  Flame,
  Brain,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  Eye
} from "lucide-react";

interface FullLifeReportProps {
  profile: Profile;
  token?: string;
  onNavigate?: (tab: string) => void;
}

export const FullLifeReport: React.FC<FullLifeReportProps> = ({ profile, token, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [ambiHistory, setAmbiHistory] = useState<AmbiRecord[]>([]);
  const [loadingAmbi, setLoadingAmbi] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hd: true,
    gk: true,
    num: true,
    astro: true,
    aura: true,
    ambi: true,
    synthesis: true,
  });

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [elaHolisticAnalysis, setElaHolisticAnalysis] = useState<string | null>(null);
  const [loadingElaHolistic, setLoadingElaHolistic] = useState(false);

  const handleAskElaHolistic = async () => {
    setLoadingElaHolistic(true);
    setElaHolisticAnalysis(null);
    try {
      const res = await fetch("/api/gemini/analyze-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate holistic analysis");
      setElaHolisticAnalysis(data.analysis);
    } catch (err) {
      console.error("Ela holistic analysis error", err);
      setElaHolisticAnalysis("Ela could not connect to the quantum stream right now. Please try again in a moment.");
    } finally {
      setLoadingElaHolistic(false);
    }
  };

  const comp = getProfileComputed(profile);

  useEffect(() => {
    if (token) {
      setLoadingAmbi(true);
      fetch("/api/ambi-history", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.history) setAmbiHistory(data.history);
        })
        .catch((err) => console.error("Error fetching AMBI for report", err))
        .finally(() => setLoadingAmbi(false));
    }
  }, [token]);

  const latestAmbi = ambiHistory.length > 0 ? ambiHistory[ambiHistory.length - 1] : null;

  const { 
    numerology = { lifePath: 1, expression: 1, soulUrge: 1, personality: 1, birthday: 1 }, 
    astrology = { sunSign: "Aries", moonSign: "Aries", risingSign: "Aries", dominantPlanet: "Sun", northNode: "Gate 1", southNode: "Gate 2", chineseZodiac: "Dragon", chineseElement: "Fire" }, 
    humanDesign = { type: "Generator", authority: "Sacral", profile: "1/3", definitionType: "Single Definition", channels: [], personalityGates: [], designGates: [], definedCenters: [], undefinedCenters: [], centers: {}, personalityPositions: {}, designPositions: {} }, 
    geneKeys = {} as GeneKeysData, 
    aura = { color: "Blue", hex: "#3b82f6", frequency: 528, consciousnessScale: 500, primaryChakra: "Throat", virtues: [], advice: "" } 
  } = comp || {};

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Safe helper to fetch Gene Key data safely
  const getGK = (sphereKey: keyof GeneKeysData) => {
    const sphere = geneKeys?.[sphereKey];
    const keyNum = sphere?.keyNumber || 1;
    const meta = GENE_KEYS[(keyNum - 1) % GENE_KEYS.length] || GENE_KEYS[0];
    return {
      sphereName: sphere?.name || sphereKey,
      keyNumber: keyNum,
      line: sphere?.line || 1,
      sequence: sphere?.sequence || "activation",
      name: meta?.name || "Gene Key",
      shadow: meta?.shadow || "Shadow",
      gift: meta?.gift || "Gift",
      siddhi: meta?.siddhi || "Siddhi",
      shadowDesc: meta?.shadowDesc || "",
      giftDesc: meta?.giftDesc || "",
      siddhiDesc: meta?.siddhiDesc || "",
    };
  };

  const lifesWorkGK = getGK("lifesWork");
  const evolutionGK = getGK("evolution");
  const radianceGK = getGK("radiance");
  const purposeGK = getGK("purpose");

  const attractionGK = getGK("attraction");
  const iqGK = getGK("iq");
  const eqGK = getGK("eq");
  const sqGK = getGK("sq");
  const coreWoundGK = getGK("coreWound");

  const vocationGK = getGK("vocation");
  const cultureGK = getGK("culture");
  const brandGK = getGK("brand");
  const pearlGK = getGK("pearl");

  const auraInfo = AURA_KNOWLEDGE[aura.color] || AURA_KNOWLEDGE["Blue"] || {
    title: `${aura.color} Aura`,
    subtitle: "Harmonic Energy Field",
    keywords: ["Vitality", "Clarity", "Resonance"],
    body: ["Your aura field vibrates with exceptional clarity."]
  };

  const hdTypeInfo = HD_TYPE_KNOWLEDGE[humanDesign.type] || HD_TYPE_KNOWLEDGE["Generator"];
  const lifePathInfo = LIFE_PATH_KNOWLEDGE[numerology.lifePath] || LIFE_PATH_KNOWLEDGE[1];
  const sunZodiacInfo = ZODIAC_KNOWLEDGE[astrology.sunSign] || ZODIAC_KNOWLEDGE["Aries"];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const categories = [
    { id: "all", label: "All Readouts", icon: Layers },
    { id: "hd", label: "Human Design", icon: Activity },
    { id: "gk", label: "Gene Keys", icon: KeyRound },
    { id: "num", label: "Numerology", icon: Star },
    { id: "astro", label: "Astrology & Birth Chart", icon: Compass },
    { id: "aura", label: "Aura Frequencies", icon: Sun },
    { id: "ambi", label: "AMBI Mindscape", icon: Brain },
    { id: "synthesis", label: "Master Synthesis", icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-100" id="full-life-report-wrapper">
      {/* Top Banner & Export Actions */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 print:bg-white print:text-slate-900 print:border-none">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-widest mb-1">
              <FileText className="w-4 h-4" />
              <span>Integrated Sovereign Readout</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-200 via-amber-200 to-amber-400 bg-clip-text text-transparent print:text-slate-900">
              {profile.firstName} {profile.lastName}'s Full Life Overview
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 print:text-slate-600">
              Complete synthesis of Human Design, Gene Keys, Allogenic Sequences, Numerology, Astrology (Birth Chart Specifics), Aura Frequencies, and AMBI Mindscape Psychometrics.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">

            <button
              id="preview-full-dossier-btn"
              onClick={() => setPreviewModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white text-xs font-semibold border border-teal-500/40 transition-colors shadow-lg"
              title="Preview full multi-page soul dossier on screen"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Preview Dossier</span>
            </button>

            <button
              id="download-full-pdf-dossier-btn"
              onClick={() => downloadProfileFullDossierPDF(profile, ambiHistory)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-semibold border border-teal-500/30 transition-colors shadow-lg"
              title="Download Full Soul Blueprint Dossier with birth chart, Human Design & test results"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Full Dossier (PDF)</span>
            </button>

            <button
              id="download-questions-pdf-from-report-btn"
              onClick={() => downloadEditablePsychometricPDF()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-medium border border-teal-500/30 transition-colors"
              title="Download full 181-question psychometric test in an editable interactive PDF"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>181-Q Form (PDF)</span>
            </button>

            <button
              id="download-mbti-pdf-from-report-btn"
              onClick={() => downloadEditableMbtiPDF()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white text-xs font-medium border border-purple-500/30 transition-colors"
              title="Download full 20-question Myers-Briggs assessment in an editable interactive PDF"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>MBTI Form (PDF)</span>
            </button>

            <button
              id="print-report-pdf-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-teal-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print View</span>
            </button>
          </div>
        </div>

        {/* Full Dossier Interactive Live Preview Modal */}
        <DossierPreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          profile={profile}
          testHistory={ambiHistory}
        />

        {/* Quick Category Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-t border-slate-800/80 pt-4 print:hidden scrollbar-none" id="report-filter-bar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSel
                    ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ELA HOLISTIC SELF-GROWTH MASTER SYNTHESIS */}
      {(selectedCategory === "all" || selectedCategory === "synthesis") && (
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-teal-950/40 via-slate-900/90 to-purple-950/40 border border-teal-500/30 space-y-5 shadow-2xl relative overflow-hidden" id="ela-holistic-synthesis-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>ELA QUANTUM HOLISTIC SYNTHESIS</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white tracking-wide">
                Illuminating Self & Growing to Inner Fulfillment
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Ela synthesizes your complete matrix — Human Design, 64 Gene Keys, Numerology, Astrology, Auric frequency, and AMBI Mindscape — into an actionable roadmap for lasting contentment, peace, and soul sovereignty.
              </p>
            </div>

            <button
              onClick={handleAskElaHolistic}
              disabled={loadingElaHolistic}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 shrink-0 shadow-teal-500/20"
            >
              {loadingElaHolistic ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Soul Codes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{elaHolisticAnalysis ? "Regenerate Ela's Synthesis" : "Ela: Analyze Everything"}</span>
                </>
              )}
            </button>
          </div>

          {elaHolisticAnalysis && (
            <div className="mt-4 p-6 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-xs md:text-sm text-slate-200 leading-relaxed space-y-4 shadow-inner whitespace-pre-line animate-fade-in font-serif">
              {elaHolisticAnalysis}
            </div>
          )}
        </div>
      )}

      {/* EXECUTIVE SUMMARY BENTO SNAPSHOT */}
      {(selectedCategory === "all" || selectedCategory === "synthesis") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="report-executive-snapshot">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400">Human Design</span>
            <div className="text-base font-bold text-slate-100 truncate">{humanDesign.type}</div>
            <div className="text-xs text-slate-400">{humanDesign.authority} Authority ({humanDesign.profile})</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Primary Gene Key</span>
            <div className="text-base font-bold text-slate-100 truncate">Key #{lifesWorkGK.keyNumber} ({lifesWorkGK.name})</div>
            <div className="text-xs text-slate-400">{lifesWorkGK.gift} Gift</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">Life Path</span>
            <div className="text-base font-bold text-slate-100 truncate">Life Path {numerology.lifePath}</div>
            <div className="text-xs text-slate-400">Expression {numerology.expression}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">Astrology</span>
            <div className="text-base font-bold text-slate-100 truncate">{astrology.sunSign} Sun</div>
            <div className="text-xs text-slate-400">{astrology.moonSign} Moon • {astrology.risingSign} Rising</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Aura Spectrum</span>
            <div className="text-base font-bold text-slate-100 truncate">{aura.color} Aura</div>
            <div className="text-xs text-slate-400">{aura.frequency} Hz • {aura.consciousnessScale}/1000</div>
          </div>
        </div>
      )}

      {/* SECTION 1: HUMAN DESIGN */}
      {(selectedCategory === "all" || selectedCategory === "hd") && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:bg-white print:text-slate-900 print:border-slate-300" id="report-hd-section">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 print:text-slate-900">1. Human Design Operating Coordinates</h3>
                <p className="text-xs text-slate-400 print:text-slate-600">Bio-energetic architecture, strategy, and decision-making authority.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection("hd")}
              className="p-2 text-slate-400 hover:text-white print:hidden"
            >
              {expandedSections.hd ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.hd && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Energy Type</span>
                  <p className="text-lg font-bold text-purple-300 print:text-purple-900 mt-1">{humanDesign.type}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Inner Authority</span>
                  <p className="text-lg font-bold text-teal-300 print:text-teal-900 mt-1">{humanDesign.authority}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Profile Lines</span>
                  <p className="text-lg font-bold text-amber-300 print:text-amber-900 mt-1">{humanDesign.profile}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Definition</span>
                  <p className="text-sm font-semibold text-slate-200 print:text-slate-800 mt-1">{humanDesign.definitionType}</p>
                </div>
              </div>

              {/* HD Type Narrative */}
              {hdTypeInfo && (
                <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                  <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>{hdTypeInfo.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {hdTypeInfo.subtitle}. Strategy: <span className="text-purple-200 font-semibold">{hdTypeInfo.keywords ? hdTypeInfo.keywords.join(", ") : ""}</span>
                  </p>
                  {hdTypeInfo.body && hdTypeInfo.body[0] && (
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {hdTypeInfo.body[0]}
                    </p>
                  )}
                </div>
              )}

              {/* Defined vs Undefined Centers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-teal-500/20 space-y-3">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-400" />
                    <span>Defined Centers ({humanDesign.definedCenters?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {humanDesign.definedCenters && humanDesign.definedCenters.length > 0 ? (
                      humanDesign.definedCenters.map((c: string) => (
                        <span key={c} className="px-3 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs font-medium">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None defined</span>
                    )}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <span>Undefined Centers ({humanDesign.undefinedCenters?.length || 0})</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {humanDesign.undefinedCenters && humanDesign.undefinedCenters.length > 0 ? (
                      humanDesign.undefinedCenters.map((c: string) => (
                        <span key={c} className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None undefined</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Channels */}
              {humanDesign.channels && humanDesign.channels.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Channels</h4>
                  <div className="flex flex-wrap gap-2">
                    {humanDesign.channels.map((ch: string) => (
                      <span key={ch} className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono">
                        Channel {ch}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: GENE KEYS HOLOGENETIC PROFILE */}
      {(selectedCategory === "all" || selectedCategory === "gk") && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:bg-white print:text-slate-900 print:border-slate-300" id="report-gk-section">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 print:text-slate-900">2. Gene Keys Hologenetic Profile</h3>
                <p className="text-xs text-slate-400 print:text-slate-600">The 12 primary spheres of your soul's evolution, open-hearted love, and prosperity.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection("gk")}
              className="p-2 text-slate-400 hover:text-white print:hidden"
            >
              {expandedSections.gk ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.gk && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {/* Activation Sequence */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-4 print:bg-slate-50">
                <h4 className="text-sm font-bold text-amber-300 print:text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Activation Sequence (Genius)</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Life's Work</span>
                      <span className="text-amber-400 font-bold font-mono">Key #{lifesWorkGK.keyNumber}.{lifesWorkGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{lifesWorkGK.name}</span>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Shadow: <span className="text-rose-400 font-semibold">{lifesWorkGK.shadow}</span> • Gift: <span className="text-emerald-400 font-semibold">{lifesWorkGK.gift}</span> • Siddhi: <span className="text-amber-300 font-semibold">{lifesWorkGK.siddhi}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Evolution</span>
                      <span className="text-amber-400 font-bold font-mono">Key #{evolutionGK.keyNumber}.{evolutionGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{evolutionGK.name}</span>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Shadow: <span className="text-rose-400 font-semibold">{evolutionGK.shadow}</span> • Gift: <span className="text-emerald-400 font-semibold">{evolutionGK.gift}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Radiance</span>
                      <span className="text-amber-400 font-bold font-mono">Key #{radianceGK.keyNumber}.{radianceGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{radianceGK.name}</span>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Shadow: <span className="text-rose-400 font-semibold">{radianceGK.shadow}</span> • Gift: <span className="text-emerald-400 font-semibold">{radianceGK.gift}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Purpose</span>
                      <span className="text-amber-400 font-bold font-mono">Key #{purposeGK.keyNumber}.{purposeGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{purposeGK.name}</span>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Shadow: <span className="text-rose-400 font-semibold">{purposeGK.shadow}</span> • Gift: <span className="text-emerald-400 font-semibold">{purposeGK.gift}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Venus Sequence */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-4 print:bg-slate-50">
                <h4 className="text-sm font-bold text-rose-300 print:text-rose-900 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Venus Sequence (Love)</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Attraction</span>
                      <span className="text-rose-400 font-bold font-mono">Key #{attractionGK.keyNumber}.{attractionGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{attractionGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">IQ Mind</span>
                      <span className="text-rose-400 font-bold font-mono">Key #{iqGK.keyNumber}.{iqGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{iqGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">EQ Heart</span>
                      <span className="text-rose-400 font-bold font-mono">Key #{eqGK.keyNumber}.{eqGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{eqGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Core Wound</span>
                      <span className="text-rose-400 font-bold font-mono">Key #{coreWoundGK.keyNumber}.{coreWoundGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{coreWoundGK.name}</span>
                  </div>
                </div>
              </div>

              {/* Pearl Sequence */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-4 print:bg-slate-50">
                <h4 className="text-sm font-bold text-emerald-300 print:text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Pearl Sequence (Prosperity)</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Vocation</span>
                      <span className="text-emerald-400 font-bold font-mono">Key #{vocationGK.keyNumber}.{vocationGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{vocationGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Culture</span>
                      <span className="text-emerald-400 font-bold font-mono">Key #{cultureGK.keyNumber}.{cultureGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{cultureGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">Brand</span>
                      <span className="text-emerald-400 font-bold font-mono">Key #{brandGK.keyNumber}.{brandGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{brandGK.name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 print:bg-white">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 font-mono">The Pearl</span>
                      <span className="text-emerald-400 font-bold font-mono">Key #{pearlGK.keyNumber}.{pearlGK.line}</span>
                    </div>
                    <span className="font-bold text-sm text-slate-100 block print:text-slate-900">{pearlGK.name}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3 & 4: NUMEROLOGY & ASTROLOGY */}
      {(selectedCategory === "all" || selectedCategory === "num" || selectedCategory === "astro") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="report-num-astro-grid">
          {/* Numerology Matrix */}
          {(selectedCategory === "all" || selectedCategory === "num") && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 print:bg-white print:text-slate-900" id="report-num-section">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs tracking-wider">
                  <Star className="w-4 h-4" />
                  <span>3. Numerology Matrix</span>
                </div>
                <button 
                  onClick={() => toggleSection("num")}
                  className="p-2 text-slate-400 hover:text-white print:hidden"
                >
                  {expandedSections.num ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.num && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Life Path</span>
                      <p className="text-2xl font-bold text-amber-300 print:text-amber-900 mt-1">{numerology.lifePath}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Expression (Destiny)</span>
                      <p className="text-2xl font-bold text-amber-300 print:text-amber-900 mt-1">{numerology.expression}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Soul Urge</span>
                      <p className="text-2xl font-bold text-amber-300 print:text-amber-900 mt-1">{numerology.soulUrge}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Personality</span>
                      <p className="text-2xl font-bold text-amber-300 print:text-amber-900 mt-1">{numerology.personality}</p>
                    </div>
                  </div>

                  {lifePathInfo && (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
                      <h4 className="font-bold text-amber-300">{lifePathInfo.title}</h4>
                      <p className="text-slate-300 leading-relaxed">{lifePathInfo.subtitle}</p>
                      {lifePathInfo.body && lifePathInfo.body[0] && (
                        <p className="text-slate-400 text-[11px] leading-relaxed pt-1">{lifePathInfo.body[0]}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Astrology Stellar Positions & Birth Chart Specifics */}
          {(selectedCategory === "all" || selectedCategory === "astro") && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 print:bg-white print:text-slate-900" id="report-astro-section">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>4. Astrology & Birth Chart Parameters</span>
                </div>
                <button 
                  onClick={() => toggleSection("astro")}
                  className="p-2 text-slate-400 hover:text-white print:hidden"
                >
                  {expandedSections.astro ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedSections.astro && (
                <div className="space-y-4 animate-fade-in">
                  {/* Birth Chart Parameters Card */}
                  <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs" id="birth-chart-details-card">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Date of Birth</span>
                        <strong className="text-white font-mono">{profile.dateOfBirth}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Time of Birth</span>
                        <strong className="text-white font-mono">{profile.timeOfBirth || "12:00 PM (Standard)"}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Place of Birth</span>
                        <strong className="text-white font-mono">{profile.placeOfBirth || "Global Equator"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Sun Sign</span>
                      <p className="text-lg font-bold text-sky-300 print:text-sky-900 mt-1">{astrology.sunSign}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Moon Sign</span>
                      <p className="text-lg font-bold text-sky-300 print:text-sky-900 mt-1">{astrology.moonSign}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Ascendant (Rising)</span>
                      <p className="text-lg font-bold text-sky-300 print:text-sky-900 mt-1">{astrology.risingSign}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-100">
                      <span className="text-slate-400 text-[10px] uppercase font-mono">Dominant Planet</span>
                      <p className="text-lg font-bold text-sky-300 print:text-sky-900 mt-1">{astrology.dominantPlanet}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase">North Node</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{astrology.northNode}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase">Chinese Zodiac</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{astrology.chineseZodiac} ({astrology.chineseElement})</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 text-[10px] uppercase">Celestial Ruler</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{astrology.dominantPlanet} System</p>
                    </div>
                  </div>

                  {sunZodiacInfo && (
                    <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-2 text-xs">
                      <h4 className="font-bold text-sky-300">{sunZodiacInfo.title}</h4>
                      <p className="text-slate-300 leading-relaxed">{sunZodiacInfo.subtitle}</p>
                      {sunZodiacInfo.body && sunZodiacInfo.body[0] && (
                        <p className="text-slate-400 text-[11px] leading-relaxed pt-1">{sunZodiacInfo.body[0]}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: AURA & FREQUENCY FIELDS */}
      {(selectedCategory === "all" || selectedCategory === "aura") && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:bg-white print:text-slate-900 print:border-slate-300" id="report-aura-section">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-2xl border flex items-center justify-center"
                style={{ backgroundColor: `${aura.hex}15`, borderColor: `${aura.hex}44`, color: aura.hex }}
              >
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 print:text-slate-900">5. Aura & Frequency Fields</h3>
                <p className="text-xs text-slate-400 print:text-slate-600">Electromagnetic aura spectrum and Hawkins scale consciousness calibration.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection("aura")}
              className="p-2 text-slate-400 hover:text-white print:hidden"
            >
              {expandedSections.aura ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.aura && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Dominant Spectrum</span>
                  <p className="text-xl font-bold" style={{ color: aura.hex }}>{aura.color} Aura</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Resonant Frequency</span>
                  <p className="text-xl font-bold text-teal-300">{aura.frequency} Hz</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Consciousness Scale</span>
                  <p className="text-xl font-bold text-amber-300">{aura.consciousnessScale} / 1000</p>
                </div>
              </div>

              {auraInfo && (
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <h4 className="text-base font-bold text-slate-100">{auraInfo.title}</h4>
                  <p className="text-xs text-slate-300">{auraInfo.subtitle}</p>
                  {auraInfo.body && (
                    <div className="space-y-2 pt-2 text-xs text-slate-400 leading-relaxed">
                      {auraInfo.body.map((paragraph: string, idx: number) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5.5: AMBI PSYCHOMETRIC MINDSCAPE ASSESSMENT */}
      {(selectedCategory === "all" || selectedCategory === "ambi") && (
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:bg-white print:text-slate-900" id="report-ambi-section">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 print:text-slate-900">5.5 AMBI Mindscape Psychometrics</h3>
                <p className="text-xs text-slate-400 print:text-slate-600">Point Zero behavioral alignment & energetic psychological profile calibration.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection("ambi")}
              className="p-2 text-slate-400 hover:text-white print:hidden"
            >
              {expandedSections.ambi ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.ambi && (
            <div className="space-y-6 animate-fade-in">
              {loadingAmbi ? (
                <div className="p-6 text-center text-xs text-slate-400 font-mono">Retrieving AMBI calibration logs...</div>
              ) : latestAmbi ? (
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-indigo-200 font-semibold">
                        Calibration Record Active ({latestAmbi.mode === "full" ? "Deep Quantum Scan" : "Quick Alignment Scan"})
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono">
                      Calibrated on: {new Date(latestAmbi.date).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 5 Dimensions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center space-y-1">
                      <span className="text-[10px] text-amber-400 font-mono uppercase block">Openness (O)</span>
                      <strong className="text-2xl font-bold text-white block">{latestAmbi.scores.O || 0}%</strong>
                      <span className="text-[10px] text-slate-400 block">Infinite Connection</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-sky-500/20 text-center space-y-1">
                      <span className="text-[10px] text-sky-400 font-mono uppercase block">Discipline (C)</span>
                      <strong className="text-2xl font-bold text-white block">{latestAmbi.scores.C || 0}%</strong>
                      <span className="text-[10px] text-slate-400 block">Sacred Execution</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-center space-y-1">
                      <span className="text-[10px] text-purple-400 font-mono uppercase block">Expression (E)</span>
                      <strong className="text-2xl font-bold text-white block">{latestAmbi.scores.E || 0}%</strong>
                      <span className="text-[10px] text-slate-400 block">Radiant Manifesting</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-center space-y-1">
                      <span className="text-[10px] text-emerald-400 font-mono uppercase block">Empathy (A)</span>
                      <strong className="text-2xl font-bold text-white block">{latestAmbi.scores.A || 0}%</strong>
                      <span className="text-[10px] text-slate-400 block">Aura Resonance</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-teal-500/20 text-center space-y-1">
                      <span className="text-[10px] text-teal-400 font-mono uppercase block">Stability (N)</span>
                      <strong className="text-2xl font-bold text-white block">{latestAmbi.scores.N || 0}%</strong>
                      <span className="text-[10px] text-slate-400 block">Point Zero Calm</span>
                    </div>
                  </div>

                  {/* Psychometric-Cosmic Synthesis Narrative */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2 text-xs">
                    <h4 className="font-bold text-indigo-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Psychometric-Cosmic Synthesis</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Your high resonance in <strong className="text-indigo-200">Openness ({latestAmbi.scores.O}%)</strong> and <strong className="text-indigo-200">Point Zero Stability ({latestAmbi.scores.N}%)</strong> creates a natural harmonic mirror with your <strong className="text-teal-200">{humanDesign.type}</strong> energy type and <strong className="text-teal-200">{humanDesign.authority} Authority</strong>. This allows you to navigate chaotic exterior environments while maintaining steady inner stillness.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-center space-y-4">
                  <Brain className="w-10 h-10 text-indigo-400/80 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">AMBI Mindscape Scan: Pending Calibration</h4>
                    <p className="text-xs text-slate-400 max-w-lg mx-auto">
                      You have not taken the AMBI assessment yet. Calibrating your psychometric score will integrate your five energetic mindscape factors into this full synthesis report.
                    </p>
                  </div>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate("psychometric")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold text-xs shadow-lg hover:brightness-110 transition-all"
                    >
                      <span>Take AMBI Assessment Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: INTEGRATED SOUL ROADMAP & MASTER SYNTHESIS */}
      {(selectedCategory === "all" || selectedCategory === "synthesis") && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/30 border border-teal-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 print:bg-white print:text-slate-900 print:border-slate-300" id="report-synthesis-section">
          <div className="flex items-center justify-between pb-4 border-b border-teal-500/20">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100 print:text-slate-900">6. Sovereign Master Synthesis & Soul Roadmap</h3>
                <p className="text-xs text-slate-400 print:text-slate-600">The unified blueprint combining Human Design, Gene Keys, Astrology Birth Chart, Numerology, Aura, and AMBI Mindscape.</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection("synthesis")}
              className="p-2 text-slate-400 hover:text-white print:hidden"
            >
              {expandedSections.synthesis ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {expandedSections.synthesis && (
            <div className="space-y-6 animate-fade-in text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-teal-500/20 space-y-3">
                  <h4 className="font-bold text-teal-300 text-sm flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-400" />
                    <span>Sovereign Strengths & Integrated Blueprint</span>
                  </h4>
                  <ul className="space-y-2.5 text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Human Design Architecture:</strong> Operating as a <strong className="text-teal-200">{humanDesign.type}</strong> with <strong className="text-teal-200">{humanDesign.authority} Authority</strong> and <strong className="text-teal-200">{humanDesign.profile} Profile</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Gene Keys Genius:</strong> Embodying the <strong className="text-amber-200">{lifesWorkGK.gift}</strong> gift from Key #{lifesWorkGK.keyNumber} to transcend shadow loops.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Birth Chart Specifics:</strong> Grounded in your <strong className="text-sky-200">{astrology.sunSign} Sun</strong>, <strong className="text-sky-200">{astrology.moonSign} Moon</strong>, and <strong className="text-sky-200">{astrology.risingSign} Ascendant</strong> ({profile.placeOfBirth || "Earth"}).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Numerological Drive:</strong> Anchored in <strong className="text-purple-200">Life Path {numerology.lifePath}</strong> and <strong className="text-purple-200">Expression {numerology.expression}</strong> master frequency.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-3">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Daily Alignment & Point Zero Practices</span>
                  </h4>
                  <ul className="space-y-2.5 text-slate-300">
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Practice 5-minute Point Zero breathing at <strong className="text-amber-200">{aura.frequency} Hz</strong> resonance daily to clear nervous system static.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Pause before major commitments and consult your <strong className="text-amber-200">{humanDesign.authority} Authority</strong> for true energetic alignment.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>Contemplate Gene Key #{coreWoundGK.keyNumber} (<strong className="text-amber-200">{coreWoundGK.name}</strong>) when encountering relationship friction.</span>
                    </li>
                    {latestAmbi && (
                      <li className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>Leverage your calibrated AMBI <strong className="text-amber-200">Stability factor ({latestAmbi.scores.N}%)</strong> to stay centred in high-stress situations.</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
