import React, { useState } from "react";
import { Profile } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { Sparkles, Compass, Eye, Info, Download, Copy, Check, X } from "lucide-react";
import { downloadSvgAsPng, downloadSvgRaw, copySvgToClipboard } from "../utils/exportGraphics";

interface AstrologyMandalaSVGProps {
  profile: Profile;
  onSelectPlacement?: (planet: string, sign: string, degree: number, house: number) => void;
}

export const AstrologyMandalaSVG: React.FC<AstrologyMandalaSVGProps> = ({ profile, onSelectPlacement }) => {
  const [selectedItem, setSelectedItem] = useState<{ name: string; symbol?: string; sign: string; degree: number; exactDegree?: string; house: number; desc: string; color?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const comp = getProfileComputed(profile);
  const astro = comp.astrology;

  const handleCopy = async () => {
    const success = await copySvgToClipboard("astrology-natal-mandala-svg");
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    setExporting(true);
    try {
      await downloadSvgAsPng("astrology-natal-mandala-svg", `${profile.firstName}_Sacred_Birth_Chart_Art`, 2);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    downloadSvgRaw("astrology-natal-mandala-svg", `${profile.firstName}_Sacred_Birth_Chart_Art`);
  };

  const zodiacSigns = [
    { sign: "Aries", symbol: "♈", element: "fire", angle: 0, ruler: "Mars" },
    { sign: "Taurus", symbol: "♉", element: "earth", angle: 30, ruler: "Venus" },
    { sign: "Gemini", symbol: "♊", element: "air", angle: 60, ruler: "Mercury" },
    { sign: "Cancer", symbol: "♋", element: "water", angle: 90, ruler: "Moon" },
    { sign: "Leo", symbol: "♌", element: "fire", angle: 120, ruler: "Sun" },
    { sign: "Virgo", symbol: "♍", element: "earth", angle: 150, ruler: "Mercury" },
    { sign: "Libra", symbol: "♎", element: "air", angle: 180, ruler: "Venus" },
    { sign: "Scorpio", symbol: "♏", element: "water", angle: 210, ruler: "Pluto" },
    { sign: "Sagittarius", symbol: "♐", element: "fire", angle: 240, ruler: "Jupiter" },
    { sign: "Capricorn", symbol: "♑", element: "earth", angle: 270, ruler: "Saturn" },
    { sign: "Aquarius", symbol: "♒", element: "air", angle: 300, ruler: "Uranus" },
    { sign: "Pisces", symbol: "♓", element: "water", angle: 330, ruler: "Neptune" },
  ];

  // Helper to get angle based on sign + degree
  const getZodiacAngle = (signName: string, degreeInSign = 15) => {
    const found = zodiacSigns.find((z) => z.sign.toLowerCase() === signName.toLowerCase());
    const baseAngle = found ? found.angle : 0;
    return (baseAngle + degreeInSign - 90) * (Math.PI / 180);
  };

  const hdPositions = comp.humanDesign?.personalityPositions || {};

  // Helper to extract dynamic planet coordinate from calculated ephemeris
  const getPlanetData = (name: string, fallbackSign: string, fallbackDeg: number, color: string, symbol: string, desc: string) => {
    const pos = hdPositions[name];
    if (pos && typeof pos.longitude === "number") {
      const deg = pos.longitude;
      const signIdx = Math.floor(deg / 30) % 12;
      const degInSign = deg % 30;
      const house = ((signIdx + 1) % 12) + 1;
      return {
        name,
        symbol,
        sign: zodiacSigns[signIdx]?.sign || fallbackSign,
        degree: Math.round(degInSign),
        exactDegree: degInSign.toFixed(1),
        longitude: deg,
        house,
        color,
        desc
      };
    }
    return {
      name,
      symbol,
      sign: fallbackSign,
      degree: fallbackDeg,
      exactDegree: fallbackDeg.toFixed(1),
      longitude: 0,
      house: 1,
      color,
      desc
    };
  };

  // Planetary positions on the wheel calculated dynamically from the exact birthday
  const planets = [
    getPlanetData("Sun", astro.sunSign, 15, "#f59e0b", "☉", "Core conscious identity, vital solar force, and sovereign purpose."),
    getPlanetData("Moon", astro.moonSign, 18, "#c084fc", "☽", "Subconscious sanctuary, primal emotional safety, and psychic intuition."),
    getPlanetData("Mercury", astro.sunSign, 22, "#38bdf8", "☿", "Mental frequency, pattern perception, and communication conduit."),
    getPlanetData("Venus", astro.risingSign, 12, "#ec4899", "♀", "Magnetic attraction, sovereign values, harmony, and creative beauty."),
    getPlanetData("Mars", astro.dominantPlanet === "Mars" ? astro.sunSign : "Scorpio", 8, "#f43f5e", "♂", "Primal drive, courage, action velocity, and boundary sovereignty."),
    getPlanetData("Jupiter", "Sagittarius", 24, "#eab308", "♃", "Higher wisdom, sovereign expansion, benevolent fortune, and grace."),
    getPlanetData("Saturn", "Capricorn", 14, "#94a3b8", "♄", "Sacred structure, master discipline, karmic boundaries, and lasting authority."),
    getPlanetData("Uranus", "Taurus", 19, "#22d3ee", "♅", "Awakening, quantum breakthroughs, innovation, and sudden revelation."),
    getPlanetData("Neptune", "Pisces", 27, "#818cf8", "♆", "Mystical transcendence, spiritual imagination, dreaming, and boundless oneness."),
    getPlanetData("Pluto", "Capricorn", 29, "#fb7185", "♇", "Underworld transformation, soul power, rebirth, and evolutionary alchemy."),
    getPlanetData("North Node", astro.northNode || "Taurus", 5, "#34d399", "☊", "Destiny trajectory, future evolution, and cosmic soul growth."),
  ];

  const centerX = 300;
  const centerY = 300;
  
  // Mandala Geometry Radii (matching birthchart_a3a9c4da.png)
  const hexagramOuterR = 290;
  const hexagramInnerR = 265;
  const outerZodiacR = 262;
  const midZodiacR = 205;
  const planetR = 165;
  const innerHouseR = 125;
  const centerHubR = 48;

  // 64 I-Ching Hexagram Yin/Yang 6-line bars generator
  const hexagrams64 = Array.from({ length: 64 }).map((_, i) => {
    // Deterministic 6-line trigram bit pattern (line 0 bottom to line 5 top)
    const lines = [
      (i >> 0) & 1,
      (i >> 1) & 1,
      (i >> 2) & 1,
      (i >> 3) & 1,
      (i >> 4) & 1,
      (i >> 5) & 1,
    ];
    const angle = (i * 360) / 64 - 90;
    return { index: i + 1, angle, lines };
  });

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 border border-teal-500/25 shadow-2xl relative overflow-hidden" id="astrology-natal-mandala">
      {/* Decorative cosmic background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>SACRED CELESTIAL ART MANDALA</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-serif mt-1">
            {profile.firstName}&apos;s Sacred Natal Birth Wheel
          </h2>
          <p className="text-xs text-slate-400">
            Calculated for {profile.dateOfBirth} • {astro.sunSign} Sun, {astro.moonSign} Moon, {astro.risingSign} Ascendant
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedItem && (
            <button
              onClick={() => setSelectedItem(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono transition-colors"
            >
              Reset Selection
            </button>
          )}

          {/* Graphic Export Controls */}
          <button
            onClick={handleDownloadPng}
            disabled={exporting}
            className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/35 text-teal-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 shadow-sm"
            title="Download high-resolution PNG graphic of your birth chart"
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
            title="Copy birth chart graphic to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "Copied!" : "Copy Graphic"}</span>
          </button>
        </div>
      </div>

      {/* SVG ART CHART CONTAINER (MATCHING BIRTHCHART_A3A9C4DA.PNG) */}
      <div className="relative flex justify-center items-center py-4">
        <svg 
          id="astrology-natal-mandala-svg"
          viewBox="0 0 600 600" 
          className="w-full max-w-[580px] h-auto drop-shadow-[0_0_35px_rgba(45,212,191,0.15)] filter"
        >
          <defs>
            <radialGradient id="spaceCenterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#090d16" stopOpacity="0.98" />
              <stop offset="80%" stopColor="#030712" stopOpacity="0.99" />
              <stop offset="100%" stopColor="#02040a" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="celestialBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Space Disc */}
          <circle cx={centerX} cy={centerY} r={hexagramOuterR + 4} fill="url(#spaceCenterGrad)" stroke="#4338ca" strokeWidth="1.5" />

          {/* 1. OUTER 64 I-CHING HEXAGRAMS RING (MATCHING BIRTHCHART_A3A9C4DA.PNG) */}
          <circle cx={centerX} cy={centerY} r={hexagramOuterR} fill="none" stroke="#6366f1" strokeWidth="0.8" opacity="0.6" />
          <circle cx={centerX} cy={centerY} r={hexagramInnerR} fill="none" stroke="#6366f1" strokeWidth="0.8" opacity="0.6" />

          {hexagrams64.map((hex, idx) => {
            const rad = (hex.angle * Math.PI) / 180;
            const barWidth = 7;
            const lineSpacing = 3.6;

            return (
              <g 
                key={idx}
                transform={`rotate(${hex.angle + 90}, ${centerX}, ${centerY}) translate(${centerX}, ${centerY - hexagramInnerR - 12})`}
              >
                {/* 6 stacked Yin / Yang lines */}
                {hex.lines.map((isYang, lineIdx) => {
                  const y = (lineIdx - 2.5) * lineSpacing;
                  if (isYang === 1) {
                    // Solid Yang line
                    return (
                      <line
                        key={lineIdx}
                        x1={-barWidth}
                        y1={y}
                        x2={barWidth}
                        y2={y}
                        stroke="#818cf8"
                        strokeWidth="1.2"
                      />
                    );
                  } else {
                    // Broken Yin line (two segments with gap)
                    return (
                      <g key={lineIdx}>
                        <line
                          x1={-barWidth}
                          y1={y}
                          x2={-1.4}
                          y2={y}
                          stroke="#818cf8"
                          strokeWidth="1.2"
                        />
                        <line
                          x1={1.4}
                          y1={y}
                          x2={barWidth}
                          y2={y}
                          stroke="#818cf8"
                          strokeWidth="1.2"
                        />
                      </g>
                    );
                  }
                })}
              </g>
            );
          })}

          {/* 2. ZODIAC SECTORS & CONCENTRIC TRACKS */}
          <circle cx={centerX} cy={centerY} r={outerZodiacR} fill="none" stroke="#475569" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={midZodiacR} fill="none" stroke="#334155" strokeWidth="0.8" />
          <circle cx={centerX} cy={centerY} r={planetR + 15} fill="none" stroke="#1e293b" strokeWidth="0.8" />
          <circle cx={centerX} cy={centerY} r={innerHouseR} fill="none" stroke="#334155" strokeWidth="0.8" />

          {/* 12 Zodiac Segments & Glyphs */}
          {zodiacSigns.map((z) => {
            const radStart = (z.angle - 90) * (Math.PI / 180);
            const radMid = (z.angle + 15 - 90) * (Math.PI / 180);

            // Dividing ray across Zodiac and planetary tracks
            const x1 = centerX + innerHouseR * Math.cos(radStart);
            const y1 = centerY + innerHouseR * Math.sin(radStart);
            const x2 = centerX + outerZodiacR * Math.cos(radStart);
            const y2 = centerY + outerZodiacR * Math.sin(radStart);

            const glyphR = (midZodiacR + outerZodiacR) / 2;
            const gx = centerX + glyphR * Math.cos(radMid);
            const gy = centerY + glyphR * Math.sin(radMid);

            const isSignActive = [astro.sunSign, astro.moonSign, astro.risingSign].some(
              (s) => s.toLowerCase() === z.sign.toLowerCase()
            );

            return (
              <g key={z.sign}>
                {/* Sector border line */}
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="0.8" />

                {/* Zodiac glyph */}
                <text
                  x={gx}
                  y={gy + 5}
                  textAnchor="middle"
                  fontSize={isSignActive ? "17" : "14"}
                  fill={isSignActive ? "#2dd4bf" : "#e2e8f0"}
                  fontWeight={isSignActive ? "bold" : "normal"}
                  className="transition-all cursor-pointer select-none font-serif"
                  filter={isSignActive ? "url(#glowGold)" : undefined}
                >
                  {z.symbol}
                </text>
              </g>
            );
          })}

          {/* 12 House Dividing Rays into Hub */}
          {Array.from({ length: 12 }).map((_, hIdx) => {
            const hAngle = (hIdx * 30 - 90) * (Math.PI / 180);
            const hx1 = centerX + centerHubR * Math.cos(hAngle);
            const hy1 = centerY + centerHubR * Math.sin(hAngle);
            const hx2 = centerX + innerHouseR * Math.cos(hAngle);
            const hy2 = centerY + innerHouseR * Math.sin(hAngle);

            const isAxis = hIdx === 0 || hIdx === 3 || hIdx === 6 || hIdx === 9; // Asc, IC, Dsc, MC

            return (
              <line 
                key={hIdx} 
                x1={hx1} 
                y1={hy1} 
                x2={hx2} 
                y2={hy2} 
                stroke={isAxis ? "#2dd4bf" : "#334155"} 
                strokeWidth={isAxis ? "1.5" : "0.6"} 
              />
            );
          })}

          {/* Harmonic Aspect Lines Web */}
          {planets.map((p1, i) => {
            return planets.slice(i + 1).map((p2, j) => {
              const a1 = (p1.longitude - 90) * (Math.PI / 180);
              const a2 = (p2.longitude - 90) * (Math.PI / 180);

              const px1 = centerX + innerHouseR * Math.cos(a1);
              const py1 = centerY + innerHouseR * Math.sin(a1);
              const px2 = centerX + innerHouseR * Math.cos(a2);
              const py2 = centerY + innerHouseR * Math.sin(a2);

              const diffDeg = Math.abs(Math.round(((a1 - a2) * (180 / Math.PI)) % 360));
              const normalizedDiff = diffDeg > 180 ? 360 - diffDeg : diffDeg;

              // Trine ~120 deg
              if (Math.abs(normalizedDiff - 120) < 10) {
                return <line key={`${i}-${j}`} x1={px1} y1={py1} x2={px2} y2={py2} stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3,3" />;
              }
              // Sextile ~60 deg
              if (Math.abs(normalizedDiff - 60) < 8) {
                return <line key={`${i}-${j}`} x1={px1} y1={py1} x2={px2} y2={py2} stroke="#fbbf24" strokeWidth="0.75" strokeOpacity="0.35" />;
              }
              // Opposition ~180 deg
              if (Math.abs(normalizedDiff - 180) < 10) {
                return <line key={`${i}-${j}`} x1={px1} y1={py1} x2={px2} y2={py2} stroke="#f43f5e" strokeWidth="0.8" strokeOpacity="0.35" />;
              }
              return null;
            });
          })}

          {/* Central Hub Rings matching template */}
          <circle cx={centerX} cy={centerY} r={centerHubR} fill="#090d16" stroke="#475569" strokeWidth="1" />
          <circle cx={centerX} cy={centerY} r={centerHubR - 14} fill="#02040a" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6" />
          <circle cx={centerX} cy={centerY} r={4} fill="#2dd4bf" />

          {/* 3. DYNAMIC PLANETARY PLACEMENTS (ROTATED TO EXACT BIRTHDAY LONGITUDES) */}
          {planets.map((planet, pIdx) => {
            const rad = (planet.longitude - 90) * (Math.PI / 180);
            const radius = planetR;
            const px = centerX + radius * Math.cos(rad);
            const py = centerY + radius * Math.sin(rad);

            const isSelected = selectedItem?.name === planet.name;

            return (
              <g 
                key={pIdx}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedItem(planet);
                  if (onSelectPlacement) onSelectPlacement(planet.name, planet.sign, planet.degree, planet.house);
                }}
              >
                {/* Node Halo */}
                <circle
                  cx={px}
                  cy={py}
                  r={isSelected ? 16 : 13}
                  fill={planet.color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                  stroke={planet.color}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300"
                />

                {/* Planet Glyph */}
                <text
                  x={px}
                  y={py + 4}
                  textAnchor="middle"
                  fontSize={isSelected ? "14" : "12"}
                  fontWeight="bold"
                  fill="#ffffff"
                  className="select-none pointer-events-none font-serif"
                >
                  {planet.symbol}
                </text>

                {/* Subtitle tag with exact degree within sign */}
                <text
                  x={px}
                  y={py + 18}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fill={planet.color}
                  className="select-none pointer-events-none font-bold opacity-90"
                >
                  {planet.exactDegree}°
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center Guidance Hint */}
      <div className="text-center text-[11px] text-slate-400 font-mono pt-2">
        Click any planetary glyph (☉ Sun, ☽ Moon, Asc, ☿, ♀, ♂, ♃, ♄) to open its centered sacred coordinate reading.
      </div>

      {/* PERFECTLY CENTERED SACRED PLANETARY PLACEMENT MODAL */}
      {selectedItem && (
        <div 
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-teal-500/35 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-slate-100 animate-scale-up"
          >
            {/* Top Right Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pr-8 border-b border-slate-800 pb-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold font-serif shadow-lg border"
                style={{ 
                  backgroundColor: `${selectedItem.color || "#2dd4bf"}15`, 
                  borderColor: `${selectedItem.color || "#2dd4bf"}40`,
                  color: selectedItem.color || "#2dd4bf" 
                }}
              >
                {selectedItem.symbol || "☉"}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                  Sacred Natal Coordinate • House {selectedItem.house}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {selectedItem.name} in {selectedItem.sign}
                </h3>
              </div>
            </div>

            {/* Coordinate Pill Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block uppercase">Degree</span>
                <span className="font-bold text-teal-300 text-sm">{selectedItem.exactDegree || selectedItem.degree}°</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block uppercase">Sign</span>
                <span className="font-bold text-amber-300 text-sm">{selectedItem.sign}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block uppercase">House</span>
                <span className="font-bold text-purple-300 text-sm">House {selectedItem.house}</span>
              </div>
            </div>

            {/* Sovereign Esoteric Synthesis */}
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/25 space-y-1.5 text-xs sm:text-sm">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                Archetypal Resonance
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {selectedItem.desc}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Affinity Lifestyle Consulting • Sacred Mandala
              </span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-colors"
              >
                Close Coordinate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
