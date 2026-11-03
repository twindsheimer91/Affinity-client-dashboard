import React, { useState, useEffect } from "react";
import { Profile, MbtiRecord } from "../types";
import { Brain, Sparkles, CheckCircle2, History, RotateCcw, Download, Upload, ArrowRight, ShieldCheck, HeartHandshake, Zap, Compass, FileCode } from "lucide-react";
import { MBTI_QUESTIONS, MBTI_PROFILES, MbtiTypeProfile } from "../data/mbtiData";
import TestAnswerModal from "./TestAnswerModal";
import { downloadCompletedMbtiPDF, downloadEditableMbtiPDF, downloadEditablePsychometricPDF } from "../utils/pdfGenerator";

interface MbtiTabProps {
  token: string;
  profile?: Profile | null;
  onNavigate?: (tabId: string) => void;
}

export default function MbtiTab({ token, profile, onNavigate }: MbtiTabProps) {
  const [mode, setMode] = useState<"overview" | "test" | "result">("overview");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B">>({});
  const [history, setHistory] = useState<MbtiRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Current active MBTI record or selected type
  const [activeMbtiType, setActiveMbtiType] = useState<string>("INFJ");
  const [activeScores, setActiveScores] = useState({
    E: 30,
    I: 70,
    S: 25,
    N: 75,
    T: 45,
    F: 55,
    J: 80,
    P: 20
  });

  // Modal for input/upload
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [selectedProfileTab, setSelectedProfileTab] = useState<"current" | "browse">("current");
  const [browseCategory, setBrowseCategory] = useState<string>("All");

  const fetchMbtiHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/mbti/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.history) {
        setHistory(data.history);
        if (data.history.length > 0) {
          const latest = data.history[data.history.length - 1];
          setActiveMbtiType(latest.mbtiType);
          if (latest.scores) setActiveScores(latest.scores);
        }
      }
    } catch (err) {
      console.error("Failed to fetch MBTI history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchMbtiHistory();
  }, [token]);

  const startTest = () => {
    setCurrentIndex(0);
    setAnswers({});
    setMode("test");
  };

  const handleSelectAnswer = (choice: "A" | "B") => {
    const q = MBTI_QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [q.id]: choice };
    setAnswers(newAnswers);

    if (currentIndex < MBTI_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate final scores
      let eCount = 0, iCount = 0;
      let sCount = 0, nCount = 0;
      let tCount = 0, fCount = 0;
      let jCount = 0, pCount = 0;

      MBTI_QUESTIONS.forEach((quest) => {
        const sel = newAnswers[quest.id];
        if (quest.dichotomy === "EI") {
          if (sel === "A") eCount++;
          else if (sel === "B") iCount++;
        } else if (quest.dichotomy === "SN") {
          if (sel === "A") sCount++;
          else if (sel === "B") nCount++;
        } else if (quest.dichotomy === "TF") {
          if (sel === "A") tCount++;
          else if (sel === "B") fCount++;
        } else if (quest.dichotomy === "JP") {
          if (sel === "A") jCount++;
          else if (sel === "B") pCount++;
        }
      });

      const ePct = Math.round((eCount / (eCount + iCount || 1)) * 100);
      const sPct = Math.round((sCount / (sCount + nCount || 1)) * 100);
      const tPct = Math.round((tCount / (tCount + fCount || 1)) * 100);
      const jPct = Math.round((jCount / (jCount + pCount || 1)) * 100);

      const calculatedScores = {
        E: ePct,
        I: 100 - ePct,
        S: sPct,
        N: 100 - sPct,
        T: tPct,
        F: 100 - tPct,
        J: jPct,
        P: 100 - jPct
      };

      const computedType = `${ePct >= 50 ? "E" : "I"}${sPct >= 50 ? "S" : "N"}${tPct >= 50 ? "T" : "F"}${jPct >= 50 ? "J" : "P"}`;

      setActiveMbtiType(computedType);
      setActiveScores(calculatedScores);
      setMode("result");
      saveMbtiResult(computedType, calculatedScores, newAnswers);
    }
  };

  const saveMbtiResult = async (type: string, scores: any, submittedAnswers: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/mbti/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mbtiType: type,
          scores,
          answers: submittedAnswers,
          source: "interactive",
          profileSnapshot: profile
        })
      });
      if (res.ok) {
        fetchMbtiHistory();
      }
    } catch (err) {
      console.error("Error saving MBTI result", err);
    } finally {
      setSaving(false);
    }
  };

  // Download Completed MBTI Test Questions & Answers PDF (only after taking test)
  const handleDownloadCompletedPdf = () => {
    const latestRec = history.length > 0 ? history[history.length - 1] : {
      id: "latest-session",
      mbtiType: activeMbtiType,
      scores: activeScores,
      answers,
      createdAt: new Date().toISOString()
    };
    const currentProf = profile || {
      firstName: "Aligned",
      lastName: "Seeker",
      dateOfBirth: "1990-01-01",
      timeOfBirth: "12:00",
      placeOfBirth: "Earth",
    };
    downloadCompletedMbtiPDF(latestRec as any, currentProf);
  };

  const currentProfileData = MBTI_PROFILES[activeMbtiType] || MBTI_PROFILES["INFJ"];
  const currentQ = MBTI_QUESTIONS[currentIndex];

  return (
    <div className="space-y-6 pb-12" id="mbti-assessment-container">
      {/* Test Answer Modal */}
      <TestAnswerModal
        isOpen={inputModalOpen}
        onClose={() => setInputModalOpen(false)}
        token={token}
        defaultTestType="mbti"
        profileSnapshot={profile}
        onSuccess={() => fetchMbtiHistory()}
      />

      {/* TOP HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider font-bold">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Cognitive Matrix & 16 Archetypes</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
            Myers-Briggs Type Indicator (MBTI)
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Synthesizing Carl Jung’s cognitive functions with your sovereign Soul Blueprint. Discover your dominant, auxiliary, tertiary, and inferior consciousness channels.
          </p>
        </div>

        {/* PRIMARY ACTIONS RIGHT NEXT TO TEST */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          {/* Input Test Answers Button */}
          <button
            onClick={() => setInputModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
            title="Input test answers manually or upload doc/word/pdf"
          >
            <FileCode className="w-3.5 h-3.5 text-purple-300" />
            <span>Input Test Answers</span>
          </button>

          {/* Upload Test Answer File */}
          <button
            onClick={() => setInputModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md"
            title="Upload Word, PDF or document answers"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Upload Document</span>
          </button>

          {/* Download Editable MBTI Questionnaire PDF */}
          <button
            onClick={() => downloadEditableMbtiPDF()}
            className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/35 text-purple-200 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md"
            title="Download full 20-question Myers-Briggs assessment in an editable/fillable blank PDF"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download MBTI Form (PDF)</span>
          </button>

          {/* Download Editable AMBI 181-Q Questionnaire PDF */}
          <button
            onClick={() => downloadEditablePsychometricPDF()}
            className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/35 text-teal-300 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md"
            title="Download full 181-question AMBI assessment in an editable/fillable blank PDF"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download 181-Q AMBI (PDF)</span>
          </button>

          {/* Download Questions & Answers PDF - Only available after taking test */}
          {(history.length > 0 || mode === "result") && (
            <button
              onClick={handleDownloadCompletedPdf}
              className="py-2 px-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm"
              title="Download your completed MBTI assessment questions, answers, and analysis as PDF"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>Test &amp; Answers (PDF)</span>
            </button>
          )}

          {mode === "overview" && (
            <button
              onClick={startTest}
              className="py-2 px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Take Test Online</span>
            </button>
          )}
        </div>
      </div>

      {/* TEST RUNNER MODE */}
      {mode === "test" && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-400 font-bold">
                Question {currentIndex + 1} of {MBTI_QUESTIONS.length}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">{currentQ.dichotomyName}</span>
            </div>
            <button
              onClick={() => setMode("overview")}
              className="text-xs text-slate-500 hover:text-slate-300 font-mono"
            >
              Exit Test
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / MBTI_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-4 py-4">
            <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {/* Option A & Option B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button
                onClick={() => handleSelectAnswer("A")}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-purple-950/30 border border-slate-800 hover:border-purple-500/60 text-left transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                    Option A
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {currentQ.optionA}
                </p>
              </button>

              <button
                onClick={() => handleSelectAnswer("B")}
                className="p-5 rounded-2xl bg-slate-950 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/60 text-left transition-all group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30">
                    Option B
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-sans">
                  {currentQ.optionB}
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW / RESULT MODE */}
      {mode !== "test" && (
        <div className="space-y-6">
          {/* Profile Tabs: Active Type vs Browse All 16 */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedProfileTab("current")}
                className={`text-xs font-bold tracking-wide transition-all pb-1 border-b-2 flex items-center gap-2 ${
                  selectedProfileTab === "current"
                    ? "border-purple-400 text-purple-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Your Profile Analysis ({activeMbtiType})</span>
              </button>
              <button
                onClick={() => setSelectedProfileTab("browse")}
                className={`text-xs font-bold tracking-wide transition-all pb-1 border-b-2 flex items-center gap-2 ${
                  selectedProfileTab === "browse"
                    ? "border-purple-400 text-purple-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Explore All 16 Types</span>
              </button>
            </div>

            {/* Test History Count Badge */}
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-teal-400" />
              <span>{history.length} Saved Assessment{history.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {selectedProfileTab === "current" ? (
            <div className="space-y-6">
              {/* Type Hero Banner */}
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/30 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono text-xs text-purple-300">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 font-bold text-sm">
                        {currentProfileData.type}
                      </span>
                      <span>• {currentProfileData.category}</span>
                      <span>• {currentProfileData.nickname}</span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white">
                      {currentProfileData.title}
                    </h2>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {currentProfileData.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onNavigate && onNavigate("chat")}
                      className="py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>Ask Ela About My MBTI</span>
                    </button>
                  </div>
                </div>

                {/* 4 Dichotomy Meters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-6">
                  {/* E vs I */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={activeScores.E >= 50 ? "text-purple-300 font-bold" : "text-slate-400"}>
                        Extravert ({activeScores.E}%)
                      </span>
                      <span className={activeScores.I > 50 ? "text-purple-300 font-bold" : "text-slate-400"}>
                        Introvert ({activeScores.I}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${activeScores.E}%` }}
                      />
                    </div>
                  </div>

                  {/* S vs N */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={activeScores.S >= 50 ? "text-indigo-300 font-bold" : "text-slate-400"}>
                        Sensing ({activeScores.S}%)
                      </span>
                      <span className={activeScores.N > 50 ? "text-indigo-300 font-bold" : "text-slate-400"}>
                        Intuition ({activeScores.N}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-indigo-500 h-full"
                        style={{ width: `${activeScores.S}%` }}
                      />
                    </div>
                  </div>

                  {/* T vs F */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={activeScores.T >= 50 ? "text-teal-300 font-bold" : "text-slate-400"}>
                        Thinking ({activeScores.T}%)
                      </span>
                      <span className={activeScores.F > 50 ? "text-teal-300 font-bold" : "text-slate-400"}>
                        Feeling ({activeScores.F}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-teal-500 h-full"
                        style={{ width: `${activeScores.T}%` }}
                      />
                    </div>
                  </div>

                  {/* J vs P */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={activeScores.J >= 50 ? "text-amber-300 font-bold" : "text-slate-400"}>
                        Judging ({activeScores.J}%)
                      </span>
                      <span className={activeScores.P > 50 ? "text-amber-300 font-bold" : "text-slate-400"}>
                        Perceiving ({activeScores.P}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${activeScores.J}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* COGNITIVE FUNCTION STACK */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Jungian Cognitive Function Architecture</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                      1. Dominant (Hero)
                    </span>
                    <div className="text-sm font-bold text-white">
                      {currentProfileData.cognitiveFunctions.dominant}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Your automatic consciousness cockpit; effortlessly guides your perception and life force.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                      2. Auxiliary (Co-Pilot)
                    </span>
                    <div className="text-sm font-bold text-white">
                      {currentProfileData.cognitiveFunctions.auxiliary}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Provides essential counterbalance and maturity to manifest your sovereign intentions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                      3. Tertiary (Relief)
                    </span>
                    <div className="text-sm font-bold text-white">
                      {currentProfileData.cognitiveFunctions.tertiary}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Playful, creative refuge when relaxed; can become defensive under initial stress.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                      4. Inferior (Shadow Gateway)
                    </span>
                    <div className="text-sm font-bold text-white">
                      {currentProfileData.cognitiveFunctions.inferior}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Source of vulnerability and acute stress triggers; doorway to profound spiritual individuation.
                    </p>
                  </div>
                </div>
              </div>

              {/* STRENGTHS, BLIND SPOTS, RELATIONSHIP DYNAMICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-slate-900 border border-teal-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Sovereign Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentProfileData.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Blind Spots & Shadow */}
                <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>Shadow Triggers & Blind Spots</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentProfileData.blindSpots.map((spot, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{spot}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relationship Style & De-escalation */}
                <div className="p-4 rounded-xl bg-slate-900 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <HeartHandshake className="w-4 h-4 text-purple-400" />
                    <span>Relational Alchemy</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentProfileData.relationshipStyle}
                  </p>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-mono text-purple-400 font-bold block">De-Escalation Key:</span>
                    <p className="text-[11px] italic text-slate-300">
                      {currentProfileData.deEscalationPhrase}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* BROWSE ALL 16 PROFILES */
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {["All", "Analysts", "Diplomats", "Sentinels", "Explorers"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBrowseCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      browseCategory === cat
                        ? "bg-purple-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {Object.values(MBTI_PROFILES)
                  .filter((p) => browseCategory === "All" || p.category === browseCategory)
                  .map((p) => {
                    const isSelected = activeMbtiType === p.type;
                    return (
                      <div
                        key={p.type}
                        className={`p-4 rounded-xl border transition-all space-y-2 cursor-pointer ${
                          isSelected
                            ? "bg-purple-950/40 border-purple-400 shadow-lg"
                            : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                        }`}
                        onClick={() => {
                          setActiveMbtiType(p.type);
                          setSelectedProfileTab("current");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                            {p.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.category}</span>
                        </div>
                        <div className="text-xs font-bold text-white">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.nickname}</div>
                        <p className="text-[11px] text-slate-300 line-clamp-2">
                          {p.description}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TEST HISTORY TABLE */}
          {history.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-400" />
                  <span>Your MBTI Assessment Submissions & Document History</span>
                </h4>
              </div>

              <div className="space-y-2">
                {history.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
                        {rec.mbtiType}
                      </span>
                      <div>
                        <div className="text-white font-medium">
                          {rec.uploadedFileName ? `Uploaded: ${rec.uploadedFileName}` : "Interactive Assessment"}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(rec.date).toLocaleDateString()} at {new Date(rec.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveMbtiType(rec.mbtiType);
                          if (rec.scores) setActiveScores(rec.scores);
                          setSelectedProfileTab("current");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-[11px] font-mono border border-purple-500/30"
                      >
                        Load This Reading
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
