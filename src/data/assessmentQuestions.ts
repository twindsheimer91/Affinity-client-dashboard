export interface AssessmentQuestion {
  id: number;
  category: "O" | "C" | "E" | "A" | "N" | "T" | "I";
  categoryName: string;
  dimension: string;
  text: string;
  reversed?: boolean;
  subscale: string;
  optionsDescription?: string;
}

export const ASSESSMENT_DIMENSIONS: Record<string, { name: string; description: string; color: string }> = {
  O: {
    name: "Curiosity & Openness to New Ideas",
    description: "How easily you welcome new perspectives, creative experiences, and imaginative concepts.",
    color: "#6366f1"
  },
  C: {
    name: "Focus, Organization & Daily Habits",
    description: "Your reliability, dedication to goals, consistency, and how you manage responsibilities.",
    color: "#f59e0b"
  },
  E: {
    name: "Social Energy & Self-Expression",
    description: "How you share your voice, express yourself in groups, and recharge around others.",
    color: "#38bdf8"
  },
  A: {
    name: "Empathy, Kindness & Relationship Harmony",
    description: "Your warmth, willingness to listen, compassion, and how you cooperate with people.",
    color: "#10b981"
  },
  N: {
    name: "Emotional Balance & Staying Calm Under Pressure",
    description: "How steadily you handle stress, process difficult emotions, and bounce back from setbacks.",
    color: "#14b8a6"
  },
  T: {
    name: "Inner Intuition & Life Purpose",
    description: "Your connection to your gut feelings, personal values, spiritual growth, and life meaning.",
    color: "#a855f7"
  },
  I: {
    name: "Practical Problem Solving & Mental Agility",
    description: "How quickly you break down challenges, connect dots, and find effective solutions.",
    color: "#ec4899"
  }
};

export const SCALE_RATING_GUIDE = [
  { value: 1, label: "Strongly Disagree", description: "This is completely unlike me or almost never true." },
  { value: 2, label: "Disagree", description: "This is rarely true for me." },
  { value: 3, label: "Neutral / In Between", description: "Sometimes true, sometimes not, or depends on the situation." },
  { value: 4, label: "Agree", description: "This is usually true and describes how I act." },
  { value: 5, label: "Strongly Agree", description: "This describes me very accurately and feels natural to who I am." }
];

// Helper generator for generating all 181 plain-English, easy-to-understand questions
function buildQuestions(): AssessmentQuestion[] {
  const rawList: { category: "O" | "C" | "E" | "A" | "N" | "T" | "I"; catName: string; dim: string; text: string; sub: string }[] = [
    // --- 1 to 26: OPENNESS & CURIOSITY ---
    { category: "O", catName: "Curiosity & Openness", dim: "Creative Imagination", text: "I have a vivid imagination and enjoy thinking up new creative possibilities.", sub: "Imagination" },
    { category: "O", catName: "Curiosity & Openness", dim: "Appreciation of Beauty", text: "I often notice and feel moved by beauty in art, music, nature, or architecture.", sub: "Aesthetics" },
    { category: "O", catName: "Curiosity & Openness", dim: "New Experiences", text: "I genuinely enjoy trying unfamiliar foods, visiting new places, and exploring different cultures.", sub: "Exploration" },
    { category: "O", catName: "Curiosity & Openness", dim: "Love of Learning", text: "I love learning about topics purely out of curiosity, even if they have no immediate practical use.", sub: "Intellectual Curiosity" },
    { category: "O", catName: "Curiosity & Openness", dim: "Open-Mindedness", text: "I am open to changing my mind when someone presents me with new, sensible information.", sub: "Flexibility" },
    { category: "O", catName: "Curiosity & Openness", dim: "Abstract Thinking", text: "I enjoy discussing deep philosophical questions about life, purpose, and the universe.", sub: "Philosophical Thought" },
    { category: "O", catName: "Curiosity & Openness", dim: "Originality", text: "I prefer coming up with my own unique approach rather than copying what everyone else is doing.", sub: "Originality" },
    { category: "O", catName: "Curiosity & Openness", dim: "Emotional Openness", text: "I allow myself to feel a wide range of emotions without judging or suppressing them.", sub: "Emotional Depth" },
    { category: "O", catName: "Curiosity & Openness", dim: "Curiosity about People", text: "I find it fascinating to understand what motivates different people and how their minds work.", sub: "Social Curiosity" },
    { category: "O", catName: "Curiosity & Openness", dim: "Daydreaming", text: "I often find myself lost in thought, daydreaming about exciting future projects.", sub: "Visionary Thought" },
    { category: "O", catName: "Curiosity & Openness", dim: "Artistic Expression", text: "Expressing myself through writing, drawing, cooking, speaking, or design feels natural to me.", sub: "Self-Expression" },
    { category: "O", catName: "Curiosity & Openness", dim: "Questioning Norms", text: "I like questioning traditional rules and asking why things have to be done a certain way.", sub: "Independent Thinking" },
    { category: "O", catName: "Curiosity & Openness", dim: "Embracing Change", text: "I view sudden changes and surprises as exciting opportunities rather than scary threats.", sub: "Adaptability" },
    { category: "O", catName: "Curiosity & Openness", dim: "Connecting Ideas", text: "I frequently see connections between two completely unrelated subjects.", sub: "Associative Thinking" },
    { category: "O", catName: "Curiosity & Openness", dim: "Sensory Awareness", text: "I am very sensitive to sounds, scents, textures, and the atmosphere of a room.", sub: "Sensory Perception" },
    { category: "O", catName: "Curiosity & Openness", dim: "Enjoying Complexity", text: "I prefer working on complex, multifaceted problems rather than repetitive, simple chores.", sub: "Mental Engagement" },
    { category: "O", catName: "Curiosity & Openness", dim: "Tolerance of Ambiguity", text: "I am comfortable when a situation does not have an immediate or black-and-white answer.", sub: "Patience with Ambiguity" },
    { category: "O", catName: "Curiosity & Openness", dim: "Seeking Wonder", text: "I regularly feel a sense of awe and wonder when looking at the night sky or ocean.", sub: "Sense of Awe" },
    { category: "O", catName: "Curiosity & Openness", dim: "Innovative Solutions", text: "When facing a roadblock, I enjoy brainstorming unusual and out-of-the-box workarounds.", sub: "Problem Solving" },
    { category: "O", catName: "Curiosity & Openness", dim: "Reading & Research", text: "I like reading books or articles that stretch my perspective and teach me something new.", sub: "Active Learning" },
    { category: "O", catName: "Curiosity & Openness", dim: "Multi-Perspective", text: "I can easily see a situation from multiple points of view, even with people I disagree with.", sub: "Perspective Taking" },
    { category: "O", catName: "Curiosity & Openness", dim: "Spontaneous Inspiration", text: "I frequently get sudden flashes of creative insight when my mind is relaxed.", sub: "Inspiration Flow" },
    { category: "O", catName: "Curiosity & Openness", dim: "Poetic & Symbolic", text: "I enjoy stories, metaphors, and symbols that carry multiple layers of meaning.", sub: "Symbolic Thinking" },
    { category: "O", catName: "Curiosity & Openness", dim: "Welcoming Feedback", text: "I appreciate constructive criticism when it helps me expand my skills and understanding.", sub: "Growth Mindset" },
    { category: "O", catName: "Curiosity & Openness", dim: "Joy of Discovery", text: "Finding out how something works behind the scenes gives me genuine pleasure.", sub: "Investigation" },
    { category: "O", catName: "Curiosity & Openness", dim: "Holistic Vision", text: "I prefer understanding the big picture before diving into small mechanical details.", sub: "Big Picture Orientation" },

    // --- 27 to 52: CONSCIENTIOUSNESS & ORGANIZATION ---
    { category: "C", catName: "Focus & Organization", dim: "Reliability", text: "When I make a promise or commitment to someone, they can trust I will follow through.", sub: "Dependability" },
    { category: "C", catName: "Focus & Organization", dim: "Clean Workspace", text: "I function much better when my living and work spaces are neat and orderly.", sub: "Orderliness" },
    { category: "C", catName: "Focus & Organization", dim: "Setting Goals", text: "I regularly set clear, realistic goals for what I want to accomplish each week.", sub: "Goal Setting" },
    { category: "C", catName: "Focus & Organization", dim: "Overcoming Procrastination", text: "I usually start important tasks promptly rather than putting them off until the last minute.", sub: "Action Orientation" },
    { category: "C", catName: "Focus & Organization", dim: "Attention to Detail", text: "I double-check my work carefully to make sure avoidable mistakes are caught.", sub: "Thoroughness" },
    { category: "C", catName: "Focus & Organization", dim: "Self-Discipline", text: "I can resist temporary temptations in order to achieve long-term success and peace of mind.", sub: "Self-Control" },
    { category: "C", catName: "Focus & Organization", dim: "Punctuality", text: "I make a conscious effort to arrive on time for meetings, calls, and appointments.", sub: "Time Respect" },
    { category: "C", catName: "Focus & Organization", dim: "Completing Tasks", text: "I finish projects I start, even when the initial excitement has worn off.", sub: "Follow-Through" },
    { category: "C", catName: "Focus & Organization", dim: "Financial Prudence", text: "I manage my money thoughtfully, keeping track of expenses and saving for the future.", sub: "Financial Responsibility" },
    { category: "C", catName: "Focus & Organization", dim: "Planning Ahead", text: "I prefer having a thoughtful plan in place rather than improvising everything on the fly.", sub: "Strategic Planning" },
    { category: "C", catName: "Focus & Organization", dim: "High Standards", text: "I take pride in producing high-quality work that reflects my best effort.", sub: "Quality Orientation" },
    { category: "C", catName: "Focus & Organization", dim: "Health Habits", text: "I maintain steady daily routines around sleep, nutrition, and bodily movement.", sub: "Wellness Consistency" },
    { category: "C", catName: "Focus & Organization", dim: "Staying Calm in Deadlines", text: "When working under time constraints, I stay focused and work methodically.", sub: "Deadline Handling" },
    { category: "C", catName: "Focus & Organization", dim: "Prioritizing", text: "I easily identify the most important task of the day and tackle it first.", sub: "Prioritization" },
    { category: "C", catName: "Focus & Organization", dim: "Personal Responsibility", text: "When something goes wrong, I take ownership instead of blaming other people or bad luck.", sub: "Accountability" },
    { category: "C", catName: "Focus & Organization", dim: "Steady Energy", text: "I work with a consistent pace rather than burning myself out in chaotic bursts.", sub: "Pacing" },
    { category: "C", catName: "Focus & Organization", dim: "Clear Documentation", text: "I keep important notes, documents, and records organized so they are easy to find.", sub: "Information Management" },
    { category: "C", catName: "Focus & Organization", dim: "Honoring Boundaries", text: "I set healthy limits on my time so that work does not consume my personal life.", sub: "Work-Life Balance" },
    { category: "C", catName: "Focus & Organization", dim: "Systemic Improvement", text: "I like finding ways to streamline chores and daily tasks to make them more efficient.", sub: "Process Optimization" },
    { category: "C", catName: "Focus & Organization", dim: "Commitment to Mastery", text: "I am willing to practice a skill over months or years to truly become good at it.", sub: "Dedication" },
    { category: "C", catName: "Focus & Organization", dim: "Preparedness", text: "Before a major event or trip, I prepare my essentials well in advance.", sub: "Forethought" },
    { category: "C", catName: "Focus & Organization", dim: "Patience with Chores", text: "I can handle necessary paperwork and administrative chores without getting irritated.", sub: "Administrative Patience" },
    { category: "C", catName: "Focus & Organization", dim: "Ethical Integrity", text: "I do the right thing even when nobody is looking or checking up on me.", sub: "Moral Consistency" },
    { category: "C", catName: "Focus & Organization", dim: "Steady Focus", text: "I can tune out background distractions and concentrate on one task for an hour or more.", sub: "Concentration" },
    { category: "C", catName: "Focus & Organization", dim: "Tracking Progress", text: "I enjoy crossing completed items off a checklist or tracking my progress toward milestones.", sub: "Progress Tracking" },
    { category: "C", catName: "Focus & Organization", dim: "Reliable Support", text: "Others know they can depend on me to be steady, grounded, and present in times of need.", sub: "Steadfastness" },

    // --- 53 to 78: EXTRAVERSION & SOCIAL ENERGY ---
    { category: "E", catName: "Social Energy & Voice", dim: "Speaking Up", text: "I feel comfortable sharing my honest opinions in a group discussion or meeting.", sub: "Assertiveness" },
    { category: "E", catName: "Social Energy & Voice", dim: "Energized by People", text: "Spending time in lively, engaging social gatherings usually leaves me energized.", sub: "Social Recharge" },
    { category: "E", catName: "Social Energy & Voice", dim: "Making Friends", text: "I find it relatively easy to strike up a friendly conversation with a stranger.", sub: "Social Warmth" },
    { category: "E", catName: "Social Energy & Voice", dim: "Taking the Lead", text: "I am willing to step forward and take the lead when a group needs direction.", sub: "Leadership" },
    { category: "E", catName: "Social Energy & Voice", dim: "Expressive Communication", text: "When I talk about something I care about, my excitement and enthusiasm show clearly.", sub: "Enthusiasm" },
    { category: "E", catName: "Social Energy & Voice", dim: "Sense of Humor", text: "I like bringing warmth, humor, and laughter into conversations to lighten the mood.", sub: "Playfulness" },
    { category: "E", catName: "Social Energy & Voice", dim: "Collaborative Work", text: "I enjoy working closely with teammates on a shared mission rather than working in isolation.", sub: "Team Collaboration" },
    { category: "E", catName: "Social Energy & Voice", dim: "Vocal Presence", text: "My voice carries naturally and I feel confident speaking in front of an audience.", sub: "Public Speaking" },
    { category: "E", catName: "Social Energy & Voice", dim: "Celebration", text: "I like celebrating milestones and achievements with friends and community.", sub: "Celebration" },
    { category: "E", catName: "Social Energy & Voice", dim: "Quick Engagement", text: "I tend to respond quickly and warmly when someone reaches out to connect.", sub: "Responsiveness" },
    { category: "E", catName: "Social Energy & Voice", dim: "Spontaneous Outings", text: "I enjoy spontaneous invitations to do something fun, social, or outdoors.", sub: "Spontaneity" },
    { category: "E", catName: "Social Energy & Voice", dim: "Vibrant Presence", text: "People often describe my presence as warm, vibrant, and welcoming.", sub: "Magnetism" },
    { category: "E", catName: "Social Energy & Voice", dim: "Inclusive Attitude", text: "When I see someone standing alone at an event, I invite them into the conversation.", sub: "Inclusiveness" },
    { category: "E", catName: "Social Energy & Voice", dim: "Active Energy", text: "I prefer an active lifestyle with regular movement and engagement over sitting still.", sub: "Vitality" },
    { category: "E", catName: "Social Energy & Voice", dim: "Storytelling", text: "I enjoy telling stories and sharing personal experiences in an engaging way.", sub: "Storytelling" },
    { category: "E", catName: "Social Energy & Voice", dim: "Networking", text: "Building a broad network of supportive, inspiring people comes naturally to me.", sub: "Community Building" },
    { category: "E", catName: "Social Energy & Voice", dim: "Direct Truth", text: "I communicate directly and clearly, without beating around the bush.", sub: "Clarity" },
    { category: "E", catName: "Social Energy & Voice", dim: "Welcoming Guests", text: "I love hosting people and creating a warm, hospitable atmosphere.", sub: "Hospitality" },
    { category: "E", catName: "Social Energy & Voice", dim: "Cheering Others", text: "I am quick to applaud and cheer for others when they succeed.", sub: "Encouragement" },
    { category: "E", catName: "Social Energy & Voice", dim: "Open Body Language", text: "My natural posture and eye contact make others feel seen and welcomed.", sub: "Body Presence" },
    { category: "E", catName: "Social Energy & Voice", dim: "Sharing Passions", text: "When I discover a great book, idea, or tool, I can't wait to recommend it to others.", sub: "Advocacy" },
    { category: "E", catName: "Social Energy & Voice", dim: "Optimistic Tone", text: "In difficult times, I tend to remind people of the silver lining and keep spirits up.", sub: "Optimism" },
    { category: "E", catName: "Social Energy & Voice", dim: "Reaching Out First", text: "I am comfortable sending the first text or phone call to check in on a friend.", sub: "Initiative" },
    { category: "E", catName: "Social Energy & Voice", dim: "Community Contribution", text: "Being an active contributor in my local or online community brings me joy.", sub: "Civic Spirit" },
    { category: "E", catName: "Social Energy & Voice", dim: "Vocal Empowerment", text: "I stand up and speak out on behalf of someone being treated unfairly.", sub: "Advocacy for Others" },
    { category: "E", catName: "Social Energy & Voice", dim: "Expressing Gratitude", text: "I make sure to openly tell people how much I appreciate their presence in my life.", sub: "Verbal Appreciation" },

    // --- 79 to 104: AGREEABLENESS & HARMONY ---
    { category: "A", catName: "Empathy & Harmony", dim: "Active Listening", text: "When someone is speaking to me, I listen with full attention without interrupting them.", sub: "Deep Listening" },
    { category: "A", catName: "Empathy & Harmony", dim: "Compassion", text: "I feel deep genuine compassion when I see someone or an animal suffering.", sub: "Compassion" },
    { category: "A", catName: "Empathy & Harmony", dim: "Forgiveness", text: "I can forgive people who apologize and work toward repairing hurt feelings.", sub: "Forgiveness" },
    { category: "A", catName: "Empathy & Harmony", dim: "Cooperation", text: "I prefer reaching a win-win compromise rather than insisting on winning an argument.", sub: "Cooperation" },
    { category: "A", catName: "Empathy & Harmony", dim: "Trusting Nature", text: "I naturally assume people have good intentions until proven otherwise.", sub: "Trust" },
    { category: "A", catName: "Empathy & Harmony", dim: "Kindness to Strangers", text: "I go out of my way to be polite, patient, and kind to service workers and strangers.", sub: "Everyday Kindness" },
    { category: "A", catName: "Empathy & Harmony", dim: "Non-Judgmental", text: "I accept people for who they are without trying to change them or judge their choices.", sub: "Non-Judgment" },
    { category: "A", catName: "Empathy & Harmony", dim: "Comforting Presence", text: "People often come to me when they are feeling upset because they feel safe and understood.", sub: "Emotional Safety" },
    { category: "A", catName: "Empathy & Harmony", dim: "Generosity", text: "I am happy to share my time, food, or resources with someone who needs help.", sub: "Generosity" },
    { category: "A", catName: "Empathy & Harmony", dim: "De-escalating Conflict", text: "When tension arises in a group, I instinctively try to calm everyone down peacefully.", sub: "Peacemaking" },
    { category: "A", catName: "Empathy & Harmony", dim: "Respecting Differences", text: "I respect people whose cultural or religious backgrounds are very different from mine.", sub: "Cultural Respect" },
    { category: "A", catName: "Empathy & Harmony", dim: "Sensitivity to Feelings", text: "I can usually sense how someone is feeling just by looking at their face or posture.", sub: "Emotional Intuition" },
    { category: "A", catName: "Empathy & Harmony", dim: "Avoiding Gossip", text: "I avoid talking behind people's backs or spreading rumors about others.", sub: "Discretion" },
    { category: "A", catName: "Empathy & Harmony", dim: "Gentle Honesty", text: "When I must deliver difficult news, I do so with kindness and tact.", sub: "Tactfulness" },
    { category: "A", catName: "Empathy & Harmony", dim: "Humility", text: "I am comfortable letting others receive credit without feeling the need to brag.", sub: "Humility" },
    { category: "A", catName: "Empathy & Harmony", dim: "Patience with Flaws", text: "I have patience with friends when they are having an off day or acting cranky.", sub: "Patience" },
    { category: "A", catName: "Empathy & Harmony", dim: "Supporting Dreams", text: "I genuinely celebrate when my peers and loved ones achieve their big dreams.", sub: "Sympathetic Joy" },
    { category: "A", catName: "Empathy & Harmony", dim: "Constructive Apology", text: "When I make a mistake that hurts someone, I apologize sincerely and try to make amends.", sub: "Sincere Apology" },
    { category: "A", catName: "Empathy & Harmony", dim: "Healthy Boundaries", text: "I can be deeply kind to others while still protecting my own emotional energy.", sub: "Kind Boundaries" },
    { category: "A", catName: "Empathy & Harmony", dim: "Animal Empathy", text: "I feel a close bond and protective instinct toward animals and wildlife.", sub: "Animal Connection" },
    { category: "A", catName: "Empathy & Harmony", dim: "Reconciling Disagreements", text: "I prefer discussing disagreements calmly rather than giving the silent treatment.", sub: "Healthy Communication" },
    { category: "A", catName: "Empathy & Harmony", dim: "Valuing Loyalty", text: "I stand by my close friends through thick and thin over many years.", sub: "Loyalty" },
    { category: "A", catName: "Empathy & Harmony", dim: "Caring for Vulnerable", text: "I feel moved to support children, elders, or anyone who cannot easily defend themselves.", sub: "Protection" },
    { category: "A", catName: "Empathy & Harmony", dim: "Gentle Touch", text: "A reassuring hug or hand on the shoulder feels like a natural way to comfort someone.", sub: "Somatic Warmth" },
    { category: "A", catName: "Empathy & Harmony", dim: "Finding Common Ground", text: "In any disagreement, I look for common values we both share.", sub: "Common Ground" },
    { category: "A", catName: "Empathy & Harmony", dim: "Inner Goodness", text: "I believe that deep down, most people want to be loved and do good in the world.", sub: "Faith in Humanity" },

    // --- 105 to 130: EMOTIONAL BALANCE & CALMNESS ---
    { category: "N", catName: "Emotional Balance", dim: "Staying Grounded", text: "When unexpected problems happen, I stay calm and think through what to do next.", sub: "Composure" },
    { category: "N", catName: "Emotional Balance", dim: "Quick Reset", text: "After feeling angry or frustrated, I can take a deep breath and let the tension go quickly.", sub: "Emotional Reset" },
    { category: "N", catName: "Emotional Balance", dim: "Low Worry", text: "I rarely lose sleep worrying about worst-case scenarios that might never happen.", sub: "Peace of Mind" },
    { category: "N", catName: "Emotional Balance", dim: "Secure Self-Worth", text: "My sense of self-worth remains steady even when someone criticizes or rejects me.", sub: "Self-Security" },
    { category: "N", catName: "Emotional Balance", dim: "Physical Relaxation", text: "I know how to physically relax my shoulders, jaw, and breath when feeling tense.", sub: "Somatic Calming" },
    { category: "N", catName: "Emotional Balance", dim: "Resilience in Failure", text: "When a plan falls through, I treat it as a learning experience and try again.", sub: "Resilience" },
    { category: "N", catName: "Emotional Balance", dim: "Freedom from Envy", text: "I can admire someone else's success without feeling jealous or insecure about myself.", sub: "Secure Comparison" },
    { category: "N", catName: "Emotional Balance", dim: "Consistent Mood", text: "My mood remains relatively steady throughout the week without extreme highs and lows.", sub: "Mood Stability" },
    { category: "N", catName: "Emotional Balance", dim: "Patience in Traffic", text: "I can sit through long lines or traffic delays without losing my temper.", sub: "Everyday Patience" },
    { category: "N", catName: "Emotional Balance", dim: "Healthy Coping", text: "When stressed, I turn to healthy outlets like walking, breathing, or talking rather than numbing out.", sub: "Healthy Outlets" },
    { category: "N", catName: "Emotional Balance", dim: "Trusting the Process", text: "I have a quiet inner trust that challenges in life have a purpose and will pass.", sub: "Inner Trust" },
    { category: "N", catName: "Emotional Balance", dim: "Clear Head in Crisis", text: "In an emergency, I become calm, clear-headed, and take helpful practical action.", sub: "Crisis Leadership" },
    { category: "N", catName: "Emotional Balance", dim: "Letting Go of Resentment", text: "I do not carry old grudges; holding onto bitterness feels unhealthy to me.", sub: "Releasing Grudges" },
    { category: "N", catName: "Emotional Balance", dim: "Comfort with Stillness", text: "I can sit quietly in silence for 15 minutes without feeling restless or reaching for my phone.", sub: "Quiet Stillness" },
    { category: "N", catName: "Emotional Balance", dim: "Balanced Perspective", text: "I can tell the difference between a minor annoyance and a real problem.", sub: "Proportionality" },
    { category: "N", catName: "Emotional Balance", dim: "Safe Self-Expression", text: "I express my feelings without shouting, slamming doors, or shutting down emotionally.", sub: "Emotional Maturity" },
    { category: "N", catName: "Emotional Balance", dim: "Deep Sleep", text: "I generally sleep peacefully through the night and wake up feeling refreshed.", sub: "Restful Sleep" },
    { category: "N", catName: "Emotional Balance", dim: "Confidence in Decisions", text: "Once I make a well-thought-out decision, I don't torment myself with second-guessing.", sub: "Decisiveness" },
    { category: "N", catName: "Emotional Balance", dim: "Non-Reactive", text: "When someone says something rude, I pause and choose not to react defensively.", sub: "Non-Reactivity" },
    { category: "N", catName: "Emotional Balance", dim: "Body Harmony", text: "I listen to my body's signals of tiredness or hunger before they turn into exhaustion.", sub: "Body Listening" },
    { category: "N", catName: "Emotional Balance", dim: "Optimistic Baseline", text: "I naturally expect good things to unfold in my life and work.", sub: "Hopefulness" },
    { category: "N", catName: "Emotional Balance", dim: "Embracing Imperfection", text: "I accept that I am human and can laugh at my own quirks and clumsy moments.", sub: "Self-Compassion" },
    { category: "N", catName: "Emotional Balance", dim: "Calm Nervous System", text: "My heart rate and breathing return to normal quickly after a sudden fright or surprise.", sub: "Nervous System Health" },
    { category: "N", catName: "Emotional Balance", dim: "Separating Work & Rest", text: "When my workday ends, I am able to mentally unplug and be fully present with loved ones.", sub: "Mental Detachment" },
    { category: "N", catName: "Emotional Balance", dim: "Emotional Self-Sufficiency", text: "I can soothe myself emotionally without needing someone else to constantly fix my feelings.", sub: "Self-Regulation" },
    { category: "N", catName: "Emotional Balance", dim: "Point Zero Peace", text: "I know how to access a place of deep, unshakeable peace inside my chest.", sub: "Point Zero Center" },

    // --- 131 to 156: INNER INTUITION & LIFE PURPOSE ---
    { category: "T", catName: "Intuition & Purpose", dim: "Gut Knowing", text: "I often get an intuitive 'gut feeling' about a decision that turns out to be completely right.", sub: "Intuitive Accuracy" },
    { category: "T", catName: "Intuition & Purpose", dim: "Sense of Mission", text: "I feel that my life has a meaningful purpose beyond just making a living and paying bills.", sub: "Life Calling" },
    { category: "T", catName: "Intuition & Purpose", dim: "Connection to Nature", text: "Spending time in forests, mountains, or near moving water revitalizes my inner spirit.", sub: "Nature Communion" },
    { category: "T", catName: "Intuition & Purpose", dim: "Synchronicities", text: "I notice meaningful coincidences and synchronicities that seem to guide my path.", sub: "Meaningful Synchronicity" },
    { category: "T", catName: "Intuition & Purpose", dim: "Living Authentically", text: "It is essential for me to live true to my core values, even when society pressures me to conform.", sub: "Authenticity" },
    { category: "T", catName: "Intuition & Purpose", dim: "Gratitude Practice", text: "I regularly pause to feel thankful for the simple blessings in my daily life.", sub: "Gratitude" },
    { category: "T", catName: "Intuition & Purpose", dim: "Oneness with Life", text: "I have moments where I feel connected to all living beings, realizing we are all part of one whole.", sub: "Interconnectedness" },
    { category: "T", catName: "Intuition & Purpose", dim: "Inner Guidance", text: "When I am unsure what to do, sitting quietly in prayer or meditation reveals the answer.", sub: "Inner Guidance" },
    { category: "T", catName: "Intuition & Purpose", dim: "Spiritual Growth", text: "Personal self-growth and expanding my consciousness are top priorities for me.", sub: "Evolution" },
    { category: "T", catName: "Intuition & Purpose", dim: "Transcending Ego", text: "I can look at my own behavior objectively without getting defensive or self-righteous.", sub: "Self-Awareness" },
    { category: "T", catName: "Intuition & Purpose", dim: "Feeling Guided", text: "I often feel supported by a higher wisdom or life intelligence that looks out for me.", sub: "Trust in Life" },
    { category: "T", catName: "Intuition & Purpose", dim: "Meaning in Suffering", text: "I have found that past hardships ultimately taught me my greatest lessons and compassion.", sub: "Post-Traumatic Growth" },
    { category: "T", catName: "Intuition & Purpose", dim: "Sacred Moments", text: "I treat simple everyday moments—like making tea or watching a sunrise—as sacred rituals.", sub: "Sacred Everyday" },
    { category: "T", catName: "Intuition & Purpose", dim: "Energy Perception", text: "I can easily sense the emotional energy or 'vibe' when I enter a room or building.", sub: "Vibrational Awareness" },
    { category: "T", catName: "Intuition & Purpose", dim: "Service to Others", text: "Helping others grow and fulfill their potential brings me the deepest fulfillment.", sub: "Selfless Service" },
    { category: "T", catName: "Intuition & Purpose", dim: "Releasing Control", text: "I know when to take practical action and when to let go and surrender the outcome.", sub: "Surrender & Flow" },
    { category: "T", catName: "Intuition & Purpose", dim: "Symbolic Dreams", text: "I sometimes have vivid dreams that give me insight into my real-life situations.", sub: "Dream Insight" },
    { category: "T", catName: "Intuition & Purpose", dim: "Universal Love", text: "I have experienced moments of pure love that did not depend on anyone doing something for me.", sub: "Unconditional Love" },
    { category: "T", catName: "Intuition & Purpose", dim: "Living Mindfully", text: "I practice being fully present in the 'now' instead of dwelling on the past or future.", sub: "Presence" },
    { category: "T", catName: "Intuition & Purpose", dim: "Courage to Walk Alone", text: "I have the courage to follow my truth even if nobody else understands or agrees with me.", sub: "Sovereignty" },
    { category: "T", catName: "Intuition & Purpose", dim: "Aesthetic Reverence", text: "Certain music, poetry, or natural scenes bring tears of gratitude to my eyes.", sub: "Reverence" },
    { category: "T", catName: "Intuition & Purpose", dim: "Forgiving the Past", text: "I have released regret over past decisions, knowing they helped me become who I am today.", sub: "Past Peace" },
    { category: "T", catName: "Intuition & Purpose", dim: "Subtle Timing", text: "I can sense the right timing to act on an opportunity rather than forcing it too early.", sub: "Divine Timing" },
    { category: "T", catName: "Intuition & Purpose", dim: "Heart Wisdom", text: "When logic and heart disagree, I trust the wisdom of my heart to guide the final choice.", sub: "Heart Intelligence" },
    { category: "T", catName: "Intuition & Purpose", dim: "Inspiring Others", text: "Others tell me that my way of living inspires them to look deeper into their own lives.", sub: "Inspirational Field" },
    { category: "T", catName: "Intuition & Purpose", dim: "Eternal Perspective", text: "Remembering that human life is short helps me focus on what truly matters: love and kindness.", sub: "Eternal Perspective" },

    // --- 157 to 181: PROBLEM SOLVING & MENTAL AGILITY ---
    { category: "I", catName: "Problem Solving", dim: "Logical Breakdown", text: "When facing a difficult task, I naturally break it down into simple, step-by-step actions.", sub: "Logical Analysis" },
    { category: "I", catName: "Problem Solving", dim: "Fast Comprehension", text: "I learn new computer programs, apps, or practical tools quickly with minimal instruction.", sub: "Rapid Learning" },
    { category: "I", catName: "Problem Solving", dim: "Spotting Patterns", text: "I easily notice patterns and trends in data, behavior, or market trends that others miss.", sub: "Pattern Recognition" },
    { category: "I", catName: "Problem Solving", dim: "Root Cause Focus", text: "I prefer solving the root cause of an issue rather than repeatedly putting band-aids on it.", sub: "Root Cause Analysis" },
    { category: "I", catName: "Problem Solving", dim: "Clear Explanations", text: "I can explain complicated concepts in clear, simple words that anyone can understand.", sub: "Simplification" },
    { category: "I", catName: "Problem Solving", dim: "Mental Calm in Debate", text: "During a debate, I focus on facts and logic without taking things personally.", sub: "Objective Debate" },
    { category: "I", catName: "Problem Solving", dim: "Quick Calculations", text: "I can do mental estimates and calculate numbers in my head with reasonable accuracy.", sub: "Quantitative Sense" },
    { category: "I", catName: "Problem Solving", dim: "Systemic Thinking", text: "I consider how a change in one area will impact the rest of the team or system.", sub: "Systems Thinking" },
    { category: "I", catName: "Problem Solving", dim: "Resourcefulness", text: "When I lack the ideal tools or budget, I find clever ways to get the job done anyway.", sub: "Resourcefulness" },
    { category: "I", catName: "Problem Solving", dim: "Checking Assumptions", text: "I question my own assumptions and verify facts before jumping to a conclusion.", sub: "Critical Thinking" },
    { category: "I", catName: "Problem Solving", dim: "Strategic foresight", text: "I anticipate potential future problems months in advance and take preventive steps.", sub: "Foresight" },
    { category: "I", catName: "Problem Solving", dim: "Memory for Details", text: "I easily remember key facts, numbers, and conversations when they matter.", sub: "Working Memory" },
    { category: "I", catName: "Problem Solving", dim: "Decision Trees", text: "I evaluate multiple alternatives side-by-side before deciding on the best course of action.", sub: "Evaluation" },
    { category: "I", catName: "Problem Solving", dim: "Mechanical & Technical Sense", text: "I can figure out how mechanical gadgets, software, or household items work.", sub: "Mechanical Insight" },
    { category: "I", catName: "Problem Solving", dim: "Puzzles & Challenges", text: "I enjoy brain teasers, strategy games, or solving complex crosswords.", sub: "Cognitive Play" },
    { category: "I", catName: "Problem Solving", dim: "Continuous Improvement", text: "Whenever I finish a project, I reflect on what went well and what could be improved next time.", sub: "Debriefing" },
    { category: "I", catName: "Problem Solving", dim: "Troubleshooting", text: "When an unexpected error appears, I calmly test variables one by one until I locate it.", sub: "Troubleshooting" },
    { category: "I", catName: "Problem Solving", dim: "Synthesizing Sources", text: "I can read 5 different viewpoints on a topic and distill the core truth behind all of them.", sub: "Synthesis" },
    { category: "I", catName: "Problem Solving", dim: "Efficient Decisions", text: "I know when I have enough information to make a solid decision without getting paralyzed.", sub: "Pragmatism" },
    { category: "I", catName: "Problem Solving", dim: "Clarity of Thought", text: "My thoughts feel organized and clear when I write them down on paper or a whiteboard.", sub: "Written Clarity" },
    { category: "I", catName: "Problem Solving", dim: "Intuitive Math", text: "I have a good instinct for percentages, time estimates, and spatial geometry.", sub: "Spatial Sense" },
    { category: "I", catName: "Problem Solving", dim: "Adapting Strategies", text: "If my original plan isn't working, I pivot immediately without wasting time being upset.", sub: "Strategic Agility" },
    { category: "I", catName: "Problem Solving", dim: "Focus Under Pressure", text: "I can solve critical problems calmly even when others around me are stressed or panicking.", sub: "Clarity Under Fire" },
    { category: "I", catName: "Problem Solving", dim: "Curious Skepticism", text: "I don't believe sensational claims until I have seen the evidence for myself.", sub: "Healthy Skepticism" },
    { category: "I", catName: "Problem Solving", dim: "Master Integration", text: "I can unite practical common sense with creative visionary thinking to produce real results.", sub: "Master Integration" }
  ];

  return rawList.map((item, idx) => ({
    id: idx + 1,
    category: item.category,
    categoryName: item.catName,
    dimension: item.dim,
    text: item.text,
    subscale: item.sub
  }));
}

export const MASTER_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = buildQuestions();
