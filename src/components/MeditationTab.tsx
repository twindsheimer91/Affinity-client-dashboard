import { useState, useEffect, useRef } from "react";
import { Profile } from "../types";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Sun, Flame, ChevronDown, ChevronUp, Check, Moon, Compass, Hand, Footprints, Wind, Eye } from "lucide-react";

interface MeditationTabProps {
  profile: Profile;
}

export default function MeditationTab({ profile }: MeditationTabProps) {
  const comp = profile.computed;
  const lp = comp?.numerology.lifePath || 7;
  const birthYear = parseInt(profile.dateOfBirth.split("-")[0] || "1991", 10);
  const calculatedAge = new Date().getFullYear() - birthYear;

  // 1. Daily Prompts Carousel
  const [promptIndex, setPromptIndex] = useState(0);
  const dailyPrompts = [
    {
      quote: "What truth am I finally ready to stop pretending I do not know?",
      body: `Life Path ${lp}, your deepest wisdom lives in the things you already know but have not yet allowed yourself to fully acknowledge. Write one true thing in your journal that you have been diplomatically avoiding.`
    },
    {
      quote: "Where does my questioning prevent me from trusting?",
      body: "The seeker's great paradox: the very mind that finds the truth can also prevent you from resting in it. Today, notice where intellectual analysis is keeping you from direct experience."
    },
    {
      quote: "What would I discover if I sat with the question rather than rushing to the answer?",
      body: "Your greatest insights come not from searching, but from settling. Today, take a question that has been troubling you and simply sit with it for 10 minutes — no analysis, no resolution-seeking. Just presence."
    },
    {
      quote: "What part of my inner world am I hiding behind intellectual analysis?",
      body: "Analysis can become a fortress against feeling. Allow your awareness to drop from the head into the heart space and acknowledge whatever emotion is present."
    }
  ];

  // 2. Personal Seed Mantra state
  const [userAge, setUserAge] = useState<string>(calculatedAge.toString());
  const [seedCalculated, setSeedCalculated] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  // Derived mantra details
  const mantraOptions = [
    { mantra: "K R I M", solfeggio: "741 Hz", desc: "This frequency acts as a vibrational filter — clearing mental fatigue and boosting your natural intuitive signal at the point in life where wisdom begins to outpace ambition." },
    { mantra: "S H R I M", solfeggio: "528 Hz", desc: "The frequency of transformation and miraculous restoration. Harmonizes body fluids and cellular DNA structure for deep soul rebirth." },
    { mantra: "A U M", solfeggio: "432 Hz", desc: "The primal organic hum of creation. Calibrates neural alpha waves to natural cosmic earth resonance." },
    { mantra: "H U M", solfeggio: "852 Hz", desc: "Clears spiritual blockages and opens third-eye foresight, aligning individual consciousness with the collective ledger." }
  ];
  const ageNum = parseInt(userAge, 10) || calculatedAge;
  const selectedMantraObj = mantraOptions[ageNum % mantraOptions.length];

  // 3. Step 5 Waking Up Senses drawer
  const [sensesExpanded, setSensesExpanded] = useState(false);

  // 4. Timer Logic (Settling 30s -> Deep Meditation 20m -> Silent Return 3m)
  const [timerActive, setTimerActive] = useState(false);
  const [timerPhase, setTimerPhase] = useState<"settling" | "deep" | "return">("settling");
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [voiceInstructions, setVoiceInstructions] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound generator
  const [soundActive, setSoundActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerPhase === "settling") {
              setTimerPhase("deep");
              return 1200; // 20 mins
            } else if (timerPhase === "deep") {
              setTimerPhase("return");
              return 180; // 3 mins
            } else {
              clearInterval(timerRef.current!);
              setTimerActive(false);
              stopSolfeggioTone();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timerPhase]);

  const handleStartTimer = () => {
    setTimerPhase("settling");
    setSecondsLeft(30);
    setTimerActive(true);
  };

  const handleEndTimer = () => {
    setTimerActive(false);
    setSecondsLeft(30);
    setTimerPhase("settling");
    stopSolfeggioTone();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const stopSolfeggioTone = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch (e) {}
      oscRef.current = null;
    }
    setSoundActive(false);
  };

  return (
    <div className="space-y-8 slide-in text-slate-100" id="point-zero-meditation-tab">
      {/* Title Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6" id="meditation-title-header">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-slate-100">Point Zero Meditation</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-4xl leading-relaxed">
          Point Zero is the quantum state of pure potentiality — absolute stillness beneath all movement. These practices are calibrated for your Life Path {lp} frequency and are designed to bring you to this state before action, so your manifestations flow from clarity rather than reaction.
        </p>
      </div>

      {/* CARD 1: ELARA'S DAILY PROMPT */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-teal-500/20 shadow-xl relative overflow-hidden space-y-6" id="elaras-daily-prompt-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_10px_#2dd4bf]" />
            <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/30">
              ELARA'S DAILY PROMPT
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Calibrated for Life Path {lp} • Monday, July 27
          </span>
        </div>

        <div className="space-y-3 min-h-[110px]" id="daily-prompt-body">
          <p className="text-xl sm:text-2xl font-serif italic text-teal-200 leading-relaxed">
            "{dailyPrompts[promptIndex].quote}"
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {dailyPrompts[promptIndex].body}
          </p>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2 pt-2" id="daily-prompt-dots">
          {dailyPrompts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPromptIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                promptIndex === idx 
                  ? "bg-teal-400 ring-4 ring-teal-500/20 scale-110" 
                  : "bg-slate-700 hover:bg-slate-500"
              }`}
              id={`prompt-dot-${idx}`}
            />
          ))}
        </div>
      </div>

      {/* CARD 2: YOUR PERSONAL SEED MANTRA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="personal-seed-mantra-card">
        <div className="flex items-center gap-2 text-teal-300 font-bold uppercase text-xs tracking-wider">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Your Personal Seed Mantra</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Your ancient seed mantra is calibrated to your current stage of life. It is a direct frequency ticket to your higher self — not a word to be understood, but a sound to be experienced. Enter your age to receive yours.
        </p>

        <div className="flex flex-wrap items-center gap-3" id="seed-calculator-controls">
          <input
            type="number"
            value={userAge}
            onChange={(e) => setUserAge(e.target.value)}
            placeholder="Enter your age"
            className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white font-mono text-sm outline-none focus:border-teal-400 w-36"
            id="user-age-input"
          />
          <button
            onClick={() => {
              setSeedCalculated(true);
              setIsLocked(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-teal-500/20"
            id="calculate-seed-btn"
          >
            Calculate +
          </button>
        </div>

        {/* Calculated Seed Cards */}
        {seedCalculated && (
          <div className="space-y-6 pt-2 animate-fade-in" id="seed-calculated-results">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">YOUR SEED MANTRA</span>
                <div className="text-3xl font-serif font-bold text-teal-300 tracking-widest my-2">{selectedMantraObj.mantra}</div>
                <span className="text-[10px] text-slate-500 block">Repeat silently • Like a heartbeat</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">SOLFEGGIO FREQUENCY</span>
                <div className="text-3xl font-mono font-bold text-teal-300 my-2">{selectedMantraObj.solfeggio}</div>
                <span className="text-[10px] text-slate-500 block">Background resonance</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">WHY IT ALIGNS</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{selectedMantraObj.desc}</p>
              </div>
            </div>

            {!isLocked ? (
              <button
                onClick={() => setIsLocked(true)}
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20"
                id="lock-into-protocol-btn"
              >
                Lock Into My Protocol +
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-3" id="locked-protocol-banner">
                <Check className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white">{selectedMantraObj.mantra}</strong> is locked into your 23.5-minute Point Zero Protocol below. Your <strong className="text-white">{selectedMantraObj.solfeggio}</strong> Solfeggio frequency is woven into your session — seek out a {selectedMantraObj.solfeggio} recording to play softly in the background as you meditate.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CARD 3: THE POINT ZERO PROTOCOL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="point-zero-protocol-card">
        <div>
          <div className="flex items-center gap-2 text-teal-300 font-bold uppercase text-xs tracking-wider mb-1">
            <Compass className="w-4 h-4 text-teal-400" />
            <span>The Point Zero Protocol</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            An effortless, mantra-based practice that aligns your nervous system with the quantum field before you take action. Your mantra — <strong className="text-teal-300">{selectedMantraObj.mantra}</strong> — is woven through Step 2.
          </p>
        </div>

        <div className="space-y-4" id="protocol-steps">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300">FIND STILLNESS</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Sit comfortably with your spine erect. Close your eyes. Take 3 slow, deep breaths, fully emptying the lungs on each exhale. Then sit quietly for 30 seconds to let your central nervous system settle into the present moment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300">INTRODUCE THE RESONANCE</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Gently introduce your ancient seed mantra — <strong className="text-teal-300">{selectedMantraObj.mantra}</strong> silently in your mind. This sound is a direct ticket to your higher self — designed to effortlessly connect you to the exact frequency it takes to get there. Do not focus heavily or strain; let it repeat as effortlessly as a faint memory, or a natural heartbeat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300">OBSERVE WITHOUT ENGAGEMENT</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Notice thoughts, sensations, and emotions arising. Do not fight them or try to empty your mind. If you realize your attention has drifted away from the seed mantra, gently and innocently drift back to it. This effortless return is the entire practice.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">4</span>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300">LOCATE THE SILENCE</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Beneath all thought, there is a layer of pure awareness. Allow the seed mantra to fade completely if it wants to, leaving only raw presence. This is Point Zero — the field of pure potentiality from which all aligned action flows.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
            <span className="w-7 h-7 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">5</span>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-300">RETURN SLOWLY</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                When your practice concludes, cease the internal sound. Remain sitting with your eyes closed in complete silence for 2 to 3 minutes. Take three deep breaths, introduce gentle movement to wake up the senses, then take your aligned action from this state of sovereign stillness.
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Step 5 Drawer */}
        <div className="pt-2">
          <button
            onClick={() => setSensesExpanded(!sensesExpanded)}
            className="flex items-center gap-2 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-colors"
            id="toggle-waking-senses-btn"
          >
            <span>▶ Step 5 — Waking Up Your Senses ({sensesExpanded ? "collapse" : "expand"})</span>
            {sensesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {sensesExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 animate-fade-in" id="senses-expanded-grid">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Hand className="w-4 h-4" />
                  <span>Touch</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Lightly rub your thumbs against your fingertips to feel your own skin and reconnect with the physical world.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Footprints className="w-4 h-4" />
                  <span>Movement</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Make tiny movements — roll your wrists and wiggle your toes — to get blood flowing gently back through your body.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Wind className="w-4 h-4" />
                  <span>Breath</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Take one deep breath in through your nose and sigh it out through your mouth to anchor yourself back in the room.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Eye className="w-4 h-4" />
                  <span>Sight</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Gently blink your eyes open halfway, looking down at the floor first, before slowly raising your gaze into your space.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CARD 4: 23.5-MINUTE POINT ZERO TIMER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="point-zero-timer-card">
        <div>
          <div className="flex items-center gap-2 text-teal-300 font-bold uppercase text-xs tracking-wider mb-1">
            <Flame className="w-4 h-4 text-teal-400" />
            <span>23.5-Minute Point Zero Timer</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            30s settling • 20 min deep meditation • 3 min silent return. Your mantra <strong className="text-teal-300">{selectedMantraObj.mantra}</strong> will appear during the 20-minute phase.
          </p>
        </div>

        {!timerActive ? (
          <div className="flex flex-wrap items-center gap-4" id="timer-idle-controls">
            <button
              onClick={handleStartTimer}
              className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
              id="begin-timer-btn"
            >
              <span>Begin +</span>
            </button>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceInstructions}
                onChange={(e) => setVoiceInstructions(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-teal-400 focus:ring-teal-400"
              />
              <span>Voice instructions on</span>
            </label>
          </div>
        ) : (
          <div className="space-y-4 p-6 rounded-2xl bg-slate-950/80 border border-teal-500/30 text-center animate-fade-in" id="timer-active-display">
            <span className="text-xs font-mono font-bold tracking-widest text-teal-400 uppercase">
              {timerPhase === "settling" ? "SETTLING — 30 SECONDS" : timerPhase === "deep" ? `DEEP MEDITATION — ${selectedMantraObj.mantra}` : "SILENT RETURN — 3 MINUTES"}
            </span>
            
            <div className="text-5xl sm:text-6xl font-serif text-teal-200 tracking-wider font-light my-2">
              {formatTime(secondsLeft)}
            </div>

            {voiceInstructions && (
              <p className="text-xs italic text-slate-300 max-w-md mx-auto">
                "Close your eyes. Find your breath, and let your body settle into complete stillness."
              </p>
            )}

            <div>
              <button
                onClick={handleEndTimer}
                className="px-6 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold text-xs transition-all mt-2"
                id="end-session-btn"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CARD 5: CORE PRACTICES FOR YOUR DESIGN */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="core-practices-card">
        <div className="flex items-center gap-2 text-teal-300 font-bold uppercase text-xs tracking-wider">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Core Practices for Your Design</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="core-practices-grid">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Moon className="w-4 h-4 text-amber-400" />
              <span>Lunar Alignment</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">New moon / Full moon ritual</span>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              At each new moon, set three intentions aligned with your Life Path purpose. At each full moon, release one thing that is not serving your growth. This practice aligns your personal manifestation cycle with the most powerful gravitational influence in your immediate cosmic environment.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
              <Wind className="w-4 h-4 text-sky-400" />
              <span>Breath as Bridge</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">5-10 minutes daily</span>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Conscious breathing is the fastest way to shift from reactive to aligned states. Practice box breathing (4 counts in, 4 hold, 4 out, 4 hold) for 5 minutes before any important meeting, decision, or creative work. This is not relaxation technique — it is quantum state management.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Soul Signature Journaling</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">10-15 minutes daily</span>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Each morning, before checking devices, write freely for 10 minutes in response to the daily prompt. Above all: do not edit, do not perform — write simply. This practice over time reveals the authentic signal of your soul beneath the noise of conditioning and social expectation.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Silent Inquiry Meditation</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">20-40 minutes</span>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Life Path 7 meditation is not visualization or affirmation — it is inquiry. Sit in complete silence with one question. Do not seek an answer through thought. Allow the answer to emerge as felt sense, image, or sudden knowing. This is your oracle access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export {};

