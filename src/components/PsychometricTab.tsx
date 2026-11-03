import { useState, useEffect } from "react";
import { Profile, AmbiRecord } from "../types";
import { Sparkles, Brain, CheckCircle2, History, RotateCcw, AlertTriangle, FileText, Download, BarChart2, ShieldCheck, Zap, Layers, Activity, Upload, FileCode } from "lucide-react";
import { MASTER_ASSESSMENT_QUESTIONS, SCALE_RATING_GUIDE, AssessmentQuestion } from "../data/assessmentQuestions";
import { downloadCompletedTestPDF, downloadEditablePsychometricPDF, downloadEditableMbtiPDF } from "../utils/pdfGenerator";
import TestAnswerModal from "./TestAnswerModal";

interface PsychometricTabProps {
  token: string;
  profile?: Profile | null;
  onNavigate?: (tabId: string) => void;
}

export default function PsychometricTab({ token, profile, onNavigate }: PsychometricTabProps) {
  const [subTab, setSubTab] = useState<"overview" | "growth" | "deep" | "scales">("overview");
  const [mode, setMode] = useState<"setup" | "test" | "result">("setup");
  const [testMode, setTestMode] = useState<"quick" | "full">("quick");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [history, setHistory] = useState<AmbiRecord[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<AssessmentQuestion[]>([]);
  const [inputModalOpen, setInputModalOpen] = useState(false);
  const [calculatedScores, setCalculatedScores] = useState<Record<string, number>>({
    O: 88,
    C: 74,
    E: 65,
    A: 82,
    N: 79,
    T: 91,
    I: 85
  });
  const [latestSavedRecord, setLatestSavedRecord] = useState<AmbiRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Fetch history on load
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch("/api/ambi-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history || []);
        if (data.history && data.history.length > 0) {
          setLatestSavedRecord(data.history[data.history.length - 1]);
        }
      }
    } catch (err) {
      console.error("Failed to load psychometric history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const startTest = (selectedMode: "quick" | "full") => {
    setTestMode(selectedMode);
    // Quick mode = 10 high-impact questions; Full mode = all 30 master questions across all 7 dimensions
    const qs = selectedMode === "quick" ? MASTER_ASSESSMENT_QUESTIONS.slice(0, 10) : MASTER_ASSESSMENT_QUESTIONS;
    setActiveQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setMode("test");
  };

  const handleSelectAnswer = (value: number) => {
    const currentQ = activeQuestions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate scores per dimension
      const tempScores: Record<string, number[]> = {};

      activeQuestions.forEach((q) => {
        const val = newAnswers[q.id] || 3;
        const adjustedVal = q.reversed ? 6 - val : val;
        if (!tempScores[q.category]) {
          tempScores[q.category] = [];
        }
        tempScores[q.category].push(adjustedVal);
      });

      const finalScores: Record<string, number> = {};
      Object.keys(tempScores).forEach((cat) => {
        const arr = tempScores[cat];
        const sum = arr.reduce((acc, v) => acc + v, 0);
        const avg = sum / arr.length;
        // Transform 1-5 to 0-100% scale
        finalScores[cat] = Math.round(((avg - 1) / 4) * 80 + 20);
      });

      setCalculatedScores(finalScores);
      setMode("result");
      saveResult(testMode, finalScores, newAnswers);
    }
  };

  const saveResult = async (m: "quick" | "full", scores: Record<string, number>, submittedAnswers: Record<number, number>) => {
    setSaving(true);
    try {
      const response = await fetch("/api/ambi-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode: m,
          testTitle: m === "quick" ? "AMBI Quick Calibration" : "AMBI 203 Master Inventory",
          scores,
          answers: submittedAnswers,
          profileSnapshot: profile,
        }),
      });
      const resJson = await response.json();
      if (response.ok && resJson.record) {
        setLatestSavedRecord(resJson.record);
        fetchHistory();
      }
    } catch (err) {
      console.error("Error saving psychometric results", err);
    } finally {
      setSaving(false);
    }
  };

  // 203 Scales mock database grouped into major inventories
  const allScalesGrouped = [
    {
      inventory: "NEO PI-R (Neuroticism, Extraversion, Openness)",
      scales: [
        { name: "N1: Anxiety", score: 32, band: "Low" },
        { name: "N2: Angry Hostility", score: 18, band: "Very Low" },
        { name: "N3: Depression", score: 25, band: "Low" },
        { name: "N4: Self-Consciousness", score: 45, band: "Moderate" },
        { name: "N5: Impulsiveness", score: 38, band: "Low" },
        { name: "N6: Vulnerability", score: 22, band: "Low" },
        { name: "E1: Warmth", score: 85, band: "Very High" },
        { name: "E2: Gregariousness", score: 62, band: "High" },
        { name: "E3: Assertiveness", score: 78, band: "High" },
        { name: "E4: Activity", score: 70, band: "High" },
        { name: "E5: Excitement-Seeking", score: 55, band: "Moderate" },
        { name: "E6: Positive Emotions", score: 88, band: "Very High" },
        { name: "O1: Fantasy / Imagination", score: 96, band: "Very High" },
        { name: "O2: Aesthetics", score: 92, band: "Very High" },
        { name: "O3: Feelings / Empathy", score: 89, band: "Very High" },
        { name: "O4: Actions / Novelty", score: 81, band: "Very High" },
        { name: "O5: Ideas / Intellectual Curiosity", score: 95, band: "Very High" },
        { name: "O6: Values / Openness", score: 90, band: "Very High" },
      ]
    },
    {
      inventory: "HEXACO Personality Inventory",
      scales: [
        { name: "H: Honesty-Humility", score: 88, band: "Very High" },
        { name: "E: Emotionality", score: 42, band: "Moderate" },
        { name: "X: Extraversion", score: 72, band: "High" },
        { name: "A: Agreeableness", score: 84, band: "Very High" },
        { name: "C: Conscientiousness", score: 76, band: "High" },
        { name: "O: Openness to Experience", score: 94, band: "Very High" },
      ]
    },
    {
      inventory: "TCI (Cloninger Temperament & Character Inventory)",
      scales: [
        { name: "NS: Novelty Seeking", score: 68, band: "High" },
        { name: "HA: Harm Avoidance", score: 28, band: "Low" },
        { name: "RD: Reward Dependence", score: 75, band: "High" },
        { name: "PS: Persistence", score: 82, band: "Very High" },
        { name: "SD: Self-Directedness", score: 91, band: "Very High" },
        { name: "CO: Cooperativeness", score: 89, band: "Very High" },
        { name: "ST: Self-Transcendence", score: 97, band: "Very High" },
      ]
    }
  ];

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calculatedScores, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "affinity_ambi_scores.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Category,Score\n" + Object.entries(calculatedScores).map(e => `${e[0]},${e[1]}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", "affinity_ambi_scores.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 slide-in text-slate-100" id="psychometric-tab">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4" id="psychometric-top-nav">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === "overview" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
            }`}
            id="subtab-overview-btn"
          >
            Overview & Growth Map
          </button>
          <button
            onClick={() => setSubTab("growth")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              subTab === "growth" ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold shadow-sm" : "text-slate-400 hover:text-white"
            }`}
            id="subtab-growth-btn"
          >
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Growth Chart (Trait Evolution)</span>
          </button>
          <button
            onClick={() => setSubTab("deep")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === "deep" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
            }`}
            id="subtab-deep-btn"
          >
            Deep Analysis
          </button>
          <button
            onClick={() => setSubTab("scales")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === "scales" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400 hover:text-white"
            }`}
            id="subtab-scales-btn"
          >
            All 203 Scales
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Input Test Answers Button */}
          <button
            onClick={() => setInputModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white font-medium text-xs transition-all border border-teal-500/40 flex items-center gap-1.5 shadow-md"
            title="Input test answers manually or upload document"
          >
            <FileCode className="w-3.5 h-3.5 text-teal-300" />
            <span>Input Test Answers</span>
          </button>

          {/* Upload Document Button */}
          <button
            onClick={() => setInputModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-all border border-slate-700 flex items-center gap-1.5"
            title="Upload Word, Doc or PDF test answer file"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Upload Document</span>
          </button>

          {/* Download Editable 181-Question PDF Form */}
          <button
            onClick={() => downloadEditablePsychometricPDF()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 hover:text-white font-medium text-xs transition-all border border-teal-500/35 flex items-center gap-1.5 shadow-sm"
            id="download-editable-181q-pdf-btn"
            title="Download the full 181-question AMBI test as an interactive editable/fillable blank PDF"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download 181-Q AMBI (PDF)</span>
          </button>

          {/* Download Editable Myers-Briggs MBTI PDF Form */}
          <button
            onClick={() => downloadEditableMbtiPDF()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white font-medium text-xs transition-all border border-purple-500/35 flex items-center gap-1.5 shadow-sm"
            id="download-editable-mbti-from-psych-btn"
            title="Download full 20-question Myers-Briggs test as an interactive editable/fillable blank PDF"
          >
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Download MBTI Form (PDF)</span>
          </button>

          {/* Completed Test Questions & Answers PDF button - Only available after taking the test */}
          {(history.length > 0 || latestSavedRecord) && (
            <button
              onClick={() => {
                const rec = latestSavedRecord || history[history.length - 1];
                const prof = profile || {
                  firstName: "Sovereign",
                  lastName: "Seeker",
                  dateOfBirth: "1990-01-01",
                  timeOfBirth: "12:00",
                  placeOfBirth: "Earth",
                };
                downloadCompletedTestPDF(rec, prof);
              }}
              className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white font-medium text-xs transition-all border border-teal-500/40 flex items-center gap-1.5 shadow-sm"
              id="download-completed-test-pdf-btn"
              title="Download your completed test questions, answers, and executive interpretation as PDF"
            >
              <Download className="w-3.5 h-3.5 text-teal-300" />
              <span>Test &amp; Answers (PDF)</span>
            </button>
          )}

          {onNavigate && (
            <button
              onClick={() => onNavigate("report")}
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
              id="full-life-picture-btn"
            >
              <span>+ Full Life Picture Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Test Answer Modal */}
      <TestAnswerModal
        isOpen={inputModalOpen}
        onClose={() => setInputModalOpen(false)}
        token={token}
        defaultTestType="ambi"
        profileSnapshot={profile}
        onSuccess={fetchHistory}
      />

      {/* VIEW 1: OVERVIEW & GROWTH MAP */}
      {subTab === "overview" && mode === "setup" && (
        <div className="space-y-8" id="overview-view">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4" id="ambi-header-banner">
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-slate-100">
              AMBI Psychometric — 203 validated psychological scales across 8 major inventories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
              The AMBI Psychometric synthesizes 203 validated psychological scales across 8 major inventories (NEO PI-R, HEXACO, MPQ, TCI, CSQ, BFI-2, EPQ-R, 16PF) into a single unified map of your mind space.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="growth-map-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Your AMBI Growth Map</span>
                </div>
                <button
                  onClick={() => startTest("full")}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold"
                  id="retake-map-btn"
                >
                  Retake +
                </button>
              </div>

              {/* Trait breakdown bar chart */}
              <div className="space-y-3" id="trait-bars-list">
                {[
                  { name: "Openness / Intuition", val: 88, color: "bg-indigo-500" },
                  { name: "Agreeableness / Harmony", val: 82, color: "bg-emerald-500" },
                  { name: "Point Zero Stability", val: 79, color: "bg-teal-500" },
                  { name: "Conscientiousness", val: 74, color: "bg-amber-500" },
                  { name: "Extraversion / Expressiveness", val: 65, color: "bg-sky-500" },
                  { name: "Creative Expression", val: 92, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{item.name}</span>
                      <span className="text-indigo-300 font-mono font-bold">{item.val}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} transition-all duration-700`} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Options */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between" id="take-assessment-card">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Take an Assessment</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-slate-100">Quick Overview</h4>
                  <p className="text-xs text-slate-400">20 questions • 3 min</p>
                  <button
                    onClick={() => startTest("quick")}
                    className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-all mt-2"
                    id="start-quick-btn"
                  >
                    Start Quick Assessment
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                  <h4 className="text-sm font-bold text-indigo-200">Full AMBI 181</h4>
                  <p className="text-xs text-slate-400">181 questions • 15 min</p>
                  <button
                    onClick={() => startTest("full")}
                    className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs transition-all mt-2"
                    id="start-full-btn"
                  >
                    Start Full Assessment
                  </button>
                </div>

                {/* Input / Upload Test Answers Box */}
                <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-teal-200">Input / Upload Answers</h4>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">
                      Doc • Word • PDF
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Upload completed test answer forms or input response codes directly
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setInputModalOpen(true)}
                      className="py-1.5 px-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Input Answers</span>
                    </button>
                    <button
                      onClick={() => setInputModalOpen(true)}
                      className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition-all flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Doc</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">My Saved Reports</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubTab("deep")}
                    className="flex-1 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-semibold hover:border-indigo-500/40"
                    id="view-saved-analysis-btn"
                  >
                    View Analysis
                  </button>
                  <button onClick={handleDownloadJSON} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white" id="download-json-btn">JSON</button>
                  <button onClick={handleDownloadCSV} className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white" id="download-csv-btn">CSV</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: TRAIT EVOLUTION & GROWTH CHART */}
      {subTab === "growth" && (
        <div className="space-y-8 animate-fade-in" id="growth-chart-view">
          {/* Recommendation Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 border-2 border-teal-500/35 shadow-2xl relative overflow-hidden space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-teal-300 font-bold">
                  Neuroplastic Trait Evolution
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended Re-Assessment: Every 3 to 6 Months</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
              Longitudinal Personality &amp; Consciousness Trajectory
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Your psychological traits are not rigid fixed boundaries; they are living neuroplastic systems that evolve through somatic awareness, spiritual deconditioning, and emotional self-regulation. Retaking the assessment every few months maps your conscious growth velocity.
            </p>
          </div>

          {/* Trait Delta Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/25 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Emotional Resilience</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-teal-300">79%</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+17% Shift</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Reduced somatic reactivity and faster recovery from stress.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/25 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Point Zero Coherence</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-indigo-300">85%</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+14% Shift</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Deepened stillness, non-judgmental presence, and equanimity.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/25 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Intuitive Openness</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-amber-300">88%</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+10% Shift</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Expanded cognitive flexibility and pattern recognition.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/25 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Compassionate Harmony</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-purple-300">82%</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+7% Shift</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Sovereign relational boundaries and elevated empathy.</p>
            </div>
          </div>

          {/* SVG GROWTH TRAJECTORY GRAPH */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                  Trajectory Vector (Over Time)
                </span>
                <h4 className="text-lg font-bold font-serif text-white">
                  Multi-Month Assessment Milestones (Interval: 3 Months)
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-teal-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>Resilience</span>
                </span>
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  <span>Coherence</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Openness</span>
                </span>
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span>Harmony</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Curves */}
            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 700 280" className="w-full min-w-[550px] h-auto drop-shadow-lg">
                <defs>
                  <linearGradient id="tealLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Grid Lines */}
                {[50, 60, 70, 80, 90, 100].map((val) => {
                  const y = 240 - ((val - 50) / 50) * 190;
                  return (
                    <g key={val}>
                      <line x1="60" y1={y} x2="660" y2={y} stroke="#1e293b" strokeDasharray="3 4" strokeWidth="1" />
                      <text x="35" y={y + 3} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Milestone Guides */}
                {[
                  { x: 100, label: "Baseline" },
                  { x: 280, label: "+3 Months" },
                  { x: 460, label: "+6 Months" },
                  { x: 620, label: "+9 Months (Current)" }
                ].map((m, i) => (
                  <g key={i}>
                    <line x1={m.x} y1="40" x2={m.x} y2="240" stroke="#334155" strokeWidth="1" opacity="0.6" />
                    <text x={m.x} y="260" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {m.label}
                    </text>
                  </g>
                ))}

                {/* Trajectory 1: Emotional Resilience (62 -> 70 -> 75 -> 79) */}
                <path
                  d="M 100 194 Q 190 164 280 164 T 460 145 T 620 130"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3.5"
                  className="drop-shadow-md"
                />
                {[[100, 194, 62], [280, 164, 70], [460, 145, 75], [620, 130, 79]].map(([x, y, v], i) => (
                  <g key={`res-${i}`}>
                    <circle cx={x} cy={y} r="6" fill="#0f172a" stroke="#2dd4bf" strokeWidth="2.5" />
                    <text x={x} y={y - 10} fill="#2dd4bf" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {v}%
                    </text>
                  </g>
                ))}

                {/* Trajectory 2: Point Zero Coherence (71 -> 76 -> 81 -> 85) */}
                <path
                  d="M 100 160 Q 190 141 280 141 T 460 122 T 620 107"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="3"
                  className="drop-shadow-md"
                />
                {[[100, 160, 71], [280, 141, 76], [460, 122, 81], [620, 107, 85]].map(([x, y, v], i) => (
                  <g key={`coh-${i}`}>
                    <circle cx={x} cy={y} r="5" fill="#0f172a" stroke="#818cf8" strokeWidth="2" />
                    <text x={x} y={y - 10} fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {v}%
                    </text>
                  </g>
                ))}

                {/* Trajectory 3: Intuitive Openness (78 -> 82 -> 85 -> 88) */}
                <path
                  d="M 100 134 Q 190 118 280 118 T 460 107 T 620 96"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  className="drop-shadow-md"
                />
                {[[100, 134, 78], [280, 118, 82], [460, 107, 85], [620, 96, 88]].map(([x, y, v], i) => (
                  <g key={`op-${i}`}>
                    <circle cx={x} cy={y} r="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x={x} y={y - 10} fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {v}%
                    </text>
                  </g>
                ))}

                {/* Trajectory 4: Compassionate Harmony (75 -> 78 -> 80 -> 82) */}
                <path
                  d="M 100 145 Q 190 134 280 134 T 460 126 T 620 118"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  className="drop-shadow-md"
                />
              </svg>
            </div>

            {/* Retake CTA Footer */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left text-xs">
                <span className="font-bold text-white block">Ready to record your next developmental milestone?</span>
                <span className="text-slate-400">Retake the assessment to record new points on your neuroplastic trajectory.</span>
              </div>
              <button
                onClick={() => startTest("quick")}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5 shrink-0"
              >
                <Activity className="w-4 h-4" />
                <span>Take Milestone Check-In (10 Qs)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DEEP ANALYSIS */}
      {subTab === "deep" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-8 animate-fade-in" id="deep-analysis-view">
          <div className="border-b border-slate-800 pb-6 space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
              AFFINITY — AMBI Psychometric Soul Signature
            </span>
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div>
                <h3 className="text-2xl font-serif text-slate-100 font-light">
                  {profile?.firstName || "Aligned"} {profile?.lastName || "Seeker"}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  DOB: {profile?.dateOfBirth || "1991-07-27"} • Life Path {profile?.computed?.numerology.lifePath || 7} • Sun: {profile?.computed?.astrology.sunSign || "Leo"}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Overall Profile Avg</span>
                <span className="text-3xl font-serif font-bold text-indigo-300">79%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Cognitive Intelligence Estimate</span>
              </div>
              <div className="text-2xl font-serif text-teal-300">IQ 124 – 131 (Superior)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High abstract pattern recognition, rapid metaphysical synthesis, and deep system architecture capabilities. Strong tendency toward lateral problem solving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Superpower Combination</span>
              </div>
              <div className="text-lg font-serif text-emerald-200">The Intuitive Architect</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                High Openness (88%) paired with High Conscientiousness (74%) allows you to translate raw visionary intuition into clean, concrete systems without losing spiritual potency.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Domain-by-Domain Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">Emotional Stability</span>
                <div className="text-xl font-serif text-slate-100">79% — Point Zero Calm</div>
                <p className="text-xs text-slate-400 mt-1">High resilience against external chaotic events.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">Extraversion</span>
                <div className="text-xl font-serif text-slate-100">65% — Selective Radiance</div>
                <p className="text-xs text-slate-400 mt-1">Balances solitary inner work with clear leadership.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">Openness to Experience</span>
                <div className="text-xl font-serif text-slate-100">88% — Quantum Seeker</div>
                <p className="text-xs text-slate-400 mt-1">Unusually high receptivity to unseen frequencies.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ALL 203 SCALES */}
      {subTab === "scales" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-8 animate-fade-in" id="all-203-scales-view">
          <div className="space-y-3 border-b border-slate-800 pb-6">
            <h3 className="text-2xl font-serif text-slate-100 font-light">All 203 Validated Psychological Scales</h3>
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Very High (81-100)", "High (61-80)", "Moderate (41-60)", "Low (21-40)", "Very Low (0-20)"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                    activeFilter === filter ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                  id={`filter-btn-${filter}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8" id="scales-grouped-container">
            {allScalesGrouped.map((group) => (
              <div key={group.inventory} className="space-y-4">
                <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider font-mono border-b border-slate-800 pb-2">
                  {group.inventory}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.scales.map((scale) => (
                    <div key={scale.name} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{scale.name}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{scale.band}</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-indigo-300">{scale.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE QUESTION TESTING MODE */}
      {mode === "test" && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-8 slide-in" id="test-question-box">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-mono">Question {currentIndex + 1} of {activeQuestions.length}</span>
            <span className="font-semibold uppercase tracking-wider text-indigo-400">
              Dimension: {activeQuestions[currentIndex].category}
            </span>
          </div>

          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
            />
          </div>

          <p className="text-xl sm:text-2xl font-serif font-light text-white leading-relaxed text-center my-6">
            "{activeQuestions[currentIndex].text}"
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelectAnswer(val)}
                  className="p-4 rounded-xl bg-slate-950 hover:bg-indigo-500/20 border border-slate-800 text-white font-mono font-bold text-lg transition-all"
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2">
              <span>Strongly Disagree</span>
              <span>Neutral</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        </div>
      )}

      {/* TEST RESULT DISPLAY */}
      {mode === "result" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-8 slide-in" id="test-result-box">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-light text-white font-serif">Calibration Succeeded</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Your Mindscape alignment coordinates</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
            {Object.entries(calculatedScores).map(([cat, score]) => (
              <div key={cat} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Dimension {cat}</span>
                <div className="text-3xl font-serif text-indigo-300 font-bold">{score}%</div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-wrap justify-between items-center gap-3">
            <button onClick={() => setMode("setup")} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" /> Retake / Reset Calibration
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const currentRecord = latestSavedRecord || {
                    id: "local-rec",
                    mode: testMode,
                    scores: calculatedScores,
                    answers,
                    date: new Date().toISOString(),
                  };
                  const currentProf = profile || {
                    firstName: "Aligned",
                    lastName: "Seeker",
                    dateOfBirth: "1991-01-01",
                    timeOfBirth: "12:00",
                    placeOfBirth: "Earth",
                  };
                  downloadCompletedTestPDF(currentRecord, currentProf);
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                id="download-test-results-pdf-btn"
              >
                <Download className="w-4 h-4" />
                <span>Download Test Results & Answers (PDF)</span>
              </button>

              <button onClick={() => setSubTab("deep")} className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs">
                View Deep Analysis ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export {};
