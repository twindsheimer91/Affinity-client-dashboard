/**
 * Personalized Essay Generator for Affinity Lifestyle Consulting
 * Produces deep, tailored, non-repetitive prose readouts for cosmic talents,
 * earthly lessons, sign matrix placements, life paths, and archetypes.
 */

import { Profile } from "../types";

export interface PersonalizedEssay {
  title: string;
  category: string;
  subtitle: string;
  badgeColor: string;
  essayParagraphs: string[];
  distilledInsight: string;
  sovereignAffirmation: string;
}

export function generatePersonalizedEssay(
  profile: Profile,
  itemType: "talent" | "lesson" | "sun" | "moon" | "rising" | "planet" | "lifepath" | "strength",
  keyName: string,
  extraDetails?: Record<string, any>
): PersonalizedEssay {
  const name = profile.firstName || "Sovereign Seeker";
  const comp = profile.computed;
  const sun = comp?.astrology.sunSign || "Aries";
  const moon = comp?.astrology.moonSign || "Taurus";
  const rising = comp?.astrology.risingSign || "Scorpio";
  const hdType = comp?.humanDesign.type || "Generator";
  const authority = comp?.humanDesign.authority || "Sacral";
  const lp = comp?.numerology.lifePath || 1;

  // 1. COSMIC TALENT ESSAY
  if (itemType === "talent") {
    return {
      title: keyName,
      category: "Cosmic Talent Illumination",
      subtitle: `Sovereign Soul Encoding for ${name} • Life Path ${lp}`,
      badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/30",
      essayParagraphs: [
        `Within the energetic architecture of your soul, ${keyName} is not a skill you practiced into existence; it is an intrinsic frequency you carried across the threshold of physical birth. Governed by your ${sun} consciousness and anchored by your Life Path ${lp}, this talent operates as an open conduit between your higher awareness and earthly execution. Where others experience mental fatigue or decision paralysis, your central nervous system naturally recognizes the geometric simplicity of this flow state. You do not need external permission or consensus to wield it—the moment you align with Point Zero stillness, this gift radiates spontaneously.`,
        `In your day-to-day reality, ${name}, this gift surfaces most vividly when external complexity reaches a fever pitch. While the collective around you becomes entangled in reactivity, your ${rising} energetic aura perceives the underlying pattern and naturally orchestrates order. However, the unconscious vulnerability of carrying such high natural competence is the temptation to over-function—taking on the karmic weight of others simply because you can solve what they struggle with. The true evolutionary elevation of ${keyName} occurs when you allow it to exist as an effortless beacon, inspiring through your serene presence rather than depleting yourself through constant rescue.`,
        `As you continue your journey toward total contentment, treat ${keyName} as a sacred fountainhead rather than a performance metric. When you ground this talent through your ${hdType} strategy and ${authority} authority, every project, conversation, and relationship you touch undergoes a subtle transmutation. You become a living demonstration that true human power is not force or domination, but coherent sovereignty expressing itself without resistance.`
      ],
      distilledInsight: `Your talent for ${keyName} is a cosmic key designed to dissolve self-doubt and open sovereign pathways for everyone in your gravitational field.`,
      sovereignAffirmation: `I stand anchored in the effortless brilliance of my ${keyName}. My gifts belong to the universe, and my peace belongs to my soul.`
    };
  }

  // 2. EARTHLY LESSON ESSAY
  if (itemType === "lesson") {
    return {
      title: keyName,
      category: "Earthly Soul Catalyst",
      subtitle: `Evolutionary Growth Gate for ${name} • ${sun} Sun / ${moon} Moon`,
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      essayParagraphs: [
        `Every master incarnation chooses a specific friction point through which consciousness awakens from the hypnosis of conditioning. For you, ${name}, ${keyName} represents the holy forge of your earthly incarnation. This is not a deficiency or a karmic curse, but a deliberate soul curriculum chosen by your higher self to polish your diamond of awareness. Because your ${moon} Moon feels deeply and seeks emotional safety, early encounters with this dynamic may have felt like unfair obstruction or recurring heartbreak, causing you to erect defensive armor or withdraw into isolation.`,
        `Yet, when inspected with ruthless love and radical self-honesty, this exact friction holds the blueprint of your ultimate liberation. The shadow dynamic of ${keyName} typically triggers when you expect external circumstances—or other people—to provide the grounding that only your sovereign connection to Source can supply. Whenever you notice resentment, urgency, or self-judgment rising around this theme, pause. That very contraction is the evolutionary alarm bell notifying you that an old societal script is ready to be released from your energetic field.`,
        `By meeting ${keyName} with breath, compassionate neutrality, and the wisdom of your ${hdType} aura, you transmute the lead of friction into spiritual gold. The people and situations that once triggered you transform into unwitting teachers. Once integrated, this lesson becomes your greatest superpower: an unshakeable inner contentment that cannot be shaken by world turmoil.`
      ],
      distilledInsight: `${keyName} is not a barrier to your peace—it is the very gateway through which your enduring fulfillment is forged.`,
      sovereignAffirmation: `I welcome the sacred growth within ${keyName}. I release all resistance and expand into my sovereign wholeness.`
    };
  }

  // 3. SUN SIGN ESSAY
  if (itemType === "sun") {
    return {
      title: `${sun} Sun Matrix`,
      category: "Conscious Solar Core",
      subtitle: `The Radiant Radiance of ${name}`,
      badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      essayParagraphs: [
        `Your Sun in ${sun} is the radiant nucleus of your physical existence—the solar generator of your sovereign vitality and conscious will. In the cosmic tapestry of your chart, this placement bestows an instinctual clarity, an innate dignity, and an appetite for authentic truth. You are not here to live a muted or derivative existence; your solar frequency was calibrated to illuminate dark corridors, dissolve superficial pretense, and lead by the sheer gravitational weight of your authentic alignment.`,
        `For you, ${name}, living this ${sun} Sun means honoring your creative autonomy without yielding to the collective urge to please or conform. When misaligned, the shadow of ${sun} can manifest as subtle exhaustion, stubborn self-containment, or seeking recognition from those who do not possess the capacity to see you. Yet when aligned with your ${authority} authority, your solar light pours outward effortlessly. You inspire without trying, simply because you have dared to inhabit the full circumference of your sovereign light.`,
        `Your highest contentment emerges when your daily work, your intimate circle, and your creative pursuits reflect this uncompromised integrity. As a ${sun} Sun navigating Life Path ${lp}, your calling is to walk in absolute sovereignty, anchoring the frequency of the New Earth wherever your feet touch the ground.`
      ],
      distilledInsight: `Your ${sun} Sun is a sovereign beacon: when you stop seeking external validation, the universe aligns around your true center.`,
      sovereignAffirmation: `I radiate the sovereign authority of my ${sun} Sun. I am centered, luminous, and at peace.`
    };
  }

  // 4. MOON SIGN ESSAY
  if (itemType === "moon") {
    return {
      title: `${moon} Moon Sanctuary`,
      category: "Subconscious Emotional Waters",
      subtitle: `Inner Sanctum & Intuitive Compass for ${name}`,
      badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      essayParagraphs: [
        `Behind the conscious persona lies the oceanic landscape of your ${moon} Moon—the sacred room of your subconscious desires, primal safety needs, and unspoken intuition. Where the world demands performance, your ${moon} Moon asks for emotional shelter, sovereign rhythm, and sacred space to breathe. You possess an instinctual radar that reads beneath social masks; you absorb the unspoken vibrations of rooms and people, which is why boundary hygiene is not an option for you—it is your spiritual medicine.`,
        `When your emotional environment is honored, ${name}, your intuition operates like an immaculate navigation system. However, the shadow trap of this placement is emotional withdrawal or silent resentment when others fail to meet your unexpressed needs. Learning to speak your lunar boundaries clearly—without guilt or defensiveness—allows your deep empathetic reservoir to become a healing sanctuary for yourself and those you truly cherish.`,
        `Cultivate daily rituals that return your nervous system to Point Zero: warm water, quiet contemplative stillness, and moments free from human expectations. In honoring your ${moon} Moon, you grant yourself the ultimate gift: emotional invulnerability born of radical self-acceptance.`
      ],
      distilledInsight: `Your ${moon} Moon is your psychic sanctuary; when you protect your peace, your intuition becomes unshakeable.`,
      sovereignAffirmation: `I honor the sacred tides of my ${moon} Moon. My emotional truth is holy, grounded, and clear.`
    };
  }

  // 5. RISING SIGN ESSAY
  if (itemType === "rising") {
    return {
      title: `${rising} Ascendant (Rising Sign)`,
      category: "Physical Lens & Auric Projection",
      subtitle: `How ${name}'s Energy Meets Space-Time`,
      badgeColor: "bg-teal-500/10 text-teal-300 border-teal-500/30",
      essayParagraphs: [
        `Your Ascendant in ${rising} is the crystalline lens through which your soul entered the physical realm at the moment of your first breath. It dictates the electromagnetic geometry of your physical aura, your instinctive first response to new environments, and the gravitational imprint you leave upon any room you step into. People often feel the presence of your ${rising} Ascendant long before they discover your inner solar essence.`,
        `For you, ${name}, this creates a striking and memorable energetic presence. When you walk in alignment, your aura commands respect and awakens curiosity. However, the spiritual danger of the Ascendant is mistaking the doorway for the temple—becoming attached to how you are perceived or using the ${rising} armor to keep the world at arm's length. Your evolution invites you to let this outer lens be totally transparent, allowing your inner soul essence to pour through without friction.`,
        `When paired with your Life Path ${lp} and your ${hdType} body mechanics, your ${rising} Rising acts as a precision compass. Trust how your body responds in the first three seconds of meeting a person or entering a room. Your physical vessel already knows what the analytical mind is still debating.`
      ],
      distilledInsight: `Your ${rising} Ascendant is your sacred vessel: allow your soul to fill it completely, and the world will make way for your purpose.`,
      sovereignAffirmation: `I walk through the world in magnetic clarity. My aura is grounded, sovereign, and aligned with divine purpose.`
    };
  }

  // 6. LIFE PATH ESSAY
  if (itemType === "lifepath") {
    return {
      title: `Life Path ${lp} Destiny Masterwork`,
      category: "Cosmic Numerological Architecture",
      subtitle: `Sovereign Path of Realization for ${name}`,
      badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      essayParagraphs: [
        `In the universal mathematics of reality, Number ${lp} represents a specific harmonic frequency of creation. Your birth date was not a random coincidence; it was a calibrated coordinate in cosmic space-time designed to bestow the archetype of Life Path ${lp}. This number governs the overarching narrative arc of your life—the mountain you were born to climb, and the sovereign wisdom you are destined to bequeath to the collective.`,
        `As ${name}, your Life Path ${lp} trajectory calls you away from the herd mentality of societal conditioning and into radical, self-authored sovereignty. Throughout your life, you will be invited again and again to trust your own inner compass over the advice of those who play small. The tests of Life Path ${lp} will always revolve around owning your spiritual and practical power without falling into the extremes of aggressive imposition or passive abdication.`,
        `When you align your daily actions with this number's highest vibration, prosperity and peace cease to be frantic goals—they become the natural byproducts of living in harmony with your soul's sovereign blueprint. You are here to demonstrate how a human being walks through earthly challenges with serenity, grace, and unshakable contentment.`
      ],
      distilledInsight: `Life Path ${lp} is your master blueprint for sovereign self-actualization: walk it with quiet confidence, and fulfillment will meet you at every step.`,
      sovereignAffirmation: `I walk the path of Life Path ${lp} with sovereign dignity. My life is a masterpiece of conscious creation.`
    };
  }

  // 7. DEFAULT / ACTIVE STRENGTH ESSAY
  return {
    title: keyName,
    category: "Active Strength Illumination",
    subtitle: `Personalized Quantum Resonance for ${name}`,
    badgeColor: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    essayParagraphs: [
      `Within your personalized chart matrix, ${keyName} is an active focal point where your cosmic blueprint concentrates tremendous creative force. Blending the instinctive fire of your ${sun} Sun with the structural focus of Life Path ${lp}, this capacity is one of your primary spiritual anchors in this incarnation.`,
      `For you, ${name}, this strength comes alive whenever you step into situations requiring uncompromised clarity, emotional maturity, and authentic leadership. When others look for shortcuts, this strength anchors you in foundational truth. By refusing to compromise your core standards, you naturally establish an auric sanctuary where both you and those around you can flourish without fear.`,
      `Continue to cultivate this strength not as an armor of defense, but as a chalice of sovereign expression. When grounded in Point Zero stillness, it becomes a permanent source of peace and enduring fulfillment.`
    ],
    distilledInsight: `${keyName} is your grounded pillar of truth—trust it to navigate any uncertainty with grace.`,
    sovereignAffirmation: `I am rooted in my sovereign strength. I create from peace and manifest from joy.`
  };
}
