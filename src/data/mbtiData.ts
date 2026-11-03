export interface MbtiQuestion {
  id: number;
  dichotomy: "EI" | "SN" | "TF" | "JP";
  dichotomyName: string;
  dimensionA: "E" | "S" | "T" | "J";
  dimensionB: "I" | "N" | "F" | "P";
  question: string;
  optionA: string;
  optionB: string;
}

export interface CognitiveFunctionStack {
  dominant: string;
  auxiliary: string;
  tertiary: string;
  inferior: string;
}

export interface MbtiTypeProfile {
  type: string;
  title: string;
  nickname: string;
  category: "Analysts" | "Diplomats" | "Sentinels" | "Explorers";
  color: string;
  description: string;
  cognitiveFunctions: CognitiveFunctionStack;
  strengths: string[];
  blindSpots: string[];
  relationshipStyle: string;
  growthEdge: string;
  deEscalationPhrase: string;
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // --- EXTRAVERSION (E) vs INTROVERSION (I) ---
  {
    id: 1,
    dichotomy: "EI",
    dichotomyName: "Energy Orientation",
    dimensionA: "E",
    dimensionB: "I",
    question: "After a long or busy week, how do you best recharge your energy?",
    optionA: "By hanging out with friends, going to social events, or talking with people.",
    optionB: "By spending quiet time alone, resting at home, or doing a relaxing solo hobby."
  },
  {
    id: 2,
    dichotomy: "EI",
    dichotomyName: "Energy Orientation",
    dimensionA: "E",
    dimensionB: "I",
    question: "When working through a difficult problem or idea, what is your usual approach?",
    optionA: "I like to talk it out with others to get clarity and feedback.",
    optionB: "I prefer to think it over quietly by myself before saying anything."
  },
  {
    id: 3,
    dichotomy: "EI",
    dichotomyName: "Energy Orientation",
    dimensionA: "E",
    dimensionB: "I",
    question: "At parties or social gatherings, what feels most natural to you?",
    optionA: "Starting conversations easily, meeting new people, and moving around the room.",
    optionB: "Waiting for people to come talk to me, or having a deep chat with one or two people."
  },
  {
    id: 4,
    dichotomy: "EI",
    dichotomyName: "Energy Orientation",
    dimensionA: "E",
    dimensionB: "I",
    question: "In your everyday communication style, you are usually:",
    optionA: "Outspoken, expressive, and quick to share what you are thinking or feeling.",
    optionB: "More reserved and quiet, thinking carefully before you speak."
  },
  {
    id: 5,
    dichotomy: "EI",
    dichotomyName: "Energy Orientation",
    dimensionA: "E",
    dimensionB: "I",
    question: "Spending several days completely alone makes you feel:",
    optionA: "Restless or drained; you start missing people and outside activity.",
    optionB: "Refreshed and peaceful; you enjoy having time all to yourself."
  },

  // --- SENSING (S) vs INTUITION (N) ---
  {
    id: 6,
    dichotomy: "SN",
    dichotomyName: "Information Intake",
    dimensionA: "S",
    dimensionB: "N",
    question: "When you take in new information, what catches your attention first?",
    optionA: "Real facts, details, and what is happening right in front of you.",
    optionB: "The big picture, deeper meanings, patterns, and future possibilities."
  },
  {
    id: 7,
    dichotomy: "SN",
    dichotomyName: "Information Intake",
    dimensionA: "S",
    dimensionB: "N",
    question: "When learning a new skill or task, what works best for you?",
    optionA: "Clear, step-by-step instructions and practical examples you can use right away.",
    optionB: "Understanding the general idea first so you can experiment and figure out your own way."
  },
  {
    id: 8,
    dichotomy: "SN",
    dichotomyName: "Information Intake",
    dimensionA: "S",
    dimensionB: "N",
    question: "When you think about the future, you focus more on:",
    optionA: "Realistic next steps and practical goals you can take today.",
    optionB: "Big dreams, imaginative ideas, and what could be possible years from now."
  },
  {
    id: 9,
    dichotomy: "SN",
    dichotomyName: "Information Intake",
    dimensionA: "S",
    dimensionB: "N",
    question: "What kind of conversations do you enjoy the most?",
    optionA: "Practical topics, hands-on experiences, current events, and daily life.",
    optionB: "Philosophical ideas, theories, 'what if' scenarios, and why things happen."
  },
  {
    id: 10,
    dichotomy: "SN",
    dichotomyName: "Information Intake",
    dimensionA: "S",
    dimensionB: "N",
    question: "People who know you best would describe you as:",
    optionA: "Sensible, down-to-earth, observant, and very practical.",
    optionB: "Creative, imaginative, insightful, and always looking between the lines."
  },

  // --- THINKING (T) vs FEELING (F) ---
  {
    id: 11,
    dichotomy: "TF",
    dichotomyName: "Decision Making",
    dimensionA: "T",
    dimensionB: "F",
    question: "When making an important decision, what matters most to you?",
    optionA: "Logic, fairness, objective facts, and common sense.",
    optionB: "How people feel, personal values, empathy, and keeping harmony."
  },
  {
    id: 12,
    dichotomy: "TF",
    dichotomyName: "Decision Making",
    dimensionA: "T",
    dimensionB: "F",
    question: "When there is an argument or disagreement between people, your first goal is to:",
    optionA: "Find the truth, figure out who is right, and solve the actual problem logically.",
    optionB: "Listen to how people feel, smooth over hurt feelings, and restore good relationships."
  },
  {
    id: 13,
    dichotomy: "TF",
    dichotomyName: "Decision Making",
    dimensionA: "T",
    dimensionB: "F",
    question: "You feel most bothered or hurt when someone criticizes your:",
    optionA: "Competence, logic, work quality, or intelligence.",
    optionB: "Kindness, good intentions, or how much you care about others."
  },
  {
    id: 14,
    dichotomy: "TF",
    dichotomyName: "Decision Making",
    dimensionA: "T",
    dimensionB: "F",
    question: "When a close friend comes to you upset and needing support, you usually:",
    optionA: "Offer helpful advice and suggest practical solutions to fix the problem.",
    optionB: "Listen with care, validate their feelings, and give them comfort and warmth."
  },
  {
    id: 15,
    dichotomy: "TF",
    dichotomyName: "Decision Making",
    dimensionA: "T",
    dimensionB: "F",
    question: "When making a tough decision that affects a whole group, it is better to:",
    optionA: "Be completely fair and follow consistent rules, even if someone gets upset.",
    optionB: "Be understanding and compassionate, making exceptions when needed for people's feelings."
  },

  // --- JUDGING (J) vs PERCEIVING (P) ---
  {
    id: 16,
    dichotomy: "JP",
    dichotomyName: "Lifestyle & Planning",
    dimensionA: "J",
    dimensionB: "P",
    question: "In your daily routine, you feel most comfortable when:",
    optionA: "Things are planned, organized, and you know what to expect ahead of time.",
    optionB: "Your schedule is flexible, open, and you can go with the flow."
  },
  {
    id: 17,
    dichotomy: "JP",
    dichotomyName: "Lifestyle & Planning",
    dimensionA: "J",
    dimensionB: "P",
    question: "When working on a major project or assignment, you typically:",
    optionA: "Plan ahead, set milestones, and finish early so there is no last-minute rush.",
    optionB: "Work in spontaneous bursts of energy and do your best work closer to the deadline."
  },
  {
    id: 18,
    dichotomy: "JP",
    dichotomyName: "Lifestyle & Planning",
    dimensionA: "J",
    dimensionB: "P",
    question: "When sudden, unexpected changes happen to your plans, you usually:",
    optionA: "Feel stressed or annoyed, because you like to stick to what was agreed upon.",
    optionB: "Take it in stride or feel excited, seeing it as an enjoyable surprise or adventure."
  },
  {
    id: 19,
    dichotomy: "JP",
    dichotomyName: "Lifestyle & Planning",
    dimensionA: "J",
    dimensionB: "P",
    question: "Your living space or workspace is typically:",
    optionA: "Neat, organized, and tidy, with items kept where they belong.",
    optionB: "A bit dynamic and lived-in, with projects and items out where you can see them."
  },
  {
    id: 20,
    dichotomy: "JP",
    dichotomyName: "Lifestyle & Planning",
    dimensionA: "J",
    dimensionB: "P",
    question: "When heading into an open weekend or vacation, you prefer:",
    optionA: "Having a clear plan or itinerary so you know how you'll spend your time.",
    optionB: "Having no set schedule so you can decide what to do in the moment."
  }
];

export const MBTI_PROFILES: Record<string, MbtiTypeProfile> = {
  INFJ: {
    type: "INFJ",
    title: "The Mystic Counselor",
    nickname: "The Advocate",
    category: "Diplomats",
    color: "#14b8a6", // teal-500
    description: "Quiet, mystical, intensely principled visionaries driven to illuminate human consciousness and help others realize their sacred purpose.",
    cognitiveFunctions: {
      dominant: "Ni (Introverted Intuition)",
      auxiliary: "Fe (Extraverted Feeling)",
      tertiary: "Ti (Introverted Thinking)",
      inferior: "Se (Extraverted Sensing)"
    },
    strengths: ["Holistic pattern recognition", "Profound empathy", "High ethical sovereignty", "Insightful foresight"],
    blindSpots: ["Burnout from carrying others' emotional weight", "Perfectionistic paralysis", "Neglecting physical embodiment"],
    relationshipStyle: "Deeply bonded, loyal, craving soul-to-soul intimacy and mutual spiritual evolution.",
    growthEdge: "Grounding in the physical sensory world (Se) without judgment; honoring personal boundaries before healing others.",
    deEscalationPhrase: "'I see your heart and hear your intentions. Let us pause and breathe together before resolving this.'"
  },
  INTJ: {
    type: "INTJ",
    title: "The Cosmic Architect",
    nickname: "The Mastermind",
    category: "Analysts",
    color: "#6366f1", // indigo-500
    description: "Strategic, hyper-perceptive master builders of systems with a relentless drive to synthesize high knowledge into sovereign manifestation.",
    cognitiveFunctions: {
      dominant: "Ni (Introverted Intuition)",
      auxiliary: "Te (Extraverted Thinking)",
      tertiary: "Fi (Introverted Feeling)",
      inferior: "Se (Extraverted Sensing)"
    },
    strengths: ["Strategic long-range vision", "Ruthless efficiency", "Independent intellect", "Immunity to dogma"],
    blindSpots: ["Impatient with perceived inefficiency", "Dismissing emotional nuances", "Over-intellectualizing relationships"],
    relationshipStyle: "Values mental sparring, sovereign independence, unconditional reliability, and deep mutual respect.",
    growthEdge: "Connecting with raw emotional vulnerability (Fi) and embracing the unpredictable beauty of physical reality (Se).",
    deEscalationPhrase: "'Let us step back to examine the system we are building together rather than blaming each other.'"
  },
  INFP: {
    type: "INFP",
    title: "The Soul Healer",
    nickname: "The Mediator",
    category: "Diplomats",
    color: "#10b981", // emerald-500
    description: "Gentle, imaginative, and deeply poetic seekers with an unwavering inner moral flame and boundless creative empathy.",
    cognitiveFunctions: {
      dominant: "Fi (Introverted Feeling)",
      auxiliary: "Ne (Extraverted Intuition)",
      tertiary: "Si (Introverted Sensing)",
      inferior: "Te (Extraverted Thinking)"
    },
    strengths: ["Absolute moral authenticity", "Limitless creative imagination", "Deep acceptance of others", "Poetic insight"],
    blindSpots: ["Taking critique to the soul's core", "Difficulty executing mundane logistics", "Idealizing relationships"],
    relationshipStyle: "Gentle, tender, honoring the sacred inner child of their partner with unconditional acceptance.",
    growthEdge: "Developing executive follow-through (Te) to manifest their high ideals into practical reality.",
    deEscalationPhrase: "'Your feelings are sacred to me. Please know my core love for you is unchanged while we navigate this.'"
  },
  INTP: {
    type: "INTP",
    title: "The Quantum Synthesizer",
    nickname: "The Logician",
    category: "Analysts",
    color: "#8b5cf6", // violet-500
    description: "Brilliant, unorthodox thinkers constantly deconstructing and reconstructing fundamental laws of nature, metaphysics, and logic.",
    cognitiveFunctions: {
      dominant: "Ti (Introverted Thinking)",
      auxiliary: "Ne (Extraverted Intuition)",
      tertiary: "Si (Introverted Sensing)",
      inferior: "Fe (Extraverted Feeling)"
    },
    strengths: ["Precision of thought", "Radical intellectual freedom", "Lateral problem solving", "Immunity to bias"],
    blindSpots: ["Social detachment", "Procrastination through analysis", "Struggling to express affection openly"],
    relationshipStyle: "Exploratory, intellectually playful, deeply loyal when their mind and freedom are honored.",
    growthEdge: "Allowing the warmth of communal feeling (Fe) to soften their solitary analytical armor.",
    deEscalationPhrase: "'Help me understand the underlying premises of what you feel, without either of us feeling judged.'"
  },
  ENFJ: {
    type: "ENFJ",
    title: "The Celestial Guide",
    nickname: "The Protagonist",
    category: "Diplomats",
    color: "#f59e0b", // amber-500
    description: "Charismatic, radiant inspirers who intuitively see the highest divine spark in everyone and guide communities toward unity.",
    cognitiveFunctions: {
      dominant: "Fe (Extraverted Feeling)",
      auxiliary: "Ni (Introverted Intuition)",
      tertiary: "Se (Extraverted Sensing)",
      inferior: "Ti (Introverted Thinking)"
    },
    strengths: ["Transformative leadership", "Emotional resonance", "Unifying disparate voices", "Inspirational clarity"],
    blindSpots: ["Over-giving to point of exhaustion", "Prone to covert control", "Struggling with boundary setting"],
    relationshipStyle: "Nurturing, deeply invested, celebratory of their partner's potential and growth milestones.",
    growthEdge: "Cultivating impersonal logical truth (Ti) and recognizing that not all suffering is theirs to heal.",
    deEscalationPhrase: "'I am listening completely. What do you need right now to feel supported and respected?'"
  },
  ENTJ: {
    type: "ENTJ",
    title: "The Sovereign Commander",
    nickname: "The Commander",
    category: "Analysts",
    color: "#ef4444", // red-500
    description: "Commanding, visionary leaders who naturally orchestrate collective resources, eliminate chaos, and actualize ambitious destinies.",
    cognitiveFunctions: {
      dominant: "Te (Extraverted Thinking)",
      auxiliary: "Ni (Introverted Intuition)",
      tertiary: "Se (Extraverted Sensing)",
      inferior: "Fi (Introverted Feeling)"
    },
    strengths: ["Decisive execution", "Systemic organization", "Unshakable self-confidence", "Strategic mastery"],
    blindSpots: ["Bluntness interpreted as coldness", "Intolerance of hesitation", "Suppressing grief and tender emotions"],
    relationshipStyle: "Protective, ambitious, building formidable power-couple dynamics and supporting mutual success.",
    growthEdge: "Opening the heart cave (Fi) to honor their own tender vulnerabilities and their partner's emotional rhythms.",
    deEscalationPhrase: "'I acknowledge your viewpoint. Let us agree on the common objective so we can align our energy.'"
  },
  ENFP: {
    type: "ENFP",
    title: "The Starlight Catalyst",
    nickname: "The Campaigner",
    category: "Diplomats",
    color: "#06b6d4", // cyan-500
    description: "Enthusiastic, free-spirited wanderers of consciousness, weaving vibrant synchronicities and inspiring genuine human awakening.",
    cognitiveFunctions: {
      dominant: "Ne (Extraverted Intuition)",
      auxiliary: "Fi (Introverted Feeling)",
      tertiary: "Te (Extraverted Thinking)",
      inferior: "Si (Introverted Sensing)"
    },
    strengths: ["Magnetic inspiration", "Boundless curiosity", "Warm emotional connection", "Uncanny intuition"],
    blindSpots: ["Scattered focus", "Overcommitting to new beginnings", "Hypersensitive to feeling boxed in"],
    relationshipStyle: "Passionate, playful, deeply communicative, seeking shared wonder and boundless freedom.",
    growthEdge: "Practicing somatic presence and completing established cycles (Si) before leaping into the next cosmic horizon.",
    deEscalationPhrase: "'I hear what you are saying. I love our connection—let us explore how we can both feel heard and free.'"
  },
  ENTP: {
    type: "ENTP",
    title: "The Cosmic Alchemist",
    nickname: "The Debater",
    category: "Analysts",
    color: "#3b82f6", // blue-500
    description: "Quick-witted, iconoclastic innovators who re-engineer assumptions, spark mental breakthroughs, and challenge stagnant orthodoxies.",
    cognitiveFunctions: {
      dominant: "Ne (Extraverted Intuition)",
      auxiliary: "Ti (Introverted Thinking)",
      tertiary: "Fe (Extraverted Feeling)",
      inferior: "Si (Introverted Sensing)"
    },
    strengths: ["Mental agility", "Unflinching originality", "Problem deconstruction", "Charismatic debate"],
    blindSpots: ["Debating for sport at cost of feelings", "Difficulty finishing mundane details", "Impatience with routine"],
    relationshipStyle: "Spirited, stimulating, keeping the relationship mentally dynamic and playfully adventurous.",
    growthEdge: "Remembering that human hearts require gentle emotional consistency (Fe/Si), not just intellectual fireworks.",
    deEscalationPhrase: "'Let me drop my argument for a moment and simply hear what this is truly about for you.'"
  },
  ISFJ: {
    type: "ISFJ",
    title: "The Sacred Guardian",
    nickname: "The Defender",
    category: "Sentinels",
    color: "#0ea5e9", // sky-500
    description: "Quietly devoted, meticulous, and profoundly compassionate caretakers who uphold sacred community traditions with steadfast grace.",
    cognitiveFunctions: {
      dominant: "Si (Introverted Sensing)",
      auxiliary: "Fe (Extraverted Feeling)",
      tertiary: "Ti (Introverted Thinking)",
      inferior: "Ne (Extraverted Intuition)"
    },
    strengths: ["Unwavering reliability", "Attentive caretaking", "Observant memory for details", "Humble devotion"],
    blindSpots: ["Internalizing resentment instead of speaking up", "Fear of sudden disruption", "Over-sacrificing self"],
    relationshipStyle: "Loyal, devoted, building a stable home sanctuary filled with thoughtful gestures and security.",
    growthEdge: "Embracing future uncertainty (Ne) and vocalizing personal desires directly before resentment brews.",
    deEscalationPhrase: "'I appreciate everything you do for our space. Let us talk gently about what would bring you peace.'"
  },
  ISTJ: {
    type: "ISTJ",
    title: "The Pillar of Integrity",
    nickname: "The Logistician",
    category: "Sentinels",
    color: "#64748b", // slate-500
    description: "Methodical, incorruptible stewards of duty and divine order, grounding vision into rock-solid manifestation with timeless discipline.",
    cognitiveFunctions: {
      dominant: "Si (Introverted Sensing)",
      auxiliary: "Te (Extraverted Thinking)",
      tertiary: "Fi (Introverted Feeling)",
      inferior: "Ne (Extraverted Intuition)"
    },
    strengths: ["Absolute trustworthiness", "Flawless organization", "Steadfast loyalty", "Pragmatic mastery"],
    blindSpots: ["Rigidity around established rules", "Hesitation to innovate", "Difficulty voicing tender sentiment"],
    relationshipStyle: "Rock-solid, dependable, expressing love through tangible acts of service and protective stability.",
    growthEdge: "Opening to spontaneous possibility (Ne) and recognizing that emotional truths do not always follow linear rules.",
    deEscalationPhrase: "'I value your reliability immensely. Let us find a clear, step-by-step resolution we can both trust.'"
  },
  ISFP: {
    type: "ISFP",
    title: "The Soul Artisan",
    nickname: "The Adventurer",
    category: "Explorers",
    color: "#ec4899", // pink-500
    description: "Spontaneous, aesthetic, and intensely authentic souls who express inner cosmic harmony through living art, presence, and quiet beauty.",
    cognitiveFunctions: {
      dominant: "Fi (Introverted Feeling)",
      auxiliary: "Se (Extraverted Sensing)",
      tertiary: "Ni (Introverted Intuition)",
      inferior: "Te (Extraverted Thinking)"
    },
    strengths: ["Sensory and aesthetic mastery", "Gentle presence", "Fierce authentic devotion", "Living in the flow"],
    blindSpots: ["Withdrawing into silence when hurt", "Avoiding future financial/logistical planning", "Impulsive decisions"],
    relationshipStyle: "Sensual, tender, non-demanding, seeking peaceful companionship and mutual creative appreciation.",
    growthEdge: "Articulating feelings verbally before retreating, and developing structural systems (Te) to protect their art.",
    deEscalationPhrase: "'Take all the time and quiet space you need. I am here when you are ready to share.'"
  },
  ISTP: {
    type: "ISTP",
    title: "The Sovereign Craftsman",
    nickname: "The Virtuoso",
    category: "Explorers",
    color: "#78716c", // stone-500
    description: "Calm, observant, and tactile masters of physical and energetic mechanics, solving complex breakdowns with effortless poise.",
    cognitiveFunctions: {
      dominant: "Ti (Introverted Thinking)",
      auxiliary: "Se (Extraverted Sensing)",
      tertiary: "Ni (Introverted Intuition)",
      inferior: "Fe (Extraverted Feeling)"
    },
    strengths: ["Crisis composure", "Mechanical mastery", "Pragmatic efficiency", "Total sovereign autonomy"],
    blindSpots: ["Emotional aloofness", "Taking reckless physical risks", "Disliking emotional discussions"],
    relationshipStyle: "Independent, companionable, sharing hands-on activities, requiring ample personal autonomy.",
    growthEdge: "Learning to check in emotionally (Fe) and honoring the relational need for verbal reassurance.",
    deEscalationPhrase: "'I respect your need for autonomy. Let me know when you would like to tackle this pragmatically.'"
  },
  ESFJ: {
    type: "ESFJ",
    title: "The Sacred Host",
    nickname: "The Consul",
    category: "Sentinels",
    color: "#f97316", // orange-500
    description: "Warm, generous, and community-centered harmonizers who weave bonds of kinship, ensuring everyone is fed, safe, and loved.",
    cognitiveFunctions: {
      dominant: "Fe (Extraverted Feeling)",
      auxiliary: "Si (Introverted Sensing)",
      tertiary: "Ne (Extraverted Intuition)",
      inferior: "Ti (Introverted Thinking)"
    },
    strengths: ["Communal harmony", "Incredible hospitality", "Loyalty to kinship", "Practical empathy"],
    blindSpots: ["Hypersensitive to disapproval", "Tendency to gossip or control social rituals", "Ignoring own fatigue"],
    relationshipStyle: "Warm, celebratory, deeply attentive to their partner's comfort, creating loving familial sanctuaries.",
    growthEdge: "Cultivating internal self-validation independent of others' praise, and developing objective detachment (Ti).",
    deEscalationPhrase: "'Your care makes this home thrive. Let us sit and focus on caring for you right now.'"
  },
  ESTJ: {
    type: "ESTJ",
    title: "The Community Steward",
    nickname: "The Executive",
    category: "Sentinels",
    color: "#475569", // slate-600
    description: "Principled, decisive organizers who uphold standards of honor, clear order, and productive teamwork in families and organizations.",
    cognitiveFunctions: {
      dominant: "Te (Extraverted Thinking)",
      auxiliary: "Si (Introverted Sensing)",
      tertiary: "Ne (Extraverted Intuition)",
      inferior: "Fi (Introverted Feeling)"
    },
    strengths: ["Executive follow-through", "High accountability", "Clear boundaries", "Tireless work ethic"],
    blindSpots: ["Authoritarian tone", "Dismissing unconventional feelings", "Struggling to relax"],
    relationshipStyle: "Devoted, steadfast, protecting and providing with tangible acts of loyalty and structural order.",
    growthEdge: "Softening the need to manage every outcome, and listening to the quiet vulnerability of the heart (Fi).",
    deEscalationPhrase: "'I appreciate the standard you set. Let us make sure our hearts feel just as safe as our plans.'"
  },
  ESFP: {
    type: "ESFP",
    title: "The Joy Bringer",
    nickname: "The Entertainer",
    category: "Explorers",
    color: "#e11d48", // rose-600
    description: "Vibrant, exuberant lovers of life who bring playfulness, somatic vitality, and infectious joy to every soul they encounter.",
    cognitiveFunctions: {
      dominant: "Se (Extraverted Sensing)",
      auxiliary: "Fi (Introverted Feeling)",
      tertiary: "Te (Extraverted Thinking)",
      inferior: "Ni (Introverted Intuition)"
    },
    strengths: ["Radiant presence", "Instant rapport", "Generous spontaneity", "Embodied playfulness"],
    blindSpots: ["Avoiding uncomfortable long-term issues", "Impulsivity", "Difficulty sitting in stillness"],
    relationshipStyle: "Fun-loving, affectionate, generous, bringing adventure and celebration into daily life.",
    growthEdge: "Cultivating meditative quiet and contemplating future consequences (Ni) rather than seeking immediate thrills.",
    deEscalationPhrase: "'I love your vibrant light. Let us slow down together and take a deep breath before answering.'"
  },
  ESTP: {
    type: "ESTP",
    title: "The Quantum Kinetic",
    nickname: "The Entrepreneur",
    category: "Explorers",
    color: "#d97706", // amber-600
    description: "Dynamic, charismatic risk-takers who navigate high-stakes moments with instantaneous reflexes and magnetic confidence.",
    cognitiveFunctions: {
      dominant: "Se (Extraverted Sensing)",
      auxiliary: "Ti (Introverted Thinking)",
      tertiary: "Fe (Extraverted Feeling)",
      inferior: "Ni (Introverted Intuition)"
    },
    strengths: ["Fearless adaptability", "Charismatic directness", "Acute sensory reflexes", "Practical problem solving"],
    blindSpots: ["Impatience with emotional processing", "Boredom with routine", "Overly blunt confrontations"],
    relationshipStyle: "Exciting, direct, action-oriented, expressing affection through shared adventures and bold gestures.",
    growthEdge: "Developing foresight and patience (Ni), recognizing that spiritual and relational depth takes time to mature.",
    deEscalationPhrase: "'I know you want to solve this immediately. Let us take five minutes to ground ourselves first.'"
  }
};
