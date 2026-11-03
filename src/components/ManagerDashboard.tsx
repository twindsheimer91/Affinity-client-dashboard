import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  ShieldAlert,
  Users, 
  FileText, 
  Brain, 
  Download, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Award, 
  Activity, 
  Database, 
  Eye, 
  X,
  UserCheck,
  CheckCircle2,
  Copy,
  Upload,
  FileCode,
  MessageSquare,
  KeyRound,
  Compass,
  Sun,
  ArrowRight,
  Edit,
  Bot,
  Cpu,
  AlertTriangle,
  Send,
  Check,
  Heart
} from "lucide-react";
import { Profile, User, AmbiRecord, ManagerOverviewData, ManagerProfileItem } from "../types";
import { MASTER_ASSESSMENT_QUESTIONS, ASSESSMENT_DIMENSIONS, SCALE_RATING_GUIDE } from "../data/assessmentQuestions";
import { 
  downloadBlankAmbi181Pdf, 
  downloadBlankMbtiPdf, 
  downloadBlankTestQuestionsPDF, 
  downloadCompletedTestPDF, 
  downloadProfileFullDossierPDF, 
  downloadEditablePsychometricPDF, 
  downloadEditableMbtiPDF 
} from "../utils/pdfGenerator";
import TestAnswerModal from "./TestAnswerModal";

interface ManagerDashboardProps {
  token: string | null;
  currentUser: User | null;
  onSelectProfileToView: (profile: Profile) => void;
  onExitManager: () => void;
}

export default function ManagerDashboard({
  token,
  currentUser,
  onSelectProfileToView,
  onExitManager,
}: ManagerDashboardProps) {
  const MASTER_MANAGER_EMAIL = "affinitylifestyleconsulting@gmail.com";
  const isAuthorized = (currentUser?.email || "").toLowerCase().trim() === MASTER_MANAGER_EMAIL;

  const [activeTab, setActiveTab] = useState<
    "overview" | "profiles" | "submissions" | "questions" | "database" | "provision" | "system-checker" | "elara-dossier"
  >("overview");
  const [data, setData] = useState<ManagerOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Test Answer Input & Upload Modal state for Manager
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testModalTargetId, setTestModalTargetId] = useState<string | undefined>(undefined);
  const [testModalTargetName, setTestModalTargetName] = useState<string | undefined>(undefined);
  const [testModalDefaultType, setTestModalDefaultType] = useState<"ambi" | "mbti">("ambi");
  const [submissionSubTab, setSubmissionSubTab] = useState<"ambi" | "mbti">("ambi");

  // Client Profile Direct Editing state
  const [editingClient, setEditingClient] = useState<ManagerProfileItem | null>(null);
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editTob, setEditTob] = useState("12:00");
  const [editPob, setEditPob] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // AI System Checker state
  const [systemChecks, setSystemChecks] = useState<any | null>(null);
  const [checkingSystem, setCheckingSystem] = useState(false);

  // AI Support Hub (Acting as Tiffany) with Identity Verification state
  const [hubQuery, setHubQuery] = useState("");
  const [hubClientEmail, setHubClientEmail] = useState("");
  const [hubClientDob, setHubClientDob] = useState("");
  const [hubLoading, setHubLoading] = useState(false);
  const [hubResult, setHubResult] = useState<any | null>(null);
  const [hubError, setHubError] = useState("");

  // In-Depth Elara Soul Dossier ("Old Friend" Voice) state
  const [dossierPrimaryClient, setDossierPrimaryClient] = useState<string>("");
  const [dossierCompareClient, setDossierCompareClient] = useState<string>("");
  const [dossierRelType, setDossierRelType] = useState<string>("partner");
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierOutput, setDossierOutput] = useState<string | null>(null);
  const [dossierCopied, setDossierCopied] = useState(false);

  // Provisioning Account Form state
  const [provUsername, setProvUsername] = useState("");
  const [provPassword, setProvPassword] = useState("");
  const [provFirstName, setProvFirstName] = useState("");
  const [provLastName, setProvLastName] = useState("");
  const [provDob, setProvDob] = useState("");
  const [provTob, setProvTob] = useState("12:00");
  const [provPob, setProvPob] = useState("");
  const [provLoading, setProvLoading] = useState(false);
  const [provError, setProvError] = useState("");
  const [provSuccessReceipt, setProvSuccessReceipt] = useState<any | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  
  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [questionCategoryFilter, setQuestionCategoryFilter] = useState<string>("All");
  
  // Expanded submissions state
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);
  
  // Modal for inspecting single profile
  const [selectedProfileModal, setSelectedProfileModal] = useState<ManagerProfileItem | null>(null);

  const handleCreateUserAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvError("");
    setProvSuccessReceipt(null);

    if (!provUsername.trim() || !provPassword.trim()) {
      setProvError("Username and temporary password are required.");
      return;
    }

    setProvLoading(true);

    try {
      const res = await fetch("/api/manager/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          username: provUsername.trim(),
          password: provPassword.trim(),
          firstName: provFirstName.trim() || undefined,
          lastName: provLastName.trim() || undefined,
          dateOfBirth: provDob || undefined,
          timeOfBirth: provTob || undefined,
          placeOfBirth: provPob.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to provision account");
      }

      setProvSuccessReceipt(json.createdUser);
      // Reset form
      setProvUsername("");
      setProvPassword("");
      setProvFirstName("");
      setProvLastName("");
      setProvDob("");
      setProvTob("12:00");
      setProvPob("");
      // Refresh list
      fetchOverview();
    } catch (err: any) {
      setProvError(err.message || "Failed to create user account.");
    } finally {
      setProvLoading(false);
    }
  };

  const fetchOverview = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/manager/overview", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch manager data");
      }
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to load manager portal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [token]);

  // Filtered Profiles
  const filteredProfiles = (data?.profiles || []).filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${item.profile?.firstName || ""} ${item.profile?.lastName || ""}`.toLowerCase();
    const email = (item.email || "").toLowerCase();
    const dob = (item.profile?.dateOfBirth || "").toLowerCase();
    const sign = (item.profile?.computed?.astrology?.sunSign || "").toLowerCase();

    const matchesSearch = !q || fullName.includes(q) || email.includes(q) || dob.includes(q) || sign.includes(q);
    const matchesRole = roleFilter === "All" || item.source === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Filtered Submissions
  const filteredSubmissions = (data?.tests || []).filter((test) => {
    const q = searchQuery.toLowerCase().trim();
    const name = (test.profileName || "").toLowerCase();
    const email = (test.userEmail || "").toLowerCase();
    const mode = (test.mode || "").toLowerCase();

    return !q || name.includes(q) || email.includes(q) || mode.includes(q);
  });

  // Filtered Questions
  const filteredQuestions = MASTER_ASSESSMENT_QUESTIONS.filter((q) => {
    const matchesCategory = questionCategoryFilter === "All" || q.category === questionCategoryFilter;
    const matchesSearch = !searchQuery || q.text.toLowerCase().includes(searchQuery.toLowerCase()) || q.subscale.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExportFullDatabaseJSON = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affinity_master_site_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white" id="manager-access-denied">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-red-500/40 text-center space-y-5 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-serif text-white tracking-wide">Manager Access Restricted</h2>
            <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/40 font-bold inline-block">
              Exclusive Administrator Barrier
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            The Executive Manager Portal and site registry are strictly reserved for the platform administrator (<strong className="text-teal-300">{MASTER_MANAGER_EMAIL}</strong>). Your active account does not have administrative clearance.
          </p>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
            Current Profile: <span className="text-slate-200">{currentUser?.email || currentUser?.username || "Guest Seeker"}</span>
          </div>
          <button
            onClick={onExitManager}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white font-semibold text-xs border border-teal-500/30 transition-all shadow-lg flex items-center justify-center gap-2"
            id="return-to-portal-btn"
          >
            <span>Return to Seeker Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-6" id="manager-portal">
      {/* TOP EXECUTIVE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-teal-500/30 shadow-2xl backdrop-blur-md" id="manager-header-bar">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
            alt="Affinity Lifestyle Consulting" 
            className="h-12 w-auto object-contain bg-white/95 p-1 rounded-xl border border-teal-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-serif font-light text-white tracking-wide">
                AFFINITY <span className="text-teal-300 font-normal">Executive Command Center</span>
              </h1>
              <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/40 font-bold">
                Master Administrator
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Authorized Owner: <strong className="text-slate-200">{currentUser?.email || MASTER_MANAGER_EMAIL}</strong> • Full Platform Audit & Registered Profiles Oversight
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Download Blank 181-Q AMBI Assessment PDF button */}
          <button
            onClick={() => downloadBlankAmbi181Pdf()}
            className="px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-teal-500/20 flex items-center gap-1.5"
            id="manager-download-ambi-btn"
            title="Download blank, editable 181-question AMBI assessment booklet (GVA-001 format)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Blank 181-Q AMBI (PDF)</span>
          </button>

          {/* Download Blank Myers-Briggs MBTI Assessment PDF button */}
          <button
            onClick={() => downloadBlankMbtiPdf()}
            className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
            id="manager-download-mbti-btn"
            title="Download blank, editable Myers-Briggs (MBTI) 20-question cognitive assessment form"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Blank Myers-Briggs MBTI (PDF)</span>
          </button>

          <button
            onClick={fetchOverview}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Refresh Site Telemetry"
            id="manager-refresh-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-teal-400" : ""}`} />
          </button>

          <button
            onClick={onExitManager}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white font-medium text-xs transition-all border border-teal-500/30"
            id="manager-exit-portal-btn"
          >
            Exit to Seeker View ➔
          </button>
        </div>
      </div>

      {/* QUICK STATS CARDS - 6 COMPREHENSIVE KPIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4" id="manager-stats-row">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Total Profiles</span>
          <div className="text-2xl font-serif text-white font-bold">{data?.stats.totalProfiles ?? "..."}</div>
          <p className="text-[10px] text-slate-500">All registered & guests</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-teal-400 tracking-wider">Registered Accounts</span>
          <div className="text-2xl font-serif text-teal-300 font-bold">{data?.stats.totalUsers ?? "..."}</div>
          <p className="text-[10px] text-slate-500">Verified platform members</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-purple-400 tracking-wider">Provisioned Clients</span>
          <div className="text-2xl font-serif text-purple-300 font-bold">{data?.stats.totalProvisionedAccounts ?? 0}</div>
          <p className="text-[10px] text-slate-500">Manager-created logins</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-amber-400 tracking-wider">Guest Portals</span>
          <div className="text-2xl font-serif text-amber-300 font-bold">{data?.stats.totalGuests ?? "..."}</div>
          <p className="text-[10px] text-slate-500">Instant anonymous sessions</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-sky-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-sky-400 tracking-wider">AMBI Psychometrics</span>
          <div className="text-2xl font-serif text-sky-300 font-bold">{data?.stats.totalTests ?? "..."}</div>
          <p className="text-[10px] text-slate-500">Full answers recorded</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-1">
          <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">Myers-Briggs MBTI</span>
          <div className="text-2xl font-serif text-indigo-300 font-bold">{data?.stats.totalMbtiTests ?? 0}</div>
          <p className="text-[10px] text-slate-500">16-personality typologies</p>
        </div>
      </div>

      {/* NAVIGATION TABS & SEARCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4" id="manager-nav-bar">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-overview-btn"
          >
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Master Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("profiles")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "profiles"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-profiles-btn"
          >
            <Users className="w-4 h-4" />
            <span>All Profiles ({data?.profiles?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "submissions"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-submissions-btn"
          >
            <FileText className="w-4 h-4" />
            <span>Test Results & Answers ({data?.tests?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "questions"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-questions-btn"
          >
            <Brain className="w-4 h-4" />
            <span>Test Questions Bank ({MASTER_ASSESSMENT_QUESTIONS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("provision")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "provision"
                ? "bg-purple-500/25 text-purple-200 border border-purple-500/40 shadow-sm"
                : "text-slate-400 hover:text-purple-300"
            }`}
            id="tab-provision-btn"
          >
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span>Provision Client Account</span>
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "database"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
            id="tab-database-btn"
          >
            <Database className="w-4 h-4" />
            <span>System Persistence</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search profiles, tests, questions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            id="manager-search-input"
          />
        </div>
      </div>

      {/* ERROR MESSAGE IF ANY */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* TAB 0: MASTER EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6" id="manager-overview-view">
          {/* Executive Quick Launcher Hub */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="overview-quick-launchers">
            <div 
              onClick={() => setActiveTab("provision")}
              className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-3 group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">Provision Client Account</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Set up a user account using a custom username and temporary password.
              </p>
              <span className="text-[10px] font-mono text-purple-400 mt-3 inline-flex items-center gap-1 font-semibold">
                Open Provisioner ➔
              </span>
            </div>

            <div 
              onClick={() => {
                setTestModalTargetId(undefined);
                setTestModalTargetName(undefined);
                setTestModalOpen(true);
              }}
              className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30 hover:border-teal-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-200 transition-colors">Input / Upload Test Answers</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Upload PDF/Word documents or manually input answers for AMBI or MBTI.
              </p>
              <span className="text-[10px] font-mono text-teal-400 mt-3 inline-flex items-center gap-1 font-semibold">
                Launch Input Modal ➔
              </span>
            </div>

            <div 
              className="p-5 rounded-2xl bg-gradient-to-br from-sky-950/40 to-slate-900 border border-sky-500/30 hover:border-sky-400 transition-all shadow-lg space-y-3"
              id="admin-blank-assessments-card"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-sky-400 uppercase font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                  Client PDF Banks
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Download Blank Assessments</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Printable examination forms with blank, unchecked boxes, logo banner, and IP notice.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => downloadBlankAmbi181Pdf()}
                  className="w-full py-2 px-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  id="admin-card-download-ambi-btn"
                  title="Download blank, editable 181-Question AMBI Assessment PDF"
                >
                  <Download className="w-3.5 h-3.5 text-teal-300" />
                  <span>Download Blank AMBI (181-Q)</span>
                </button>
                <button
                  onClick={() => downloadBlankMbtiPdf()}
                  className="w-full py-2 px-3 rounded-xl bg-purple-500/25 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                  id="admin-card-download-mbti-btn"
                  title="Download blank, editable Myers-Briggs (MBTI) 20-Question Cognitive Profile PDF"
                >
                  <Download className="w-3.5 h-3.5 text-purple-300" />
                  <span>Download Blank Myers-Briggs (MBTI)</span>
                </button>
              </div>
            </div>

            <div 
              onClick={handleExportFullDatabaseJSON}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">Export Site Database</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Download complete JSON snapshot of all registered seekers, tests, and posts.
              </p>
              <span className="text-[10px] font-mono text-indigo-400 mt-3 inline-flex items-center gap-1 font-semibold">
                Download JSON Backup ➔
              </span>
            </div>
          </div>

          {/* REGISTERED PROFILES ROSTER OVERVIEW */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-300" />
                  <span>Master Roster of Registered Profiles ({filteredProfiles.length})</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  All accounts, provisioned client logins, guest portals, and third-party subjects on this portal.
                </p>
              </div>

              {/* Source filter tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {["All", "Registered User", "Provisioned Account", "Guest Account", "Inputted Guest Subject"].map((src) => (
                  <button
                    key={src}
                    onClick={() => setRoleFilter(src)}
                    className={`px-3 py-1 rounded-lg border text-xs transition-all ${
                      roleFilter === src
                        ? "bg-teal-500/20 border-teal-500/40 text-teal-300 font-semibold"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Profiles Table View */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Seeker Name & Login</th>
                    <th className="p-3.5">Account Type</th>
                    <th className="p-3.5">Birth Coordinates</th>
                    <th className="p-3.5">Soul Blueprint Summary</th>
                    <th className="p-3.5">Assessments</th>
                    <th className="p-3.5 text-right">Manager Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProfiles.slice(0, 15).map((item, index) => {
                    const p = item.profile;
                    const comp = p?.computed;

                    return (
                      <tr key={`overview-row-${item.userId}-${index}`} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-semibold text-white">
                            {p?.firstName} {p?.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                            {item.email} {item.username ? `(@${item.username})` : ""}
                          </div>
                          {item.mustAddEmail && (
                            <span className="text-[9px] font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded inline-block mt-0.5">
                              Setup Incomplete (Needs Email)
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                            item.source === "Registered User"
                              ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                              : item.source === "Master Manager" || item.source === "Manager"
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : item.source === "Provisioned Account"
                              ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                              : item.source === "Inputted Guest Subject"
                              ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}>
                            {item.source}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono text-[11px] text-slate-400">
                          <div>{p?.dateOfBirth || "N/A"}</div>
                          <div className="text-slate-500 truncate max-w-[150px]">{p?.placeOfBirth || "Coordinates pending"}</div>
                        </td>

                        <td className="p-3.5">
                          {comp ? (
                            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                              <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                                LP {comp.numerology?.lifePath}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-300 font-mono">
                                {comp.astrology?.sunSign}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-mono">
                                {comp.humanDesign?.type}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 italic">Blueprint Pending</span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono text-[11px]">
                          <span className="text-teal-300 font-bold">{item.testCount || 0} AMBI</span>
                          {item.mbtiCount !== undefined && (
                            <span className="text-indigo-300 font-bold ml-2">• {item.mbtiCount} MBTI</span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setTestModalTargetId(item.userId);
                                setTestModalTargetName(`${p?.firstName} ${p?.lastName}`);
                                setTestModalOpen(true);
                              }}
                              className="p-1.5 px-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 transition-all text-xs flex items-center gap-1 font-mono"
                              title="Input or Upload test answers for this client"
                            >
                              <FileCode className="w-3.5 h-3.5 text-purple-300" />
                              <span>Input Test</span>
                            </button>

                            <button
                              onClick={() => setSelectedProfileModal(item)}
                              className="p-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                              title="Inspect Full Profile Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onSelectProfileToView(p)}
                              className="p-1.5 px-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 transition-all text-xs font-mono"
                              title="Switch Portal to View as This Seeker"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredProfiles.length > 15 && (
              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveTab("profiles")}
                  className="text-xs font-mono text-teal-300 hover:text-teal-200 transition-colors"
                >
                  View all {filteredProfiles.length} profiles in the Profiles Directory ➔
                </button>
              </div>
            )}
          </div>

          {/* REAL-TIME SITE ACTIVITY AUDIT STREAM */}
          {data?.recentActivity && data.recentActivity.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl" id="overview-recent-activity">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white font-serif flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-300" />
                    <span>Real-Time Site Telemetry & Activity Stream</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Live events recorded across registrations, test assessments, and community sanctuary.
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  Live Audit Feed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.recentActivity.slice(0, 10).map((act, i) => (
                  <div key={`activity-${i}`} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      act.type === "signup"
                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        : act.type === "ambi"
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                        : act.type === "mbti"
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                        : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                    }`}>
                      {act.type === "signup" && <UserCheck className="w-4 h-4" />}
                      {act.type === "ambi" && <Activity className="w-4 h-4" />}
                      {act.type === "mbti" && <Brain className="w-4 h-4" />}
                      {act.type === "community" && <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{act.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{act.subtitle}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                        {new Date(act.time).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 1: ALL PROFILES DIRECTORY */}
      {activeTab === "profiles" && (
        <div className="space-y-4" id="manager-profiles-view">
          {/* Sub-filter bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-mono">Source Filter:</span>
            {["All", "Registered User", "Guest Account", "Inputted Guest Subject", "Manager"].map((src) => (
              <button
                key={src}
                onClick={() => setRoleFilter(src)}
                className={`px-3 py-1 rounded-lg border text-xs transition-all ${
                  roleFilter === src
                    ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {src}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="profiles-grid">
            {filteredProfiles.map((item, index) => {
              const p = item.profile;
              const comp = p?.computed;
              const isGuest = item.isGuest;

              return (
                <div
                  key={`${item.userId}-${index}`}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/30 transition-all space-y-4 shadow-lg group relative"
                  id={`profile-card-${index}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white">
                          {p?.firstName} {p?.lastName}
                        </h3>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                          item.source === "Registered User"
                            ? "bg-teal-500/15 text-teal-300 border-teal-500/30"
                            : item.source === "Manager"
                            ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                            : item.source === "Inputted Guest Subject"
                            ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}>
                          {item.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.email}</p>
                    </div>

                    <button
                      onClick={() => setSelectedProfileModal(item)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs"
                      title="Inspect Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cosmic Badges */}
                  {comp && (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Life Path</span>
                        <span className="font-serif font-bold text-amber-300 text-sm">{comp.numerology.lifePath}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">Sun Sign</span>
                        <span className="font-serif font-bold text-teal-300 text-xs">{comp.astrology.sunSign}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[9px] text-slate-500 block uppercase font-mono">HD Type</span>
                        <span className="font-serif font-bold text-indigo-300 text-[11px] truncate block">{comp.humanDesign.type}</span>
                      </div>
                    </div>
                  )}

                  {/* Birth coordinates */}
                  <div className="text-[11px] text-slate-400 space-y-1 font-mono pt-1 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>DOB: {p?.dateOfBirth} ({p?.timeOfBirth || "12:00"})</span>
                    </div>
                    {p?.placeOfBirth && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{p.placeOfBirth}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => onSelectProfileToView(p)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                      id={`view-in-app-${index}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View in Portal</span>
                    </button>

                    <button
                      onClick={() => {
                        setTestModalTargetId(item.userId);
                        setTestModalTargetName(`${p?.firstName} ${p?.lastName}`);
                        setTestModalOpen(true);
                      }}
                      className="p-1.5 px-2.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 transition-all text-xs flex items-center gap-1"
                      title="Input or Upload test answers (AMBI or MBTI) for this client"
                    >
                      <FileCode className="w-3.5 h-3.5 text-purple-300" />
                      <span>Input Tests</span>
                    </button>

                    <button
                      onClick={() => downloadProfileFullDossierPDF(p, item.latestTest ? [item.latestTest] : [])}
                      className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
                      title="Download Profile Dossier (PDF)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="p-12 text-center text-slate-500 rounded-3xl bg-slate-900/40 border border-slate-800 font-mono text-xs">
              No profiles match your search criteria.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEST SUBMISSIONS & QUESTION-BY-QUESTION RESULTS */}
      {activeTab === "submissions" && (
        <div className="space-y-4" id="manager-submissions-view">
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Every completed psychometric test is permanently archived here with full questions and user answers.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadBlankAmbi181Pdf()}
                className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Download Blank 181-Question AMBI PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Blank AMBI (181-Q)</span>
              </button>
              <button
                onClick={() => downloadBlankMbtiPdf()}
                className="px-3 py-1.5 rounded-lg bg-purple-500/25 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Download Blank Myers-Briggs MBTI PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Blank MBTI Form</span>
              </button>
            </div>
          </div>

          <div className="space-y-3" id="submissions-list">
            {filteredSubmissions.map((sub, index) => {
              const isExpanded = expandedSubmissionId === sub.id;
              const answeredCount = sub.answers ? Object.keys(sub.answers).length : 0;

              return (
                <div
                  key={sub.id || index}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg transition-all"
                  id={`submission-item-${index}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-white">
                          {sub.profileName || "Seeker"}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase font-bold">
                          {sub.testTitle || `Mode: ${sub.mode}`}
                        </span>
                        {sub.isGuest && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            Guest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        DOB: {sub.profileDob || "N/A"} • Submitted: {new Date(sub.date).toLocaleString()} • User: {sub.userEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const mockProfile: Profile = {
                            firstName: (sub.profileName || "Seeker").split(" ")[0] || "Seeker",
                            lastName: (sub.profileName || "").split(" ")[1] || "",
                            dateOfBirth: sub.profileDob || "1990-01-01",
                            timeOfBirth: "12:00",
                            placeOfBirth: "Earth",
                          };
                          downloadCompletedTestPDF(sub, mockProfile);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Results (PDF)
                      </button>

                      <button
                        onClick={() => setExpandedSubmissionId(isExpanded ? null : sub.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                      >
                        <span>{isExpanded ? "Hide Questions" : `View Answers (${answeredCount})`}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Score breakdown pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
                    {Object.entries(sub.scores || {}).map(([dim, score]) => (
                      <div key={dim} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
                        <span className="text-[9px] uppercase font-mono text-slate-400 block">Dim {dim}</span>
                        <span className="text-base font-serif font-bold text-teal-300">{score}%</span>
                      </div>
                    ))}
                  </div>

                  {/* EXPANDED QUESTIONS & ANSWERS TABLE */}
                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
                        <span>DETAILED QUESTION RESPONSE AUDIT</span>
                        <span>Scale: 1 (Strongly Disagree) to 5 (Strongly Agree)</span>
                      </div>

                      {sub.answers && Object.keys(sub.answers).length > 0 ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                          {Object.entries(sub.answers).map(([qIdStr, userVal]) => {
                            const qId = Number(qIdStr);
                            const qObj = MASTER_ASSESSMENT_QUESTIONS.find((q) => q.id === qId);
                            const ratingLabel = SCALE_RATING_GUIDE.find((s) => s.value === userVal)?.label || `Score ${userVal}`;

                            return (
                              <div key={qId} className="p-3 rounded-lg bg-slate-900 border border-slate-800/70 flex items-start justify-between gap-3 text-xs">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-teal-400">Q{qId}.</span>
                                    <span className="text-slate-200">{qObj?.text || `Test question statement #${qId}`}</span>
                                  </div>
                                  {qObj && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      [Category: {qObj.categoryName} • {qObj.subscale}]
                                    </span>
                                  )}
                                </div>

                                <div className="p-1.5 px-3 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono font-bold text-center shrink-0">
                                  <div>Ans: {userVal}/5</div>
                                  <div className="text-[9px] font-normal text-slate-400">{ratingLabel}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 font-mono">No individual question breakdown recorded for this submission.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="p-12 text-center text-slate-500 rounded-3xl bg-slate-900/40 border border-slate-800 font-mono text-xs">
              No test submissions recorded yet. Take an assessment in the Psychometric tab to generate records.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TEST QUESTIONS BANK */}
      {activeTab === "questions" && (
        <div className="space-y-6" id="manager-questions-view">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-serif text-white font-light">
                  Master Psychometric Question Repository ({MASTER_ASSESSMENT_QUESTIONS.length} Questions)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  Synthesized across NEO PI-R, HEXACO, MPQ, TCI, CSQ, BFI-2, EPQ-R, and 16PF. Every question is fully exportable into a printable examination PDF.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadEditablePsychometricPDF()}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                  id="download-master-questions-pdf-btn"
                  title="Download editable 181-question interactive form PDF with blank unchecked boxes"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blank AMBI 181-Q (PDF)</span>
                </button>

                <button
                  onClick={() => downloadEditableMbtiPDF()}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                  id="download-mbti-questions-pdf-btn"
                  title="Download blank, editable 20-question Myers-Briggs form PDF with unchecked boxes"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Blank Myers-Briggs MBTI (PDF)</span>
                </button>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-slate-500 text-xs font-mono">Dimension Filter:</span>
              <button
                onClick={() => setQuestionCategoryFilter("All")}
                className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                  questionCategoryFilter === "All"
                    ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                All Dimensions ({MASTER_ASSESSMENT_QUESTIONS.length})
              </button>
              {Object.entries(ASSESSMENT_DIMENSIONS).map(([key, dim]) => (
                <button
                  key={key}
                  onClick={() => setQuestionCategoryFilter(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                    questionCategoryFilter === key
                      ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Dim {key}: {dim.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-3" id="questions-list">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-teal-400 text-sm">Q{q.id}.</span>
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-teal-300 px-2 py-0.5 rounded border border-slate-700">
                      Dim {q.category} • {q.categoryName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{q.dimension}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono italic">
                    {q.subscale}
                  </span>
                </div>

                <p className="text-sm font-serif font-light text-slate-100 pl-6 leading-relaxed">
                  "{q.text}"
                </p>

                <div className="pl-6 pt-1 flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                  <span>Standard 1-5 Likert scale</span>
                  <span>•</span>
                  <span>Scoring: Forward Direction (1 to 5)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE & PERSISTENCE */}
      {activeTab === "database" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6" id="manager-database-view">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-xl font-serif text-white font-light">Site Database & Persistence Architecture</h3>
              <p className="text-xs text-slate-400 mt-1">
                Data is saved directly to local persistent JSON storage (`src/data/db.json`). All users, guests, profiles, test submissions, and questions are fully preserved across restarts.
              </p>
            </div>

            <button
              onClick={handleExportFullDatabaseJSON}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Entire Database (JSON)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-teal-400 font-bold">1. Users Collection</span>
              <div className="text-2xl font-serif text-white font-bold">{data?.profiles?.length || 0} Records</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores registered user credentials, guest sessions, and their computed cosmic blueprints (Numerology, Astrology, Human Design, Gene Keys, Aura).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-indigo-400 font-bold">2. Tests Submissions Collection</span>
              <div className="text-2xl font-serif text-white font-bold">{data?.tests?.length || 0} Records</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores all psychometric examinations completed with individual question-by-question choices (1-5), dimensional scores, and candidate snapshots.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold">3. Guest Subjects Collection</span>
              <div className="text-2xl font-serif text-white font-bold">{data?.guestSubjects?.length || 0} Records</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores temporary and secondary profiles inputted for other people/guests so they can be switched to or examined anytime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROVISION USER ACCOUNT */}
      {activeTab === "provision" && (
        <div className="space-y-6" id="manager-provision-view">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>MANAGER ACCOUNT PROVISIONING</span>
                </div>
                <h3 className="text-xl font-serif text-white font-light">Provision New User Account</h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Create an account using a custom username and initial password without requiring an initial email. The seeker can log in immediately, explore their blueprint, and add their real email address and update their password at any time.
                </p>
              </div>
            </div>

            {provError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {provError}
              </div>
            )}

            {/* Success Receipt Card */}
            {provSuccessReceipt && (
              <div className="p-6 rounded-2xl bg-teal-950/40 border border-teal-500/50 space-y-4 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-400" />
                    <span>Account Provisioned Successfully!</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 border border-teal-500/30">
                    Ready For Login
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">USERNAME</span>
                    <strong className="text-teal-300 text-sm">{provSuccessReceipt.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">INITIAL PASSWORD</span>
                    <strong className="text-amber-300 text-sm">{provSuccessReceipt.initialPassword}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">EMAIL STATUS</span>
                    <span className="text-amber-300 text-xs font-semibold">Pending (User will add upon login)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      const slip = `AFFINITY SOVEREIGN PORTAL - LOGIN CREDENTIALS\n` +
                        `Username: ${provSuccessReceipt.username}\n` +
                        `Initial Password: ${provSuccessReceipt.initialPassword}\n` +
                        `Instructions: Log in using your username and password at the Affinity Sovereign Portal. Upon login, you can add your personal email address and personalize your password.`;
                      navigator.clipboard.writeText(slip);
                      setCopiedReceipt(true);
                      setTimeout(() => setCopiedReceipt(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    {copiedReceipt ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedReceipt ? "Credentials Copied!" : "Copy Login Slip for User"}</span>
                  </button>

                  {provSuccessReceipt.profile && (
                    <button
                      onClick={() => {
                        onSelectProfileToView(provSuccessReceipt.profile);
                        onExitManager();
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white text-xs font-medium border border-teal-500/30 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inspect Calculated Blueprint in Portal ➔</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setTestModalTargetId(provSuccessReceipt.id);
                      setTestModalTargetName(provSuccessReceipt.username);
                      setTestModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-medium border border-purple-500/40 transition-all flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5 text-purple-300" />
                    <span>Input / Upload Test Answers for Client</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Creation Form */}
            <form onSubmit={handleCreateUserAccount} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Seeker Username *
                  </label>
                  <input
                    type="text"
                    value={provUsername}
                    onChange={(e) => setProvUsername(e.target.value)}
                    placeholder="e.g. john_seeker or starwalker99"
                    className="cosmic-input text-xs w-full"
                    required
                  />
                  <p className="text-[10px] text-slate-500">The user will use this username to sign in.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Initial Password *
                  </label>
                  <input
                    type="text"
                    value={provPassword}
                    onChange={(e) => setProvPassword(e.target.value)}
                    placeholder="e.g. cosmic1234"
                    className="cosmic-input text-xs w-full"
                    required
                  />
                  <p className="text-[10px] text-slate-500">Temporary passkey. User can change this after logging in.</p>
                </div>
              </div>

              {/* Optional Birth Information for Instant Blueprint */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                    Optional: Pre-compute Soul Blueprint
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Leave blank if you want the user to enter their own birth info
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">First Name</label>
                    <input
                      type="text"
                      value={provFirstName}
                      onChange={(e) => setProvFirstName(e.target.value)}
                      placeholder="e.g. Elena"
                      className="cosmic-input text-xs w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Last Name</label>
                    <input
                      type="text"
                      value={provLastName}
                      onChange={(e) => setProvLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="cosmic-input text-xs w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Date of Birth</label>
                    <input
                      type="date"
                      value={provDob}
                      onChange={(e) => setProvDob(e.target.value)}
                      className="cosmic-input text-xs w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Time of Birth</label>
                    <input
                      type="time"
                      value={provTob}
                      onChange={(e) => setProvTob(e.target.value)}
                      className="cosmic-input text-xs w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Place of Birth</label>
                    <input
                      type="text"
                      value={provPob}
                      onChange={(e) => setProvPob(e.target.value)}
                      placeholder="e.g. Denver, Colorado"
                      className="cosmic-input text-xs w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={provLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{provLoading ? "Provisioning Account..." : "Create User Account & Generate Access"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Provisioned Accounts Overview */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Provisioned Accounts History
            </h4>
            <div className="space-y-2">
              {(data?.profiles || []).filter(p => p.username || p.source === "Provisioned Account").length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">No provisioned username accounts yet. Use the form above to create one.</p>
              ) : (
                (data?.profiles || [])
                  .filter(p => p.username || p.source === "Provisioned Account")
                  .map((acc, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <strong className="text-teal-300 font-mono">@{acc.username || acc.email}</strong>
                          {acc.profile?.firstName && (
                            <span className="text-slate-300">({acc.profile.firstName} {acc.profile.lastName})</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Created: {new Date(acc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        {acc.mustAddEmail ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Email Pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Email Verified ({acc.email})
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE INSPECTION MODAL */}
      {selectedProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-900 border border-teal-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-teal-400 tracking-wider">Profile Dossier</span>
                <h3 className="text-2xl font-serif text-white font-light">
                  {selectedProfileModal.profile?.firstName} {selectedProfileModal.profile?.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProfileModal(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-400">Account Source: <strong className="text-teal-300">{selectedProfileModal.source}</strong></div>
                <div className="text-slate-400">Email: <strong className="text-white">{selectedProfileModal.email}</strong></div>
                <div className="text-slate-400">DOB: <strong className="text-white">{selectedProfileModal.profile?.dateOfBirth}</strong> ({selectedProfileModal.profile?.timeOfBirth || "12:00"})</div>
                <div className="text-slate-400">Place: <strong className="text-white">{selectedProfileModal.profile?.placeOfBirth || "Earth"}</strong></div>
              </div>

              {selectedProfileModal.profile?.computed && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-teal-400 block font-mono">Cosmic Blueprint Summary</span>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Life Path: <strong className="text-amber-300">{selectedProfileModal.profile.computed.numerology.lifePath}</strong></div>
                    <div>Expression: <strong className="text-white">{selectedProfileModal.profile.computed.numerology.expression}</strong></div>
                    <div>Sun Sign: <strong className="text-teal-300">{selectedProfileModal.profile.computed.astrology.sunSign}</strong></div>
                    <div>Moon Sign: <strong className="text-white">{selectedProfileModal.profile.computed.astrology.moonSign}</strong></div>
                    <div>Rising Sign: <strong className="text-white">{selectedProfileModal.profile.computed.astrology.risingSign}</strong></div>
                    <div>Dominant Planet: <strong className="text-white">{selectedProfileModal.profile.computed.astrology.dominantPlanet}</strong></div>
                    <div>Human Design: <strong className="text-indigo-300">{selectedProfileModal.profile.computed.humanDesign.type} ({selectedProfileModal.profile.computed.humanDesign.profile})</strong></div>
                    <div>Aura Field: <strong className="text-yellow-300">{selectedProfileModal.profile.computed.aura.color} ({selectedProfileModal.profile.computed.aura.frequency} Hz)</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  downloadProfileFullDossierPDF(selectedProfileModal.profile);
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Dossier (PDF)</span>
              </button>

              <button
                onClick={() => {
                  onSelectProfileToView(selectedProfileModal.profile);
                  setSelectedProfileModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white font-medium text-xs transition-all border border-teal-500/30"
              >
                View in App ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manager Test Input & Upload Modal */}
      {token && (
        <TestAnswerModal
          isOpen={testModalOpen}
          onClose={() => {
            setTestModalOpen(false);
            setTestModalTargetId(undefined);
            setTestModalTargetName(undefined);
          }}
          token={token}
          defaultTestType={testModalDefaultType}
          targetUserId={testModalTargetId}
          targetClientName={testModalTargetName}
          onSuccess={() => {
            fetch("/api/manager/overview", {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then((res) => res.json())
              .then((d) => setData(d))
              .catch(console.error);
          }}
        />
      )}
      {/* MANAGER FOOTER INTELLECTUAL PROPERTY NOTICE */}
      <footer className="pt-8 pb-4 border-t border-teal-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
            alt="Affinity Lifestyle Consulting" 
            className="h-7 w-auto object-contain bg-white/95 p-0.5 rounded-lg border border-teal-500/30 shadow-sm"
          />
          <span className="font-semibold text-slate-200 font-serif">Affinity Lifestyle Consulting</span>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          The analysis and interpretation is the intellectual property of Affinity lifestyle consulting.
        </p>
      </footer>
    </div>
  );
}
