import { 
  Profile, 
  RelationshipCategory, 
  RelationshipSynergyResult, 
  ElectromagneticBridge, 
  CenterInterplayItem, 
  FightingStyleAnalysis, 
  RelationshipCheatSheet, 
  GrowthWorkDivision 
} from "../types";
import { getProfileComputed } from "./calculations";

// All 36 Human Design Channels with gate pairs and energetic descriptions
const ALL_CHANNELS: { gateA: number; gateB: number; name: string; theme: string }[] = [
  { gateA: 1, gateB: 8, name: "1-8 Inspiration", theme: "Creative Role Model & Unique Contribution" },
  { gateA: 2, gateB: 14, name: "2-14 The Beat", theme: "Keeper of the Keys, Wealth & Higher Direction" },
  { gateA: 3, gateB: 60, name: "3-60 Mutation", theme: "Quantum Shifts, Innovation & Structure" },
  { gateA: 4, gateB: 63, name: "4-63 Logic", theme: "Mental Clarity, Hypothesis & Doubt Resolution" },
  { gateA: 5, gateB: 15, name: "5-15 Rhythm", theme: "Universal Flow, Natural Timing & Harmony" },
  { gateA: 6, gateB: 59, name: "6-59 Intimacy & Mating", theme: "Breaking Barriers, Emotional Bonding & Fertility" },
  { gateA: 7, gateB: 31, name: "7-31 The Alpha", theme: "Elected Leadership, Guidance & Council" },
  { gateA: 9, gateB: 52, name: "9-52 Concentration", theme: "Laser Focus, Stillness & Detail Mastery" },
  { gateA: 10, gateB: 20, name: "10-20 Awakening", theme: "Living One's Truth, Presence & Self-Love" },
  { gateA: 10, gateB: 34, name: "10-34 Exploration", theme: "Following Conviction & Pure Self-Empowerment" },
  { gateA: 10, gateB: 57, name: "10-57 Perfected Form", theme: "Intuitive Survival, Grace & Architecture" },
  { gateA: 11, gateB: 56, name: "11-56 Curiosity", theme: "The Storyteller, Ideas & Quest for Meaning" },
  { gateA: 12, gateB: 22, name: "12-22 Openness", theme: "Emotional Passion, Artistry & Timed Expression" },
  { gateA: 13, gateB: 33, name: "13-33 The Prodigal", theme: "The Witness, Memory & Retrospective Wisdom" },
  { gateA: 16, gateB: 48, name: "16-48 The Wavelength", theme: "Mastery, Depth & Talent Expression" },
  { gateA: 17, gateB: 62, name: "17-62 Acceptance", theme: "Organizational Being, Frameworks & Precision" },
  { gateA: 18, gateB: 58, name: "18-58 Judgment", theme: "Correction, Joy of Life & Perfectionism" },
  { gateA: 19, gateB: 49, name: "19-49 Synthesis", theme: "Tribal Sensitivity, Principles & Communal Needs" },
  { gateA: 20, gateB: 34, name: "20-34 Charisma", theme: "Now-Action, Magnetism & Pure Activity" },
  { gateA: 20, gateB: 57, name: "20-57 The Brainwave", theme: "Penetrating Instant Knowing & Clarity" },
  { gateA: 21, gateB: 45, name: "21-45 Money Line", theme: "Resource Governance, Material Authority & Kingdom" },
  { gateA: 23, gateB: 43, name: "23-43 Structuring", theme: "Genius to Freak, Revolutionary Insights" },
  { gateA: 24, gateB: 61, name: "24-61 Awareness", theme: "The Thinker, Mysteries of Life & Mental Return" },
  { gateA: 25, gateB: 51, name: "25-51 Initiation", theme: "The Sacred Warrior, Leaping into the Void" },
  { gateA: 26, gateB: 44, name: "26-44 Surrender", theme: "The Transmitter, Persuasion & Instinctive Memory" },
  { gateA: 27, gateB: 50, name: "27-50 Preservation", theme: "Custodianship, Caretaking & Tribal Defense" },
  { gateA: 28, gateB: 38, name: "28-38 Struggle", theme: "The Fighter, Finding Meaning Worth Dying For" },
  { gateA: 29, gateB: 46, name: "29-46 Discovery", theme: "Saying Yes to Life & Honoring the Physical Temple" },
  { gateA: 30, gateB: 41, name: "30-41 Recognition", theme: "Fires of Desire, Yearning & Experiential Dreams" },
  { gateA: 32, gateB: 54, name: "32-54 Transformation", theme: "The Driven Climb, Ambition & Enduring Legacy" },
  { gateA: 34, gateB: 57, name: "34-57 Power", theme: "Primal Survival Intuition & Kinetic Speed" },
  { gateA: 35, gateB: 36, name: "35-36 Transitoriness", theme: "Jack of All Trades, Adventure & Crisis Mastery" },
  { gateA: 37, gateB: 40, name: "37-40 Community", theme: "The Sacred Bargain, Devotion & Equal Exchange" },
  { gateA: 39, gateB: 55, name: "39-55 Emoting", theme: "Moods of Spirit, Provocation & Ecstatic Abundance" },
  { gateA: 42, gateB: 53, name: "42-53 Maturation", theme: "Cycles of Life, Beginning, Culmination & Closure" },
  { gateA: 47, gateB: 64, name: "47-64 Abstraction", theme: "Mental Illumination, Making Sense of the Past" },
];

// Zodiac Element mapping
const ZODIAC_ELEMENTS: Record<string, "Fire" | "Earth" | "Air" | "Water"> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

export function calculateRelationshipSynergy(
  profileA: Profile,
  profileB: Profile,
  category: RelationshipCategory = "partner"
): RelationshipSynergyResult {
  const compA = getProfileComputed(profileA);
  const compB = getProfileComputed(profileB);

  // Gates of Person 1 and Person 2
  const p1Gates = new Set([
    ...(compA.humanDesign.personalityGates || []),
    ...(compA.humanDesign.designGates || []),
  ]);
  const p2Gates = new Set([
    ...(compB.humanDesign.personalityGates || []),
    ...(compB.humanDesign.designGates || []),
  ]);

  // 1. Electromagnetic Bridges (Electromagnetic = One has Gate A, other has Gate B, completing the Channel!)
  const electromagneticBridges: ElectromagneticBridge[] = [];
  const compromiseChannels: string[] = [];
  const companionshipChannels: string[] = [];

  for (const ch of ALL_CHANNELS) {
    const p1HasA = p1Gates.has(ch.gateA);
    const p1HasB = p1Gates.has(ch.gateB);
    const p2HasA = p2Gates.has(ch.gateA);
    const p2HasB = p2Gates.has(ch.gateB);

    const p1Full = p1HasA && p1HasB;
    const p2Full = p2HasA && p2HasB;

    if (p1Full && p2Full) {
      companionshipChannels.push(ch.name);
    } else if ((p1Full && (p2HasA || p2HasB)) || (p2Full && (p1HasA || p1HasB))) {
      compromiseChannels.push(ch.name);
    } else if ((p1HasA && !p1HasB && !p2HasA && p2HasB) || (p1HasB && !p1HasA && !p2HasB && p2HasA)) {
      electromagneticBridges.push({
        channelName: ch.name,
        p1Gate: p1HasA ? ch.gateA : ch.gateB,
        p2Gate: p2HasB ? ch.gateB : ch.gateA,
        keyTheme: ch.theme,
        description: `${profileA.firstName} anchors Gate ${p1HasA ? ch.gateA : ch.gateB} while ${profileB.firstName} ignites Gate ${p2HasB ? ch.gateB : ch.gateA}. When together, this forms a quantum electromagnetic bridge that neither can access alone.`
      });
    }
  }

  // 2. Center Interplay
  const allCenterNames = [
    "Head", "Ajna", "Throat", "G-Center", "Heart / Ego", "Sacral", "Solar Plexus", "Spleen", "Root"
  ];

  const centersInterplay: CenterInterplayItem[] = allCenterNames.map((center) => {
    const isP1Def = (compA.humanDesign.definedCenters || []).some(c => c.toLowerCase().includes(center.toLowerCase().split(" ")[0]));
    const isP2Def = (compB.humanDesign.definedCenters || []).some(c => c.toLowerCase().includes(center.toLowerCase().split(" ")[0]));

    let interactionType: CenterInterplayItem["interactionType"] = "Mutual Openness";
    let guidance = "";

    if (isP1Def && isP2Def) {
      interactionType = "Mutual Definition";
      guidance = `Both carry fixed, consistent energy in the ${center}. You can work side-by-side with mutual stamina, but must respect that neither will change their inherent rhythm here.`;
    } else if (isP1Def && !isP2Def) {
      interactionType = "Conditioning Flow";
      guidance = `${profileA.firstName} consistently broadcasts ${center} energy into ${profileB.firstName}, who amplifies it. ${profileB.firstName} must recognize when they are feeling ${profileA.firstName}'s frequency rather than their own.`;
    } else if (!isP1Def && isP2Def) {
      interactionType = "Conditioning Flow";
      guidance = `${profileB.firstName} consistently broadcasts ${center} energy into ${profileA.firstName}, who amplifies it. ${profileA.firstName} should practice taking space to discharge amplified emotional/mental charge.`;
    } else {
      interactionType = "Mutual Openness";
      guidance = `Both are open/undefined in the ${center}. You reflect each other with profound empathy and wisdom here, but should not look to each other for constant stability in this domain.`;
    }

    return {
      center,
      p1State: isP1Def ? "defined" : "undefined",
      p2State: isP2Def ? "defined" : "undefined",
      interactionType,
      guidance
    };
  });

  // 3. Elemental Synastry
  const p1Sun = compA.astrology.sunSign || "Aries";
  const p2Sun = compB.astrology.sunSign || "Libra";
  const p1Elem = ZODIAC_ELEMENTS[p1Sun] || "Fire";
  const p2Elem = ZODIAC_ELEMENTS[p2Sun] || "Air";

  let elementalHarmony = {
    p1Element: p1Elem,
    p2Element: p2Elem,
    title: `${p1Elem} meets ${p2Elem}`,
    description: "A dynamic synergy balancing different modalities of perception and drive."
  };

  if ((p1Elem === "Fire" && p2Elem === "Air") || (p1Elem === "Air" && p2Elem === "Fire")) {
    elementalHarmony = {
      p1Element: p1Elem,
      p2Element: p2Elem,
      title: "Wildfire & Oxygen — Creative Expansion",
      description: "Air feeds Fire's creative ambition with endless ideas, while Fire gives Air's visions warmth and momentum. Conversations spark quickly and you never run out of inspiration."
    };
  } else if ((p1Elem === "Earth" && p2Elem === "Water") || (p1Elem === "Water" && p2Elem === "Earth")) {
    elementalHarmony = {
      p1Element: p1Elem,
      p2Element: p2Elem,
      title: "Oasis & Bedrock — Fertile Longevity",
      description: "Earth provides safe banks and structural grounding for Water's rich emotions. Water softens Earth's pragmatic rigidity with tenderness and intuitive depth. High long-term endurance."
    };
  } else if (p1Elem === p2Elem) {
    elementalHarmony = {
      p1Element: p1Elem,
      p2Element: p2Elem,
      title: `Double ${p1Elem} — Instant Kinship`,
      description: `Operating on the exact same elemental frequency. You instinctively understand each other's pace, temperament, and instinctive reactions without needing extensive translation.`
    };
  } else if ((p1Elem === "Fire" && p2Elem === "Water") || (p1Elem === "Water" && p2Elem === "Fire")) {
    elementalHarmony = {
      p1Element: p1Elem,
      p2Element: p2Elem,
      title: "Steam & Alchemy — Intense Catalyst",
      description: "High emotional and passionate intensity. Fire pushes Water into dramatic bravery; Water cools Fire into soulful depth. Requires conscious emotional pacing to avoid steam burns."
    };
  } else if ((p1Elem === "Earth" && p2Elem === "Air") || (p1Elem === "Air" && p2Elem === "Earth")) {
    elementalHarmony = {
      p1Element: p1Elem,
      p2Element: p2Elem,
      title: "Blueprint & Scaffold — Practical Innovation",
      description: "Air provides the elevated visionary plan, and Earth builds the solid foundation. Essential for professional co-creation when expectations are explicitly mapped."
    };
  }

  // 4. Numerology Resonance
  const p1LP = compA.numerology.lifePath || 1;
  const p2LP = compB.numerology.lifePath || 1;

  let numerologyTitle = `Life Path ${p1LP} & Life Path ${p2LP} Harmonic`;
  let numerologyDesc = `Your vibrational numbers interact to foster reciprocal growth and evolutionary maturity.`;

  const diff = Math.abs(p1LP - p2LP);
  if (p1LP === p2LP) {
    numerologyTitle = `Mirror Vibrations: Dual Life Path ${p1LP}`;
    numerologyDesc = `You walk identical archetypal trails. You intuitively respect each other's life purpose and recognize your own inner journey reflected back at you.`;
  } else if (diff === 2 || diff === 4 || diff === 6) {
    numerologyTitle = `Even Harmonic Resonator (${p1LP} + ${p2LP})`;
    numerologyDesc = `Your frequencies complement each other with structural rhythm. One leads where the other observes, creating an efficient shared energetic balance.`;
  } else {
    numerologyTitle = `Evolutionary Polarity (${p1LP} + ${p2LP})`;
    numerologyDesc = `Dynamic tension that acts as an evolutionary forge. You challenge each other to step out of cognitive comfort zones into sovereign self-realization.`;
  }

  // 5. Longevity & Resonance Scores
  let baseLongevity = 72;
  // Earth/Water elements boost longevity
  if (p1Elem === "Earth" || p1Elem === "Water") baseLongevity += 6;
  if (p2Elem === "Earth" || p2Elem === "Water") baseLongevity += 6;
  // Companion channels add ease
  baseLongevity += Math.min(companionshipChannels.length * 4, 12);
  // Electromagnetic channels add attraction
  const electroCount = electromagneticBridges.length;
  baseLongevity += Math.min(electroCount * 3, 15);
  // Cap longevity between 65 and 98
  const longevityScore = Math.max(65, Math.min(97, baseLongevity));

  let baseResonance = 70;
  baseResonance += electroCount * 5;
  if (p1Elem === p2Elem) baseResonance += 8;
  if ((p1Elem === "Fire" && p2Elem === "Air") || (p1Elem === "Earth" && p2Elem === "Water")) baseResonance += 10;
  const resonanceScore = Math.max(68, Math.min(99, baseResonance));

  // 6. Interaction Dynamic by Category
  let interactionDynamic = "Catalytic Synergy & Evolutionary Alliance";
  let dynamicSummary = "";

  if (category === "partner") {
    interactionDynamic = electroCount >= 2 ? "High Magnetic Chemistry & Complementary Spark" : "Deep Heart Sanctuary & Steady Mutual Nurturing";
    dynamicSummary = `As romantic partners, your interaction is characterized by ${electroCount >= 2 ? 'irresistible magnetic attraction and continuous energetic chemistry' : 'a deeply grounded sanctuary of mutual respect and companionship'}. You trigger rapid personal evolution in each other while offering a safe harbour when conscious communication is maintained.`;
  } else if (category === "coworker") {
    interactionDynamic = electroCount >= 2 ? "High-Velocity Innovation & Strategic Completion" : "Stable Operational Alignment & Systematic Execution";
    dynamicSummary = `As colleagues and collaborators, you fill each other's blind spots with precision. Decisions are made most smoothly when ${profileA.firstName}'s strengths in ${compA.humanDesign.type} energy are aligned with ${profileB.firstName}'s ${compB.humanDesign.type} authority, preventing bottlenecks and ego friction.`;
  } else {
    // friend
    interactionDynamic = "Spontaneous Camaraderie & Soul-Level Candor";
    dynamicSummary = `In friendship, you provide a non-judgmental mirror for one another. You can spend long stretches apart and pick up with instantaneous warmth, serving as each other's grounded sounding board during life transitions.`;
  }

  // 7. Fighting Styles, Shadow Clashes & Trigger Points
  const p1Type = compA.humanDesign.type;
  const p2Type = compB.humanDesign.type;

  const fightingStyles: FightingStyleAnalysis = {
    p1StyleName: p1Type.includes("Generator") 
      ? "Frustration Eruption or Stone-Walling" 
      : p1Type === "Projector" 
      ? "Bitterness & Intellectual Dissection" 
      : p1Type === "Manifestor" 
      ? "Sudden Fierce Anger & Immediate Withdrawal" 
      : "Quiet Disillusionment & Environmental Retreat",
    p1Description: `${profileA.firstName} (${p1Type}) enters fight-or-flight when feeling ${p1Type.includes("Generator") ? 'drained, trapped into obligations, or not responded to' : p1Type === "Projector" ? 'unrecognized, interrupted, or unsolicitedly managed' : p1Type === "Manifestor" ? 'controlled, questioned, or restricted from moving' : 'overwhelmed by turbulent external energy'}.`,
    p2StyleName: p2Type.includes("Generator") 
      ? "Frustration Eruption or Stone-Walling" 
      : p2Type === "Projector" 
      ? "Bitterness & Intellectual Dissection" 
      : p2Type === "Manifestor" 
      ? "Sudden Fierce Anger & Immediate Withdrawal" 
      : "Quiet Disillusionment & Environmental Retreat",
    p2Description: `${profileB.firstName} (${p2Type}) enters fight-or-flight when feeling ${p2Type.includes("Generator") ? 'drained, trapped into obligations, or not responded to' : p2Type === "Projector" ? 'unrecognized, interrupted, or unsolicitedly managed' : p2Type === "Manifestor" ? 'controlled, questioned, or restricted from moving' : 'overwhelmed by turbulent external energy'}.`,
    coreClashTriggers: [
      `Assumptions of intent without explicit checking — especially around emotional states and deadlines.`,
      `Over-stepping boundaries when either party is in their 'not-self' theme (${compA.humanDesign.type} vs ${compB.humanDesign.type}).`,
      `Trying to resolve heated disagreements in the emotional wave instead of waiting for biological stillness.`,
      `Demanding promises from undefined ego centers or demanding spontaneous decisions from emotional authorities.`
    ],
    shadowHooks: [
      `Gene Key Shadow hook: Projecting unhealed childhood survival strategies onto mundane daily interactions.`,
      `The 'Fixing' Reflex: Offering unsolicited logical solutions when the other simply needs empathetic witnessing.`,
      `Energy Encroachment: Not leaving sufficient solitary space to discharge borrowed auric frequencies.`
    ],
    deEscalationBlueprint: `The 20-Minute Circuit Breaker: When voices rise or curtness enters, call the 'Affinity Pause'. Disengage physical proximity for exactly 20 minutes to let your nervous systems return to baseline. Return and start with: 'I hear that you feel X, and my intention was not to cause friction. Let us solve this as partners against the problem.'`
  };

  // 8. Cheat Sheet for Bettering the Relationship
  const cheatSheet: RelationshipCheatSheet = {
    communicationScripts: [
      {
        situation: "When initiating a request or making plans together",
        whatToSay: category === "coworker" 
          ? `"I'm outlining the parameters for this milestone. What does your gut and bandwidth say to this direction?"`
          : `"I'd love your perspective on this. Does this feel aligned with your energy right now?"`,
        whatToAvoid: `"You have to get this done by tonight" or "Why haven't you decided yet?"`
      },
      {
        situation: "When friction or disagreement begins to boil",
        whatToSay: `"I value our connection more than being right in this moment. Can we take 15 minutes to breathe, and then hear each other's core need?"`,
        whatToAvoid: `"You always do this" or rolling eyes and shutting down communications completely.`
      },
      {
        situation: "When offering feedback or course-correction",
        whatToSay: `"You bring tremendous value to this. Here is one nuance that could elevate our harmony even further..."`,
        whatToAvoid: `Critiquing character traits rather than specific behaviors and shared outcomes.`
      }
    ],
    vitalDos: [
      category === "partner" 
        ? `Create weekly non-transactional check-ins where neither person brings up logistics or chores.`
        : category === "coworker"
        ? `Clarify decision rights explicitly: who has final veto, who gives input, who executes.`
        : `Celebrate spontaneous joys without keeping emotional score of who reached out first.`,
      `Honor each other's Human Design authority (${compA.humanDesign.authority} and ${compB.humanDesign.authority}) without demanding instant answers.`,
      `Acknowledge and celebrate progress: verbal appreciation acts as a sovereign lubricant for this bond.`
    ],
    vitalDonts: [
      `Never debate when either person is hungry, exhausted, or in an amplified emotional wave.`,
      `Do not attempt to convert the other person to your style of thinking; celebrate the complementary polarity.`,
      `Avoid triangulating conflicts with outside parties before having direct, loving conversation with each other.`
    ],
    appreciationBlueprint: category === "partner"
      ? `${profileA.firstName} thrives on authentic verbal recognition and physical touch, while ${profileB.firstName} deeply values undivided listening and shared experiential adventures.`
      : category === "coworker"
      ? `Acknowledge contributions publicly and give credit generously. Both thrive when their distinct subject-matter sovereignty is respected.`
      : `Consistent check-ins, laughing through life's absurdities, and showing up during pivotal life milestones.`
  };

  // 9. Work to Do on Self vs Work to Do Together
  const growthWork: GrowthWorkDivision = {
    workOnSelf: [
      `Sovereignty Master: ${profileA.firstName} must practice catching their own conditioned emotional triggers before projecting blame outward.`,
      `Energy Hygiene: ${profileB.firstName} must clear outside auric impressions daily through grounding, quiet walking, or breathwork.`,
      `Boundary Ownership: Learn to say a clean, non-apologetic 'No' to things that drain your sacral/nervous system vitality.`,
      `Inner Fulfillment: Recognize that no partner, friend, or coworker can provide internal contentment — it springs solely from your own connection to Source.`
    ],
    workTogether: [
      `Establish Sacred Micro-Rituals: A 2-minute morning grounding breath, coffee ritual, or milestone celebration handshake.`,
      `Vulnerability Audits: A monthly question: 'What is one thing I do that makes you feel most loved/supported, and one thing I can adjust?'`,
      `Shared Sovereign Vision: Maintain a written blueprint of your collective goals so minor disagreements are contextualized against the big picture.`,
      `Forgiveness Protocol: Practice fast reconciliation — refusing to let silent resentment compound over days.`
    ]
  };

  // 10. Personality & Psychometrics Blend + Toxicity vs Harmony Analysis
  // Infer or read MBTI and dimensional traits
  const p1SunElem = p1Elem;
  const p2SunElem = p2Elem;
  
  // Assess Toxicity Risk vs Harmony Level
  let toxicityRiskLevel: "Low Toxicity Risk (High Harmony)" | "Moderate Friction (Growth Catalyst)" | "High Risk of Toxicity / Shadow Spiral" = "Low Toxicity Risk (High Harmony)";
  let toxicityColor: "emerald" | "amber" | "rose" = "emerald";

  if ((p1Elem === "Fire" && p2Elem === "Water") || (p1Elem === "Water" && p2Elem === "Fire")) {
    toxicityRiskLevel = "High Risk of Toxicity / Shadow Spiral";
    toxicityColor = "rose";
  } else if ((p1Elem === "Fire" && p2Elem === "Earth") || (p1Elem === "Air" && p2Elem === "Water")) {
    toxicityRiskLevel = "Moderate Friction (Growth Catalyst)";
    toxicityColor = "amber";
  } else {
    toxicityRiskLevel = "Low Toxicity Risk (High Harmony)";
    toxicityColor = "emerald";
  }

  const personalityPsychometricsBlend = {
    blendTitle: `${profileA.firstName} (${p1Type} • ${p1Sun}) & ${profileB.firstName} (${p2Type} • ${p2Sun}) Psychological Blend`,
    toxicityRiskLevel,
    toxicityColor,
    blendSummary: toxicityRiskLevel === "High Risk of Toxicity / Shadow Spiral"
      ? `This combination has explosive passion and deep magnetic pull, but carries a high potential for toxic cycles if either person acts from unhealed survival wounds. ${profileA.firstName} expresses intensity outwardly, while ${profileB.firstName} absorbs and broods inwardly, which can create a vicious cycle of pursuit and withdrawal.`
      : toxicityRiskLevel === "Moderate Friction (Growth Catalyst)"
      ? `A dynamic balance that requires conscious communication. You do not naturally perceive the world the same way, meaning small misunderstandings can turn into defensiveness if you don't translate your intent into basic, simple language.`
      : `High organic harmony. Your psychological styles naturally complement each other without draining energy. You give each other room to be authentic without constantly stepping on subconscious landmines.`,
    compliments: [
      `${profileA.firstName}'s natural strength in ${compA.humanDesign.authority} authority gives ${profileB.firstName} a steady mirror to calibrate their thoughts.`,
      `${profileB.firstName} brings an adaptable perspective that softens ${profileA.firstName}'s rigid tendencies during stress.`,
      `When collaborating, ${profileA.firstName} provides the initiating momentum while ${profileB.firstName} refines and anchors the details into lasting reality.`
    ],
    contrasts: [
      `Different Speeds of Processing: ${profileA.firstName} wants quick resolution, whereas ${profileB.firstName} needs time and quiet to sort through how they actually feel.`,
      `Emotional Expression: One tends to be direct and vocal, while the other processes internally, which can be misinterpreted as coldness or disinterest.`,
      `Stress Response: Under high pressure, one becomes hyper-focused and critical, while the other tends to shut down or seek an escape.`
    ],
    toxicTriggersToAvoid: [
      `The Silent Treatment / Stonewalling: Walking away without agreeing on a specific time to return and talk.`,
      `Mind-Reading Assumptions: Deciding what the other person meant instead of asking: 'Are you upset, or are you just tired?'`,
      `Invalidating Feelings with Logic: Saying 'that doesn't make sense' when the other is sharing an emotional wound.`
    ],
    plainEnglishTranslation: `In simple terms: You two will either be an unstoppable dream team or you will drive each other crazy over small miscommunications. When you speak gently, give each other space to breathe, and don't take bad moods personally, you bring out the best in one another.`
  };

  // 11. Astrology Synastry: Compliments & Contrasts in Plain English
  const astrologyComplimentsContrasts = {
    compliments: [
      `${p1Sun} (${p1Elem}) and ${p2Sun} (${p2Elem}) create an engaging balance of energy where conversations never go stale.`,
      `${profileA.firstName}'s ${compA.astrology.moonSign} Moon and ${profileB.firstName}'s ${compB.astrology.moonSign} Moon share an underlying desire for emotional security and respect.`,
      `You inspire each other to step up and take bold actions that you might hesitate to take on your own.`
    ],
    contrasts: [
      `Ego Clashes: Both have strong points of view and dislike being told what to do or being micromanaged.`,
      `Pacing Differences: ${p1Elem} energy moves fast and impatient, while ${p2Elem} energy prefers steady, predictable rhythm.`
    ],
    plainEnglishTranslation: `Astrology in plain English: Your zodiac signs naturally spark curiosity. The only real trap is stubbornness—learning to say 'I see your point' will prevent 90% of arguments.`
  };

  // 12. Human Design & Gene Keys: Compliments & Contrasts
  const humanDesignGeneKeysComplimentsContrasts = {
    compliments: [
      `Energetic Teamwork: As a ${p1Type} and ${p2Type}, you do not duplicate the exact same energetic blind spots. One provides stamina, the other provides guidance.`,
      `Electromagnetic Completion: The channels you share (${electromagneticBridges.length > 0 ? electromagneticBridges.map(e => e.channelName).join(', ') : 'Centers Interplay'}) create a third entity—the 'Us'—that is smarter and more capable together than apart.`
    ],
    contrasts: [
      `Energy Depletion: When spending long hours together in the same room, open centers absorb and amplify emotions, causing unexplained fatigue if you don't take solo breaks.`,
      `Authority Clashes: Trying to force spontaneous agreements when one of you has an emotional wave will lead to buyer's remorse and resentment.`
    ],
    plainEnglishTranslation: `Human Design in plain English: You operate with different battery types. One person's battery recharges by doing, while the other recharges by resting in quiet. Respecting each other's need for downtime keeps love alive.`
  };

  // 13. Basic Plain English Translation (Entire Dynamic Simplified)
  const basicPlainEnglishTranslation = {
    headline: longevityScore >= 85 
      ? `Exceptional Longevity (${longevityScore}%): A Deep, Enduring Bond with Mutual Growth`
      : longevityScore >= 75
      ? `Strong Connection (${longevityScore}%): Great Chemistry That Thrives with Clear Boundaries`
      : `High-Intensity Bond (${longevityScore}%): Passionate, Transformative, But Needs Conscious Work`,
    verdict: `You two have real potential to support, love, and build with each other. You stimulate each other's minds and keep things exciting. As long as you don't try to change each other into copies of yourself, this relationship can stand the test of time.`,
    howYouGetAlong: `You click because you appreciate things in each other that you don't possess yourself. There is natural admiration, good laughter, and a mutual sense that you can be your true self without walking on eggshells.`,
    howYouFightAndHowToFixIt: `When you fight, it's almost always because one person felt disrespected, rushed, or dismissed. To fix it instantly: Take a 20-minute breather, drink a glass of water, and come back ready to say: 'I value you more than winning this argument. Let's fix this together.'`,
    longevityOutlook: `Longevity is high (${longevityScore}%). This is not a shallow connection. You have the structural ingredients to grow old together as partners, build a thriving business as coworkers, or stay lifelong trusted confidants as allies.`
  };

  return {
    category,
    longevityScore,
    resonanceScore,
    interactionDynamic,
    dynamicSummary,
    electromagneticBridges,
    compromiseChannels,
    companionshipChannels,
    centersInterplay,
    elementalHarmony,
    numerologyResonance: {
      p1LifePath: p1LP,
      p2LifePath: p2LP,
      title: numerologyTitle,
      description: numerologyDesc
    },
    fightingStyles,
    cheatSheet,
    growthWork,
    personalityPsychometricsBlend,
    astrologyComplimentsContrasts,
    humanDesignGeneKeysComplimentsContrasts,
    basicPlainEnglishTranslation
  };
}
