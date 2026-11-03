import React, { useState } from "react";
import { Profile, HologeneticSphere } from "../types";
import { GENE_KEYS } from "../data/knowledge";
import { getProfileComputed } from "../utils/calculations";
import { KeyRound, Brain, Heart, Coins, Scale, Layers, X, Info, ChevronRight, Download, Copy, Check } from "lucide-react";
import { downloadSvgAsPng, downloadSvgRaw, copySvgToClipboard } from "../utils/exportGraphics";

interface GeneKeysMapSVGProps {
  profile: Profile;
}

export const GeneKeysMapSVG: React.FC<GeneKeysMapSVGProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState<"Full" | "Genius" | "Love" | "Prosperity" | "Harmony">("Full");
  const [selectedSphere, setSelectedSphere] = useState<{ name: string; sphere: HologeneticSphere } | null>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const comp = getProfileComputed(profile);

  const handleCopy = async () => {
    const success = await copySvgToClipboard("genekeys-hologenetic-map-svg");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    setExporting(true);
    try {
      await downloadSvgAsPng("genekeys-hologenetic-map-svg", `${profile.firstName}_GeneKeys_Hologenetic_Map_Art`, 2);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    downloadSvgRaw("genekeys-hologenetic-map-svg", `${profile.firstName}_GeneKeys_Hologenetic_Map_Art`);
  };

  const gkData = comp.geneKeys;

  // Spheres definitions matching genekeys_eb45ea84.jpeg template (Activation Green, Venus Red, Pearl Gold)
  const sphereNodes = [
    // 1. ACTIVATION SEQUENCE (GREEN)
    {
      id: "lifesWork",
      name: "Life Work",
      subname: "Brand / Genius",
      sequence: "Genius",
      sphere: gkData.lifesWork,
      x: 300,
      y: 85,
      color: "from-emerald-400 to-teal-500",
      stroke: "#10b981",
      textColor: "#34d399",
      textAnchor: "middle"
    },
    {
      id: "evolution",
      name: "Evolution",
      subname: "Challenge",
      sequence: "Genius",
      sphere: gkData.evolution,
      x: 495,
      y: 290,
      color: "from-emerald-500 to-emerald-700",
      stroke: "#10b981",
      textColor: "#34d399",
      textAnchor: "start"
    },
    {
      id: "radiance",
      name: "Radiance",
      subname: "Vitality",
      sequence: "Genius",
      sphere: gkData.radiance,
      x: 105,
      y: 290,
      color: "from-emerald-400 to-emerald-600",
      stroke: "#10b981",
      textColor: "#34d399",
      textAnchor: "end"
    },
    {
      id: "purpose",
      name: "Purpose",
      subname: "Core Stability",
      sequence: "Genius",
      sphere: gkData.purpose,
      x: 300,
      y: 495,
      color: "from-emerald-600 to-teal-700",
      stroke: "#10b981",
      textColor: "#34d399",
      textAnchor: "middle"
    },

    // 2. VENUS SEQUENCE (RED / ROSE)
    {
      id: "attraction",
      name: "Attraction",
      subname: "Karmic Field",
      sequence: "Love",
      sphere: gkData.attraction,
      x: 300,
      y: 405,
      color: "from-rose-600 to-red-700",
      stroke: "#f43f5e",
      textColor: "#fb7185",
      textAnchor: "middle"
    },
    {
      id: "iq",
      name: "Intelligence (IQ)",
      subname: "Mental Defense",
      sequence: "Love",
      sphere: gkData.iq,
      x: 215,
      y: 340,
      color: "from-rose-500 to-pink-600",
      stroke: "#f43f5e",
      textColor: "#fb7185",
      textAnchor: "end"
    },
    {
      id: "eq",
      name: "Emotional (EQ)",
      subname: "Heart Openness",
      sequence: "Love",
      sphere: gkData.eq,
      x: 385,
      y: 340,
      color: "from-rose-500 to-pink-600",
      stroke: "#f43f5e",
      textColor: "#fb7185",
      textAnchor: "start"
    },
    {
      id: "sq",
      name: "Spiritual (SQ)",
      subname: "Innocence Core",
      sequence: "Love",
      sphere: gkData.sq,
      x: 300,
      y: 280,
      color: "from-rose-600 to-rose-800",
      stroke: "#f43f5e",
      textColor: "#fda4af",
      textAnchor: "middle"
    },
    {
      id: "coreWound",
      name: "Vocation",
      subname: "Core Wound",
      sequence: "Love",
      sphere: gkData.coreWound,
      x: 215,
      y: 205,
      color: "from-amber-500 to-rose-600",
      stroke: "#f59e0b",
      textColor: "#fbbf24",
      textAnchor: "end"
    },

    // 3. PEARL SEQUENCE (GOLDEN AMBER)
    {
      id: "culture",
      name: "Culture",
      subname: "Network Alignment",
      sequence: "Prosperity",
      sphere: gkData.culture,
      x: 385,
      y: 205,
      color: "from-amber-400 to-yellow-600",
      stroke: "#f59e0b",
      textColor: "#fbbf24",
      textAnchor: "start"
    },
    {
      id: "pearl",
      name: "The Pearl",
      subname: "Prosperity & Harvest",
      sequence: "Prosperity",
      sphere: gkData.pearl,
      x: 300,
      y: 155,
      color: "from-yellow-300 to-amber-500",
      stroke: "#eab308",
      textColor: "#fef08a",
      textAnchor: "start"
    }
  ];

  // Filter spheres based on tab
  const visibleSpheres = sphereNodes.filter((node) => {
    if (activeTab === "Full" || activeTab === "Harmony") return true;
    if (activeTab === "Genius") return node.sequence === "Genius";
    if (activeTab === "Love") return node.sequence === "Love" || node.id === "purpose";
    if (activeTab === "Prosperity") return node.sequence === "Prosperity" || node.id === "lifesWork" || node.id === "coreWound";
    return true;
  });

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Sacred Geometry Pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/5 via-teal-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <KeyRound className="w-4 h-4" />
            <span>Hologenetic Profile Codex</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">
            {profile.firstName} {profile.lastName} - Golden Path Blueprint
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculated for {profile.dateOfBirth} • Golden Path 11-Sphere Hologenetic Map
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Graphic Controls */}
          <button
            onClick={handleDownloadPng}
            disabled={exporting}
            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-sm"
            title="Download high-resolution PNG graphic of Gene Keys Hologenetic Map"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
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
            title="Copy Gene Keys Map graphic to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Graphic"}</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Click any sphere to inspect</span>
          </div>
        </div>
      </div>

      {/* HOLOGENETIC SVG MAP CANVAS (MATCHING GENEKEYS TEMPLATE) */}
      <div className="flex justify-center items-center py-4 relative z-10">
        <svg
          id="genekeys-hologenetic-map-svg"
          viewBox="0 0 600 600"
          className="w-full max-w-2xl h-auto drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 15px 35px rgba(0,0,0,0.6))" }}
        >
          <defs>
            {/* Arrow Marker Definitions */}
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
            </marker>
            <marker id="arrowRed" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
            </marker>
            <marker id="arrowGold" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>

            <radialGradient id="sacredCoreLotus" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.03" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Sacred Lotus Field */}
          <circle cx="300" cy="290" r="280" fill="url(#sacredCoreLotus)" />

          {/* TEMPLATE SACRED GEOMETRY INTERSECTING CIRCLES (FROM GENEKEYS_EB45EA84.JPEG) */}
          {/* Outer circle passing through the 4 Activation nodes */}
          <circle cx="300" cy="290" r="205" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
          
          {/* Internal intersecting Vesica Piscis circles from template */}
          <circle cx="300" cy="190" r="100" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.25" />
          <circle cx="300" cy="390" r="100" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.25" />
          <circle cx="215" cy="290" r="85" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.25" />
          <circle cx="385" cy="290" r="85" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.25" />
          <circle cx="300" cy="290" r="145" fill="none" stroke="#64748b" strokeWidth="0.8" opacity="0.2" strokeDasharray="3 3" />

          {/* 1. ACTIVATION SEQUENCE (GREEN) PATHWAYS & LABELS */}
          {(activeTab === "Full" || activeTab === "Genius" || activeTab === "Harmony") && (
            <g>
              {/* Pathway 1: Life's Work to Evolution (CHALLENGE) */}
              <line x1="318" y1="102" x2="475" y2="272" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" opacity="0.9" />
              <text 
                x="410" 
                y="170" 
                fill="#34d399" 
                fontSize="9" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="1.5"
                transform="rotate(40, 410, 170)"
              >
                CHALLENGE →
              </text>

              {/* Pathway 2: Evolution across to Spiritual / Radiance (BREAKTHROUGH) */}
              <line x1="465" y1="290" x2="330" y2="282" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" opacity="0.85" />
              <line x1="270" y1="282" x2="135" y2="290" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" opacity="0.85" />
              <text 
                x="400" 
                y="282" 
                fill="#34d399" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="1"
              >
                ← BREAKTHROUGH
              </text>
              <text 
                x="150" 
                y="282" 
                fill="#34d399" 
                fontSize="8.5" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="1"
              >
                ← BREAKTHROUGH
              </text>

              {/* Pathway 3: Radiance down to Purpose (CORE STABILITY) */}
              <line x1="122" y1="308" x2="282" y2="478" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowGreen)" opacity="0.9" />
              <text 
                x="180" 
                y="410" 
                fill="#34d399" 
                fontSize="9" 
                fontFamily="monospace" 
                fontWeight="bold" 
                letterSpacing="1.5"
                transform="rotate(48, 180, 410)"
              >
                CORE STABILITY →
              </text>
            </g>
          )}

          {/* 2. VENUS SEQUENCE (RED) PATHWAYS */}
          {(activeTab === "Full" || activeTab === "Love" || activeTab === "Harmony") && (
            <g stroke="#f43f5e" strokeWidth="2" opacity="0.9">
              {/* Purpose up to Attraction */}
              <line x1="300" y1="465" x2="300" y2="435" markerEnd="url(#arrowRed)" />

              {/* Attraction up to IQ & EQ */}
              <line x1="282" y1="392" x2="235" y2="358" markerEnd="url(#arrowRed)" />
              <line x1="318" y1="392" x2="365" y2="358" markerEnd="url(#arrowRed)" />

              {/* Horizontal line between IQ and EQ */}
              <line x1="245" y1="340" x2="355" y2="340" markerEnd="url(#arrowRed)" />

              {/* IQ & EQ up to SQ */}
              <line x1="235" y1="325" x2="280" y2="295" markerEnd="url(#arrowRed)" />
              <line x1="365" y1="325" x2="320" y2="295" markerEnd="url(#arrowRed)" />

              {/* SQ up to Vocation (Core Wound) */}
              <line x1="280" y1="262" x2="235" y2="225" markerEnd="url(#arrowRed)" />
            </g>
          )}

          {/* 3. PEARL SEQUENCE (GOLD) PATHWAYS */}
          {(activeTab === "Full" || activeTab === "Prosperity" || activeTab === "Harmony") && (
            <g stroke="#f59e0b" strokeWidth="2" opacity="0.9">
              {/* Vocation across to Culture */}
              <line x1="245" y1="205" x2="355" y2="205" markerEnd="url(#arrowGold)" />

              {/* Vocation & Culture up to Pearl */}
              <line x1="235" y1="192" x2="280" y2="168" markerEnd="url(#arrowGold)" />
              <line x1="365" y1="192" x2="320" y2="168" markerEnd="url(#arrowGold)" />

              {/* Pearl up to Life Work */}
              <line x1="300" y1="130" x2="300" y2="112" markerEnd="url(#arrowGold)" />

              {/* Vocation & Culture direct to Life Work */}
              <line x1="228" y1="182" x2="285" y2="105" strokeDasharray="3 3" opacity="0.5" />
              <line x1="372" y1="182" x2="315" y2="105" strokeDasharray="3 3" opacity="0.5" />
            </g>
          )}

          {/* SPHERE NODES */}
          {visibleSpheres.map((node) => {
            const gkInfo = GENE_KEYS[node.sphere.keyNumber - 1];
            return (
              <g
                key={node.id}
                className="cursor-pointer group select-none"
                style={{ 
                  transformOrigin: `${node.x}px ${node.y}px`, 
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)" 
                }}
                onClick={() => setSelectedSphere({ name: node.name, sphere: node.sphere })}
              >
                {/* Soft glowing hover halo */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="33"
                  fill="none"
                  stroke={node.stroke}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Outer Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="27"
                  fill="#0b0f19"
                  stroke={node.stroke}
                  strokeWidth="2.5"
                  className="transition-all duration-300 group-hover:stroke-width-3"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
                />

                {/* Inner Center Glow */}
                <circle cx={node.x} cy={node.y} r="22" fill="#0f172a" className="transition-colors group-hover:fill-slate-900" />

                {/* Sphere Key.Line text */}
                <text x={node.x} y={node.y - 2} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {node.sphere.keyNumber}.{node.sphere.line}
                </text>
                <text x={node.x} y={node.y + 11} textAnchor="middle" fill={node.textColor} fontSize="7.5" fontWeight="bold">
                  {node.name.split(" ")[0]}
                </text>

                {/* Floating Frequency Trinity Text */}
                {gkInfo && (
                  <g fontSize="8.5" fill="#94a3b8" textAnchor={node.textAnchor} fontFamily="sans-serif">
                    <text x={node.x + (node.textAnchor === "start" ? 36 : node.textAnchor === "end" ? -36 : 0)} y={node.y - 10}>
                      <tspan fill="#38bdf8" fontWeight="bold">S: {gkInfo.siddhi}</tspan>
                    </text>
                    <text x={node.x + (node.textAnchor === "start" ? 36 : node.textAnchor === "end" ? -36 : 0)} y={node.y + 3}>
                      <tspan fill="#34d399" fontWeight="bold">G: {gkInfo.gift}</tspan>
                    </text>
                    <text x={node.x + (node.textAnchor === "start" ? 36 : node.textAnchor === "end" ? -36 : 0)} y={node.y + 15}>
                      <tspan fill="#f43f5e" fontWeight="bold">Sh: {gkInfo.shadow}</tspan>
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* SEQUENCE TAB SELECTOR BAR (BOTTOM MATCHING IMAGE 5) */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 border-t border-slate-800 pt-4 relative z-10">
        {[
          { id: "Full", label: "Full Profile", icon: Layers },
          { id: "Genius", label: "Genius (Activation)", icon: Brain },
          { id: "Love", label: "Love (Venus)", icon: Heart },
          { id: "Prosperity", label: "Prosperity (Pearl)", icon: Coins },
          { id: "Harmony", label: "Harmony", icon: Scale }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all shadow-lg ${
                isActive
                  ? "bg-amber-400 text-slate-950 font-bold shadow-amber-400/20 scale-105"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* DETAIL MODAL FOR SELECTED SPHERE */}
      {selectedSphere && (
        <div 
          onClick={() => setSelectedSphere(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedSphere(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const gk = GENE_KEYS[selectedSphere.sphere.keyNumber - 1];
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold font-mono text-xl">
                      #{selectedSphere.sphere.keyNumber}.{selectedSphere.sphere.line}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedSphere.name}</h3>
                      <span className="text-xs text-amber-400 font-semibold">{gk ? gk.name : "Gene Key"}</span>
                    </div>
                  </div>

                  {gk && (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
                        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Shadow</span>
                          <span className="font-bold text-rose-400 mt-1 block">{gk.shadow}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Gift</span>
                          <span className="font-bold text-emerald-400 mt-1 block">{gk.gift}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Siddhi</span>
                          <span className="font-bold text-sky-400 mt-1 block">{gk.siddhi}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <h4 className="font-bold text-slate-200">Gene Key Wisdom</h4>
                        <p className="text-slate-300 leading-relaxed">{gk.description}</p>
                      </div>
                    </div>
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
