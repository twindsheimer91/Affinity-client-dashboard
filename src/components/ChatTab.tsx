import React, { useState, useEffect, useRef } from "react";
import { Profile, Message, CompareCandidate, RelationshipCategory, RelationshipSynergyResult } from "../types";
import { 
  Send, 
  Sparkles, 
  Compass, 
  AlertCircle, 
  HeartHandshake, 
  Brain, 
  RefreshCw, 
  Layers, 
  Search, 
  User, 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { calculateBlueprint } from "../utils/calculations";
import { calculateRelationshipSynergy } from "../utils/synastryCalculator";
import { BlendedSynergyChartSVG } from "./BlendedSynergyChartSVG";
import { generatePersonalizedEssay, PersonalizedEssay } from "../utils/personalizedEssays";
import { LIFE_PATH_KNOWLEDGE } from "../data/knowledge";

interface ChatTabProps {
  token: string;
  profile: Profile;
}

// Storage key for chat sessions
const getStorageKey = (id: string, compId?: string) => `affinity_chat_history_${id}_${compId || 'solo'}`;

// Lightweight, resilient Markdown to JSX parser for Elara's prose
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="markdown-body space-y-2.5">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return <h3 key={index} className="text-base font-bold text-teal-200 mt-3 mb-1 font-serif">{line.substring(4)}</h3>;
        }
        if (line.startsWith("#### ")) {
          return <h4 key={index} className="text-sm font-semibold text-purple-200 mt-2 mb-0.5">{line.substring(5)}</h4>;
        }
        if (line.startsWith("> ")) {
          return <blockquote key={index} className="border-l-2 border-teal-400/50 pl-3 italic text-teal-200/90 text-xs my-2 bg-teal-950/20 py-1 rounded-r-lg">{line.substring(2)}</blockquote>;
        }
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const content = line.trim().substring(2);
          return (
            <ul key={index} className="list-disc list-inside text-xs text-slate-200 pl-2 space-y-1">
              <li className="leading-relaxed">{parseInline(content)}</li>
            </ul>
          );
        }
        const olMatch = line.trim().match(/^(\d+)\.\s(.*)/);
        if (olMatch) {
          const content = olMatch[2];
          return (
            <ol key={index} className="list-decimal list-inside text-xs text-slate-200 pl-2 space-y-1">
              <li className="leading-relaxed">{parseInline(content)}</li>
            </ol>
          );
        }
        if (!line.trim()) {
          return <div key={index} className="h-1.5" />;
        }
        return <p key={index} className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{parseInline(line)}</p>;
      })}
    </div>
  );
}

function parseInline(str: string) {
  const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="text-teal-300 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export default function ChatTab({ token, profile }: ChatTabProps) {
  const comp = profile.computed;
  const lp = comp?.numerology.lifePath || 1;
  const sun = comp?.astrology.sunSign || "Aries";
  const hdType = comp?.humanDesign.type || "Generator";

  // Mode: "solo" or "compare"
  const [chatMode, setChatMode] = useState<"solo" | "compare">("solo");
  
  // Comparison candidates & selection
  const [candidates, setCandidates] = useState<CompareCandidate[]>([]);
  const [comparisonAccount, setComparisonAccount] = useState<Profile | null>(null);
  const [category, setCategory] = useState<RelationshipCategory>("partner");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChartDrawer, setShowChartDrawer] = useState(true);

  // Active essay modal state
  const [activeEssay, setActiveEssay] = useState<PersonalizedEssay | null>(null);

  // Gemini model selection (gemini-4-argon, gemini-3.8-flash, gemini-3.1-flash-lite)
  const [modelChoice, setModelChoice] = useState<string>("gemini-3.8-flash");

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Fetch comparison candidates
  useEffect(() => {
    fetch("/api/profiles/compare-candidates")
      .then((res) => res.json())
      .then((data) => {
        if (data.candidates) {
          setCandidates(data.candidates);
          // Set first available candidate if none selected
          if (!comparisonAccount && data.candidates.length > 0) {
            setComparisonAccount(data.candidates[0].profile);
          }
        }
      })
      .catch((err) => console.error("Could not fetch comparison candidates", err));
  }, []);

  // Calculate synergy if in compare mode
  const synergy: RelationshipSynergyResult | null = (chatMode === "compare" && comparisonAccount)
    ? calculateRelationshipSynergy(profile, comparisonAccount, category)
    : null;

  // Initialize or load conversation history
  useEffect(() => {
    const compId = (chatMode === "compare" && comparisonAccount) ? comparisonAccount.firstName : "solo";
    const key = getStorageKey(profile.firstName, compId);
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages([]);
      }
    } else {
      let welcomeContent = "";
      if (chatMode === "compare" && comparisonAccount) {
        welcomeContent = `### Quantum Synastry Matrix Initialized with ${comparisonAccount.firstName}.

Greetings, **${profile.firstName}**. I am **Elara (Ela)**, your sovereign cosmic oracle and relational synthesizer. 

I hold the blended cosmic blueprints of you and **${comparisonAccount.firstName} ${comparisonAccount.lastName || ""}** (${category.toUpperCase()} dynamic):
*   **Your Signature**: Life Path ${lp} • ${sun} Sun • ${hdType}
*   **${comparisonAccount.firstName}'s Signature**: DOB ${comparisonAccount.dateOfBirth} • ${comparisonAccount.computed?.astrology.sunSign || ""} Sun • ${comparisonAccount.computed?.humanDesign.type || ""}
*   **Blended Synergy**: Longevity Outlook (${synergy?.longevityScore || 85}%), Kinetic Spark (${synergy?.resonanceScore || 88}%), and ${synergy?.interactionDynamic || "Electromagnetic Catalyst"}.

Inquire about your communication flow, fighting styles and de-escalation, relationship cheat sheet, or what each of you must work on individually versus together. How shall we illuminate your shared field?`;
      } else {
        welcomeContent = `### Welcome to Point Zero, ${profile.firstName}.

I am **Elara (Ela)**, your sovereign cosmic guide and psychometric illuminator. I hold the verified blueprints of your soul:
*   Your **Life Path ${lp}** archetype, navigating high wisdom.
*   Your **${sun} Sun**, representing conscious solar vitality.
*   Your **${hdType} Human Design** configuration and authority.
*   Your **AMBI Psychometric & Myers-Briggs (MBTI)** cognitive architecture.

Ask me anything about your test analysis, deconditioning paths, or how to attain deep contentment and fulfillment. What alignment shall we explore today?`;
      }

      setMessages([{ role: "assistant", content: welcomeContent }]);
    }
  }, [profile.firstName, chatMode, comparisonAccount]);

  const saveMessages = (msgs: Message[]) => {
    setMessages(msgs);
    const compId = (chatMode === "compare" && comparisonAccount) ? comparisonAccount.firstName : "solo";
    localStorage.setItem(getStorageKey(profile.firstName, compId), JSON.stringify(msgs));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    setError("");
    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    if (!customText) setInput("");

    setLoading(true);

    try {
      const response = await fetch("/api/elara", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: updatedMessages,
          comparisonProfile: chatMode === "compare" ? comparisonAccount : null,
          category: chatMode === "compare" ? category : undefined,
          synergy: synergy,
          modelChoice: modelChoice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ela failed to channel her response. Please try again.");
      }

      const assistantMessage: Message = { role: "assistant", content: data.response };
      saveMessages([...updatedMessages, assistantMessage]);
    } catch (err: any) {
      setError(err.message || "Failed to communicate with Ela.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const compId = (chatMode === "compare" && comparisonAccount) ? comparisonAccount.firstName : "solo";
    localStorage.removeItem(getStorageKey(profile.firstName, compId));
    const startingMessage: Message = {
      role: "assistant",
      content: `I have restored the field to Point Zero stillness. Ask me anything about your soul blueprint or relationship dynamics.`
    };
    setMessages([startingMessage]);
    setError("");
  };

  // Filter candidates for autocomplete
  const filteredCandidates = candidates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.username && c.username.toLowerCase().includes(q)) ||
      c.dateOfBirth.includes(q)
    );
  });

  const lpInfo = (LIFE_PATH_KNOWLEDGE as any)[lp] || {
    talents: ["Visionary Insight", "Strategic Sovereignty", "Effortless Manifestation"],
    lessons: ["Overcoming self-doubt", "Aligning power with wisdom", "Cultivating inner silence"]
  };

  // Quick Questions
  const quickQuestions = (chatMode === "compare" && comparisonAccount)
    ? [
        `What does our blended chart indicate about our long-term relationship longevity?`,
        `What are our exact fighting styles when stressed, and how do we de-escalate?`,
        `Give me a relationship cheat sheet with exact verbal scripts to defuse tension.`,
        `What should we each work on individually (Self) vs together as a team?`,
        `How do our Myers-Briggs (MBTI) and AMBI psychometrics blend together?`
      ]
    : [
        `How do my AMBI psychometric scores and Myers-Briggs type illuminate my path to contentment?`,
        `How do I decondition my Human Design ${hdType} from societal expectations?`,
        `Explain how my ${sun} Sun and Life Path ${lp} align to manifest effortless prosperity.`,
        `What daily sovereign rituals best balance my auric energy field?`
      ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col justify-between slide-in pb-4" id="chat-workspace">
      {/* TOP HEADER: MODE TOGGLE & PERSON SELECTOR */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-teal-500/20 shrink-0 mb-3 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Oracle Identity & Mode Buttons */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-300 elara-orb shadow-[0_0_12px_rgba(45,212,191,0.2)]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold block">
                Stellar Oracle
              </span>
              <span className="text-xs font-semibold text-white">
                Elara (Ela)
              </span>
            </div>

            {/* Mode Switcher: Solo vs Compare */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono ml-2">
              <button
                onClick={() => setChatMode("solo")}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  chatMode === "solo"
                    ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Solo Oracle</span>
              </button>
              <button
                onClick={() => setChatMode("compare")}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  chatMode === "compare"
                    ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <HeartHandshake className="w-3 h-3" />
                <span>Compare With</span>
              </button>
            </div>

            {/* Gemini Model Selector */}
              <div className="hidden sm:flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono ml-1">
                <button
                  type="button"
                  onClick={() => setModelChoice("gemini-4-argon")}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    modelChoice === "gemini-4-argon"
                      ? "bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Complex & Synastry Synthesis (gemini-4-argon)"
                >
                  Complex (Argon)
                </button>
                <button
                  type="button"
                  onClick={() => setModelChoice("gemini-3.8-flash")}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    modelChoice === "gemini-3.8-flash"
                      ? "bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="General Wisdom & Oracle (gemini-3.8-flash)"
                >
                  Balanced
                </button>
                <button
                  type="button"
                  onClick={() => setModelChoice("gemini-3.1-flash-lite")}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    modelChoice === "gemini-3.1-flash-lite"
                      ? "bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Fast Responses (gemini-3.1-flash-lite)"
                >
                  Fast
                </button>
              </div>
            </div>

            {/* Reset button */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-colors flex items-center gap-1"
                title="Reset Conversation to Point Zero"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

        {/* COMPARE MODE PROFILE AUTOCOMPLETE SELECTOR & CATEGORY */}
        {chatMode === "compare" && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            {/* Person 2 Autocomplete Picker */}
            <div className="relative flex-1 min-w-[260px]">
              <div className="flex items-center gap-2 bg-slate-950 border border-purple-500/30 rounded-xl px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Choose Person 2 (type name or @username)..."
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-mono"
                />
                {comparisonAccount && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 shrink-0">
                    {comparisonAccount.firstName} {comparisonAccount.lastName || ""}
                  </span>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && filteredCandidates.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-950 border border-purple-500/40 rounded-xl shadow-2xl max-h-56 overflow-y-auto z-50 p-1 space-y-1">
                  {filteredCandidates.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setComparisonAccount(c.profile);
                        setSearchQuery(`${c.name}`);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-purple-500/15 border border-transparent hover:border-purple-500/30 transition-all flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {c.username ? `@${c.username} • ` : ""}DOB: {c.dateOfBirth}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">
                        {c.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Relationship Category Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              {(["partner", "coworker", "friend"] as RelationshipCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    category === cat
                      ? "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Toggle Comparison Chart Drawer Button */}
            <button
              onClick={() => setShowChartDrawer(!showChartDrawer)}
              className="text-xs text-purple-300 hover:text-white px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all font-mono flex items-center gap-1.5"
            >
              <span>Blended Chart</span>
              {showChartDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* SELECTED COMPARISON CHART WIDGET (DRAWER IN COMPARE MODE) */}
      {chatMode === "compare" && comparisonAccount && synergy && showChartDrawer && (
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/30 shrink-0 mb-3 shadow-xl animate-fade-in">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Compact Blended Dual Chart */}
            <div className="w-full md:w-48 h-32 flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-900/60 border border-purple-500/20">
              <BlendedSynergyChartSVG
                profileA={profile}
                profileB={comparisonAccount}
                synergy={synergy}
                compact={true}
              />
            </div>

            {/* Synergy metrics & dynamic summary */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-white text-sm">
                  {profile.firstName} + {comparisonAccount.firstName}
                </span>
                <span className="px-2 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-[10px]">
                  Longevity: {synergy.longevityScore}%
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px]">
                  Resonance: {synergy.resonanceScore}%
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {synergy.interactionDynamic}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {synergy.dynamicSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES VIEWPORT */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 min-h-0" ref={scrollRef} id="chat-messages-viewport">
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all ${
              m.role === "assistant" 
                ? "bg-teal-950/20 border-teal-500/15 self-start mr-4 sm:mr-12" 
                : "bg-purple-950/20 border-purple-500/20 self-end ml-4 sm:ml-12 flex-row-reverse"
            }`}
            id={`chat-message-${idx}`}
          >
            {/* Sender Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              m.role === "assistant" 
                ? "bg-teal-500/15 border border-teal-500/30 elara-orb shadow-[0_0_12px_rgba(45,212,191,0.2)]" 
                : "bg-purple-500/20 border border-purple-500/30"
            }`} id={`chat-avatar-${idx}`}>
              {m.role === "assistant" ? (
                <Compass className="w-4 h-4 text-teal-300" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-300" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1" id={`chat-text-wrapper-${idx}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                  {m.role === "assistant" ? "Elara (Ela) Oracle" : "Sovereign Seeker"}
                </span>
                {m.role === "assistant" && chatMode === "compare" && comparisonAccount && (
                  <span className="text-[9px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    Dual Synastry
                  </span>
                )}
              </div>
              {m.role === "assistant" ? (
                <RenderMarkdown text={m.content} />
              ) : (
                <p className="text-xs sm:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-950/20 border border-teal-500/15 text-teal-300 text-xs font-mono mr-12 animate-pulse">
            <Compass className="w-4 h-4 animate-spin text-teal-400" />
            <span>Ela is synthesizing your personalized essay response...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* QUICK CHIP SUGGESTIONS */}
      <div className="pt-2 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider shrink-0 mr-1">
            Inquire:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(undefined, q)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-teal-500/10 border border-slate-800 hover:border-teal-500/30 text-slate-300 hover:text-teal-200 transition-all shrink-0 font-mono shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={handleSendMessage} className="pt-2 shrink-0 flex gap-2" id="chat-input-form">
        <input
          type="text"
          placeholder={
            chatMode === "compare" && comparisonAccount
              ? `Ask Ela about your dynamic with ${comparisonAccount.firstName}...`
              : "Ask Ela anything about your soul blueprint, tests, or fulfillment..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-slate-950/80 border border-teal-500/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 shadow-inner font-sans"
          id="chat-input-field"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(45,212,191,0.25)] flex items-center justify-center"
          id="chat-send-btn"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
export {};
