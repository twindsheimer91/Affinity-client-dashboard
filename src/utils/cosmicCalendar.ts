import { Profile } from "../types";
import { getProfileComputed } from "./calculations";

// Zodiac Signs Reference
export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", quality: "Cardinal", ruler: "Mars" },
  { name: "Taurus", symbol: "♉", element: "Earth", quality: "Fixed", ruler: "Venus" },
  { name: "Gemini", symbol: "♊", element: "Air", quality: "Mutable", ruler: "Mercury" },
  { name: "Cancer", symbol: "♋", element: "Water", quality: "Cardinal", ruler: "Moon" },
  { name: "Leo", symbol: "♌", element: "Fire", quality: "Fixed", ruler: "Sun" },
  { name: "Virgo", symbol: "♍", element: "Earth", quality: "Mutable", ruler: "Mercury" },
  { name: "Libra", symbol: "♎", element: "Air", quality: "Cardinal", ruler: "Venus" },
  { name: "Scorpio", symbol: "♏", element: "Water", quality: "Fixed", ruler: "Pluto" },
  { name: "Sagittarius", symbol: "♐", element: "Fire", quality: "Mutable", ruler: "Jupiter" },
  { name: "Capricorn", symbol: "♑", element: "Earth", quality: "Cardinal", ruler: "Saturn" },
  { name: "Aquarius", symbol: "♒", element: "Air", quality: "Fixed", ruler: "Uranus" },
  { name: "Pisces", symbol: "♓", element: "Water", quality: "Mutable", ruler: "Neptune" },
];

export interface LunarPhaseInfo {
  phaseName: string;
  emoji: string;
  illumination: number; // 0 to 100
  phaseAngle: number;
  stage: "New" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous" | "Full" | "Waning Gibbous" | "Last Quarter" | "Waning Crescent" | "Dark Moon";
  moonSign: string;
  moonDegree: number;
  sunSign: string;
  sunDegree: number;
  summary: string;
}

export interface PlanetaryPlacement {
  planet: string;
  symbol: string;
  longitude: number;
  sign: string;
  degreeInSign: number;
  gate: number;
  line: number;
}

export interface TransitAspect {
  planet1: string;
  aspect: "Conjunction" | "Opposition" | "Trine" | "Square" | "Sextile";
  planet2: string;
  orb: number;
  interpretation: string;
  impact: "High" | "Medium" | "Subtle";
}

export interface DailyTransitData {
  dateStr: string; // YYYY-MM-DD
  displayDate: string;
  lunarPhase: LunarPhaseInfo;
  placements: Record<string, PlanetaryPlacement>;
  transitSunGate: number;
  transitSunLine: number;
  transitEarthGate: number;
  transitMoonGate: number;
  aspects: TransitAspect[];
  isOptimalMeditation: boolean;
  meditationReason: string;
  isOptimalGoalSetting: boolean;
  goalSettingReason: string;
  energyVibe: string;
  electromagneticChannel: {
    channelName: string;
    transitGate: number;
    natalGate: number;
    description: string;
  } | null;
  personalDailyReading: {
    theme: string;
    mantra: string;
    readingEssay: string;
    meditationProtocol: string;
    goalSettingProtocol: string;
    recommendedHz: number;
  };
}

// Low-level Ephemeris Math
function normDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}
function rad2deg(r: number): number {
  return (r * 180) / Math.PI;
}

function getJulianDay(year: number, month: number, day: number, hour: number = 12): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    hour / 24
  );
}

function getSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const M = normDeg(357.5291 + 35999.0503 * T);
  const Mrad = deg2rad(M);
  const L =
    280.4665 +
    36000.7698 * T +
    (1.9146 - 0.0048 * T) * Math.sin(Mrad) +
    0.02 * Math.sin(2 * Mrad) +
    0.0003 * Math.sin(3 * Mrad);
  return normDeg(L);
}

function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = normDeg(218.3165 + 481267.8813 * T);
  const M = normDeg(134.9634 + 477198.8676 * T);
  const F = normDeg(93.2721 + 483202.0175 * T);
  const D = normDeg(297.8502 + 445267.1114 * T);
  const Ms = normDeg(357.5291 + 35999.0503 * T);

  const L =
    L0 +
    6.2886 * Math.sin(deg2rad(M)) +
    1.274 * Math.sin(deg2rad(2 * D - M)) +
    0.6583 * Math.sin(deg2rad(2 * D)) +
    0.2136 * Math.sin(deg2rad(2 * M)) -
    0.1851 * Math.sin(deg2rad(Ms)) -
    0.1143 * Math.sin(deg2rad(2 * F)) +
    0.0588 * Math.sin(deg2rad(2 * D - 2 * M)) +
    0.0572 * Math.sin(deg2rad(2 * D - Ms - M)) +
    0.0533 * Math.sin(deg2rad(2 * D + M));
  return normDeg(L);
}

function getPlanetLongitude(jd: number, planetName: string): number {
  const elemsMap: Record<string, any> = {
    Mercury: { N0: 48.3313, N1: 0.0000324, i0: 7.0047, i1: 0.00000005, w0: 29.1241, w1: 0.0000101, a0: 0.387098, a1: 0, e0: 0.205635, e1: 0.000000025, M0: 174.7947, M1: 4.0923344368 },
    Venus:   { N0: 76.6799, N1: 0.0000246, i0: 3.3946, i1: 0.00000003, w0: 54.891,  w1: 0.0000138, a0: 0.72333,  a1: 0, e0: 0.006773, e1: -0.000000049, M0: 50.115,   M1: 1.6021302244 },
    Mars:    { N0: 49.5574, N1: 0.0000211, i0: 1.8497, i1: -0.00000002, w0: 286.5016, w1: 0.0000293, a0: 1.523688, a1: 0, e0: 0.093405, e1: 0.000000092, M0: 19.387,  M1: 0.5240207766 },
    Jupiter: { N0: 100.4542, N1: 0.0000277, i0: 1.303,  i1: -0.00000004, w0: 273.8777, w1: 0.0000165, a0: 5.20256,  a1: 0, e0: 0.048498, e1: 0.000000163, M0: 19.895,  M1: 0.0830853001 },
    Saturn:  { N0: 113.6655, N1: 0.0000239, i0: 2.4886, i1: -0.00000004, w0: 339.3939, w1: 0.0000297, a0: 9.55475,  a1: 0, e0: 0.055546, e1: -0.000000346, M0: 316.967, M1: 0.0334442282 },
    Uranus:  { N0: 74.0005, N1: 0.0000139, i0: 0.7733, i1: 0.00000002, w0: 96.6612, w1: 0.0000305, a0: 19.18171, a1: -0.00000002, e0: 0.047318, e1: 0.000000075, M0: 142.5905, M1: 0.011725806 },
    Neptune: { N0: 131.7806, N1: 0.0000302, i0: 1.77,   i1: -0.00000001, w0: 272.8461, w1: -0.000006, a0: 30.05826, a1: 0.00000003, e0: 0.008606, e1: 0.000000021, M0: 260.2471, M1: 0.005995147 },
    Pluto:   { N0: 110.3034, N1: 0.000018,  i0: 17.1417, i1: 0.0000001, w0: 113.7633, w1: 0.00003,  a0: 39.48168, a1: 0, e0: 0.248807, e1: 0, M0: 14.882, M1: 0.003975 },
  };

  const elems = elemsMap[planetName];
  if (!elems) return getSunLongitude(jd);

  const d = jd - 2451545.0;
  const N = normDeg(elems.N0 + elems.N1 * d);
  const i = elems.i0 + elems.i1 * d;
  const w = normDeg(elems.w0 + elems.w1 * d);
  const a = elems.a0 + elems.a1 * d;
  const e = elems.e0 + elems.e1 * d;
  const M = normDeg(elems.M0 + elems.M1 * d);

  let E = M;
  for (let k = 0; k < 10; k++) {
    E = M + rad2deg(e * Math.sin(deg2rad(E)));
  }
  const x = a * (Math.cos(deg2rad(E)) - e);
  const y = a * Math.sqrt(1 - e * e) * Math.sin(deg2rad(E));

  const r = Math.sqrt(x * x + y * y);
  const v = normDeg(rad2deg(Math.atan2(y, x)));

  const xeclip =
    r *
    (Math.cos(deg2rad(N)) * Math.cos(deg2rad(v + w)) -
      Math.sin(deg2rad(N)) * Math.sin(deg2rad(v + w)) * Math.cos(deg2rad(i)));
  const yeclip =
    r *
    (Math.sin(deg2rad(N)) * Math.cos(deg2rad(v + w)) +
      Math.cos(deg2rad(N)) * Math.sin(deg2rad(v + w)) * Math.cos(deg2rad(i)));

  const sunL = getSunLongitude(jd);
  const xEarth = Math.cos(deg2rad(sunL + 180));
  const yEarth = Math.sin(deg2rad(sunL + 180));

  const xGeo = xeclip - xEarth;
  const yGeo = yeclip - yEarth;

  return normDeg(rad2deg(Math.atan2(yGeo, xGeo)));
}

// 64 Rave Gates Wheel Order
const RAVE_WHEEL_GATES = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
];

function longitudeToGateAndLine(deg: number): { gate: number; line: number } {
  const wheelOffsetDeg = normDeg(deg + 58);
  const fraction = wheelOffsetDeg / 360;
  const index = Math.floor(fraction * 64) % 64;
  const gate = RAVE_WHEEL_GATES[index];
  const gateFraction = (wheelOffsetDeg % (360 / 64)) / (360 / 64);
  const line = Math.floor(gateFraction * 6) + 1;
  return { gate, line: Math.min(Math.max(line, 1), 6) };
}

// 36 Human Design Channels
const HD_CHANNELS = [
  { g1: 61, g2: 24, name: "Awareness (61-24)", c1: "Head", c2: "Ajna", desc: "A design of mental think-through and sudden epiphany." },
  { g1: 43, g2: 23, name: "Structuring (43-23)", c1: "Ajna", c2: "Throat", desc: "A design of individuality, insight from genius to freak." },
  { g1: 28, g2: 38, name: "Struggle (28-38)", c1: "Spleen", c2: "Root", desc: "A design of stubborn purpose and finding worth fighting for." },
  { g1: 57, g2: 20, name: "Brain Wave (57-20)", c1: "Spleen", c2: "Throat", desc: "A design of penetrating intuitive clarity in the now." },
  { g1: 60, g2: 3,  name: "Mutation (60-3)", c1: "Root", c2: "Sacral", desc: "A design of quantum pulse, radical breakthroughs and new directions." },
  { g1: 14, g2: 2,  name: "Beat (14-2)", c1: "Sacral", c2: "G", desc: "A design of generating prosperity, resources and direction." },
  { g1: 8,  g2: 1,  name: "Inspiration (8-1)", c1: "Throat", c2: "G", desc: "A design of creative role-modeling and authentic self-expression." },
  { g1: 34, g2: 10, name: "Exploration (34-10)", c1: "Sacral", c2: "G", desc: "A design of effortless self-love and convictions." },
  { g1: 51, g2: 25, name: "Initiation (51-25)", c1: "Heart", c2: "G", desc: "A design of courage to leap into spiritual awakening." },
  { g1: 63, g2: 4,  name: "Logic (63-4)", c1: "Head", c2: "Ajna", desc: "A design of questioning and developing verifiable formulas." },
  { g1: 17, g2: 62, name: "Acceptance (17-62)", c1: "Ajna", c2: "Throat", desc: "A design of organizing opinions and detail into actionable plans." },
  { g1: 18, g2: 58, name: "Judgment (18-58)", c1: "Spleen", c2: "Root", desc: "A design of insatiable joy in perfecting life and systems." },
  { g1: 48, g2: 16, name: "Wavelength (48-16)", c1: "Spleen", c2: "Throat", desc: "A design of talent, depth, and mastery through enthusiastic practice." },
  { g1: 52, g2: 9,  name: "Concentration (52-9)", c1: "Root", c2: "Sacral", desc: "A design of focused stillness, sustained attention and detail." },
  { g1: 15, g2: 5,  name: "Rhythm (15-5)", c1: "G", c2: "Sacral", desc: "A design of universal timing, natural patterns and magnetism." },
  { g1: 7,  g2: 31, name: "Alpha (7-31)", c1: "G", c2: "Throat", desc: "A design of democratic leadership that guides the collective." },
  { g1: 64, g2: 47, name: "Abstraction (64-47)", c1: "Head", c2: "Ajna", desc: "A design of mental clarity born from remembering past lessons." },
  { g1: 11, g2: 56, name: "Curiosity (11-56)", c1: "Ajna", c2: "Throat", desc: "A design of searching, visual storytelling, and wandering inspiration." },
  { g1: 41, g2: 30, name: "Recognition (41-30)", c1: "Root", c2: "Solar Plexus", desc: "A design of focused emotional desire and starting new cycles." },
  { g1: 35, g2: 36, name: "Transitoriness (35-36)", c1: "Throat", c2: "Solar Plexus", desc: "A design of worldly exploration and gathering experiential wisdom." },
  { g1: 53, g2: 42, name: "Maturation (53-42)", c1: "Root", c2: "Sacral", desc: "A design of balanced growth, initiating and finishing cycles." },
  { g1: 29, g2: 46, name: "Discovery (29-46)", c1: "Sacral", c2: "G", desc: "A design of wholehearted commitment to physical experience." },
  { g1: 13, g2: 33, name: "Prodigal (13-33)", c1: "G", c2: "Throat", desc: "A design of listening, witness consciousness, and retreating to synthesize." },
  { g1: 54, g2: 32, name: "Transformation (54-32)", c1: "Root", c2: "Spleen", desc: "A design of ambitious endurance, transforming vision into enduring legacy." },
  { g1: 44, g2: 26, name: "Surrender (44-26)", c1: "Spleen", c2: "Heart", desc: "A design of enterprise, instinct for talent, and marketing truths." },
  { g1: 19, g2: 49, name: "Synthesis (19-49)", c1: "Root", c2: "Solar Plexus", desc: "A design of tribal sensitivity, principles, and shared sanctuary." },
  { g1: 37, g2: 40, name: "Community (37-40)", c1: "Solar Plexus", c2: "Heart", desc: "A design of mutual loyalty, emotional bonding, and shared nourishment." },
  { g1: 21, g2: 45, name: "Money (21-45)", c1: "Heart", c2: "Throat", desc: "A design of material sovereignty, controlling territory and communal wealth." },
  { g1: 59, g2: 6,  name: "Mating (59-6)", c1: "Sacral", c2: "Solar Plexus", desc: "A design of profound bonding, emotional openness and intimacy." },
  { g1: 27, g2: 50, name: "Preservation (27-50)", c1: "Sacral", c2: "Spleen", desc: "A design of custodial care, protective values, and nurturing survival." },
  { g1: 57, g2: 34, name: "Power (57-34)", c1: "Spleen", c2: "Sacral", desc: "A design of pure archetype survival and primal health empowerment." },
  { g1: 57, g2: 10, name: "Perfected Form (57-10)", c1: "Spleen", c2: "G", desc: "A design of surviving through honoring self-worth and beauty." },
  { g1: 20, g2: 10, name: "Awakening (20-10)", c1: "Throat", c2: "G", desc: "A design of higher self-awareness expressed in the present moment." },
  { g1: 20, g2: 34, name: "Charisma (20-34)", c1: "Throat", c2: "Sacral", desc: "A design where thoughts and gut power manifest effortlessly into busy action." },
];

/**
 * Calculates complete astronomical transit and lunar snapshot for any calendar date
 */
export function getDailyTransitData(date: Date, profile: Profile): DailyTransitData {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const jd = getJulianDay(year, month, day, 12);

  const sunLong = getSunLongitude(jd);
  const moonLong = getMoonLongitude(jd);

  // Lunar Phase Calculation
  const phaseAngle = normDeg(moonLong - sunLong);
  const illumination = ((1 - Math.cos(deg2rad(phaseAngle))) / 2) * 100;

  let stage: LunarPhaseInfo["stage"] = "New";
  let emoji = "🌑";
  let phaseName = "New Moon";
  let phaseSummary = "A time of zero-point stillness, planting seeds in the dark fertile void.";

  if (phaseAngle < 22.5 || phaseAngle >= 337.5) {
    stage = "New";
    emoji = "🌑";
    phaseName = "New Moon";
    phaseSummary = "Reset and quiet calibration. Ideal for setting long-range soul intentions.";
  } else if (phaseAngle < 67.5) {
    stage = "Waxing Crescent";
    emoji = "🌒";
    phaseName = "Waxing Crescent";
    phaseSummary = "Fresh momentum emerging. Take initial grounded steps forward.";
  } else if (phaseAngle < 112.5) {
    stage = "First Quarter";
    emoji = "🌓";
    phaseName = "First Quarter (Half Moon)";
    phaseSummary = "Overcoming early friction. Make decisions and fortify your commitments.";
  } else if (phaseAngle < 157.5) {
    stage = "Waxing Gibbous";
    emoji = "🌔";
    phaseName = "Waxing Gibbous";
    phaseSummary = "Refining and perfecting systems. High energy for creative execution.";
  } else if (phaseAngle < 202.5) {
    stage = "Full";
    emoji = "🌕";
    phaseName = "Full Moon";
    phaseSummary = "Peak illumination and emotional culmination. Great for clarity and celebrating wins.";
  } else if (phaseAngle < 247.5) {
    stage = "Waning Gibbous";
    emoji = "🌖";
    phaseName = "Waning Gibbous (Disseminating)";
    phaseSummary = "Sharing wisdom, teaching, and harvesting the fruits of this cycle.";
  } else if (phaseAngle < 292.5) {
    stage = "Last Quarter";
    emoji = "🌗";
    phaseName = "Last Quarter";
    phaseSummary = "Forgiveness and conscious release. Clearing physical and mental clutter.";
  } else {
    stage = "Waning Crescent";
    emoji = "🌘";
    phaseName = "Waning Crescent (Balsamic)";
    phaseSummary = "Surrender, deep sleep, and spiritual sanctuary before the rebirth.";
  }

  const moonSignIdx = Math.floor(moonLong / 30) % 12;
  const moonDegree = Math.round(moonLong % 30);
  const moonSign = ZODIAC_SIGNS[moonSignIdx].name;

  const sunSignIdx = Math.floor(sunLong / 30) % 12;
  const sunDegree = Math.round(sunLong % 30);
  const sunSign = ZODIAC_SIGNS[sunSignIdx].name;

  const lunarPhase: LunarPhaseInfo = {
    phaseName,
    emoji,
    illumination: Math.round(illumination),
    phaseAngle: Math.round(phaseAngle),
    stage,
    moonSign,
    moonDegree,
    sunSign,
    sunDegree,
    summary: phaseSummary,
  };

  // Planetary placements
  const planetNames = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
  const planetSymbols: Record<string, string> = {
    Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇"
  };

  const placements: Record<string, PlanetaryPlacement> = {};
  planetNames.forEach((p) => {
    let long = p === "Sun" ? sunLong : p === "Moon" ? moonLong : getPlanetLongitude(jd, p);
    long = normDeg(long);
    const sIdx = Math.floor(long / 30) % 12;
    const dInSign = Math.round(long % 30);
    const { gate, line } = longitudeToGateAndLine(long);
    placements[p] = {
      planet: p,
      symbol: planetSymbols[p] || "✦",
      longitude: long,
      sign: ZODIAC_SIGNS[sIdx].name,
      degreeInSign: dInSign,
      gate,
      line,
    };
  });

  const sunGateInfo = longitudeToGateAndLine(sunLong);
  const earthGateInfo = longitudeToGateAndLine(normDeg(sunLong + 180));
  const moonGateInfo = longitudeToGateAndLine(moonLong);

  // Aspects between major planets
  const aspects: TransitAspect[] = [];
  const testAspects = [
    { p1: "Sun", p2: "Mercury" },
    { p1: "Sun", p2: "Venus" },
    { p1: "Sun", p2: "Mars" },
    { p1: "Sun", p2: "Jupiter" },
    { p1: "Sun", p2: "Saturn" },
    { p1: "Moon", p2: "Venus" },
    { p1: "Moon", p2: "Mars" },
    { p1: "Venus", p2: "Mars" },
    { p1: "Venus", p2: "Jupiter" },
    { p1: "Mars", p2: "Pluto" },
    { p1: "Jupiter", p2: "Saturn" },
    { p1: "Mercury", p2: "Uranus" },
  ];

  testAspects.forEach(({ p1, p2 }) => {
    const l1 = placements[p1]?.longitude || 0;
    const l2 = placements[p2]?.longitude || 0;
    let diff = Math.abs(l1 - l2);
    if (diff > 180) diff = 360 - diff;

    if (diff <= 6) {
      aspects.push({
        planet1: p1,
        aspect: "Conjunction",
        planet2: p2,
        orb: Math.round(diff * 10) / 10,
        interpretation: `${p1} merges forces with ${p2}, intensifying focus and direct catalytic manifestation.`,
        impact: "High",
      });
    } else if (Math.abs(diff - 180) <= 6) {
      aspects.push({
        planet1: p1,
        aspect: "Opposition",
        planet2: p2,
        orb: Math.round(Math.abs(diff - 180) * 10) / 10,
        interpretation: `Polarity axis between ${p1} and ${p2}: call for integration rather than reactive swing.`,
        impact: "High",
      });
    } else if (Math.abs(diff - 120) <= 5) {
      aspects.push({
        planet1: p1,
        aspect: "Trine",
        planet2: p2,
        orb: Math.round(Math.abs(diff - 120) * 10) / 10,
        interpretation: `Harmonious celestial golden stream between ${p1} and ${p2}, bringing effortless flow and grace.`,
        impact: "Medium",
      });
    } else if (Math.abs(diff - 90) <= 5) {
      aspects.push({
        planet1: p1,
        aspect: "Square",
        planet2: p2,
        orb: Math.round(Math.abs(diff - 90) * 10) / 10,
        interpretation: `Constructive tension between ${p1} and ${p2}, urging you to break through stagnant patterns.`,
        impact: "Medium",
      });
    } else if (Math.abs(diff - 60) <= 4) {
      aspects.push({
        planet1: p1,
        aspect: "Sextile",
        planet2: p2,
        orb: Math.round(Math.abs(diff - 60) * 10) / 10,
        interpretation: `Creative collaborative opening between ${p1} and ${p2}, ripe for communication and synergy.`,
        impact: "Subtle",
      });
    }
  });

  // Calculate Natal Blueprint of user for Synastry & Electromagnetic Channel check
  const comp = getProfileComputed(profile);
  const userGates = new Set<number>([
    ...(comp.humanDesign?.personalityGates || []),
    ...(comp.humanDesign?.designGates || []),
  ]);

  // Check if today's Transit Sun or Moon gate connects with user's hanging gate to form a Channel
  let electromagneticChannel: DailyTransitData["electromagneticChannel"] = null;
  const transitGates = [sunGateInfo.gate, moonGateInfo.gate];

  for (const tGate of transitGates) {
    const candidateChannel = HD_CHANNELS.find((ch) => {
      if (ch.g1 === tGate && userGates.has(ch.g2) && !userGates.has(ch.g1)) {
        return true;
      }
      if (ch.g2 === tGate && userGates.has(ch.g1) && !userGates.has(ch.g2)) {
        return true;
      }
      return false;
    });

    if (candidateChannel) {
      const natalG = candidateChannel.g1 === tGate ? candidateChannel.g2 : candidateChannel.g1;
      electromagneticChannel = {
        channelName: candidateChannel.name,
        transitGate: tGate,
        natalGate: natalG,
        description: `Today's transit Gate ${tGate} activates your Natal Gate ${natalG}, temporarily illuminating the complete ${candidateChannel.name} in your BodyGraph! ${candidateChannel.desc}`,
      };
      break;
    }
  }

  // Determine Personalized Optimal Days
  const waterEarthSigns = ["Cancer", "Scorpio", "Pisces", "Taurus", "Virgo", "Capricorn"];
  const fireAirSigns = ["Aries", "Leo", "Sagittarius", "Gemini", "Libra", "Aquarius"];

  const isWaterOrEarthMoon = waterEarthSigns.includes(moonSign);
  const isFireOrAirMoon = fireAirSigns.includes(moonSign);
  const isNewOrDarkMoon = stage === "New" || stage === "Waning Crescent";
  const isWaxingCycle = stage === "Waxing Crescent" || stage === "First Quarter" || stage === "Waxing Gibbous";

  // Check aspect to user's natal Sun or Moon
  const natalSunSign = comp.astrology?.sunSign || "Aries";
  const natalMoonSign = comp.astrology?.moonSign || "Taurus";
  const userHdType = comp.humanDesign?.type || "Projector";

  const moonHarmonizesWithNatal = moonSign === natalMoonSign || moonSign === natalSunSign || isWaterOrEarthMoon;

  // Optimal Meditation Evaluation
  let isOptimalMeditation = false;
  let meditationReason = "";

  if (isNewOrDarkMoon) {
    isOptimalMeditation = true;
    meditationReason = `Balsamic / New Moon Void in ${moonSign}: Peak receptivity for clearing nervous system static and resting in Point Zero stillness.`;
  } else if (stage === "Full") {
    isOptimalMeditation = true;
    meditationReason = `Full Moon Illuminance (${illumination}%): Heightened psychic perception and aura radiance. Ideal for deep heart-coherence meditation.`;
  } else if (moonHarmonizesWithNatal && (userHdType === "Projector" || userHdType === "Reflector")) {
    isOptimalMeditation = true;
    meditationReason = `Moon in ${moonSign} harmonizes with your ${userHdType} frequency: Deep nourishment for your open centers and non-motorized energy field.`;
  } else if (isWaterOrEarthMoon) {
    isOptimalMeditation = true;
    meditationReason = `Moon transiting grounded ${moonSign}: Soothing somatic integration, ideal for breathwork and grounding excess mental pressure.`;
  } else {
    meditationReason = `Standard maintenance meditation: 15-20 minutes of Point Zero breathing to sustain baseline coherence.`;
  }

  // Optimal Goal Setting Evaluation
  let isOptimalGoalSetting = false;
  let goalSettingReason = "";

  if (isWaxingCycle && (isFireOrAirMoon || sunSign === "Aries" || sunSign === "Leo" || sunSign === "Sagittarius")) {
    isOptimalGoalSetting = true;
    goalSettingReason = `Waxing Moon in ${moonSign} + Sun in ${sunSign}: Solar-lunar forward momentum creates peak clarity for drafting milestones and initiating contracts.`;
  } else if (stage === "First Quarter") {
    isOptimalGoalSetting = true;
    goalSettingReason = `First Quarter Phase: Breaking through hesitation. Perfect timing to audit your SMART goals and commit to concrete deadlines.`;
  } else if (electromagneticChannel !== null) {
    isOptimalGoalSetting = true;
    goalSettingReason = `Cosmic Channel Activation (${electromagneticChannel.channelName}): Rare energetic surge connecting directly to your natal blueprint.`;
  } else if (aspects.some(a => (a.aspect === "Trine" || a.aspect === "Conjunction") && (a.planet1 === "Jupiter" || a.planet2 === "Jupiter" || a.planet1 === "Mars" || a.planet2 === "Mars"))) {
    isOptimalGoalSetting = true;
    goalSettingReason = `Harmonious Mars / Jupiter transit aspect: Expansive vision combined with grounded strategic execution power.`;
  } else {
    goalSettingReason = `Steady consolidation day: Focus on executing existing tasks rather than launching major new commitments.`;
  }

  // Energy Vibe
  let energyVibe = "Balanced Cosmic Alignment";
  if (isOptimalMeditation && isOptimalGoalSetting) energyVibe = "Quantum Synthesis: Receptive Power & Vision";
  else if (isOptimalMeditation) energyVibe = "Deep Inward Sanctuary & Restoration";
  else if (isOptimalGoalSetting) energyVibe = "Catalytic Forward Velocity & Strategy";
  else if (stage === "Full") energyVibe = "High Illumination & Expressive Vitality";

  // Formatted date string
  const dateObj = new Date(year, month - 1, day);
  const displayDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // Personalized Daily Reading Synthesis
  const auraColor = comp.aura?.color || "Blue";
  const auraHz = comp.aura?.frequency || 741;
  const authority = comp.humanDesign?.authority || "Emotional";
  const lifePath = comp.numerology?.lifePath || 1;

  const readingTheme = `${lunarPhase.emoji} ${phaseName} in ${moonSign}: ${energyVibe}`;
  const readingMantra = `I honor the celestial rhythm of ${moonSign} Moon. My decisions flow effortlessly from my ${authority} authority, anchoring my Life Path ${lifePath} sovereign genius.`;

  const readingEssay = `Today the cosmic wheel positions the Sun at Gate ${sunGateInfo.gate}.${sunGateInfo.line} in ${sunSign} and the Moon traversing ${moonSign} at ${moonDegree}°. For you as a ${userHdType} with ${authority} authority and Life Path ${lifePath}, this alignment carries a tailored vibration. 

${electromagneticChannel ? `✨ **Electromagnetic Breakthrough**: ${electromagneticChannel.description}\n\n` : ""}The ${phaseName} (${illumination}% illumination) stirs your ${isWaterOrEarthMoon ? "somatic intuitive waters" : "mental vision and expressive drive"}. ${isOptimalMeditation ? `Because today is an **Optimal Meditation Day**, your nervous system will gain exponential clarity if you step back from external demands and allow your defined centers to recalibrate.` : ""} ${isOptimalGoalSetting ? `As an **Optimal Goal Setting Day**, your field is magnetically primed to crystallize abstract dreams into measurable SMART milestones.` : ""}

**Relational & Environmental Field**:
Be mindful of your undefined centers. When interacting with others, observe whether feelings belong to your authentic truth or the transiting sky. Use your ${authority} authority—avoid impulsive leaps when emotional waves are peaking, and instead allow clarity to settle like crystal water.`;

  const meditationProtocol = `Sit in comfortable stillness. Play ${auraHz} Hz sacred tone (harmonizing your ${auraColor} aura). Focus on Point Zero behind your heart center. Inhale for 4 counts, hold for 4 counts, release for 6 counts. Repeat for 12 cycles.`;

  const goalSettingProtocol = `Review your active goals in the SMART Goals tab. Ask yourself: "Does this objective honor my ${authority} authority, or is it born from societal conditioned urgency?" Select ONE high-impact milestone to advance today.`;

  return {
    dateStr,
    displayDate,
    lunarPhase,
    placements,
    transitSunGate: sunGateInfo.gate,
    transitSunLine: sunGateInfo.line,
    transitEarthGate: earthGateInfo.gate,
    transitMoonGate: moonGateInfo.gate,
    aspects,
    isOptimalMeditation,
    meditationReason,
    isOptimalGoalSetting,
    goalSettingReason,
    energyVibe,
    electromagneticChannel,
    personalDailyReading: {
      theme: readingTheme,
      mantra: readingMantra,
      readingEssay,
      meditationProtocol,
      goalSettingProtocol,
      recommendedHz: auraHz,
    },
  };
}

/**
 * Returns full calendar month days with calculated transit markers
 */
export function getMonthCalendarDays(year: number, month: number, profile: Profile): DailyTransitData[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const list: DailyTransitData[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    list.push(getDailyTransitData(date, profile));
  }
  return list;
}

/**
 * Returns upcoming notable transits over the next 45 days
 */
export function getUpcomingNotableEvents(startDate: Date, daysAhead = 45, profile: Profile) {
  const events: Array<{
    date: Date;
    dateStr: string;
    displayDate: string;
    title: string;
    type: "lunar" | "transit" | "gate" | "optimal";
    badgeText: string;
    description: string;
    impact: "High" | "Medium" | "Subtle";
  }> = [];

  for (let i = 0; i < daysAhead; i++) {
    const curDate = new Date(startDate.getTime() + i * 86400000);
    const dayData = getDailyTransitData(curDate, profile);

    // Track New Moon and Full Moon exact milestones
    if (dayData.lunarPhase.stage === "New" && (dayData.lunarPhase.phaseAngle < 12 || dayData.lunarPhase.phaseAngle > 348)) {
      events.push({
        date: curDate,
        dateStr: dayData.dateStr,
        displayDate: dayData.displayDate,
        title: `New Moon in ${dayData.lunarPhase.moonSign} 🌑`,
        type: "lunar",
        badgeText: "Zero-Point Rebirth",
        description: `New Moon solar-lunar conjunction in ${dayData.lunarPhase.moonSign}. Perfect portal for setting sacred intentions.`,
        impact: "High",
      });
    } else if (dayData.lunarPhase.stage === "Full" && dayData.lunarPhase.illumination >= 98) {
      events.push({
        date: curDate,
        dateStr: dayData.dateStr,
        displayDate: dayData.displayDate,
        title: `Full Moon in ${dayData.lunarPhase.moonSign} 🌕`,
        type: "lunar",
        badgeText: "Peak Illumination",
        description: `Full Moon peak illumination at 180° opposition. Highest energetic radiance and psychic clarity.`,
        impact: "High",
      });
    }

    // Track Electromagnetic Channel activations
    if (dayData.electromagneticChannel) {
      events.push({
        date: curDate,
        dateStr: dayData.dateStr,
        displayDate: dayData.displayDate,
        title: `Cosmic Channel Activated: ${dayData.electromagneticChannel.channelName}`,
        type: "gate",
        badgeText: "Electromagnetic Shift",
        description: dayData.electromagneticChannel.description,
        impact: "High",
      });
    }

    // Track major High Impact aspects
    dayData.aspects
      .filter((a) => a.impact === "High")
      .forEach((a) => {
        events.push({
          date: curDate,
          dateStr: dayData.dateStr,
          displayDate: dayData.displayDate,
          title: `${a.planet1} ${a.aspect} ${a.planet2}`,
          type: "transit",
          badgeText: `${a.aspect} Aspect`,
          description: a.interpretation,
          impact: "High",
        });
      });
  }

  // Deduplicate and sort by date
  return events.slice(0, 20);
}
