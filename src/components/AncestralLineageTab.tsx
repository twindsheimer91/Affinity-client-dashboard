import React, { useState, useMemo } from "react";
import { Profile } from "../types";
import { getProfileComputed } from "../utils/calculations";
import { 
  Dna, 
  Sparkles, 
  Compass, 
  Activity, 
  Shield, 
  Heart, 
  Eye, 
  Brain, 
  Layers, 
  Flame, 
  Wind, 
  CheckCircle2, 
  ChevronRight, 
  Info,
  Maximize2,
  Printer,
  RotateCcw
} from "lucide-react";

interface AncestralLineageTabProps {
  profile: Profile;
  onNavigate?: (tab: string) => void;
}

interface SomaticMarker {
  id: string;
  angle: number; // 0 to 360 degrees
  name: string;
  category: "Neuro-Vagal" | "Musculoskeletal" | "Endocrine" | "Cellular-Metabolic";
  biologicalSubstrate: string;
  somaticTensionPattern: string;
  wisdomTradition: string;
  ancientCanonicalSource: string;
  ancestralLineageMeaning: string;
  releaseProtocol: string;
  somaticAcupressureOrMarma: string;
  element: "Earth" | "Water" | "Fire" | "Air" | "Ether";
  color: string;
}

// 12 Classical Somatic Markers mapped to Historical Wisdom Lineages
const SOMATIC_MARKERS: SomaticMarker[] = [
  {
    id: "vagus-ventral",
    angle: 0, // Top / 12 o'clock
    name: "Vagus Nerve (Ventral Complex)",
    category: "Neuro-Vagal",
    biologicalSubstrate: "Cranial Nerve X (Myelinated anterior branches to sinoatrial node, larynx, pharynx)",
    somaticTensionPattern: "Voice constriction, flattened facial expressivity, inability to enter social safe harbor",
    wisdomTradition: "Vedic Anahata & Hrdaya Marma (Heart Lotus)",
    ancientCanonicalSource: "Tantric *Sat-Cakra-Nirupana* (1577 CE) & *Charaka Samhita*",
    ancestralLineageMeaning: "The seat of generational compassion and maternal safety signaling. When ventral vagal tone is activated, ancestral dread dissolves into collective belonging.",
    releaseProtocol: "Voiced glottal humming (528Hz acoustic vibration), slow prolonged expiration (4s inhale, 8s exhale), suboccipital cervical decompression.",
    somaticAcupressureOrMarma: "Hrdaya Marma (Center of Sternum) & CV-17 (Shanzhong)",
    element: "Air",
    color: "#2dd4bf" // Teal
  },
  {
    id: "pineal-circadian",
    angle: 30,
    name: "Pineal Pacemaker & Melatonin Axis",
    category: "Endocrine",
    biologicalSubstrate: "Epithalamic Pineal Gland & Suprachiasmatic Nucleus (Circadian retinal ganglion input)",
    somaticTensionPattern: "Disrupted sleep architecture, temporal disorientation, ancestral vigilance during dark hours",
    wisdomTradition: "Egyptian Eye of Horus (Wadjet) & Vedic Ajna",
    ancientCanonicalSource: "Ancient Egyptian *Book of the Dead* & Hermetic *Corpus Hermeticum*",
    ancestralLineageMeaning: "The biological bridge between solar-lunar cycles and cellular rejuvenation. Preserves the internal clock calibrated to natural cosmic cycles.",
    releaseProtocol: "Early morning horizontal sunlight gazing (within 30 mins of dawn), bilateral eye tracking sweeps, darkness sanctum at night.",
    somaticAcupressureOrMarma: "Sthapani Marma (Third Eye) & GV-24.5 (Yintang)",
    element: "Ether",
    color: "#818cf8" // Indigo
  },
  {
    id: "jaw-masseter",
    angle: 60,
    name: "Masseter & Temporomandibular Armor",
    category: "Musculoskeletal",
    biologicalSubstrate: "Trigeminal Nerve (CN V3 motor branch), Masseter & Pterygoid fascia",
    somaticTensionPattern: "Nocturnal bruxism, clenched mandibular bite, suppressed righteous truth and ancestral rage",
    wisdomTradition: "I-Ching Hexagram 21 (Shihe / Biting Through)",
    ancientCanonicalSource: "King Wen *Zhouyi* (1000 BCE) & Ancient Taoist *Neijing*",
    ancestralLineageMeaning: "The somatic barrier of suppressed boundaries. Ancestors who had to stay silent under survival duress transmit involuntary mandibular clenching.",
    releaseProtocol: "Intra-oral pterygoid myofascial release, mandibular jaw shaking, audible sighing on vowels 'Ah' and 'Voo'.",
    somaticAcupressureOrMarma: "Hanu Marma (Mandibular angle) & ST-6 (Jiache)",
    element: "Fire",
    color: "#f59e0b" // Amber
  },
  {
    id: "thoracic-cardiac",
    angle: 90,
    name: "Thoracic Shield & Pericardial Fascia",
    category: "Neuro-Vagal",
    biologicalSubstrate: "Endothelial Nitric Oxide synthases, Fibrous Pericardium, Intercostal neurovascular bundles",
    somaticTensionPattern: "Chest tightness, shallow apico-costal breathing, guarded thoracic cage against intimacy",
    wisdomTradition: "Kabbalistic Tiferet (Pillar of Equilibrium)",
    ancientCanonicalSource: "Zoharic Kabbalah & Classical Greek Pneumatology",
    ancestralLineageMeaning: "The ancestral armor protecting the heart from generational grief. When softened, restores balance between giving (Chesed) and boundaries (Gevurah).",
    releaseProtocol: "Gentle passive chest opening over a bolster, somatic breath hold with heart-hand placement, oceanic sighing.",
    somaticAcupressureOrMarma: "Kshipra Marma & PC-6 (Neiguan)",
    element: "Air",
    color: "#38bdf8" // Sky Blue
  },
  {
    id: "hpa-adrenal",
    angle: 120,
    name: "HPA Axis & Adrenomedullary Core",
    category: "Endocrine",
    biologicalSubstrate: "Hypothalamus-Pituitary-Adrenal Axis (Cortisol, Epinephrine, Noradrenaline release)",
    somaticTensionPattern: "Chronic hyper-vigilance, sudden startle reflex, afternoon energetic crash, sympathetic exhaustion",
    wisdomTradition: "Vedic Manipura & Martial Solar Fire",
    ancientCanonicalSource: "Ayurvedic *Sushruta Samhita* & Ptolemaic Martial Dignity",
    ancestralLineageMeaning: "Inherited survivor adrenaline. Reflects ancestral displacement or famine where vigilance was biologically required for survival.",
    releaseProtocol: "Cold water facial immersion (mammalian dive reflex stimulation), slow somatic heel drops, adrenal kidney warming packs.",
    somaticAcupressureOrMarma: "Nabhi Marma (Solar plexus) & KI-1 (Yongquan)",
    element: "Fire",
    color: "#ef4444" // Crimson
  },
  {
    id: "gut-microbiome",
    angle: 150,
    name: "Enteric Nervous System & Microbiome",
    category: "Cellular-Metabolic",
    biologicalSubstrate: "Vagal sensory afferents (80%), Auerbach's & Meissner's plexuses, short-chain fatty acids",
    somaticTensionPattern: "Visceral hypersensitivity, gut spasms during emotional conflict, somatic intuition numbness",
    wisdomTradition: "Taoist Lower Dantian & Primordial Jing",
    ancientCanonicalSource: "Taoist *Yellow Emperor's Classic* & *Secret of the Golden Flower*",
    ancestralLineageMeaning: "The primal ancestral storehouse of physical Jing. Inherited dietary memory, gut bacteria lineage passed down through birth canal and milk.",
    releaseProtocol: "Gentle circular clockwise abdominal Chi Nei Tsang massage, warm bone/mineral broths, rhythmic grounding.",
    somaticAcupressureOrMarma: "Basti Marma (Lower abdomen) & CV-4 (Guanyuan)",
    element: "Earth",
    color: "#10b981" // Emerald
  },
  {
    id: "psoas-axis",
    angle: 180, // Bottom / 6 o'clock
    name: "Psoas Major (The Muscle of the Soul)",
    category: "Musculoskeletal",
    biologicalSubstrate: "Psoas Major originating from T12-L4, running to lesser trochanter; continuous with respiratory diaphragm",
    somaticTensionPattern: "Anterior pelvic tilt, lower back compression, chronic tucked-tailbone freeze or flight preparation",
    wisdomTradition: "Ancient Taoist Kidney/Water Gate (*Mingmen*)",
    ancientCanonicalSource: "Classical Taoist *Neijing Suwen* & *I-Ching* Hexagram 29 (The Abysmal Water)",
    ancestralLineageMeaning: "The primary somatic storage unit for ancestral fear. As the physical connector between trunk and legs, it reflexively coils during existential threat.",
    releaseProtocol: "Constructive rest position (psoas release with bent knees for 15 mins), neurogenic tremoring (TRE), slow pelvic tilts.",
    somaticAcupressureOrMarma: "Kati Marma (Sacral base) & BL-23 (Shenshu)",
    element: "Water",
    color: "#06b6d4" // Cyan
  },
  {
    id: "pelvic-root",
    angle: 210,
    name: "Pelvic Floor & Perineal Root",
    category: "Musculoskeletal",
    biologicalSubstrate: "Levator Ani, Pudendal Nerve, Sacral Plexus (S2-S4 parasympathetic outflow)",
    somaticTensionPattern: "Involuntary perineal clenching, alienation from the earth, difficulty feeling safe in physical space",
    wisdomTradition: "Vedic Muladhara & Prithvi (Earth Element)",
    ancientCanonicalSource: "Ancient Upanishadic Kundalini Canon & Ptolemaic Saturnian Earth",
    ancestralLineageMeaning: "Root grounding and ancestral tribe connection. Contains the somatic imprint of whether one belongs to the land and human family.",
    releaseProtocol: "Diaphragmatic pelvic floor relaxation, barefoot earthen earthing contact, squatted resting postures.",
    somaticAcupressureOrMarma: "Guda Marma (Perineum) & CV-1 (Huiyin)",
    element: "Earth",
    color: "#a855f7" // Purple
  },
  {
    id: "dorsal-vagal",
    angle: 240,
    name: "Dorsal Vagal Vegetative Axis",
    category: "Neuro-Vagal",
    biologicalSubstrate: "Unmyelinated subdiaphragmatic visceral Vagus (evolutionarily ancient reptilian circuit)",
    somaticTensionPattern: "Profound dissociation, emotional numbness, metabolic shutdown, feelings of paralysis or entrapment",
    wisdomTradition: "Hermetic Principle of Rhythm & Dissolution",
    ancientCanonicalSource: "Hermetic *Kybalion* & Classical Greek Stoic Apathy vs. Pathos",
    ancestralLineageMeaning: "The ancestral conservation response during extreme overwhelm. When flight and fight failed, the body conserved life by playing dead.",
    releaseProtocol: "Gentle tactile warmth (weighted blankets, hand on heart and belly), micro-movements of fingers and toes, orienting to safe horizon.",
    somaticAcupressureOrMarma: "Kurpara Marma & ST-36 (Zusanli)",
    element: "Water",
    color: "#6366f1" // Indigo
  },
  {
    id: "mitochondrial-dna",
    angle: 270,
    name: "Mitochondrial Energy & Maternal Lineage",
    category: "Cellular-Metabolic",
    biologicalSubstrate: "Mitochondrial DNA (mtDNA, 37 genes inherited strictly matrilineally), ATP Electron Transport Chain",
    somaticTensionPattern: "Cellular chronic fatigue, metabolic inefficiency, deep feelings of maternal depletion across generations",
    wisdomTradition: "I-Ching Hexagram 2 (Kun / The Receptive Mother)",
    ancientCanonicalSource: "King Wen *Zhouyi* (c. 1000 BCE) & Vedic *Shakti Prana*",
    ancestralLineageMeaning: "The unbroken maternal spark. Every mitochondrion in every cell was passed directly from mother to daughter across millions of years.",
    releaseProtocol: "Mitochondrial red-light photonic exposure, cold thermogenesis, cyclic ketogenic nourishment, ancestral maternal gratitude rituals.",
    somaticAcupressureOrMarma: "Urvi Marma (Inner thigh) & SP-6 (Sanyinjiao)",
    element: "Earth",
    color: "#ec4899" // Pink
  },
  {
    id: "ocular-cervical",
    angle: 300,
    name: "Ocular-Cervical Defense Reflex",
    category: "Neuro-Vagal",
    biologicalSubstrate: "Superior Colliculus, Suboccipital Triangles, Vestibulocochlear Nerve (CN VIII)",
    somaticTensionPattern: "Rigid neck posture, hyper-scanning gaze, chronic tension headaches at skull base",
    wisdomTradition: "Classical Greek Humoral & Sanguine/Choleric Eye",
    ancientCanonicalSource: "Galenic *De Sanitate Tuenda* & Pythagorean Tetractys",
    ancestralLineageMeaning: "The horizon scanner of the tribe. Ancestral scouts and protectors who held vigilant watch through war or wilderness pass this tight cervical reflex.",
    releaseProtocol: "Suboccipital still-point induction (two tennis balls at occiput), wide peripheral panoramic vision practice, neck rocking.",
    somaticAcupressureOrMarma: "Krikotika Marma & GB-20 (Fengchi)",
    element: "Air",
    color: "#14b8a6" // Teal
  },
  {
    id: "fascial-spiral",
    angle: 330,
    name: "Fascial Spiral Kinetic Matrix",
    category: "Musculoskeletal",
    biologicalSubstrate: "Superficial Back Line & Spiral Line fascial meridians (Liquid crystalline collagen lattice)",
    somaticTensionPattern: "Rotational twisting torque in spine, asymmetric shoulder posture, fascial armoring against impact",
    wisdomTradition: "Vedic Ida & Pingala Nadis (Spiral Caduceus)",
    ancientCanonicalSource: "Ancient Vedic *Hatha Yoga Pradipika* & Hermetic Staff of Asclepius",
    ancestralLineageMeaning: "The fluid collagen network that conducts bio-photons and piezo-electric currents throughout the ancestral body vessel.",
    releaseProtocol: "Hydration with micro-minerals, rhythmic dynamic rotational swinging (Qi Gong silk reeling), myofascial unwinding.",
    somaticAcupressureOrMarma: "Gulpha Marma (Ankle ring) & BL-60 (Kunlun)",
    element: "Water",
    color: "#f43f5e" // Rose
  }
];

export default function AncestralLineageTab({ profile }: AncestralLineageTabProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>("vagus-ventral");
  const [viewFilter, setViewFilter] = useState<"all" | "Neuro-Vagal" | "Musculoskeletal" | "Endocrine" | "Cellular-Metabolic">("all");
  const [activeLayer, setActiveLayer] = useState<"mandala" | "protocols" | "epigenetics">("mandala");
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  // Compute personalized blueprint
  const blueprint = useMemo(() => {
    return getProfileComputed(profile);
  }, [profile]);

  // Personalized Ancestral Resonance Calculation
  const personalizedData = useMemo(() => {
    const dob = profile.dateOfBirth || "1990-01-01";
    let hash = 0;
    for (let i = 0; i < dob.length; i++) {
      hash = (hash << 5) - hash + dob.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const elements: Array<"Earth" | "Water" | "Fire" | "Air" | "Ether"> = ["Earth", "Water", "Fire", "Air", "Ether"];
    const dominantElement = elements[absHash % 5];

    // Primary somatic anchor marker index
    const primaryIndex = absHash % SOMATIC_MARKERS.length;
    const primaryMarker = SOMATIC_MARKERS[primaryIndex];

    // Epigenetic Lineage Vector
    const maternalScore = 70 + (absHash % 28);
    const paternalScore = 65 + ((absHash >> 2) % 32);
    const nervousSystemEquilibrium = 75 + ((absHash >> 3) % 23);

    return {
      dominantElement,
      primaryMarker,
      maternalScore,
      paternalScore,
      nervousSystemEquilibrium,
      ancestralArchetype: [
        "The Sovereign Healer & Sacred Alchemist",
        "The Resilient Wayfinder & Horizon Scout",
        "The Deep Rooted Ancestral Preserver",
        "The Harmonious Mediator & Heart Anchor",
        "The Visionary Transmuter of Generational Wounds"
      ][absHash % 5]
    };
  }, [profile]);

  const activeMarker = useMemo(() => {
    return SOMATIC_MARKERS.find(m => m.id === selectedMarkerId) || SOMATIC_MARKERS[0];
  }, [selectedMarkerId]);

  const filteredMarkers = useMemo(() => {
    if (viewFilter === "all") return SOMATIC_MARKERS;
    return SOMATIC_MARKERS.filter(m => m.category === viewFilter);
  }, [viewFilter]);

  // Geometric calculations for the SVG circular interface
  const centerX = 350;
  const centerY = 350;
  const outerWisdomRadius = 290;
  const somaticRingRadius = 205;
  const polyvagalRingRadius = 125;
  const coreRadius = 55;

  return (
    <div className="space-y-8 animate-fade-in text-slate-100" id="ancestral-lineage-container">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-teal-950/30 border border-teal-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono uppercase tracking-wider">
              <Dna className="w-3.5 h-3.5" />
              <span>Ancestral Science & Somatic Epigenetics</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-wide">
              Ancestral Lineage & Somatic Matrix
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Mapping neuro-biological somatic markers to historical wisdom canons: the 
              <span className="text-teal-300 font-medium"> King Wen *Zhouyi* (I-Ching)</span>, 
              <span className="text-purple-300 font-medium"> Vedic Marmas & Tantra</span>, 
              <span className="text-amber-300 font-medium"> Ptolemaic Astronomy</span>, and 
              <span className="text-sky-300 font-medium"> Polyvagal Somatics</span>.
            </p>
          </div>

          {/* Personalized Client Archetype Badge */}
          <div className="bg-slate-950/70 border border-teal-500/40 rounded-2xl p-4.5 w-full lg:w-auto min-w-[280px] shadow-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">Client Profile</span>
              <span className="text-[10px] font-mono text-slate-400">{profile.dateOfBirth}</span>
            </div>
            <div className="text-sm font-bold text-white">
              {profile.firstName} {profile.lastName}
            </div>
            <div className="text-xs font-serif text-teal-200 italic">
              "{personalizedData.ancestralArchetype}"
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[9px]">Somatic Anchor</span>
                <span className="text-teal-300 font-semibold truncate block">{personalizedData.primaryMarker.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">Dominant Element</span>
                <span className="text-amber-300 font-semibold">{personalizedData.dominantElement}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Layer Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-teal-500/15">
          <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveLayer("mandala")}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeLayer === "mandala"
                  ? "bg-teal-500/20 text-teal-200 border border-teal-500/40 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Circular Geometric Mandala</span>
            </button>
            <button
              onClick={() => setActiveLayer("protocols")}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeLayer === "protocols"
                  ? "bg-teal-500/20 text-teal-200 border border-teal-500/40 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Ancestral Somatic Protocols ({SOMATIC_MARKERS.length})</span>
            </button>
            <button
              onClick={() => setActiveLayer("epigenetics")}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeLayer === "epigenetics"
                  ? "bg-teal-500/20 text-teal-200 border border-teal-500/40 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Epigenetic Lineage Breakdown</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all shadow-sm"
              title="Print Ancestral Lineage Report"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* LAYER 1: CIRCULAR GEOMETRIC MANDALA INTERFACE */}
      {activeLayer === "mandala" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLUMNS: THE SACRED CIRCULAR INTERFACE */}
          <div className="lg:col-span-7 bg-slate-950/80 border border-teal-500/20 rounded-3xl p-6 backdrop-blur-xl flex flex-col items-center justify-center relative shadow-2xl overflow-hidden">
            {/* Filter Pill Controls */}
            <div className="w-full flex items-center justify-between mb-4 z-20">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Ancestral Geometry</span>
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-mono">
                {(["all", "Neuro-Vagal", "Musculoskeletal", "Endocrine", "Cellular-Metabolic"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setViewFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      viewFilter === cat
                        ? "bg-teal-500/20 text-teal-200 border border-teal-500/40 font-bold"
                        : "text-slate-500 hover:text-slate-300 bg-slate-900/50"
                    }`}
                  >
                    {cat === "all" ? "All Rings" : cat.split("-")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full max-w-[620px] aspect-square flex items-center justify-center">
              <svg 
                viewBox="0 0 700 700" 
                className="w-full h-full select-none"
              >
                <defs>
                  {/* Glow Filters */}
                  <filter id="tealGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#0f766e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
                  </linearGradient>
                  <radialGradient id="spaceGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#134e4a" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#06101e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#030712" stopOpacity="1" />
                  </radialGradient>
                </defs>

                {/* Background Space Circle */}
                <circle cx={centerX} cy={centerY} r={335} fill="url(#spaceGrad)" stroke="#14b8a6" strokeOpacity="0.15" strokeWidth="1" />

                {/* 1. OUT隻 DEGREE TICK RING */}
                <circle cx={centerX} cy={centerY} r={320} fill="none" stroke="#2dd4bf" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,6" />
                <circle cx={centerX} cy={centerY} r={305} fill="none" stroke="#64748b" strokeOpacity="0.25" strokeWidth="1" />

                {/* 2. OUTER WISDOM RING (Historical Lineages) */}
                <circle cx={centerX} cy={centerY} r={outerWisdomRadius} fill="none" stroke="#0d9488" strokeOpacity="0.35" strokeWidth="1.5" />

                {/* 3. SOMATIC BIOLOGICAL RING */}
                <circle cx={centerX} cy={centerY} r={somaticRingRadius} fill="none" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6,4" />

                {/* 4. POLYVAGAL AUTONOMIC EQUILIBRIUM RING */}
                <circle cx={centerX} cy={centerY} r={polyvagalRingRadius} fill="none" stroke="#a855f7" strokeOpacity="0.25" strokeWidth="1.2" />

                {/* Cardinal Axes (North-South-East-West / Solstice-Equinox Lineage) */}
                <line x1={centerX} y1={25} x2={centerX} y2={675} stroke="#2dd4bf" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4,4" />
                <line x1={25} y1={centerY} x2={675} y2={centerY} stroke="#2dd4bf" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4,4" />
                {/* Diagonal 45-degree harmonics */}
                <line x1={115} y1={115} x2={585} y2={585} stroke="#a855f7" strokeOpacity="0.08" strokeWidth="1" />
                <line x1={585} y1={115} x2={115} y2={585} stroke="#a855f7" strokeOpacity="0.08" strokeWidth="1" />

                {/* CONNECTING HARMONIC RAYS & BEZIER ARCS (Bio-Marker to Ancient Wisdom) */}
                {SOMATIC_MARKERS.map((marker) => {
                  const rad = (marker.angle - 90) * (Math.PI / 180);
                  const bioX = centerX + somaticRingRadius * Math.cos(rad);
                  const bioY = centerY + somaticRingRadius * Math.sin(rad);
                  const wisX = centerX + outerWisdomRadius * Math.cos(rad);
                  const wisY = centerY + outerWisdomRadius * Math.sin(rad);

                  const isSelected = selectedMarkerId === marker.id;
                  const isHovered = hoveredMarkerId === marker.id;

                  // Curved ray to center
                  const cRad = rad + 0.15;
                  const ctrlX = centerX + (somaticRingRadius * 0.45) * Math.cos(cRad);
                  const ctrlY = centerY + (somaticRingRadius * 0.45) * Math.sin(cRad);

                  return (
                    <g key={`ray-${marker.id}`}>
                      {/* Radial link from somatic ring to wisdom node */}
                      <line
                        x1={bioX}
                        y1={bioY}
                        x2={wisX}
                        y2={wisY}
                        stroke={isSelected ? "#f59e0b" : isHovered ? "#2dd4bf" : marker.color}
                        strokeOpacity={isSelected ? 0.9 : isHovered ? 0.7 : 0.25}
                        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                      />

                      {/* Sacred chord from center to somatic marker */}
                      <path
                        d={`M ${centerX} ${centerY} Q ${ctrlX} ${ctrlY} ${bioX} ${bioY}`}
                        fill="none"
                        stroke={isSelected ? "#fbbf24" : marker.color}
                        strokeOpacity={isSelected ? 0.75 : isHovered ? 0.5 : 0.12}
                        strokeWidth={isSelected ? 2 : 1}
                        strokeDasharray={isSelected ? "none" : "3,4"}
                      />
                    </g>
                  );
                })}

                {/* 12 SOMATIC BIOLOGICAL NODES */}
                {SOMATIC_MARKERS.map((marker) => {
                  const rad = (marker.angle - 90) * (Math.PI / 180);
                  const x = centerX + somaticRingRadius * Math.cos(rad);
                  const y = centerY + somaticRingRadius * Math.sin(rad);
                  const isSelected = selectedMarkerId === marker.id;
                  const isHovered = hoveredMarkerId === marker.id;

                  const isVisibleInFilter = viewFilter === "all" || marker.category === viewFilter;

                  return (
                    <g 
                      key={`somatic-${marker.id}`}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedMarkerId(marker.id)}
                      onMouseEnter={() => setHoveredMarkerId(marker.id)}
                      onMouseLeave={() => setHoveredMarkerId(null)}
                      opacity={isVisibleInFilter ? 1 : 0.2}
                    >
                      {/* Pulse halo if selected */}
                      {isSelected && (
                        <circle
                          cx={x}
                          cy={y}
                          r={18}
                          fill="none"
                          stroke="#2dd4bf"
                          strokeWidth="2"
                          strokeOpacity="0.8"
                          className="animate-ping"
                        />
                      )}
                      {/* Background circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 14 : isHovered ? 12 : 9}
                        fill={isSelected ? "#0f766e" : "#0f172a"}
                        stroke={isSelected ? "#5eead4" : marker.color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter={isSelected ? "url(#tealGlow)" : undefined}
                      />
                      {/* Inner dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 5 : 3.5}
                        fill={isSelected ? "#ffffff" : marker.color}
                      />
                    </g>
                  );
                })}

                {/* 12 ANCIENT WISDOM TRADITION NODES (Outer Perimeter) */}
                {SOMATIC_MARKERS.map((marker) => {
                  const rad = (marker.angle - 90) * (Math.PI / 180);
                  const x = centerX + outerWisdomRadius * Math.cos(rad);
                  const y = centerY + outerWisdomRadius * Math.sin(rad);
                  const isSelected = selectedMarkerId === marker.id;
                  const isHovered = hoveredMarkerId === marker.id;

                  // Label coordinates outside the node
                  const labelRad = (marker.angle - 90) * (Math.PI / 180);
                  const lx = centerX + (outerWisdomRadius + 18) * Math.cos(labelRad);
                  const ly = centerY + (outerWisdomRadius + 18) * Math.sin(labelRad);

                  return (
                    <g
                      key={`wisdom-${marker.id}`}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedMarkerId(marker.id)}
                      onMouseEnter={() => setHoveredMarkerId(marker.id)}
                      onMouseLeave={() => setHoveredMarkerId(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 10 : 6}
                        fill={isSelected ? "#f59e0b" : "#022c22"}
                        stroke={isSelected ? "#fbbf24" : "#14b8a6"}
                        strokeWidth={isSelected ? 2 : 1}
                        filter={isSelected ? "url(#goldGlow)" : undefined}
                      />

                      {/* Small Glyph / Angle Tick */}
                      <text
                        x={lx}
                        y={ly + 3}
                        textAnchor="middle"
                        fontSize={isSelected ? "11" : "8"}
                        fontFamily="ui-monospace, monospace"
                        fontWeight={isSelected ? "bold" : "normal"}
                        fill={isSelected ? "#fbbf24" : isHovered ? "#5eead4" : "#94a3b8"}
                      >
                        {marker.angle}°
                      </text>
                    </g>
                  );
                })}

                {/* CENTER CORE: MITOCHONDRIAL CELLULAR NUCLEUS */}
                <g 
                  className="cursor-pointer"
                  onClick={() => setSelectedMarkerId("mitochondrial-dna")}
                >
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={coreRadius}
                    fill="url(#coreGrad)"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                    filter="url(#tealGlow)"
                  />
                  {/* Sacred Octagram / Seed of Life Intersecting Circles */}
                  <circle cx={centerX} cy={centerY - 18} r={18} fill="none" stroke="#5eead4" strokeOpacity="0.4" strokeWidth="1" />
                  <circle cx={centerX} cy={centerY + 18} r={18} fill="none" stroke="#5eead4" strokeOpacity="0.4" strokeWidth="1" />
                  <circle cx={centerX - 18} cy={centerY} r={18} fill="none" stroke="#5eead4" strokeOpacity="0.4" strokeWidth="1" />
                  <circle cx={centerX + 18} cy={centerY} r={18} fill="none" stroke="#5eead4" strokeOpacity="0.4" strokeWidth="1" />

                  {/* Center Core Text */}
                  <text
                    x={centerX}
                    y={centerY - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="serif"
                    fontWeight="bold"
                    fill="#ffffff"
                  >
                    CELLULAR
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 8}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="1"
                    fill="#5eead4"
                  >
                    NUCLEUS
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 20}
                    textAnchor="middle"
                    fontSize="7.5"
                    fontFamily="ui-monospace, monospace"
                    fill="#94a3b8"
                  >
                    mtDNA
                  </text>
                </g>
              </svg>

              {/* Rotational Guide Overlay Indicators */}
              <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                Click any node to reveal ancestral biology
              </div>
              <div className="absolute top-2 right-4 text-[10px] font-mono text-teal-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-teal-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>360° Ecliptic Harmonic Ring</span>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: DEEP SOMATIC & ANCESTRAL INSPECTION PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950/80 border border-teal-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: activeMarker.color }}
                  />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {activeMarker.category} • {activeMarker.angle}°
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {activeMarker.element} Element
                </span>
              </div>

              {/* Marker Title */}
              <div className="mt-4 space-y-1">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
                  {activeMarker.name}
                </h3>
                <p className="text-xs font-mono text-teal-300">
                  {activeMarker.somaticAcupressureOrMarma}
                </p>
              </div>

              {/* Biological Substrate */}
              <div className="mt-5 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Brain className="w-3 h-3 text-sky-400" />
                    <span>Biological & Neuro-Anatomical Substrate</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {activeMarker.biologicalSubstrate}
                  </p>
                </div>

                {/* Ancient Wisdom Lineage */}
                <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-teal-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    <span>Historical Wisdom Lineage & Text</span>
                  </span>
                  <div className="text-white font-medium text-xs font-serif">
                    {activeMarker.wisdomTradition}
                  </div>
                  <p className="text-teal-200/80 text-[11px] italic">
                    {activeMarker.ancientCanonicalSource}
                  </p>
                  <p className="text-slate-300 text-xs mt-1.5 leading-relaxed font-sans">
                    {activeMarker.ancestralLineageMeaning}
                  </p>
                </div>

                {/* Somatic Tension Pattern */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-amber-400" />
                    <span>Somatic Tension Pattern in the Body</span>
                  </span>
                  <p className="text-amber-100 text-xs leading-relaxed font-sans">
                    {activeMarker.somaticTensionPattern}
                  </p>
                </div>

                {/* Prescribed Somatic Release Protocol */}
                <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ancestral Realignment & Somatic Protocol</span>
                  </span>
                  <p className="text-slate-200 text-xs leading-relaxed font-sans">
                    {activeMarker.releaseProtocol}
                  </p>
                </div>
              </div>

              {/* Quick Navigation to Other Markers */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Jump to another marker:</span>
                <select
                  value={selectedMarkerId}
                  onChange={(e) => setSelectedMarkerId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-teal-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-teal-400"
                >
                  {SOMATIC_MARKERS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.angle}°)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Consultation Key */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
              <h4 className="font-serif font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>Affinity Consulting Clinical Note</span>
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Generational tension is stored somatically in the fascia and unmyelinated nerve branches. When addressing life goals and relationship dynamics, realigning these 12 physical anchors accelerates neuroplasticity and emotional sovereignty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 2: ANCESTRAL SOMATIC PROTOCOLS GRID */}
      {activeLayer === "protocols" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">The 12 Ancestral Realignment Protocols</h2>
              <p className="text-xs text-slate-400">Step-by-step physical and acoustic practices drawn from authentic historical lineages.</p>
            </div>
            <span className="text-xs font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
              Complete Somatic Index
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOMATIC_MARKERS.map((marker) => (
              <div 
                key={marker.id}
                onClick={() => {
                  setSelectedMarkerId(marker.id);
                  setActiveLayer("mandala");
                }}
                className={`bg-slate-950/70 border rounded-2xl p-5 space-y-3 cursor-pointer hover:border-teal-400 transition-all shadow-md group ${
                  selectedMarkerId === marker.id ? "border-teal-400 ring-1 ring-teal-400/50" : "border-slate-800 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-teal-300">
                    {marker.angle}° • {marker.element}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: marker.color }} />
                </div>

                <div>
                  <h4 className="font-serif font-bold text-white text-base group-hover:text-teal-300 transition-colors">
                    {marker.name}
                  </h4>
                  <div className="text-[11px] font-mono text-teal-400">
                    {marker.wisdomTradition}
                  </div>
                </div>

                <div className="text-xs text-slate-300 line-clamp-2">
                  {marker.somaticTensionPattern}
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-emerald-300 font-sans leading-relaxed">
                  <strong className="block text-slate-400 text-[9px] uppercase font-mono mb-0.5">Somatic Protocol</strong>
                  {marker.releaseProtocol}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <span>Marma: {marker.somaticAcupressureOrMarma.split("&")[0]}</span>
                  <span className="text-teal-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    View in Mandala <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LAYER 3: EPIGENETIC LINEAGE BREAKDOWN */}
      {activeLayer === "epigenetics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Maternal Lineage Card */}
            <div className="bg-slate-950/80 border border-pink-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400 font-bold">Matrilineal Stream</span>
                <h3 className="text-xl font-serif font-bold text-white">Mitochondrial Epigenetic Code</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Inherited directly through the mother's egg cell without paternal recombination. Encodes cellular endurance, parasympathetic tone, and foundational maternal safety signaling.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-pink-500/20 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Cellular Resilience</span>
                  <span className="text-pink-300 font-bold">{personalizedData.maternalScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-pink-500 h-full rounded-full" style={{ width: `${personalizedData.maternalScore}%` }} />
                </div>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Canon: I-Ching Hexagram 2 (Kun) & *Shakti Prana*
              </div>
            </div>

            {/* Paternal Lineage Card */}
            <div className="bg-slate-950/80 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">Patrilineal Stream</span>
                <h3 className="text-xl font-serif font-bold text-white">Structural Kinetic & Executive Vector</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Encodes outer boundary defense, musculoskeletal postural alignment, purposeful directional drive, and societal sovereign action.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-blue-500/20 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Structural Integrity</span>
                  <span className="text-blue-300 font-bold">{personalizedData.paternalScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${personalizedData.paternalScore}%` }} />
                </div>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Canon: I-Ching Hexagram 1 (Qian) & Martial Ptolemaic Decans
              </div>
            </div>

            {/* Nervous System Equilibrium Card */}
            <div className="bg-slate-950/80 border border-teal-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold">Synthetic Coherence</span>
                <h3 className="text-xl font-serif font-bold text-white">Polyvagal Somatosensory Balance</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The integrated harmony between ventral social engagement, regulated sympathetic mobilization, and deep metabolic rest.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-teal-500/20 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Somatic Equilibrium</span>
                  <span className="text-teal-300 font-bold">{personalizedData.nervousSystemEquilibrium}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${personalizedData.nervousSystemEquilibrium}%` }} />
                </div>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Canon: Dr. David R. Hawkins (540 Joy) & Vedic Sushumna
              </div>
            </div>
          </div>

          {/* Deep Narrative Synthesis */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <h3 className="text-lg md:text-xl font-serif font-bold text-white">
              Somatic Epigenetic Integration for {profile.firstName} {profile.lastName}
            </h3>
            <div className="text-xs text-slate-300 leading-relaxed space-y-3 font-sans">
              <p>
                Your unique astrological configuration and Human Design structure indicate a primary resonance with the <strong className="text-teal-300">{personalizedData.dominantElement} Element</strong> and the somatic anchor of the <strong className="text-amber-300">{personalizedData.primaryMarker.name}</strong>.
              </p>
              <p>
                In classical ancestral science, somatic symptoms are not random mechanical malfunctions; they are biological adaptations that once kept your forebears alive. By consciously acknowledging these ancestral stress expressions ({personalizedData.primaryMarker.somaticTensionPattern}) and applying targeted vagal and marma decompression protocols, the nervous system shifts from transgenerational survival dread into conscious sovereignty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
