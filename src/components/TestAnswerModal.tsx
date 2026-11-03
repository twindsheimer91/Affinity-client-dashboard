import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Brain, X, ArrowRight, Layers, FileCode } from "lucide-react";
import { MASTER_ASSESSMENT_QUESTIONS } from "../data/assessmentQuestions";
import { MBTI_QUESTIONS, MBTI_PROFILES } from "../data/mbtiData";
import { Profile } from "../types";

interface TestAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  defaultTestType?: "ambi" | "mbti";
  targetUserId?: string; // If manager is submitting for a client
  targetClientName?: string;
  profileSnapshot?: Profile | null;
  onSuccess?: () => void;
}

export default function TestAnswerModal({
  isOpen,
  onClose,
  token,
  defaultTestType = "ambi",
  targetUserId,
  targetClientName,
  profileSnapshot,
  onSuccess,
}: TestAnswerModalProps) {
  const [testType, setTestType] = useState<"ambi" | "mbti">(defaultTestType);
  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [parseResult, setParseResult] = useState<any>(null);

  // Manual Quick Input State
  const [ambiAnswers, setAmbiAnswers] = useState<Record<number, number>>({});
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, "A" | "B">>({});
  const [directMbtiType, setDirectMbtiType] = useState<string>("INFJ");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle file drop or selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setParseError("");
      setParseResult(null);

      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        processDocumentContent(text, file.name, file.type);
      };
      reader.onerror = () => {
        setParseError("Could not read file. You can paste the text answers below.");
      };
      reader.readAsText(file);
    }
  };

  const processDocumentContent = async (content: string, fileName: string, fileType: string) => {
    setParsing(true);
    setParseError("");

    try {
      const res = await fetch("/api/test/upload-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: content,
          fileName,
          fileType,
          testType,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze document.");
      }

      setParseResult(data.result);
      if (data.result.detectedTestType) {
        setTestType(data.result.detectedTestType);
      }
      if (data.result.mbtiType) {
        setDirectMbtiType(data.result.mbtiType);
      }
    } catch (err: any) {
      setParseError(err.message || "Failed to parse document. Please check text or enter manually.");
    } finally {
      setParsing(false);
    }
  };

  const handleParsePastedText = () => {
    if (!pastedText.trim()) return;
    processDocumentContent(pastedText, "pasted_text_input.txt", "text/plain");
  };

  // Quick fill all remaining AMBI answers
  const handleQuickFillAmbi = (rating: number) => {
    const updated = { ...ambiAnswers };
    MASTER_ASSESSMENT_QUESTIONS.forEach((q) => {
      updated[q.id] = rating;
    });
    setAmbiAnswers(updated);
  };

  // Save parsed or manual test results
  const handleSaveAssessment = async () => {
    setSaving(true);
    setParseError("");

    try {
      let isAmbi = testType === "ambi";
      let postUrl = "";
      let payload: any = {};

      if (targetUserId) {
        // Manager submitting for client
        postUrl = "/api/manager/submit-client-test";
        if (isAmbi) {
          const scores = parseResult?.ambiScores || computeAmbiScores(ambiAnswers);
          payload = {
            targetUserId,
            testType: "ambi",
            testData: {
              testTitle: selectedFile ? `Uploaded AMBI: ${selectedFile.name}` : "Manual Entry AMBI",
              mode: "master",
              scores,
              answers: parseResult?.answers || ambiAnswers,
              source: selectedFile ? "document_upload" : "manual",
              uploadedFileName: selectedFile?.name || null,
            },
            profileSnapshot,
          };
        } else {
          const finalMbtiType = parseResult?.mbtiType || directMbtiType;
          const scores = parseResult?.mbtiScores || computeMbtiScores(mbtiAnswers);
          payload = {
            targetUserId,
            testType: "mbti",
            testData: {
              mbtiType: finalMbtiType,
              scores,
              answers: parseResult?.answers || mbtiAnswers,
              source: selectedFile ? "document_upload" : "manual",
              uploadedFileName: selectedFile?.name || null,
            },
            profileSnapshot,
          };
        }
      } else {
        // Regular user submitting for themselves
        if (isAmbi) {
          postUrl = "/api/ambi-history";
          const scores = parseResult?.ambiScores || computeAmbiScores(ambiAnswers);
          payload = {
            mode: "full",
            testTitle: selectedFile ? `Ingested Document: ${selectedFile.name}` : "Manual Input AMBI",
            scores,
            answers: parseResult?.answers || ambiAnswers,
            profileSnapshot,
          };
        } else {
          postUrl = "/api/mbti/submit";
          const finalMbtiType = parseResult?.mbtiType || directMbtiType;
          const scores = parseResult?.mbtiScores || computeMbtiScores(mbtiAnswers);
          payload = {
            mbtiType: finalMbtiType,
            scores,
            answers: parseResult?.answers || mbtiAnswers,
            source: selectedFile ? "document_upload" : "manual",
            uploadedFileName: selectedFile?.name || null,
            profileSnapshot,
          };
        }
      }

      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const resJson = await response.json();
      if (!response.ok) {
        throw new Error(resJson.error || "Failed to save assessment");
      }

      setSaveSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } catch (err: any) {
      setParseError(err.message || "Failed to save test results");
    } finally {
      setSaving(false);
    }
  };

  const computeAmbiScores = (ans: Record<number, number>) => {
    const scores: Record<string, number[]> = { O: [], C: [], E: [], A: [], N: [], T: [], I: [] };
    MASTER_ASSESSMENT_QUESTIONS.forEach((q) => {
      const val = ans[q.id] || 3;
      const adjusted = q.reversed ? 6 - val : val;
      scores[q.category].push(adjusted);
    });
    const finalScores: Record<string, number> = {};
    Object.keys(scores).forEach((cat) => {
      const arr = scores[cat];
      const avg = arr.reduce((a, b) => a + b, 0) / (arr.length || 1);
      finalScores[cat] = Math.round(((avg - 1) / 4) * 80 + 20);
    });
    return finalScores;
  };

  const computeMbtiScores = (ans: Record<number, "A" | "B">) => {
    let eCount = 0, iCount = 0;
    let sCount = 0, nCount = 0;
    let tCount = 0, fCount = 0;
    let jCount = 0, pCount = 0;

    MBTI_QUESTIONS.forEach((q) => {
      const choice = ans[q.id];
      if (q.dichotomy === "EI") {
        if (choice === "A") eCount++;
        else if (choice === "B") iCount++;
      } else if (q.dichotomy === "SN") {
        if (choice === "A") sCount++;
        else if (choice === "B") nCount++;
      } else if (q.dichotomy === "TF") {
        if (choice === "A") tCount++;
        else if (choice === "B") fCount++;
      } else if (q.dichotomy === "JP") {
        if (choice === "A") jCount++;
        else if (choice === "B") pCount++;
      }
    });

    const calcPair = (a: number, b: number) => {
      const total = a + b || 1;
      const pctA = Math.round((a / total) * 100);
      return [pctA, 100 - pctA];
    };

    const [ePct, iPct] = calcPair(eCount, iCount);
    const [sPct, nPct] = calcPair(sCount, nCount);
    const [tPct, fPct] = calcPair(tCount, fCount);
    const [jPct, pPct] = calcPair(jCount, pCount);

    return { E: ePct, I: iPct, S: sPct, N: nPct, T: tPct, F: fPct, J: jPct, P: pPct };
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-teal-500/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-4 pr-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Input & Upload Test Answers
                {targetClientName && (
                  <span className="text-xs font-mono font-normal text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-500/30">
                    For: {targetClientName}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Upload Doc/Word/PDF forms or manually enter response codes
              </p>
            </div>
          </div>
        </div>

        {/* Test Type Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setTestType("ambi");
              setParseResult(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              testType === "ambi"
                ? "bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">AMBI Psychometric</div>
              <div className="text-[11px] text-slate-400">7-Dimensional Consciousness Matrix</div>
            </div>
          </button>

          <button
            onClick={() => {
              setTestType("mbti");
              setParseResult(null);
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
              testType === "mbti"
                ? "bg-purple-500/20 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Brain className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">Myers-Briggs (MBTI)</div>
              <div className="text-[11px] text-slate-400">16 Cognitive Archetypes & Stacks</div>
            </div>
          </button>
        </div>

        {/* Action Method Tabs: Upload vs Manual Entry */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2.5 text-xs font-medium tracking-wide border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-teal-400 text-teal-300 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document (PDF / Word / Doc)</span>
          </button>

          <button
            onClick={() => setActiveTab("manual")}
            className={`pb-2.5 text-xs font-medium tracking-wide border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "manual"
                ? "border-teal-400 text-teal-300 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Manual Quick Input Grid</span>
          </button>
        </div>

        {/* TAB 1: DOCUMENT UPLOAD */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            {/* File Drag/Drop Zone */}
            <div className="border-2 border-dashed border-teal-500/30 hover:border-teal-400/60 bg-teal-950/10 rounded-2xl p-6 text-center transition-all">
              <input
                type="file"
                id="doc-upload-input"
                accept=".pdf,.doc,.docx,.txt,.json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="doc-upload-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-md">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-white">
                  {selectedFile ? selectedFile.name : "Choose or drag test document here"}
                </div>
                <div className="text-xs text-slate-400">
                  Supports PDF forms, Word (.docx / .doc), plain text, and question answer slips
                </div>
                <span className="mt-2 py-1.5 px-3 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 text-xs font-mono border border-teal-500/40">
                  Select File
                </span>
              </label>
            </div>

            {/* Paste Text Fallback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Or Paste Document Content / Raw Answers</span>
                <span className="text-[10px] text-slate-500 font-mono">e.g. "Q1: 5, Q2: 4" or "Type: INFJ"</span>
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste questions and answers, scanned test text, or assessment summaries here..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 font-mono"
              />
              {pastedText.trim() && (
                <button
                  onClick={handleParsePastedText}
                  disabled={parsing}
                  className="py-1.5 px-3 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 text-xs font-mono border border-teal-500/40 flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Parse Pasted Content with AI</span>
                </button>
              )}
            </div>

            {/* Parsing State */}
            {parsing && (
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center gap-3 animate-pulse">
                <Sparkles className="w-5 h-5 text-teal-300 animate-spin" />
                <div className="text-xs text-teal-200">
                  Synthesizing and extracting assessment answers with AI ingestion engine...
                </div>
              </div>
            )}

            {/* Parse Error */}
            {parseError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{parseError}</span>
              </div>
            )}

            {/* Parsed Result Preview */}
            {parseResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Document Parsed Successfully</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {Math.round((parseResult.confidence || 0.9) * 100)}%
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {parseResult.summary}
                </div>

                {parseResult.detectedTestType === "mbti" && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">Detected MBTI Type:</span>
                      <span className="text-base font-bold font-mono text-purple-300 px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40">
                        {parseResult.mbtiType}
                      </span>
                    </div>
                    {parseResult.mbtiScores && (
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono pt-1">
                        <div className="p-1 rounded bg-slate-900 border border-slate-800">
                          E: {parseResult.mbtiScores.E}% | I: {parseResult.mbtiScores.I}%
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-slate-800">
                          S: {parseResult.mbtiScores.S}% | N: {parseResult.mbtiScores.N}%
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-slate-800">
                          T: {parseResult.mbtiScores.T}% | F: {parseResult.mbtiScores.F}%
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-slate-800">
                          J: {parseResult.mbtiScores.J}% | P: {parseResult.mbtiScores.P}%
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {parseResult.detectedTestType === "ambi" && parseResult.ambiScores && (
                  <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-2">
                    <span className="text-xs text-slate-400 font-mono block">Extracted Dimensional Scores:</span>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
                      {Object.entries(parseResult.ambiScores).map(([k, v]: [string, any]) => (
                        <div key={k} className="p-1.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-teal-400 font-bold block">{k}</span>
                          <span className="text-slate-200">{v}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MANUAL QUICK INPUT */}
        {activeTab === "manual" && (
          <div className="space-y-4">
            {testType === "mbti" ? (
              <div className="space-y-4">
                {/* Direct Type Quick Selector */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/20 space-y-2">
                  <label className="text-xs font-semibold text-purple-300 block">
                    Direct Select 16-Personality Type:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 font-mono text-xs">
                    {Object.keys(MBTI_PROFILES).map((t) => (
                      <button
                        key={t}
                        onClick={() => setDirectMbtiType(t)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          directMbtiType === t
                            ? "bg-purple-600 text-white font-bold border-purple-400 shadow-md"
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Selected: <strong className="text-purple-300">{directMbtiType}</strong> — {MBTI_PROFILES[directMbtiType]?.title} ({MBTI_PROFILES[directMbtiType]?.nickname})
                  </div>
                </div>

                {/* 20 Questions A / B quick inputs */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  <div className="text-xs font-semibold text-slate-300">
                    Or select answers to the 20 questionnaire items:
                  </div>
                  {MBTI_QUESTIONS.map((q) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <div className="text-slate-300 text-[11px]">
                        <strong className="text-purple-400">Q{q.id}.</strong> {q.question}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setMbtiAnswers({ ...mbtiAnswers, [q.id]: "A" })}
                          className={`p-1.5 rounded text-left text-[10px] border transition-all ${
                            mbtiAnswers[q.id] === "A"
                              ? "bg-purple-500/25 border-purple-400 text-purple-200 font-semibold"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <strong>[A]</strong> {q.optionA}
                        </button>
                        <button
                          onClick={() => setMbtiAnswers({ ...mbtiAnswers, [q.id]: "B" })}
                          className={`p-1.5 rounded text-left text-[10px] border transition-all ${
                            mbtiAnswers[q.id] === "B"
                              ? "bg-purple-500/25 border-purple-400 text-purple-200 font-semibold"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          <strong>[B]</strong> {q.optionB}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Enter answers (1-5 rating scale):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Quick fill all:</span>
                    {[3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleQuickFillAmbi(val)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-mono border border-slate-700"
                      >
                        All {val}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of 30 questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {MASTER_ASSESSMENT_QUESTIONS.map((q) => {
                    const currentVal = ambiAnswers[q.id] || 3;
                    return (
                      <div key={q.id} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-300 truncate max-w-[190px]">
                            <strong className="text-teal-400">Q{q.id}.</strong> {q.text}
                          </span>
                          <span className="font-mono text-teal-300 font-bold px-1.5 py-0.5 rounded bg-teal-950 border border-teal-500/30">
                            {currentVal}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 pt-0.5">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmbiAnswers({ ...ambiAnswers, [q.id]: val })}
                              className={`py-1 rounded text-center font-mono text-[10px] border transition-all ${
                                currentVal === val
                                  ? "bg-teal-500 text-slate-950 font-bold border-teal-300 shadow-sm"
                                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success message */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-400 text-teal-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal-400" />
            <span>Test successfully saved and synthesized to the site repository!</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAssessment}
            disabled={saving || saveSuccess}
            className="py-2.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
          >
            {saving ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Saving Assessment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Assessment Answers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
