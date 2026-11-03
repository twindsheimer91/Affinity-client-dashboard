export interface User {
  id: string;
  email: string;
  username?: string;
  role?: string;
  isGuest?: boolean;
  mustAddEmail?: boolean;
}

export interface NumerologyData {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
}

export interface AstrologyData {
  sunSign: string;
  risingSign: string;
  moonSign: string;
  dominantPlanet: string;
  northNode: string;
  southNode?: string;
  chineseZodiac: string;
  chineseElement: string;
}

export type CenterState = "defined" | "undefined" | "open";

export type DefinitionType =
  | "Single Definition"
  | "Split Definition"
  | "Triple Split"
  | "Quadruple Split"
  | "No Definition";

export interface CenterDetail {
  name: string;
  state: CenterState;
  hangingGates: number[];
  definedChannels: string[];
}

export interface PlanetaryPosition {
  planet: string;
  gate: number;
  line: number;
  color: number;
  tone: number;
  base: number;
  longitude: number;
}

export interface HumanDesignData {
  type: string;
  authority: string;
  profile: string;
  definitionType?: DefinitionType;
  channels: string[];
  personalityGates: number[];
  designGates: number[];
  personalityPositions?: Record<string, PlanetaryPosition>;
  designPositions?: Record<string, PlanetaryPosition>;
  centers?: Record<string, CenterDetail>;
  definedCenters: string[];
  undefinedCenters: string[];
}

export interface HologeneticSphere {
  name: string;
  keyNumber: number;
  line: number;
  sequence: "activation" | "venus" | "pearl";
  description: string;
}

export interface GeneKeysData {
  lifesWork: HologeneticSphere;
  evolution: HologeneticSphere;
  radiance: HologeneticSphere;
  purpose: HologeneticSphere;
  attraction: HologeneticSphere;
  iq: HologeneticSphere;
  eq: HologeneticSphere;
  sq: HologeneticSphere;
  coreWound: HologeneticSphere;
  vocation: HologeneticSphere;
  culture: HologeneticSphere;
  brand: HologeneticSphere;
  pearl: HologeneticSphere;
}

export interface AuraData {
  color: string;
  hex: string;
  frequency: number;
  consciousnessScale: number;
}

export interface CalculatedBlueprint {
  numerology: NumerologyData;
  astrology: AstrologyData;
  humanDesign: HumanDesignData;
  geneKeys: GeneKeysData;
  aura: AuraData;
}

export interface Profile {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  mbtiType?: string;
  computed?: CalculatedBlueprint;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AmbiRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  isGuest?: boolean;
  testTitle?: string;
  mode: "quick" | "full" | string;
  scores: Record<string, number>;
  answers?: Record<number, number>;
  profileName?: string;
  profileDob?: string;
  date: string;
}

export interface ManagerProfileItem {
  source: string;
  userId: string;
  email: string;
  username?: string;
  isGuest?: boolean;
  mustAddEmail?: boolean;
  role: string;
  createdAt: string;
  profile: Profile;
  testCount: number;
  latestTest?: AmbiRecord | null;
}

export interface ManagerOverviewData {
  isManagerAuthorized: boolean;
  stats: {
    totalUsers: number;
    totalGuests: number;
    totalGuestSubjects: number;
    totalProvisionedAccounts?: number;
    totalProfiles: number;
    totalTests: number;
    totalMbtiTests?: number;
    totalCommunityPosts?: number;
  };
  profiles: ManagerProfileItem[];
  tests: AmbiRecord[];
  mbtiTests?: any[];
  guestSubjects: any[];
  communityPosts?: any[];
  recentActivity?: {
    type: string;
    title: string;
    subtitle: string;
    time: string;
  }[];
}

export type RelationshipCategory = "partner" | "coworker" | "friend";

export interface ElectromagneticBridge {
  channelName: string;
  p1Gate: number;
  p2Gate: number;
  keyTheme: string;
  description: string;
}

export interface CenterInterplayItem {
  center: string;
  p1State: CenterState;
  p2State: CenterState;
  interactionType: "Mutual Definition" | "Electromagnetic Completion" | "Conditioning Flow" | "Mutual Openness";
  guidance: string;
}

export interface FightingStyleAnalysis {
  p1StyleName: string;
  p1Description: string;
  p2StyleName: string;
  p2Description: string;
  coreClashTriggers: string[];
  shadowHooks: string[];
  deEscalationBlueprint: string;
}

export interface RelationshipCheatSheet {
  communicationScripts: {
    situation: string;
    whatToSay: string;
    whatToAvoid: string;
  }[];
  vitalDos: string[];
  vitalDonts: string[];
  appreciationBlueprint: string;
}

export interface GrowthWorkDivision {
  workOnSelf: string[];
  workTogether: string[];
}

export interface RelationshipSynergyResult {
  category: RelationshipCategory;
  longevityScore: number;
  resonanceScore: number;
  interactionDynamic: string;
  dynamicSummary: string;
  electromagneticBridges: ElectromagneticBridge[];
  compromiseChannels: string[];
  companionshipChannels: string[];
  centersInterplay: CenterInterplayItem[];
  elementalHarmony: {
    p1Element: string;
    p2Element: string;
    title: string;
    description: string;
  };
  numerologyResonance: {
    p1LifePath: number;
    p2LifePath: number;
    title: string;
    description: string;
  };
  fightingStyles: FightingStyleAnalysis;
  cheatSheet: RelationshipCheatSheet;
  growthWork: GrowthWorkDivision;
  elaSynthesis?: string;
  personalityPsychometricsBlend?: {
    blendTitle: string;
    toxicityRiskLevel: "Low Toxicity Risk (High Harmony)" | "Moderate Friction (Growth Catalyst)" | "High Risk of Toxicity / Shadow Spiral";
    toxicityColor: "emerald" | "amber" | "rose";
    blendSummary: string;
    compliments: string[];
    contrasts: string[];
    toxicTriggersToAvoid: string[];
    plainEnglishTranslation: string;
  };
  astrologyComplimentsContrasts?: {
    compliments: string[];
    contrasts: string[];
    plainEnglishTranslation: string;
  };
  humanDesignGeneKeysComplimentsContrasts?: {
    compliments: string[];
    contrasts: string[];
    plainEnglishTranslation: string;
  };
  basicPlainEnglishTranslation?: {
    headline: string;
    verdict: string;
    howYouGetAlong: string;
    howYouFightAndHowToFixIt: string;
    longevityOutlook: string;
  };
}

export interface CompareCandidate {
  id: string;
  name: string;
  username?: string;
  email?: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  source: string;
  profile: Profile;
  latestMbti?: string | null;
}

export interface MbtiRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  isGuest?: boolean;
  mbtiType: string;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  answers: Record<number, string | number>;
  source?: "manual" | "interactive" | "document_upload";
  uploadedFileName?: string;
  profileName?: string;
  date: string;
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorSignature?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorSignature?: string;
  category: "blueprints" | "psychometrics" | "synastry" | "deconditioning" | "general";
  categoryLabel: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  likedBy?: string[];
  comments: CommunityComment[];
  createdAt: string;
}
