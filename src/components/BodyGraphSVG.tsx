import React, { useState } from "react";
import { Profile } from "../types";
import { HD_TYPE_KNOWLEDGE, GENE_KEYS } from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { Info, X, Sparkles, Activity, Layers, Shield, Compass, Download, Copy, Check } from "lucide-react";
import { downloadSvgAsPng, downloadSvgRaw, copySvgToClipboard } from "../utils/exportGraphics";

interface BodyGraphSVGProps {
  profile: Profile;
  onSelectCenter?: (centerName: string) => void;
  onSelectGate?: (gateNum: number) => void;
}

interface CenterInfo {
  name: string;
  type: string;
  defined: boolean;
  color: string;
  description: string;
  gates: number[];
}

export const BodyGraphSVG: React.FC<BodyGraphSVGProps> = ({ profile, onSelectCenter, onSelectGate }) => {
  const [activeCenterModal, setActiveCenterModal] = useState<CenterInfo | null>(null);
  const [activeGateModal, setActiveGateModal] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const comp = getProfileComputed(profile);

  const handleCopy = async () => {
    const success = await copySvgToClipboard("human-design-bodygraph-svg");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    setExporting(true);
    try {
      await downloadSvgAsPng("human-design-bodygraph-svg", `${profile.firstName}_HumanDesign_BodyGraph_Art`, 2);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    downloadSvgRaw("human-design-bodygraph-svg", `${profile.firstName}_HumanDesign_BodyGraph_Art`);
  };

  const hd = comp.humanDesign;

  // Helper to check center definition
  const isDefined = (centerName: string) => {
    if (centerName === "G/Self" || centerName === "G") {
      return (hd.definedCenters || []).some(c => c === "G" || c === "G/Self");
    }
    if (centerName === "Heart/Ego" || centerName === "Ego" || centerName === "Heart") {
      return (hd.definedCenters || []).some(c => c === "Ego" || c === "Heart/Ego" || c === "Heart");
    }
    return (hd.definedCenters || []).includes(centerName);
  };

  const centers: Record<string, CenterInfo> = {
    Head: {
      name: "Head Center",
      type: "Pressure Center",
      defined: isDefined("Head"),
      color: "from-amber-500 to-amber-600",
      description: "Inspiration, cosmic pressure, mental drive, and questioning reality.",
      gates: [64, 61, 63]
    },
    Ajna: {
      name: "Ajna Center",
      type: "Awareness Center",
      defined: isDefined("Ajna"),
      color: "from-emerald-500 to-emerald-600",
      description: "Mental conceptualization, research, opinions, and holding theories.",
      gates: [47, 24, 4, 11, 43, 17]
    },
    Throat: {
      name: "Throat Center",
      type: "Manifestation Hub",
      defined: isDefined("Throat"),
      color: "from-sky-500 to-sky-600",
      description: "Voice, communication, action, and physical manifestation into the world.",
      gates: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16]
    },
    "G/Self": {
      name: "G / Self Center",
      type: "Identity & Magnetics",
      defined: isDefined("G/Self"),
      color: "from-yellow-500 to-yellow-600",
      description: "Identity, love, direction in life, and the magnetic monopole.",
      gates: [1, 13, 25, 46, 2, 15, 10, 7]
    },
    "Heart/Ego": {
      name: "Heart / Ego Center",
      type: "Motor Center",
      defined: isDefined("Heart/Ego"),
      color: "from-rose-500 to-rose-600",
      description: "Willpower, material world, self-worth, and making promises.",
      gates: [21, 51, 26, 40]
    },
    Spleen: {
      name: "Spleen Center",
      type: "Awareness & Immune",
      defined: isDefined("Spleen"),
      color: "from-teal-500 to-teal-600",
      description: "Survival intuition, body health, instinct, and present-moment knowing.",
      gates: [48, 57, 44, 50, 32, 28, 18]
    },
    "Solar Plexus": {
      name: "Solar Plexus Center",
      type: "Motor & Awareness",
      defined: isDefined("Solar Plexus"),
      color: "from-amber-600 to-rose-600",
      description: "Emotional wave, spirit, passion, feeling, and emotional clarity over time.",
      gates: [6, 37, 22, 36, 55, 30, 49]
    },
    Sacral: {
      name: "Sacral Center",
      type: "Life Force Motor",
      defined: isDefined("Sacral"),
      color: "from-orange-500 to-amber-500",
      description: "Vital force, work capacity, sexuality, and guttural gut response.",
      gates: [34, 5, 14, 29, 59, 9, 3, 42, 27]
    },
    Root: {
      name: "Root Center",
      type: "Motor & Pressure",
      defined: isDefined("Root"),
      color: "from-purple-500 to-purple-600",
      description: "Adrenaline pressure, stress drive, momentum, and physical grounding.",
      gates: [53, 60, 52, 19, 39, 41, 58, 38, 54]
    }
  };

  // Planetary activation order matching Jovian / MMI BodyGraph template
  const planetList = [
    { name: "Sun", symbol: "☉", fallbackGate: 16, fallbackLine: 1 },
    { name: "Earth", symbol: "⊕", fallbackGate: 9, fallbackLine: 1 },
    { name: "Moon", symbol: "☽", fallbackGate: 14, fallbackLine: 5 },
    { name: "North Node", symbol: "☊", fallbackGate: 54, fallbackLine: 5 },
    { name: "South Node", symbol: "☋", fallbackGate: 53, fallbackLine: 5 },
    { name: "Mercury", symbol: "☿", fallbackGate: 2, fallbackLine: 3 },
    { name: "Venus", symbol: "♀", fallbackGate: 53, fallbackLine: 6 },
    { name: "Mars", symbol: "♂", fallbackGate: 56, fallbackLine: 5 },
    { name: "Jupiter", symbol: "♃", fallbackGate: 33, fallbackLine: 1 },
    { name: "Saturn", symbol: "♄", fallbackGate: 41, fallbackLine: 6 },
    { name: "Uranus", symbol: "♅", fallbackGate: 38, fallbackLine: 4 },
    { name: "Neptune", symbol: "♆", fallbackGate: 54, fallbackLine: 2 },
    { name: "Pluto", symbol: "♇", fallbackGate: 1, fallbackLine: 6 },
  ];

  // Dynamic activations calculated from user's exact birthday & solar arc
  const designGates = planetList.map((p) => {
    const pos = hd.designPositions?.[p.name];
    const gate = pos?.gate || p.fallbackGate;
    const line = pos?.line || p.fallbackLine;
    return {
      num: `${gate}.${line}`,
      name: p.name,
      symbol: p.symbol,
      gate,
      line,
    };
  });

  const personalityGates = planetList.map((p) => {
    const pos = hd.personalityPositions?.[p.name];
    const gate = pos?.gate || p.fallbackGate;
    const line = pos?.line || p.fallbackLine;
    return {
      num: `${gate}.${line}`,
      name: p.name,
      symbol: p.symbol,
      gate,
      line,
    };
  });

  // Channel activation helper
  const isChannelActive = (cNumberOrName: string) => {
    return (hd.channels || []).some(c => c.toLowerCase().includes(cNumberOrName.toLowerCase()));
  };

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl relative">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-bold">
            Interactive BodyGraph Vector
          </span>
          <h3 className="text-2xl font-bold text-slate-100 mt-1">
            {profile.firstName} {profile.lastName}'s Energy Mechanics
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Graphic Controls */}
          <button
            onClick={handleDownloadPng}
            disabled={exporting}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-sm"
            title="Download high-resolution PNG graphic of Human Design BodyGraph"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>{exporting ? "Generating..." : "Download PNG"}</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
            title="Download pure vector SVG"
          >
            <span>SVG</span>
          </button>

          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              copied 
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold" 
                : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white"
            }`}
            title="Copy BodyGraph graphic to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Graphic"}</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Click Center / Gate</span>
          </div>
        </div>
      </div>

      {/* Main Bodygraph Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DESIGN COLUMN (LEFT) */}
        <div className="lg:col-span-2 order-2 lg:order-1 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 space-y-2 text-xs">
          <div className="text-center font-bold text-rose-400 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Design (Unconscious)</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {designGates.map((g, idx) => {
              const gateNum = parseInt(g.num.split(".")[0]);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveGateModal(gateNum);
                    if (onSelectGate) onSelectGate(gateNum);
                  }}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/30 text-slate-300 transition-all text-[11px]"
                >
                  <span className="text-slate-500 text-[10px]">{g.symbol} {g.name}</span>
                  <span className="font-bold text-rose-300">{g.num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG BODYGRAPH CANVAS (CENTER) */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center relative py-2">
          {/* Subtle Glow Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <svg
            id="human-design-bodygraph-svg"
            viewBox="0 0 450 560"
            className="w-full max-w-lg h-auto drop-shadow-2xl selection:bg-none"
            style={{ filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.5))" }}
          >
            <defs>
              {/* Center Defined Gradients */}
              <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              <linearGradient id="ajnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="throatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              <linearGradient id="gGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>

              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="spleenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>

              <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>

              <linearGradient id="sacralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>

              {/* Sacred Glow Filter */}
              <filter id="sacredAuraGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sacred Geometry Background Mandala */}
            <g opacity="0.4" pointerEvents="none">
              <circle cx="225" cy="275" r="230" fill="none" stroke="#2dd4bf" strokeWidth="0.8" strokeDasharray="3 6" />
              <circle cx="225" cy="275" r="170" fill="none" stroke="#c084fc" strokeWidth="0.6" strokeDasharray="2 4" />
              <circle cx="225" cy="275" r="110" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
              <line x1="225" y1="10" x2="225" y2="540" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="4 8" opacity="0.6" />
              <line x1="10" y1="275" x2="440" y2="275" stroke="#c084fc" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.4" />
              {/* Subtle 8-pointed star chords */}
              <polygon points="225,45 388,275 225,505 62,275" fill="none" stroke="#2dd4bf" strokeWidth="0.5" opacity="0.3" />
            </g>

            {/* SACRED BLOOMING LOTUS IN BACKDROP BEHIND SILHOUETTE */}
            <g id="bodygraph-backdrop-lotus" opacity="0.65" pointerEvents="none">
              {/* Central Lotus Core Glow */}
              <circle cx="225" cy="275" r="90" fill="url(#headGrad)" opacity="0.08" filter="url(#sacredAuraGlow)" />
              
              {/* Outer Lotus Petals Ring (16 petals) */}
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((deg) => (
                <path
                  key={`lotus-outer-${deg}`}
                  d="M 225 275 C 240 215, 260 160, 225 120 C 190 160, 210 215, 225 275 Z"
                  fill="rgba(129, 140, 248, 0.08)"
                  stroke="rgba(168, 85, 247, 0.35)"
                  strokeWidth="1"
                  transform={`rotate(${deg} 225 275)`}
                />
              ))}

              {/* Mid Lotus Petals Ring (12 petals, offset) */}
              {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                <path
                  key={`lotus-mid-${deg}`}
                  d="M 225 275 C 238 230, 250 185, 225 150 C 200 185, 212 230, 225 275 Z"
                  fill="rgba(45, 212, 191, 0.10)"
                  stroke="rgba(45, 212, 191, 0.45)"
                  strokeWidth="1.2"
                  transform={`rotate(${deg} 225 275)`}
                />
              ))}

              {/* Inner Sacred Heart Petals (8 petals) */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <path
                  key={`lotus-inner-${deg}`}
                  d="M 225 275 C 235 245, 242 210, 225 185 C 208 210, 215 245, 225 275 Z"
                  fill="rgba(245, 158, 11, 0.12)"
                  stroke="rgba(251, 191, 36, 0.55)"
                  strokeWidth="1.2"
                  transform={`rotate(${deg} 225 275)`}
                />
              ))}
            </g>

            {/* 1. REALISTIC MEDITATING HUMAN SILHOUETTE OUTLINE */}
            <g id="bodygraph-human-silhouette">
              {/* Outer Aura Glow Contour */}
              <path
                d="
                  M 225 12
                  C 245 12, 256 25, 256 46
                  C 256 65, 246 80, 242 92
                  C 252 98, 278 108, 305 122
                  C 330 135, 352 155, 362 185
                  C 372 215, 370 260, 360 305
                  C 350 348, 332 385, 335 410
                  C 342 435, 368 455, 390 475
                  C 410 492, 405 520, 385 532
                  C 360 545, 280 545, 225 545
                  C 170 545, 90 545, 65 532
                  C 45 520, 40 492, 60 475
                  C 82 455, 108 435, 115 410
                  C 118 385, 100 348, 90 305
                  C 80 260, 78 215, 88 185
                  C 98 155, 120 135, 145 122
                  C 172 108, 198 98, 208 92
                  C 204 80, 194 65, 194 46
                  C 194 25, 205 12, 225 12 Z
                "
                fill="rgba(10, 15, 30, 0.78)"
                stroke="rgba(45, 212, 191, 0.4)"
                strokeWidth="2"
                filter="drop-shadow(0 0 18px rgba(45, 212, 191, 0.2))"
              />

              {/* Internal Anatomical Meditation Lines (Neck, Collarbone, Mudra Lap Base) */}
              <g stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" fill="none" opacity="0.75" pointerEvents="none">
                {/* Collarbones */}
                <path d="M 195 108 Q 225 116 255 108" />
                {/* Chest / Torso subtle flank contours */}
                <path d="M 175 140 Q 165 240 180 320" strokeDasharray="3 3" />
                <path d="M 275 140 Q 285 240 270 320" strokeDasharray="3 3" />
                {/* Crossed Meditation Lap & Dhyana Hands */}
                <path d="M 140 440 C 185 465, 265 465, 310 440" stroke="rgba(45, 212, 191, 0.35)" />
                <ellipse cx="225" cy="460" rx="35" ry="12" stroke="rgba(245, 158, 11, 0.4)" />
                {/* Crown Aura Radiance Arc */}
                <path d="M 205 20 A 24 24 0 0 1 245 20" stroke="rgba(251, 191, 36, 0.6)" strokeWidth="1.5" />
              </g>
            </g>

            {/* 2. CHANNELS (PATHWAYS) - Dynamically lit when defined by the user's birthday gates */}
            {/* Head to Ajna (64-47, 61-24, 63-4) */}
            <line x1="210" y1="50" x2="210" y2="75" stroke={isChannelActive("64-47") ? "#f43f5e" : "#334155"} strokeWidth={isChannelActive("64-47") ? "5" : "2"} filter={isChannelActive("64-47") ? "url(#sacredAuraGlow)" : undefined} />
            <line x1="225" y1="50" x2="225" y2="75" stroke={isChannelActive("61-24") ? "#2dd4bf" : "#334155"} strokeWidth={isChannelActive("61-24") ? "5" : "2"} filter={isChannelActive("61-24") ? "url(#sacredAuraGlow)" : undefined} />
            <line x1="240" y1="50" x2="240" y2="75" stroke={isChannelActive("63-4") ? "#38bdf8" : "#334155"} strokeWidth={isChannelActive("63-4") ? "5" : "2"} filter={isChannelActive("63-4") ? "url(#sacredAuraGlow)" : undefined} />

            {/* Ajna to Throat (17-62, 43-23, 11-56) */}
            <line x1="210" y1="105" x2="210" y2="135" stroke={isChannelActive("17-62") ? "#38bdf8" : "#334155"} strokeWidth={isChannelActive("17-62") ? "5" : "2"} filter={isChannelActive("17-62") ? "url(#sacredAuraGlow)" : undefined} />
            <line x1="225" y1="105" x2="225" y2="135" stroke={isChannelActive("43-23") ? "#f59e0b" : "#334155"} strokeWidth={isChannelActive("43-23") ? "5" : "2"} filter={isChannelActive("43-23") ? "url(#sacredAuraGlow)" : undefined} />
            <line x1="240" y1="105" x2="240" y2="135" stroke={isChannelActive("11-56") ? "#2dd4bf" : "#334155"} strokeWidth={isChannelActive("11-56") ? "5" : "2"} filter={isChannelActive("11-56") ? "url(#sacredAuraGlow)" : undefined} />

            {/* Throat to G Center (7-31, 1-8, 13-33, 10-20) */}
            <line x1="225" y1="180" x2="225" y2="210" stroke={(isChannelActive("7-31") || isChannelActive("1-8") || isChannelActive("13-33") || isChannelActive("10-20")) ? "#eab308" : "#334155"} strokeWidth={(isChannelActive("7-31") || isChannelActive("1-8") || isChannelActive("13-33") || isChannelActive("10-20")) ? "5" : "2"} filter={(isChannelActive("7-31") || isChannelActive("1-8") || isChannelActive("13-33") || isChannelActive("10-20")) ? "url(#sacredAuraGlow)" : undefined} />

            {/* Spleen to Throat (16-48, 20-57) */}
            <line x1="135" y1="320" x2="195" y2="175" stroke={(isChannelActive("16-48") || isChannelActive("20-57")) ? "#14b8a6" : "#334155"} strokeWidth={(isChannelActive("16-48") || isChannelActive("20-57")) ? "4.5" : "2"} />

            {/* Solar Plexus to Throat (12-22, 35-36) */}
            <line x1="315" y1="320" x2="255" y2="175" stroke={(isChannelActive("12-22") || isChannelActive("35-36")) ? "#f43f5e" : "#334155"} strokeWidth={(isChannelActive("12-22") || isChannelActive("35-36")) ? "4.5" : "2"} />

            {/* Throat to Heart/Ego (21-45 Money) */}
            <line x1="240" y1="180" x2="275" y2="260" stroke={isChannelActive("21-45") ? "#ef4444" : "#334155"} strokeWidth={isChannelActive("21-45") ? "4.5" : "2"} />

            {/* G Center to Sacral (15-5, 2-14, 46-29, 10-34) */}
            <line x1="225" y1="270" x2="225" y2="330" stroke={(isChannelActive("15-5") || isChannelActive("2-14") || isChannelActive("46-29") || isChannelActive("10-34")) ? "#f97316" : "#334155"} strokeWidth={(isChannelActive("15-5") || isChannelActive("2-14") || isChannelActive("46-29") || isChannelActive("10-34")) ? "5" : "2"} />

            {/* G Center to Heart (25-51 Exploration) */}
            <line x1="250" y1="240" x2="285" y2="265" stroke={isChannelActive("25-51") ? "#ef4444" : "#334155"} strokeWidth={isChannelActive("25-51") ? "4.5" : "2"} />

            {/* Spleen to Sacral (50-27, 34-57) */}
            <line x1="155" y1="350" x2="195" y2="355" stroke={(isChannelActive("50-27") || isChannelActive("34-57")) ? "#14b8a6" : "#334155"} strokeWidth={(isChannelActive("50-27") || isChannelActive("34-57")) ? "4.5" : "2"} />

            {/* Solar Plexus to Sacral (6-59, 37-40) */}
            <line x1="295" y1="350" x2="255" y2="355" stroke={(isChannelActive("6-59") || isChannelActive("37-40")) ? "#f43f5e" : "#334155"} strokeWidth={(isChannelActive("6-59") || isChannelActive("37-40")) ? "4.5" : "2"} />

            {/* Spleen to Root (18-58, 28-38, 32-54) */}
            <line x1="135" y1="380" x2="200" y2="440" stroke={(isChannelActive("18-58") || isChannelActive("28-38") || isChannelActive("32-54")) ? "#a855f7" : "#334155"} strokeWidth={(isChannelActive("18-58") || isChannelActive("28-38") || isChannelActive("32-54")) ? "4.5" : "2"} />

            {/* Sacral to Root (53-42, 60-3, 52-9) */}
            <line x1="215" y1="380" x2="215" y2="430" stroke={(isChannelActive("53-42") || isChannelActive("60-3")) ? "#a855f7" : "#334155"} strokeWidth={(isChannelActive("53-42") || isChannelActive("60-3")) ? "4.5" : "2"} />
            <line x1="235" y1="380" x2="235" y2="430" stroke={isChannelActive("52-9") ? "#f97316" : "#334155"} strokeWidth={isChannelActive("52-9") ? "4.5" : "2"} />

            {/* Solar Plexus to Root (49-19, 55-39, 30-41) */}
            <line x1="315" y1="380" x2="250" y2="440" stroke={(isChannelActive("49-19") || isChannelActive("55-39") || isChannelActive("30-41")) ? "#f43f5e" : "#334155"} strokeWidth={(isChannelActive("49-19") || isChannelActive("55-39") || isChannelActive("30-41")) ? "4.5" : "2"} />

            {/* 3. THE 9 GEOMETRIC CENTERS */}

            {/* Center 1: HEAD (Triangle pointing Up) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Head"]);
                if (onSelectCenter) onSelectCenter("Head");
              }}
            >
              <polygon
                points="225,20 190,55 260,55"
                fill={centers["Head"].defined ? "url(#headGrad)" : "#0f172a"}
                stroke={centers["Head"].defined ? "#fbbf24" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="44" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                HEAD
              </text>
            </g>

            {/* Center 2: AJNA (Triangle pointing Down) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Ajna"]);
                if (onSelectCenter) onSelectCenter("Ajna");
              }}
            >
              <polygon
                points="190,75 260,75 225,110"
                fill={centers["Ajna"].defined ? "url(#ajnaGrad)" : "#0f172a"}
                stroke={centers["Ajna"].defined ? "#34d399" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="92" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                AJNA
              </text>
            </g>

            {/* Center 3: THROAT (Square) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Throat"]);
                if (onSelectCenter) onSelectCenter("Throat");
              }}
            >
              <rect
                x="192"
                y="132"
                width="66"
                height="50"
                rx="8"
                fill={centers["Throat"].defined ? "url(#throatGrad)" : "#0f172a"}
                stroke={centers["Throat"].defined ? "#38bdf8" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="162" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                THROAT
              </text>
            </g>

            {/* Center 4: G / SELF (Diamond) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["G/Self"]);
                if (onSelectCenter) onSelectCenter("G/Self");
              }}
            >
              <polygon
                points="225,205 265,240 225,275 185,240"
                fill={centers["G/Self"].defined ? "url(#gGrad)" : "#0f172a"}
                stroke={centers["G/Self"].defined ? "#facc15" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="244" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                G / SELF
              </text>
            </g>

            {/* Center 5: HEART / EGO (Small Triangle) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Heart/Ego"]);
                if (onSelectCenter) onSelectCenter("Heart/Ego");
              }}
            >
              <polygon
                points="280,250 315,270 280,290"
                fill={centers["Heart/Ego"].defined ? "url(#heartGrad)" : "#0f172a"}
                stroke={centers["Heart/Ego"].defined ? "#f87171" : "#475569"}
                strokeWidth="3"
              />
              <text x="292" y="273" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                EGO
              </text>
            </g>

            {/* Center 6: SPLEEN (Triangle pointing Left) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Spleen"]);
                if (onSelectCenter) onSelectCenter("Spleen");
              }}
            >
              <polygon
                points="155,305 110,350 155,390"
                fill={centers["Spleen"].defined ? "url(#spleenGrad)" : "#0f172a"}
                stroke={centers["Spleen"].defined ? "#2dd4bf" : "#475569"}
                strokeWidth="3"
              />
              <text x="142" y="352" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                SPLEEN
              </text>
            </g>

            {/* Center 7: SOLAR PLEXUS (Triangle pointing Right) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Solar Plexus"]);
                if (onSelectCenter) onSelectCenter("Solar Plexus");
              }}
            >
              <polygon
                points="295,305 340,350 295,390"
                fill={centers["Solar Plexus"].defined ? "url(#solarGrad)" : "#0f172a"}
                stroke={centers["Solar Plexus"].defined ? "#fb7185" : "#475569"}
                strokeWidth="3"
              />
              <text x="308" y="352" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                SOLAR PLX
              </text>
            </g>

            {/* Center 8: SACRAL (Square) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Sacral"]);
                if (onSelectCenter) onSelectCenter("Sacral");
              }}
            >
              <rect
                x="192"
                y="330"
                width="66"
                height="50"
                rx="8"
                fill={centers["Sacral"].defined ? "url(#sacralGrad)" : "#0f172a"}
                stroke={centers["Sacral"].defined ? "#fb923c" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="360" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                SACRAL
              </text>
            </g>

            {/* Center 9: ROOT (Square) */}
            <g
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => {
                setActiveCenterModal(centers["Root"]);
                if (onSelectCenter) onSelectCenter("Root");
              }}
            >
              <rect
                x="192"
                y="430"
                width="66"
                height="50"
                rx="8"
                fill={centers["Root"].defined ? "url(#rootGrad)" : "#0f172a"}
                stroke={centers["Root"].defined ? "#c084fc" : "#475569"}
                strokeWidth="3"
              />
              <text x="225" y="460" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                ROOT
              </text>
            </g>
          </svg>
        </div>

        {/* PERSONALITY COLUMN (RIGHT) */}
        <div className="lg:col-span-2 order-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 space-y-2 text-xs">
          <div className="text-center font-bold text-sky-400 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800 flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Personality (Conscious)</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {personalityGates.map((g, idx) => {
              const gateNum = parseInt(g.num.split(".")[0]);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveGateModal(gateNum);
                    if (onSelectGate) onSelectGate(gateNum);
                  }}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/60 hover:bg-sky-500/10 border border-slate-800/80 hover:border-sky-500/30 text-slate-300 transition-all text-[11px]"
                >
                  <span className="font-bold text-sky-300">{g.num}</span>
                  <span className="text-slate-500 text-[10px]">{g.symbol} {g.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* HUMAN DESIGN CANDIDATE ANALYSIS SHEET (MATCHING HDTEMP TEMPLATE) */}
      <div className="mt-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">BodyGraph Analysis Sheet</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{profile.firstName} {profile.lastName}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono">
                {hd.profile} • {hd.type}
              </span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] font-mono text-slate-300">
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[9px]">BIRTH DATE</span>
              <span className="text-white font-bold">{profile.dateOfBirth || "Unknown"}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[9px]">TIME OF BIRTH</span>
              <span className="text-white font-bold">{profile.timeOfBirth || "12:00"}</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[9px]">PLACE OF BIRTH</span>
              <span className="text-white font-bold truncate block">{profile.placeOfBirth || "Unspecified"}</span>
            </div>
          </div>
        </div>

        {/* 4-COLUMN MATRIX GRID: AURA, DEFINITION, DEFINED CENTERS, PROFILE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* 1. AURA */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <span className="font-mono text-[11px] font-bold text-amber-400 uppercase tracking-wider">Aura Type</span>
              <span className="text-[10px] text-slate-500 font-mono">1 of 5</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {[
                "Generator",
                "Manifesting Generator",
                "Projector",
                "Manifestor",
                "Reflector"
              ].map((t) => {
                const isActive = hd.type.toLowerCase().trim() === t.toLowerCase().trim();
                return (
                  <div
                    key={t}
                    className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-200 font-bold" 
                        : "text-slate-400 border border-transparent"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                      isActive ? "bg-amber-400 border-amber-300 text-slate-950 font-bold" : "border-slate-700 bg-slate-900"
                    }`}>
                      {isActive ? "✓" : ""}
                    </div>
                    <span className="text-[11px]">{t}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. DEFINITION */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <span className="font-mono text-[11px] font-bold text-sky-400 uppercase tracking-wider">Definition</span>
              <span className="text-[10px] text-slate-500 font-mono">Circuit split</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {[
                { label: "No Definition / Lunar", id: "No Definition" },
                { label: "Single Definition", id: "Single Definition" },
                { label: "Split Definition", id: "Split Definition" },
                { label: "Triple Split", id: "Triple Split" },
                { label: "Quadruple Split", id: "Quadruple Split" }
              ].map((d) => {
                const isActive = (hd.definitionType || "").toLowerCase().includes(d.id.toLowerCase());
                return (
                  <div
                    key={d.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-sky-400/15 border border-sky-400/40 text-sky-200 font-bold" 
                        : "text-slate-400 border border-transparent"
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                      isActive ? "bg-sky-400 border-sky-300 text-slate-950 font-bold" : "border-slate-700 bg-slate-900"
                    }`}>
                      {isActive ? "✓" : ""}
                    </div>
                    <span className="text-[11px]">{d.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. DEFINED CENTERS */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <span className="font-mono text-[11px] font-bold text-teal-400 uppercase tracking-wider">Defined Centers</span>
              <span className="text-[10px] text-slate-500 font-mono">{(hd.definedCenters || []).length} / 9</span>
            </div>
            <div className="space-y-1 pt-1 max-h-48 overflow-y-auto pr-1">
              {[
                { name: "Spleen (Intuitive Awareness)", id: "Spleen" },
                { name: "Ajna (Mental Awareness)", id: "Ajna" },
                { name: "Solar Plexus (Emotional)", id: "Solar Plexus" },
                { name: "Head Center", id: "Head" },
                { name: "Heart / Ego", id: "Heart/Ego" },
                { name: "Throat Center", id: "Throat" },
                { name: "Sacral Center", id: "Sacral" },
                { name: "G / Identity", id: "G/Self" },
                { name: "Root Center", id: "Root" }
              ].map((c) => {
                const defined = isDefined(c.id);
                return (
                  <div
                    key={c.id}
                    className={`flex items-center gap-2 p-1 rounded-lg transition-colors text-[10.5px] ${
                      defined 
                        ? "bg-teal-500/15 text-teal-200 font-semibold" 
                        : "text-slate-500"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded flex items-center justify-center border text-[9px] ${
                      defined ? "bg-teal-400 border-teal-300 text-slate-950 font-bold" : "border-slate-800 bg-slate-900"
                    }`}>
                      {defined ? "✓" : ""}
                    </div>
                    <span className="truncate">{c.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. MY PROFILE MATRIX */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
              <span className="font-mono text-[11px] font-bold text-rose-400 uppercase tracking-wider">My Profile</span>
              <span className="text-[10px] text-rose-300 font-mono font-bold">{hd.profile}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                "1/3", "1/4", "2/4", "2/5", 
                "3/5", "3/6", "4/6", "4/1", 
                "5/1", "5/2", "6/2", "6/3"
              ].map((pStr) => {
                const isActive = hd.profile === pStr;
                return (
                  <div
                    key={pStr}
                    className={`p-1.5 rounded-lg border text-center font-mono text-[11px] transition-all ${
                      isActive 
                        ? "bg-rose-500/20 border-rose-500 text-rose-200 font-bold shadow-sm shadow-rose-500/30 scale-105" 
                        : "border-slate-800/80 bg-slate-900/60 text-slate-500"
                    }`}
                  >
                    {pStr}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. COMPLETE CIRCUITRY & CHANNELS CATALOG (MATCHING HDTEMP TEMPLATE) */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-300 uppercase tracking-widest">Circuitry & Defined Channels</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                {(hd.channels || []).length} active channels calculated for {profile.dateOfBirth}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Active channels illuminate in glowing teal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                circuit: "INDIVIDUAL",
                list: [
                  { name: "Awareness", pair: "61-24" },
                  { name: "Structuring", pair: "43-23" },
                  { name: "Struggle", pair: "28-38" },
                  { name: "Brain Wave", pair: "57-20" },
                  { name: "Mutation", pair: "60-3" },
                  { name: "Beat", pair: "14-2" },
                  { name: "Inspiration", pair: "8-1" },
                  { name: "Exploration", pair: "34-10" },
                  { name: "Initiation", pair: "51-25" },
                ]
              },
              {
                circuit: "UNDERSTANDING (LOGIC)",
                list: [
                  { name: "Logic", pair: "63-4" },
                  { name: "Acceptance", pair: "17-62" },
                  { name: "Judgment", pair: "18-58" },
                  { name: "Wavelength", pair: "48-16" },
                  { name: "Concentration", pair: "52-9" },
                  { name: "Rhythm", pair: "15-5" },
                  { name: "Alpha", pair: "7-31" },
                ]
              },
              {
                circuit: "SENSING (ABSTRACT)",
                list: [
                  { name: "Abstraction", pair: "64-47" },
                  { name: "Curiosity", pair: "11-56" },
                  { name: "Recognition", pair: "41-30" },
                  { name: "Transitoriness", pair: "35-36" },
                  { name: "Maturation", pair: "53-42" },
                  { name: "Discovery", pair: "29-46" },
                  { name: "Prodigal", pair: "13-33" },
                ]
              },
              {
                circuit: "DEFENSE & TRIBAL",
                list: [
                  { name: "Transformation", pair: "54-32" },
                  { name: "Surrender", pair: "44-26" },
                  { name: "Synthesis", pair: "19-49" },
                  { name: "Community", pair: "37-40" },
                  { name: "Money", pair: "21-45" },
                  { name: "Mating", pair: "59-6" },
                  { name: "Preservation", pair: "27-50" },
                ]
              },
              {
                circuit: "INTEGRATION",
                list: [
                  { name: "Power", pair: "57-34" },
                  { name: "Perfected Form", pair: "57-10" },
                  { name: "Awakening", pair: "20-10" },
                  { name: "Charisma", pair: "20-34" },
                ]
              }
            ].map((col) => (
              <div key={col.circuit} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-slate-400 block pb-1 border-b border-slate-800/60 uppercase truncate">
                  {col.circuit}
                </span>
                <div className="space-y-1">
                  {col.list.map((ch) => {
                    const isActive = isChannelActive(ch.pair) || isChannelActive(ch.name);
                    return (
                      <div
                        key={ch.pair}
                        className={`flex items-center justify-between p-1 rounded text-[10px] font-mono transition-colors ${
                          isActive 
                            ? "bg-teal-500/20 text-teal-200 font-bold border border-teal-500/40 shadow-xs" 
                            : "text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        <span className="truncate pr-1">{ch.name}</span>
                        <span className={isActive ? "text-teal-300 font-bold" : "text-slate-600"}>{ch.pair}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER MODAL */}
      {activeCenterModal && (
        <div 
          onClick={() => setActiveCenterModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setActiveCenterModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pr-10">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${activeCenterModal.color} text-slate-950 font-bold`}>
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{activeCenterModal.name}</h3>
                <span className="text-xs font-mono text-teal-400 uppercase tracking-widest">{activeCenterModal.type} · {activeCenterModal.defined ? "Defined" : "Open / Undefined"}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCenterModal.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider">Associated Gates</h4>
              <div className="flex flex-wrap gap-2">
                {activeCenterModal.gates.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-slate-300">
                    Gate {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GATE MODAL */}
      {activeGateModal && (
        <div 
          onClick={() => setActiveGateModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setActiveGateModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-20"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const gk = GENE_KEYS[activeGateModal - 1];
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 font-bold font-mono text-lg">
                      #{activeGateModal}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{gk ? gk.name : `Gate ${activeGateModal}`}</h3>
                      <span className="text-xs text-slate-400 font-mono">I-Ching Hexagram #{activeGateModal}</span>
                    </div>
                  </div>

                  {gk ? (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-rose-400 font-bold block">Shadow: {gk.shadow}</span>
                        <span className="text-emerald-400 font-bold block">Gift: {gk.gift}</span>
                        <span className="text-amber-300 font-bold block">Siddhi: {gk.siddhi}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {gk.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-300">
                      Detailed hexagram frequency breakdown for Gate {activeGateModal}.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
