import React, { useState } from "react";
import { Profile, RelationshipSynergyResult, ElectromagneticBridge } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { Sparkles, Heart, Zap, Layers, ShieldCheck, Info, Flame, AlertCircle, Download, Copy, Check } from "lucide-react";
import { downloadSvgAsPng, downloadSvgRaw, copySvgToClipboard } from "../utils/exportGraphics";

interface BlendedSynergyChartSVGProps {
  profileA: Profile;
  profileB: Profile;
  synergy: RelationshipSynergyResult;
  compact?: boolean;
}

export const BlendedSynergyChartSVG: React.FC<BlendedSynergyChartSVGProps> = ({
  profileA,
  profileB,
  synergy,
  compact = false,
}) => {
  const [selectedBridge, setSelectedBridge] = useState<ElectromagneticBridge | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "bridges" | "elements">("all");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const compA = getProfileComputed(profileA);
  const compB = getProfileComputed(profileB);

  const handleCopy = async () => {
    const success = await copySvgToClipboard("blended-synergy-chart-svg");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    setExporting(true);
    try {
      const filename = `${profileA.firstName}_and_${profileB.firstName}_Sacred_Synergy_Composite_Art`;
      await downloadSvgAsPng("blended-synergy-chart-svg", filename, 2);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    const filename = `${profileA.firstName}_and_${profileB.firstName}_Sacred_Synergy_Composite_Art`;
    downloadSvgRaw("blended-synergy-chart-svg", filename);
  };

  // SVG Coordinates
  const width = compact ? 540 : 760;
  const height = compact ? 380 : 490;
  
  const c1X = compact ? 195 : 270;
  const c1Y = compact ? 190 : 245;
  const c2X = compact ? 345 : 490;
  const c2Y = compact ? 190 : 245;
  const r = compact ? 135 : 190;

  const bridges = synergy.electromagneticBridges || [];

  return (
    <div className={`rounded-3xl bg-slate-950/90 border border-teal-500/30 relative overflow-hidden shadow-2xl ${compact ? "p-4" : "p-6 md:p-8"}`} id="blended-synergy-chart-container">
      {/* Background Aura Gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono font-semibold uppercase">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>SACRED COMPOSITE CELESTIAL ART MANDALA</span>
          </div>
          <h3 className={`${compact ? "text-lg" : "text-xl md:text-2xl"} font-bold text-white font-serif mt-1`}>
            {profileA.firstName} &amp; {profileB.firstName}&apos;s Blended Unified Field
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Vesica Piscis Cosmic Fusion • {bridges.length} Electromagnetic Bridge{bridges.length !== 1 ? "s" : ""} • Longevity: {synergy.longevityScore}%
          </p>
        </div>

        {/* View Controls & Graphic Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "all" ? "bg-teal-500/20 text-teal-200 border border-teal-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              Dual Mandala
            </button>
            <button
              onClick={() => setActiveFilter("bridges")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "bridges" ? "bg-amber-500/20 text-amber-200 border border-amber-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              Bridges ({bridges.length})
            </button>
          </div>

          {/* Export Controls */}
          <button
            onClick={handleDownloadPng}
            disabled={exporting}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-sm"
            title="Download high-resolution composite graphic (PNG)"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>{exporting ? "Rendering..." : "Download PNG"}</span>
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
            title="Copy blended composite chart to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Graphic"}</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex justify-center items-center">
        <svg 
          id="blended-synergy-chart-svg"
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full max-w-3xl h-auto drop-shadow-[0_0_45px_rgba(45,212,191,0.25)] select-none"
        >
          <defs>
            {/* Person 1 Gradient */}
            <radialGradient id="p1Grad" cx="40%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#0d9488" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.0" />
            </radialGradient>

            {/* Person 2 Gradient */}
            <radialGradient id="p2Grad" cx="60%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3b0764" stopOpacity="0.0" />
            </radialGradient>

            {/* Central Vesica Piscis Fusion Gradient */}
            <radialGradient id="fusionGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.0" />
            </radialGradient>

            {/* Bridge Glow Filter */}
            <filter id="bridgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="sparkGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND SACRED GEOMETRY: FLOWER OF LIFE OVERLAY IN INTERSECTION */}
          <g opacity="0.35">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const ox = (c1X + c2X) / 2 + 35 * Math.cos(rad);
              const oy = (c1Y + c2Y) / 2 + 35 * Math.sin(rad);
              return (
                <circle
                  key={i}
                  cx={ox}
                  cy={oy}
                  r="35"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="0.6"
                  strokeDasharray="2 4"
                />
              );
            })}
          </g>

          {/* PERSON 1 CELESTIAL CIRCLE (CYAN/TEAL) */}
          <circle 
            cx={c1X} 
            cy={c1Y} 
            r={r} 
            fill="url(#p1Grad)" 
            stroke="#2dd4bf" 
            strokeWidth="1.6" 
            strokeDasharray="4,4"
          />
          <circle cx={c1X} cy={c1Y} r={r * 0.78} fill="none" stroke="#2dd4bf" strokeWidth="0.7" strokeOpacity="0.5" />
          <circle cx={c1X} cy={c1Y} r={r * 0.52} fill="none" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="3 3" />
          <circle cx={c1X} cy={c1Y} r={r * 0.28} fill="none" stroke="#2dd4bf" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Planetary Orbit Points for Person 1 */}
          <g transform={`translate(${c1X}, ${c1Y})`}>
            {/* Sun indicator */}
            <circle cx={-r * 0.65} cy={-r * 0.4} r="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
            <text x={-r * 0.65} y={-r * 0.4 + 3} textAnchor="middle" fontSize="8" fill="#fbbf24">☉</text>
            <text x={-r * 0.65 - 12} y={-r * 0.4 + 3} textAnchor="end" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compA.astrology.sunSign}
            </text>

            {/* Moon indicator */}
            <circle cx={-r * 0.72} cy={r * 0.25} r="8" fill="#0f172a" stroke="#c084fc" strokeWidth="1.2" />
            <text x={-r * 0.72} y={r * 0.25 + 3} textAnchor="middle" fontSize="8" fill="#c084fc">☽</text>
            <text x={-r * 0.72 - 12} y={r * 0.25 + 3} textAnchor="end" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compA.astrology.moonSign}
            </text>

            {/* Rising indicator */}
            <circle cx={-r * 0.2} cy={-r * 0.72} r="8" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.2" />
            <text x={-r * 0.2} y={-r * 0.72 + 2.5} textAnchor="middle" fontSize="6.5" fill="#2dd4bf" fontWeight="bold">ASC</text>
            <text x={-r * 0.2} y={-r * 0.72 - 8} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compA.astrology.risingSign}
            </text>
          </g>

          {/* PERSON 2 CELESTIAL CIRCLE (PURPLE/ROSE) */}
          <circle 
            cx={c2X} 
            cy={c2Y} 
            r={r} 
            fill="url(#p2Grad)" 
            stroke="#c084fc" 
            strokeWidth="1.6" 
            strokeDasharray="4,4"
          />
          <circle cx={c2X} cy={c2Y} r={r * 0.78} fill="none" stroke="#c084fc" strokeWidth="0.7" strokeOpacity="0.5" />
          <circle cx={c2X} cy={c2Y} r={r * 0.52} fill="none" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="3 3" />
          <circle cx={c2X} cy={c2Y} r={r * 0.28} fill="none" stroke="#c084fc" strokeWidth="0.5" strokeOpacity="0.4" />

          {/* Planetary Orbit Points for Person 2 */}
          <g transform={`translate(${c2X}, ${c2Y})`}>
            {/* Sun indicator */}
            <circle cx={r * 0.65} cy={-r * 0.4} r="8" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.2" />
            <text x={r * 0.65} y={-r * 0.4 + 3} textAnchor="middle" fontSize="8" fill="#fbbf24">☉</text>
            <text x={r * 0.65 + 12} y={-r * 0.4 + 3} textAnchor="start" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compB.astrology.sunSign}
            </text>

            {/* Moon indicator */}
            <circle cx={r * 0.72} cy={r * 0.25} r="8" fill="#0f172a" stroke="#c084fc" strokeWidth="1.2" />
            <text x={r * 0.72} y={r * 0.25 + 3} textAnchor="middle" fontSize="8" fill="#c084fc">☽</text>
            <text x={r * 0.72 + 12} y={r * 0.25 + 3} textAnchor="start" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compB.astrology.moonSign}
            </text>

            {/* Rising indicator */}
            <circle cx={r * 0.2} cy={-r * 0.72} r="8" fill="#0f172a" stroke="#c084fc" strokeWidth="1.2" />
            <text x={r * 0.2} y={-r * 0.72 + 2.5} textAnchor="middle" fontSize="6.5" fill="#c084fc" fontWeight="bold">ASC</text>
            <text x={r * 0.2} y={-r * 0.72 - 8} textAnchor="middle" fontSize="7" fill="#cbd5e1" fontFamily="monospace">
              {compB.astrology.risingSign}
            </text>
          </g>

          {/* CENTRAL VESICA PISCIS (SHARED SOUL CONDUIT) */}
          <ellipse 
            cx={(c1X + c2X) / 2} 
            cy={(c1Y + c2Y) / 2} 
            rx={(c2X - c1X) * 0.65} 
            ry={r * 0.88} 
            fill="url(#fusionGrad)" 
            stroke="#fbbf24" 
            strokeWidth="1.8"
          />

          {/* Central Point of Equilibrium */}
          <g transform={`translate(${(c1X + c2X) / 2}, ${(c1Y + c2Y) / 2})`}>
            <circle cx="0" cy="0" r="30" fill="#060913" stroke="#fbbf24" strokeWidth="1.8" filter="url(#nodeGlow)" />
            <Sparkles className="w-4 h-4 text-amber-300" x="-8" y="-15" />
            <text x="0" y="5" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#fbbf24" fontFamily="monospace">
              {synergy.resonanceScore}%
            </text>
            <text x="0" y="15" textAnchor="middle" fontSize="6" fill="#e2e8f0" fontStyle="italic">
              Resonance
            </text>
          </g>

          {/* PERSON 1 SOVEREIGN CORE NODE */}
          <g transform={`translate(${c1X}, ${c1Y})`}>
            <circle cx="0" cy="0" r="34" fill="#060913" stroke="#2dd4bf" strokeWidth="2.2" />
            <text x="0" y="-8" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
              {profileA.firstName}
            </text>
            <text x="0" y="5" textAnchor="middle" fontSize="7.5" fill="#2dd4bf" fontFamily="monospace">
              {compA.astrology.sunSign} Sun
            </text>
            <text x="0" y="15" textAnchor="middle" fontSize="6.5" fill="#94a3b8">
              {compA.humanDesign.type}
            </text>
          </g>

          {/* PERSON 2 SOVEREIGN CORE NODE */}
          <g transform={`translate(${c2X}, ${c2Y})`}>
            <circle cx="0" cy="0" r="34" fill="#060913" stroke="#c084fc" strokeWidth="2.2" />
            <text x="0" y="-8" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff" fontFamily="sans-serif">
              {profileB.firstName}
            </text>
            <text x="0" y="5" textAnchor="middle" fontSize="7.5" fill="#c084fc" fontFamily="monospace">
              {compB.astrology.sunSign} Sun
            </text>
            <text x="0" y="15" textAnchor="middle" fontSize="6.5" fill="#94a3b8">
              {compB.humanDesign.type}
            </text>
          </g>

          {/* ACTIVE ELECTROMAGNETIC CHANNELS (GOLDEN PULSING LIGHTNING ARCS) */}
          {bridges.length === 0 ? (
            <g transform={`translate(${(c1X + c2X) / 2}, ${(c1Y + c2Y) / 2 + 85})`}>
              <text x="0" y="0" textAnchor="middle" fontSize="8" fill="#94a3b8" fontStyle="italic">
                Companionship Channel Dynamic (Calm Grounded Resonance)
              </text>
            </g>
          ) : (
            bridges.map((bridge, idx) => {
              const total = bridges.length;
              const offsetAngle = ((idx - (total - 1) / 2) / Math.max(total, 1)) * 55;
              const rad = (offsetAngle * Math.PI) / 180;

              // Node on P1 circle
              const p1x = c1X + 48 * Math.cos(rad);
              const p1y = c1Y + (idx - total / 2) * 24;

              // Node on P2 circle
              const p2x = c2X - 48 * Math.cos(rad);
              const p2y = c2Y + (idx - total / 2) * 24;

              // Control points for organic lightning curve
              const midX = (c1X + c2X) / 2;
              const midY = (c1Y + c2Y) / 2 + (idx - total / 2) * 38;

              const isSelected = selectedBridge?.channelName === bridge.channelName;

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer group"
                  onClick={() => setSelectedBridge(bridge)}
                >
                  {/* Glowing Arc Path */}
                  <path
                    d={`M ${p1x} ${p1y} Q ${midX} ${midY} ${p2x} ${p2y}`}
                    fill="none"
                    stroke={isSelected ? "#fbbf24" : "#f59e0b"}
                    strokeWidth={isSelected ? "3.2" : "2"}
                    strokeOpacity={isSelected ? "1" : "0.8"}
                    filter="url(#bridgeGlow)"
                    className="transition-all duration-300"
                  />

                  {/* Channel Gate Badge at Center of Arc */}
                  <circle
                    cx={midX}
                    cy={midY}
                    r={isSelected ? "12" : "9"}
                    fill="#060913"
                    stroke={isSelected ? "#fbbf24" : "#f59e0b"}
                    strokeWidth="1.5"
                    filter="url(#sparkGlow)"
                  />
                  <text
                    x={midX}
                    y={midY + 3.2}
                    textAnchor="middle"
                    fontSize={isSelected ? "8.5" : "7"}
                    fontWeight="bold"
                    fill="#fbbf24"
                    fontFamily="monospace"
                  >
                    ⚡
                  </text>

                  {/* Gate Numbers on Endpoints */}
                  <circle cx={p1x} cy={p1y} r="5.5" fill="#2dd4bf" />
                  <text x={p1x - 10} y={p1y + 3} textAnchor="end" fontSize="7" fill="#2dd4bf" fontFamily="monospace">
                    G{bridge.p1Gate}
                  </text>

                  <circle cx={p2x} cy={p2y} r="5.5" fill="#c084fc" />
                  <text x={p2x + 10} y={p2y + 3} textAnchor="start" fontSize="7" fill="#c084fc" fontFamily="monospace">
                    G{bridge.p2Gate}
                  </text>
                </g>
              );
            })
          )}

          {/* Outer Astrological Harmonic Aspect Chord */}
          <path
            d={`M ${c1X - 90} ${c1Y - 110} Q ${(c1X + c2X) / 2} ${Math.min(c1Y, c2Y) - 145} ${c2X + 90} ${c2Y - 110}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4,4"
            strokeOpacity="0.5"
          />
          <text 
            x={(c1X + c2X) / 2} 
            y={Math.min(c1Y, c2Y) - 152} 
            textAnchor="middle" 
            fontSize="8" 
            fill="#38bdf8" 
            fontFamily="monospace"
          >
            Celestial Synastry Arc: {compA.astrology.sunSign} ☉ — {compB.astrology.sunSign} ☉
          </text>
        </svg>
      </div>

      {/* Bridge Deep Dive Drawer if selected */}
      {selectedBridge ? (
        <div className="mt-4 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300 font-mono text-sm">{selectedBridge.channelName}</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-[10px] font-mono">
                Gate {selectedBridge.p1Gate} + Gate {selectedBridge.p2Gate}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed max-w-xl">
              <strong>Theme: {selectedBridge.keyTheme}.</strong> {selectedBridge.description}
            </p>
          </div>
          <button
            onClick={() => setSelectedBridge(null)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono shrink-0"
          >
            Close Bridge
          </button>
        </div>
      ) : (
        <div className="text-center text-[11px] text-slate-400 font-mono pt-2">
          {bridges.length > 0 
            ? `Click any golden ⚡ bridge node in the central fusion field to inspect how your gates link together.` 
            : `Your charts connect through companionship harmony and deep calm longevity rather than turbulent friction.`}
        </div>
      )}
    </div>
  );
};
