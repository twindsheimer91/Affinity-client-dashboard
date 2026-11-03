// Deterministic Cosmic Calculator for Numerology, Astrology, Human Design, and Aura
import {
  Profile,
  CalculatedBlueprint,
  HumanDesignData,
  GeneKeysData,
  AuraData,
  HologeneticSphere,
  NumerologyData,
  AstrologyData,
  CenterDetail,
  PlanetaryPosition,
  DefinitionType,
  CenterState,
} from "../types";
import {
  AURA_KNOWLEDGE,
  HD_TYPE_KNOWLEDGE,
  LIFE_PATH_KNOWLEDGE,
  ZODIAC_KNOWLEDGE,
} from "../data/knowledge";

export type {
  CalculatedBlueprint,
  HumanDesignData,
  GeneKeysData,
  AuraData,
  HologeneticSphere,
  NumerologyData,
  AstrologyData,
};

// ============================================================================
// HELPER FUNCTIONS & NUMEROLOGY
// ============================================================================

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

function reduceToSingleOrMaster(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  let temp = num;
  while (temp > 9) {
    let sum = 0;
    const str = temp.toString();
    for (let i = 0; i < str.length; i++) {
      sum += parseInt(str[i], 10);
    }
    temp = sum;
    if (temp === 11 || temp === 22 || temp === 33) return temp;
  }
  return temp;
}

function getPythagoreanValue(char: string): number {
  const c = char.toUpperCase();
  if (c >= "A" && c <= "Z") {
    const val = (c.charCodeAt(0) - 65 + 1) % 9;
    return val === 0 ? 9 : val;
  }
  return 0;
}

export function getProfileComputed(profile: Profile): CalculatedBlueprint {
  // Always calculate fresh from the profile's active birth date, birth time, coordinates, and name
  // so any update to birthday immediately and dynamically updates all charts and information site-wide.
  return calculateBlueprint(
    profile?.firstName || "Seeker",
    profile?.lastName || "",
    profile?.dateOfBirth || "1990-01-01",
    profile?.timeOfBirth || "12:00",
    profile?.placeOfBirth || ""
  );
}

// ============================================================================
// HISTORICAL TIMEZONE RESOLVER
// ============================================================================

function resolveUtcOffsetHours(
  dateOfBirth: string,
  timeOfBirth: string,
  placeOfBirth: string
): number {
  const place = (placeOfBirth || "").toLowerCase();
  const [yearStr, monthStr, dayStr] = dateOfBirth.split("-");
  const year = parseInt(yearStr || "1990", 10);
  const month = parseInt(monthStr || "1", 10);
  const day = parseInt(dayStr || "1", 10);

  // Helper for US Daylight Saving Time (1987-2006: last Sun in Apr to last Sun in Oct)
  const isUsDst1987To2006 = (m: number, d: number) => {
    if (m > 4 && m < 10) return true;
    if (m === 4 && d >= 24) return true; // Approximation for late April
    if (m === 10 && d < 25) return true;
    return false;
  };

  // Check explicit offset strings
  if (place.includes("pdt") || place.includes("utc-7") || place.includes("gmt-7")) return -7;
  if (place.includes("pst") || place.includes("utc-8") || place.includes("gmt-8")) return -8;
  if (place.includes("edt") || place.includes("utc-4") || place.includes("gmt-4")) return -4;
  if (place.includes("est") || place.includes("utc-5") || place.includes("gmt-5")) return -5;

  // US Pacific (WA, OR, CA, Seattle, Centralia, Portland, Los Angeles, San Francisco, etc.)
  if (
    place.includes("wa") ||
    place.includes("washington") ||
    place.includes("ca") ||
    place.includes("california") ||
    place.includes("or") ||
    place.includes("oregon") ||
    place.includes("seattle") ||
    place.includes("centralia") ||
    place.includes("portland") ||
    place.includes("los angeles") ||
    place.includes("san francisco")
  ) {
    const dst = isUsDst1987To2006(month, day);
    return dst ? -7 : -8;
  }

  // US Mountain (CO, UT, MT, Denver, Salt Lake, etc.)
  if (
    place.includes("co") ||
    place.includes("colorado") ||
    place.includes("denver") ||
    place.includes("ut") ||
    place.includes("utah")
  ) {
    const dst = isUsDst1987To2006(month, day);
    return dst ? -6 : -7;
  }

  // US Central (IL, TX, Chicago, Houston, Dallas, etc.)
  if (
    place.includes("tx") ||
    place.includes("texas") ||
    place.includes("il") ||
    place.includes("illinois") ||
    place.includes("chicago") ||
    place.includes("houston")
  ) {
    const dst = isUsDst1987To2006(month, day);
    return dst ? -5 : -6;
  }

  // US Eastern (NY, FL, MA, New York, Miami, Boston, etc.)
  if (
    place.includes("ny") ||
    place.includes("new york") ||
    place.includes("fl") ||
    place.includes("florida") ||
    place.includes("ma") ||
    place.includes("boston") ||
    place.includes("miami")
  ) {
    const dst = isUsDst1987To2006(month, day);
    return dst ? -4 : -5;
  }

  // UK / Europe / Asia
  if (place.includes("london") || place.includes("uk") || place.includes("england")) {
    return month >= 4 && month <= 10 ? 1 : 0;
  }
  if (place.includes("paris") || place.includes("berlin") || place.includes("rome") || place.includes("europe")) {
    return month >= 4 && month <= 10 ? 2 : 1;
  }
  if (place.includes("tokyo") || place.includes("japan") || place.includes("jst")) {
    return 9;
  }

  // Fallback: use local browser / environment timezone offset or UTC-7 for May
  const d = new Date(`${dateOfBirth}T${timeOfBirth || "12:00"}:00Z`);
  return -d.getTimezoneOffset() / 60 || (month >= 4 && month <= 10 ? -7 : -8);
}

// ============================================================================
// ASTRONOMICAL EPHEMERIS & RAVE MANDALA WHEEL
// ============================================================================

function getJulianDay(year: number, month: number, day: number, hour: number, minute: number, second: number): number {
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
    (hour + minute / 60 + second / 3600) / 24
  );
}

function normDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}
function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}
function rad2deg(r: number): number {
  return (r * 180) / Math.PI;
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

function getNorthNodeLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return normDeg(125.04452 - 1934.136261 * T);
}

function getPlanetLongitude(jd: number, planetName: string): number {
  const T = (jd - 2451545.0) / 36525.0;
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

// Sequence of 64 gates around the 360° Rave Mandala starting at 302.000° (Gate 41)
const GATES_IN_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2,  23, 8,  20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7,  4,  29, 59, 40, 64, 47, 6,  46, 18, 48, 57, 32, 50,
  28, 44, 1,  43, 14, 34, 9,  5,  26, 11, 10, 58, 38, 54, 61, 60,
];

function longitudeToGateInfo(deg: number, planetName: string): PlanetaryPosition {
  const norm = normDeg(deg);
  const offset = normDeg(norm - 302.0);
  const gateIndex = Math.floor(offset / 5.625);
  const gate = GATES_IN_ORDER[gateIndex % 64];

  const degInGate = offset % 5.625;
  const line = Math.floor(degInGate / 0.9375) + 1;

  const degInLine = degInGate % 0.9375;
  const color = Math.floor(degInLine / 0.15625) + 1;

  const degInColor = degInLine % 0.15625;
  const tone = Math.floor(degInColor / 0.026041666666666666) + 1;

  const degInTone = degInColor % 0.026041666666666666;
  const base = Math.floor(degInTone / 0.005208333333333333) + 1;

  return {
    planet: planetName,
    gate,
    line,
    color,
    tone,
    base,
    longitude: norm,
  };
}

// ============================================================================
// CHANNELS & CENTERS CONFIGURATION
// ============================================================================

export interface ChannelDef {
  g1: number;
  g2: number;
  c1: string;
  c2: string;
  name: string;
}

export const ALL_36_CHANNELS: ChannelDef[] = [
  { g1: 64, g2: 47, c1: "Head", c2: "Ajna", name: "64-47 Abstraction" },
  { g1: 61, g2: 24, c1: "Head", c2: "Ajna", name: "61-24 Awareness" },
  { g1: 63, g2: 4,  c1: "Head", c2: "Ajna", name: "63-4 Logic" },
  { g1: 17, g2: 62, c1: "Ajna", c2: "Throat", name: "17-62 Acceptance" },
  { g1: 43, g2: 23, c1: "Ajna", c2: "Throat", name: "43-23 Structuring" },
  { g1: 11, g2: 56, c1: "Ajna", c2: "Throat", name: "11-56 Curiosity" },
  { g1: 31, g2: 7,  c1: "Throat", c2: "G", name: "31-7 The Alpha" },
  { g1: 8,  g2: 1,  c1: "Throat", c2: "G", name: "8-1 Inspiration" },
  { g1: 33, g2: 13, c1: "Throat", c2: "G", name: "33-13 The Prodigal" },
  { g1: 20, g2: 10, c1: "Throat", c2: "G", name: "20-10 Awakening" },
  { g1: 45, g2: 21, c1: "Throat", c2: "Ego", name: "45-21 Money" },
  { g1: 12, g2: 22, c1: "Throat", c2: "Solar Plexus", name: "12-22 Openness" },
  { g1: 35, g2: 36, c1: "Throat", c2: "Solar Plexus", name: "35-36 Transitoriness" },
  { g1: 57, g2: 20, c1: "Throat", c2: "Spleen", name: "57-20 Brainwave" },
  { g1: 20, g2: 34, c1: "Throat", c2: "Sacral", name: "20-34 Charisma" },
  { g1: 25, g2: 51, c1: "G", c2: "Ego", name: "25-51 Initiation" },
  { g1: 10, g2: 34, c1: "G", c2: "Sacral", name: "10-34 Exploration" },
  { g1: 2,  g2: 14, c1: "G", c2: "Sacral", name: "2-14 The Beat" },
  { g1: 46, g2: 29, c1: "G", c2: "Sacral", name: "46-29 Discovery" },
  { g1: 15, g2: 5,  c1: "G", c2: "Sacral", name: "15-5 Rhythm" },
  { g1: 10, g2: 57, c1: "G", c2: "Spleen", name: "10-57 Perfected Form" },
  { g1: 40, g2: 37, c1: "Ego", c2: "Solar Plexus", name: "40-37 Community" },
  { g1: 37, g2: 40, c1: "Solar Plexus", c2: "Ego", name: "37-40 Community" },
  { g1: 26, g2: 44, c1: "Ego", c2: "Spleen", name: "26-44 Surrender" },
  { g1: 57, g2: 34, c1: "Spleen", c2: "Sacral", name: "57-34 Power" },
  { g1: 28, g2: 38, c1: "Spleen", c2: "Root", name: "28-38 Struggle" },
  { g1: 18, g2: 58, c1: "Spleen", c2: "Root", name: "18-58 Judgment" },
  { g1: 32, g2: 54, c1: "Spleen", c2: "Root", name: "32-54 Transformation" },
  { g1: 50, g2: 27, c1: "Spleen", c2: "Sacral", name: "50-27 Preservation" },
  { g1: 6,  g2: 59, c1: "Solar Plexus", c2: "Sacral", name: "6-59 Mating" },
  { g1: 49, g2: 19, c1: "Solar Plexus", c2: "Root", name: "49-19 Synthesis" },
  { g1: 55, g2: 39, c1: "Solar Plexus", c2: "Root", name: "55-39 Emotion" },
  { g1: 30, g2: 41, c1: "Solar Plexus", c2: "Root", name: "30-41 Recognition" },
  { g1: 53, g2: 42, c1: "Sacral", c2: "Root", name: "53-42 Maturation" },
  { g1: 60, g2: 3,  c1: "Sacral", c2: "Root", name: "60-3 Mutation" },
  { g1: 52, g2: 9,  c1: "Sacral", c2: "Root", name: "52-9 Concentration" },
];

const CENTER_GATES_MAP: Record<string, number[]> = {
  Head: [64, 61, 63],
  Ajna: [47, 24, 4, 11, 43, 17],
  Throat: [62, 23, 56, 31, 8, 33, 45, 12, 35, 16, 20],
  G: [7, 1, 13, 25, 46, 15, 10, 2],
  Ego: [21, 51, 26, 40],
  "Solar Plexus": [36, 22, 37, 6, 49, 55, 30],
  Sacral: [5, 14, 29, 59, 9, 3, 27, 42, 34],
  Spleen: [48, 57, 44, 50, 32, 28, 18],
  Root: [53, 60, 52, 19, 39, 41, 58, 38, 54],
};

const ALL_CENTERS_NAMES = ["Head", "Ajna", "Throat", "G", "Ego", "Sacral", "Solar Plexus", "Spleen", "Root"];

// ============================================================================
// MAIN BLUEPRINT CALCULATOR
// ============================================================================

export function calculateBlueprint(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  timeOfBirth: string = "12:00",
  placeOfBirth: string = ""
): CalculatedBlueprint {
  const hashVal = Math.abs(hashCode(`${firstName} ${lastName} ${dateOfBirth} ${timeOfBirth}`));

  // 1. NUMEROLOGY
  const parts = dateOfBirth.split("-");
  const yearDigits = parts[0]?.split("").reduce((sum, d) => sum + parseInt(d, 10), 0) || 0;
  const monthDigits = parts[1]?.split("").reduce((sum, d) => sum + parseInt(d, 10), 0) || 0;
  const dayDigits = parts[2]?.split("").reduce((sum, d) => sum + parseInt(d, 10), 0) || 0;

  const rYear = reduceToSingleOrMaster(yearDigits);
  const rMonth = reduceToSingleOrMaster(monthDigits);
  const rDay = reduceToSingleOrMaster(dayDigits);

  const lifePath = reduceToSingleOrMaster(rYear + rMonth + rDay);

  const fullName = `${firstName}${lastName}`.replace(/[^A-Za-z]/g, "");
  let exprSum = 0;
  for (let i = 0; i < fullName.length; i++) {
    exprSum += getPythagoreanValue(fullName[i]);
  }
  const expression = reduceToSingleOrMaster(exprSum);

  const vowels = "AEIOUaeiou";
  let soulSum = 0;
  let persSum = 0;
  for (let i = 0; i < fullName.length; i++) {
    if (vowels.includes(fullName[i])) {
      soulSum += getPythagoreanValue(fullName[i]);
    } else {
      persSum += getPythagoreanValue(fullName[i]);
    }
  }
  const soulUrge = reduceToSingleOrMaster(soulSum);
  const personality = reduceToSingleOrMaster(persSum);

  const bDayNum = parseInt(parts[2] || "1", 10);
  const birthday = reduceToSingleOrMaster(bDayNum);

  const numerology: NumerologyData = {
    lifePath,
    expression,
    soulUrge,
    personality,
    birthday,
  };

  // 2. ASTROLOGY & ASTRONOMICAL DUAL-LAYER TIMESTAMPS
  const month = parseInt(parts[1] || "1", 10);
  const day = parseInt(parts[2] || "1", 10);
  const year = parseInt(parts[0] || "1990", 10);

  const [hStr, mStr] = (timeOfBirth || "12:00").split(":");
  const hour = parseInt(hStr || "12", 10);
  const minute = parseInt(mStr || "0", 10);

  const utcOffsetHours = resolveUtcOffsetHours(dateOfBirth, timeOfBirth, placeOfBirth);
  const utcHour = hour - utcOffsetHours;

  const jdPersonality = getJulianDay(year, month, day, utcHour, minute, 0);
  const sunPersDeg = getSunLongitude(jdPersonality);

  // Exact 88° solar longitude regression for Design
  let jdDesign = jdPersonality - 88;
  for (let i = 0; i < 5; i++) {
    const desSun = getSunLongitude(jdDesign);
    let diff = normDeg(sunPersDeg - 88) - desSun;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    jdDesign += diff / 0.9856;
  }

  // 13 celestial positions for Personality & Design
  const planetList = ["Sun", "Earth", "Moon", "North Node", "South Node", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  const getPositionsForJd = (jd: number) => {
    const map: Record<string, PlanetaryPosition> = {};
    const sDeg = getSunLongitude(jd);
    map["Sun"] = longitudeToGateInfo(sDeg, "Sun");
    map["Earth"] = longitudeToGateInfo(normDeg(sDeg + 180), "Earth");

    const mDeg = getMoonLongitude(jd);
    map["Moon"] = longitudeToGateInfo(mDeg, "Moon");

    const nnDeg = getNorthNodeLongitude(jd);
    map["North Node"] = longitudeToGateInfo(nnDeg, "North Node");
    map["South Node"] = longitudeToGateInfo(normDeg(nnDeg + 180), "South Node");

    ["Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"].forEach((p) => {
      const pDeg = getPlanetLongitude(jd, p);
      map[p] = longitudeToGateInfo(pDeg, p);
    });

    return map;
  };

  const personalityPositions = getPositionsForJd(jdPersonality);
  const designPositions = getPositionsForJd(jdDesign);

  // Collect personality and design active gates
  const personalityGates = Array.from(new Set(Object.values(personalityPositions).map((pos) => pos.gate)));
  const designGates = Array.from(new Set(Object.values(designPositions).map((pos) => pos.gate)));
  const allActiveGates = new Set<number>([...personalityGates, ...designGates]);

  // Tropical Zodiac & Astrology Labels
  let sunSign = "Aries";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = "Aries";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = "Taurus";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = "Gemini";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = "Cancer";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = "Leo";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = "Virgo";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = "Capricorn";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = "Aquarius";
  else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = "Pisces";

  const zodiacSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const sunIndex = zodiacSigns.indexOf(sunSign);

  const hoursFromSunrise = ((hour + minute / 60) - 6 + 24) % 24;
  const risingIndex = (sunIndex + Math.floor(hoursFromSunrise / 2)) % 12;
  const risingSign = zodiacSigns[risingIndex];

  const moonGatePos = personalityPositions["Moon"].longitude;
  const moonSignIndex = Math.floor(moonGatePos / 30) % 12;
  const moonSign = zodiacSigns[moonSignIndex];

  const nnGatePos = personalityPositions["North Node"].longitude;
  const nnSignIndex = Math.floor(nnGatePos / 30) % 12;
  const northNode = zodiacSigns[nnSignIndex];

  const planetRulers: Record<string, string> = {
    Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
    Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Pluto",
    Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Uranus", Pisces: "Neptune",
  };
  const dominantPlanet = planetRulers[risingSign] || "Sun";

  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const chineseZodiac = animals[((year - 1900) % 12 + 12) % 12];
  const elements = ["Metal", "Metal", "Water", "Water", "Wood", "Wood", "Fire", "Fire", "Earth", "Earth"];
  const chineseElement = elements[year % 10];

  const astrology: AstrologyData = {
    sunSign,
    risingSign,
    moonSign,
    dominantPlanet,
    northNode,
    chineseZodiac,
    chineseElement,
  };

  // 3. HUMAN DESIGN & CENTER / CHANNEL NETWORK CALCULATIONS
  const activeChannels: ChannelDef[] = [];
  const activeChannelNamesSet = new Set<string>();

  ALL_36_CHANNELS.forEach((ch) => {
    if (allActiveGates.has(ch.g1) && allActiveGates.has(ch.g2)) {
      if (!activeChannelNamesSet.has(ch.name)) {
        activeChannels.push(ch);
        activeChannelNamesSet.add(ch.name);
      }
    }
  });

  // Evaluate Center States
  const centerDetailsMap: Record<string, CenterDetail> = {};

  ALL_CENTERS_NAMES.forEach((centerName) => {
    const centerGates = CENTER_GATES_MAP[centerName] || [];
    const connectedChannels = activeChannels.filter(
      (ch) => ch.c1 === centerName || ch.c2 === centerName
    );

    const activeHangingGates = centerGates.filter((g) => allActiveGates.has(g));

    let state: CenterState = "open";
    if (connectedChannels.length > 0) {
      state = "defined";
    } else if (activeHangingGates.length > 0) {
      state = "undefined";
    }

    centerDetailsMap[centerName] = {
      name: centerName,
      state,
      hangingGates: activeHangingGates,
      definedChannels: connectedChannels.map((ch) => ch.name),
    };
  });

  const definedCenterNames = ALL_CENTERS_NAMES.filter((c) => centerDetailsMap[c].state === "defined");
  const undefinedCenterNames = ALL_CENTERS_NAMES.filter((c) => centerDetailsMap[c].state !== "defined");

  // Definition Network Types
  const definedSet = new Set(definedCenterNames);
  let definitionType: DefinitionType = "No Definition";

  if (definedSet.size > 0) {
    const visited = new Set<string>();
    let componentCount = 0;

    definedSet.forEach((center) => {
      if (!visited.has(center)) {
        componentCount++;
        const queue = [center];
        visited.add(center);

        while (queue.length > 0) {
          const current = queue.shift()!;
          const neighbors = activeChannels
            .filter((ch) => ch.c1 === current || ch.c2 === current)
            .map((ch) => (ch.c1 === current ? ch.c2 : ch.c1))
            .filter((n) => definedSet.has(n));

          neighbors.forEach((nb) => {
            if (!visited.has(nb)) {
              visited.add(nb);
              queue.push(nb);
            }
          });
        }
      }
    });

    if (componentCount === 1) definitionType = "Single Definition";
    else if (componentCount === 2) definitionType = "Split Definition";
    else if (componentCount === 3) definitionType = "Triple Split";
    else if (componentCount >= 4) definitionType = "Quadruple Split";
  }

  // Motor Center to Throat Path Check
  const motorCenters = ["Sacral", "Root", "Solar Plexus", "Ego"];
  const isThroatDefined = centerDetailsMap["Throat"].state === "defined";

  const isMotorConnectedToThroat = (): boolean => {
    if (!isThroatDefined) return false;

    const visited = new Set<string>(["Throat"]);
    const queue = ["Throat"];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current !== "Throat" && motorCenters.includes(current) && centerDetailsMap[current].state === "defined") {
        return true;
      }

      const neighbors = activeChannels
        .filter((ch) => ch.c1 === current || ch.c2 === current)
        .map((ch) => (ch.c1 === current ? ch.c2 : ch.c1))
        .filter((n) => centerDetailsMap[n]?.state === "defined");

      neighbors.forEach((nb) => {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      });
    }

    return false;
  };

  const motorToThroat = isMotorConnectedToThroat();
  const isSacralDefined = centerDetailsMap["Sacral"].state === "defined";

  // STRICT TYPE EVALUATION LOGIC
  let hdType = "Projector";
  if (definedCenterNames.length === 0) {
    hdType = "Reflector";
  } else if (isSacralDefined) {
    if (motorToThroat) {
      hdType = "Manifesting Generator";
    } else {
      hdType = "Generator";
    }
  } else {
    if (motorToThroat) {
      hdType = "Manifestor";
    } else {
      hdType = "Projector";
    }
  }

  // STRICT AUTHORITY EVALUATION HIERARCHY
  let hdAuthority = "Lunar";
  if (centerDetailsMap["Solar Plexus"].state === "defined") {
    hdAuthority = "Solar Plexus";
  } else if (isSacralDefined) {
    hdAuthority = "Sacral";
  } else if (centerDetailsMap["Spleen"].state === "defined") {
    hdAuthority = "Splenic";
  } else if (centerDetailsMap["Ego"].state === "defined") {
    hdAuthority = motorToThroat ? "Ego Manifested" : "Ego Projected";
  } else if (centerDetailsMap["G"].state === "defined") {
    hdAuthority = "Self-Projected";
  } else if (isThroatDefined && (centerDetailsMap["Head"].state === "defined" || centerDetailsMap["Ajna"].state === "defined")) {
    hdAuthority = "Mental / Environment";
  } else {
    hdAuthority = "Lunar";
  }

  // Profile: Personality Sun Line / Design Sun Line
  const persSunLine = personalityPositions["Sun"].line;
  const desSunLine = designPositions["Sun"].line;
  const hdProfile = `${persSunLine}/${desSunLine}`;

  const humanDesign: HumanDesignData = {
    type: hdType,
    authority: hdAuthority,
    profile: hdProfile,
    definitionType,
    channels: Array.from(activeChannelNamesSet),
    personalityGates,
    designGates,
    personalityPositions,
    designPositions,
    centers: centerDetailsMap,
    definedCenters: definedCenterNames,
    undefinedCenters: undefinedCenterNames,
  };

  // 4. GENE KEYS PROFILE CALCULATIONS
  const makeSphere = (
    name: string,
    pos: PlanetaryPosition,
    sequence: "activation" | "venus" | "pearl",
    desc: string
  ): HologeneticSphere => ({
    name,
    keyNumber: pos.gate,
    line: pos.line,
    sequence,
    description: desc,
  });

  const geneKeys: GeneKeysData = {
    lifesWork: makeSphere("Life's Work / Genius", personalityPositions["Sun"], "activation", "Your core creative expression, conscious gifts, and primary contribution to the world."),
    evolution: makeSphere("Evolution", personalityPositions["Earth"], "activation", "Your greatest challenge, shadow trigger, and soil for spiritual growth and maturity."),
    radiance: makeSphere("Radiance", designPositions["Sun"], "activation", "Your physical health, bodily vitality, aura radiance, and inner grounding."),
    purpose: makeSphere("Purpose", designPositions["Earth"], "activation", "Your deep soul stability, ancestral frequency, and ultimate physical embodiment."),
    attraction: makeSphere("Attraction", designPositions["Moon"], "venus", "The physical aura field that draws specific relationships, karmic ties, and lessons to you."),
    iq: makeSphere("IQ (Mental Mind)", personalityPositions["Venus"], "venus", "Mental defensive strategies formed between ages 14-21 and how your mind learns surrender."),
    eq: makeSphere("EQ (Emotional Mind)", personalityPositions["Mars"], "venus", "Emotional patterns and reactivity formed between ages 7-14 and your open-hearted presence."),
    sq: makeSphere("SQ (Spiritual Mind)", designPositions["Venus"], "venus", "Core soul innocence formed during first 7 years of life and your link to the divine child."),
    coreWound: makeSphere("Core Wound / Vocation", designPositions["Mars"], "venus", "The collective human wound you carry, which becomes your ultimate gift to humanity."),
    vocation: makeSphere("Vocation", designPositions["Mars"], "pearl", "How your Core Wound turns into your unique service, vocation, and creative impact."),
    culture: makeSphere("Culture", designPositions["Jupiter"], "pearl", "Your natural role in groups, community alignment, and social network synergy."),
    brand: makeSphere("Brand / Expression", personalityPositions["Sun"], "pearl", "The authentic frequency you broadcast outwardly that attracts alignment and resources."),
    pearl: makeSphere("The Pearl", personalityPositions["Jupiter"], "pearl", "The harvest of your soul journey, true prosperity, and effortless flow of abundance."),
  };

  // 5. AURA CALCULATIONS
  let auraColor = "Blue";
  if (lifePath === 1) auraColor = "Red";
  else if (lifePath === 2) auraColor = "Orange";
  else if (lifePath === 3 || lifePath === 5) auraColor = "Yellow";
  else if (lifePath === 4) auraColor = "Green";
  else if (lifePath === 6) auraColor = "Blue";
  else if (lifePath === 7) auraColor = "Indigo";
  else if (lifePath === 8) auraColor = "Violet";
  else if (lifePath === 9) auraColor = "Violet";
  else if (lifePath === 11 || lifePath === 22) auraColor = "Teal";
  else auraColor = "White-Gold";

  const colorHexes: Record<string, string> = {
    Red: "#ef4444",
    Orange: "#f97316",
    Yellow: "#fbbf24",
    Green: "#10b981",
    Teal: "#00c4b4",
    Blue: "#3b82f6",
    Indigo: "#6366f1",
    Violet: "#a78bfa",
    "White-Gold": "#fef08a",
  };

  const hzMap: Record<string, number> = {
    Red: 396,
    Orange: 417,
    Yellow: 528,
    Green: 639,
    Teal: 741,
    Blue: 741,
    Indigo: 852,
    Violet: 963,
    "White-Gold": 999,
  };

  const aura: AuraData = {
    color: auraColor,
    hex: colorHexes[auraColor] || "#00c4b4",
    frequency: hzMap[auraColor] || 528,
    consciousnessScale: 300 + (hashVal % 400),
  };

  return {
    numerology,
    astrology,
    humanDesign,
    geneKeys,
    aura,
  };
}
