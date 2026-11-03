import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Onboarding from "./components/Onboarding";
import Home from "./components/Home";
import SoulBlueprint from "./components/SoulBlueprint";
import HumanDesignTab from "./components/HumanDesignTab";
import { GeneKeysTab } from "./components/GeneKeysTab";
import { FullLifeReport } from "./components/FullLifeReport";
import PsychometricTab from "./components/PsychometricTab";
import AuraTab from "./components/AuraTab";
import GoalsTab from "./components/GoalsTab";
import AkashicTab from "./components/AkashicTab";
import MeditationTab from "./components/MeditationTab";
import ChatTab from "./components/ChatTab";
import GuestProfileModal from "./components/GuestProfileModal";
import ManagerDashboard from "./components/ManagerDashboard";
import RelationshipCompareTab from "./components/RelationshipCompareTab";
import AccountSettingsModal from "./components/AccountSettingsModal";
import MbtiTab from "./components/MbtiTab";
import CommunityTab from "./components/CommunityTab";
import AccountTab from "./components/AccountTab";
import CosmicCalendarTab from "./components/CosmicCalendarTab";
import AncestralLineageTab from "./components/AncestralLineageTab";
import { CosmicSanctuary3D } from "./components/CosmicSanctuary3D";
import { Profile, User } from "./types";
import { 
  Calendar as CalendarIcon,
  Sparkles, 
  Home as HomeIcon, 
  Compass, 
  Layers, 
  KeyRound,
  FileText,
  Activity, 
  Sun, 
  Target, 
  BookOpen, 
  Flame, 
  LogOut,
  Menu,
  X,
  Users,
  UserPlus,
  RefreshCw,
  ShieldCheck,
  Download,
  Settings,
  HeartHandshake,
  ArrowRight,
  Brain,
  MessageSquare,
  User as UserIcon,
  Dna
} from "lucide-react";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [isManagerView, setIsManagerView] = useState(false);

  const MASTER_MANAGER_EMAIL = "affinitylifestyleconsulting@gmail.com";
  const isMasterManager = user?.email?.toLowerCase().trim() === MASTER_MANAGER_EMAIL;

  // Load auth state from localStorage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("affinity_token");
    if (savedToken) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token expired");
          return res.json();
        })
        .then((data) => {
          setToken(savedToken);
          setUser(data.user);
          setProfile(data.profile || null);
          setActiveProfile(data.profile || null);
          const isUserMasterManager = data.user?.email?.toLowerCase().trim() === MASTER_MANAGER_EMAIL;
          if (isUserMasterManager && data.user?.role === "manager") {
            setIsManagerView(true);
          } else {
            setIsManagerView(false);
          }
        })
        .catch(() => {
          // Clear stale credentials
          localStorage.removeItem("affinity_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (newToken: string, newUser: User, newProfile: Profile | null) => {
    localStorage.setItem("affinity_token", newToken);
    setToken(newToken);
    setUser(newUser);
    setProfile(newProfile);
    setActiveProfile(newProfile);
    const isUserMasterManager = newUser.email?.toLowerCase().trim() === MASTER_MANAGER_EMAIL;
    if (isUserMasterManager && newUser.role === "manager") {
      setIsManagerView(true);
    } else {
      setIsManagerView(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("affinity_token");
    setToken(null);
    setUser(null);
    setProfile(null);
    setActiveProfile(null);
    setIsManagerView(false);
    setActiveTab("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4" id="app-loading-screen">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 elara-orb">
          <Sparkles className="w-6 h-6 text-teal-400 animate-spin" />
        </div>
        <p className="text-xs font-mono tracking-widest text-teal-300 uppercase animate-pulse">Initializing cosmic codes...</p>
      </div>
    );
  }

  // 1. Not Authenticated -> Show Auth screen
  if (!token || !user) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  // 2. Authenticated but profile is not completed -> Force Onboarding
  if (!profile) {
    return <Onboarding token={token} onComplete={(p) => { setProfile(p); setActiveProfile(p); }} />;
  }

  const currentViewProfile = activeProfile || profile;
  const isViewingGuestSubject = profile && currentViewProfile && (currentViewProfile.firstName !== profile.firstName || currentViewProfile.dateOfBirth !== profile.dateOfBirth);

  // If manager portal view is active AND user is the master administrator, render the Executive Manager Dashboard
  if (isManagerView && isMasterManager) {
    return (
      <ManagerDashboard
        token={token}
        currentUser={user}
        onSelectProfileToView={(selectedProfile) => {
          setActiveProfile(selectedProfile);
          setIsManagerView(false);
        }}
        onExitManager={() => setIsManagerView(false)}
      />
    );
  }

  // Sidebar navigation options
  const navItems = [
    { id: "home", label: "Home Base", icon: HomeIcon },
    { id: "calendar", label: "Cosmic Calendar", icon: CalendarIcon },
    { id: "synergy", label: "Compare Charts", icon: HeartHandshake },
    { id: "blueprint", label: "Soul Blueprint", icon: Compass },
    { id: "lineage", label: "Ancestral Lineage", icon: Dna },
    { id: "humandesign", label: "Human Design", icon: Layers },
    { id: "genekeys", label: "64 Gene Keys Codex", icon: KeyRound },
    { id: "report", label: "Full Life Report", icon: FileText },
    { id: "psychometric", label: "AMBI Mindscape", icon: Activity },
    { id: "mbti", label: "Myers-Briggs (MBTI)", icon: Brain },
    { id: "community", label: "Community Sanctuary", icon: MessageSquare },
    { id: "aura", label: "Aura & Energy", icon: Sun },
    { id: "sanctuary3d", label: "3D Sanctuary", icon: Sparkles },
    { id: "goals", label: "SMART Goals", icon: Target },
    { id: "akashic", label: "Akashic Records", icon: BookOpen },
    { id: "meditation", label: "Point Zero Loop", icon: Flame },
    { id: "chat", label: "Chat with Ela", icon: Sparkles },
    { id: "account", label: "My Account & Profile", icon: UserIcon },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#060913] text-white overflow-hidden relative" id="app-main-layout">
      {/* Galaxy Universe Backdrop Glow Layer */}
      <div className="galaxy-bg-glow" />

      {/* Guest Profile Switcher Modal */}
      <GuestProfileModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        currentProfile={currentViewProfile}
        mainProfile={profile}
        onSelectProfile={(p) => setActiveProfile(p)}
      />

      {/* Account Settings & Credentials Modal */}
      <AccountSettingsModal
        isOpen={accountSettingsOpen}
        onClose={() => setAccountSettingsOpen(false)}
        user={user}
        token={token}
        onUserUpdated={(updatedUser) => setUser(updatedUser)}
      />

      {/* MOBILE TOP BAR - WHITE BACKGROUND, BLACK & TEAL TEXT */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white border-b border-teal-500/25 shadow-md sticky top-0 z-50 shrink-0" id="mobile-top-bar">
        <div className="flex items-center gap-2.5" id="mobile-logo-box">
          <img 
            src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
            alt="Affinity Lifestyle Consulting" 
            className="h-9 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="font-script text-2xl text-black tracking-wide leading-none">Affinity</span>
            <span className="font-brand-sub text-[6.5px] text-teal-700 uppercase font-bold leading-tight tracking-[0.25em]">LIFESTYLE CONSULTING</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5" id="mobile-buttons">
          {isMasterManager && (
            <button
              onClick={() => setIsManagerView(true)}
              className="p-1 px-2 rounded-lg bg-teal-50 border border-teal-300 text-teal-800 text-[11px] font-mono flex items-center gap-1 shadow-xs"
              title="Open Executive Manager Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span className="font-bold">Manager</span>
            </button>
          )}
          <button
            onClick={() => setAccountSettingsOpen(true)}
            className="p-1.5 px-2 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors"
            title="Account Settings"
          >
            <Settings className="w-3.5 h-3.5 text-teal-700" />
          </button>
          <button
            onClick={() => setGuestModalOpen(true)}
            className="p-1.5 px-2 text-white bg-teal-600 hover:bg-teal-700 border border-teal-600 rounded-lg text-[11px] flex items-center gap-1 font-mono font-medium shadow-sm transition-colors"
            id="mobile-input-guest-btn"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Guest</span>
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-800 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition-colors"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
          </button>
        </div>
      </div>

      {/* PERSISTENT DESKTOP SIDEBAR */}
      <aside 
        className={`w-64 border-r border-teal-500/10 bg-slate-950/60 backdrop-blur-xl p-4 flex flex-col justify-between fixed md:relative top-0 h-screen z-40 transition-transform md:translate-x-0 overflow-y-auto shrink-0 ${
          mobileMenuOpen ? "translate-x-0 w-full" : "-translate-x-full"
        }`}
        id="app-sidebar"
      >
        <div className="space-y-4" id="sidebar-top-group">
          {/* TOP PART OF THE MENU THAT HOUSES THE NAME ETC - WHITE BACKGROUND, BLACK & TEAL TEXT */}
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-teal-500/25 space-y-3.5" id="sidebar-top-header">
            {/* Logo Heading with Official Affinity Lifestyle Consulting Branding */}
            <div className="flex items-center justify-between" id="sidebar-logo-heading">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
                  alt="Affinity Lifestyle Consulting" 
                  className="h-11 w-auto object-contain"
                />
                <div className="flex flex-col">
                  <span className="font-script text-2xl text-black tracking-wide leading-none">Affinity</span>
                  <span className="font-brand-sub text-[7px] text-teal-700 uppercase font-bold leading-tight tracking-[0.25em] mt-0.5">LIFESTYLE CONSULTING</span>
                </div>
              </div>

              {/* Manager quick button - Exclusively visible to affinitylifestyleconsulting@gmail.com */}
              {isMasterManager && (
                <button
                  onClick={() => setIsManagerView(true)}
                  className="p-1 px-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-300 text-teal-800 text-[10px] font-mono flex items-center gap-1 transition-all shadow-xs"
                  title="Manager & Executive Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span className="font-bold">Manager</span>
                </button>
              )}
            </div>

            {/* User Status Profile Card inside the white header */}
            <div className="p-3 rounded-xl bg-slate-50 border border-teal-200/80 space-y-1 shadow-xs" id="sidebar-user-card">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider text-teal-700 font-bold block">
                  {isViewingGuestSubject ? "Guest Subject View" : "Active Profile"}
                </span>
                <div className="flex items-center gap-1">
                  {user.isGuest && (
                    <span className="text-[8px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                      Guest
                    </span>
                  )}
                  {user.role === "manager" && (
                    <span className="text-[8px] font-mono font-bold bg-teal-100 text-teal-900 px-1.5 py-0.5 rounded border border-teal-300">
                      Manager
                    </span>
                  )}
                  <button
                    onClick={() => setAccountSettingsOpen(true)}
                    className="p-1 rounded bg-white hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors shadow-xs"
                    title="Account Settings & Credentials"
                  >
                    <Settings className="w-3 h-3 text-teal-700" />
                  </button>
                </div>
              </div>
              <div className="text-sm font-bold text-black truncate">
                {currentViewProfile.firstName} {currentViewProfile.lastName}
              </div>
              <div className="text-[10px] text-teal-800 truncate font-mono">
                DOB: {currentViewProfile.dateOfBirth} {user.username ? `• @${user.username}` : ""}
              </div>

              {user.mustAddEmail && (
                <button
                  onClick={() => setAccountSettingsOpen(true)}
                  className="w-full mt-2 py-1 px-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-mono transition-all flex items-center justify-center gap-1 border border-amber-300 shadow-xs"
                >
                  <KeyRound className="w-3 h-3 text-amber-700" />
                  <span className="font-semibold">Add Email & Password</span>
                </button>
              )}

              {isViewingGuestSubject && (
                <button
                  onClick={() => setActiveProfile(profile)}
                  className="w-full mt-2 py-1 px-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-mono transition-all flex items-center justify-center gap-1 shadow-sm"
                  id="sidebar-reset-profile-btn"
                >
                  <RefreshCw className="w-3 h-3 text-white" />
                  <span className="font-bold">Reset to My Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* QUICK ACTION BUTTONS */}
          <div className="space-y-1.5" id="sidebar-quick-actions">
            {/* Input guest profile button */}
            <button
              onClick={() => {
                setGuestModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-teal-500/30 text-teal-200 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-medium shadow-md group"
              id="sidebar-input-guest-btn"
            >
              <UserPlus className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>Input Guest / Other Person</span>
            </button>
          </div>

          {/* Nav links list */}
          <nav className="space-y-1 pt-1" id="sidebar-navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all ${
                    isSelected
                      ? "bg-teal-500/15 text-teal-200 border-l-2 border-teal-400 font-semibold shadow-[0_0_12px_rgba(45,212,191,0.15)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-teal-300 animate-pulse" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="pt-4 border-t border-teal-500/10 space-y-2 mt-6" id="sidebar-footer">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Close Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 w-full z-10" id="app-viewport">
        <div className="max-w-7xl mx-auto w-full">
          {/* Top Banner when user needs to add email / finish setup */}
          {user.mustAddEmail && (
            <div className="mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-amber-200 shadow-xl animate-fade-in" id="account-setup-required-banner">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Finish Your Account Setup</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    You logged in using username <strong className="text-amber-300">@{user.username || "seeker"}</strong>. Add your personal email address and change your temporary password so you can always recover your sovereign portal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAccountSettingsOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <span>Add Email & Update Password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Top Notification Banner when viewing a guest profile */}
          {isViewingGuestSubject && (
            <div className="mb-6 p-3.5 px-5 rounded-2xl bg-teal-950/40 border border-teal-500/40 flex items-center justify-between gap-3 text-xs text-teal-200 shadow-lg animate-fade-in" id="guest-view-banner">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  Currently analyzing temporary profile for <strong className="text-white">{currentViewProfile.firstName} {currentViewProfile.lastName}</strong> ({currentViewProfile.dateOfBirth}).
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isMasterManager && (
                  <button
                    onClick={() => setIsManagerView(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 transition-all font-mono text-[11px] flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-purple-300" />
                    <span>Return to Manager Portal</span>
                  </button>
                )}
                <button
                  onClick={() => setGuestModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-100 transition-all font-mono text-[11px]"
                >
                  Switch / Add Person
                </button>
                <button
                  onClick={() => setActiveProfile(profile)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all font-mono text-[11px]"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {activeTab === "home" && <Home profile={currentViewProfile} token={token} onNavigate={handleTabChange} />}
          {activeTab === "calendar" && <CosmicCalendarTab profile={currentViewProfile} token={token} onNavigate={handleTabChange} />}
          {activeTab === "synergy" && <RelationshipCompareTab currentProfile={currentViewProfile} token={token} />}
          {activeTab === "blueprint" && <SoulBlueprint profile={currentViewProfile} />}
          {activeTab === "lineage" && <AncestralLineageTab profile={currentViewProfile} onNavigate={handleTabChange} />}
          {activeTab === "humandesign" && <HumanDesignTab profile={currentViewProfile} />}
          {activeTab === "genekeys" && <GeneKeysTab profile={currentViewProfile} />}
          {activeTab === "report" && <FullLifeReport profile={currentViewProfile} token={token} onNavigate={handleTabChange} />}
          {activeTab === "psychometric" && <PsychometricTab token={token} profile={currentViewProfile} onNavigate={handleTabChange} />}
          {activeTab === "mbti" && <MbtiTab token={token} profile={currentViewProfile} onNavigate={handleTabChange} />}
          {activeTab === "community" && <CommunityTab token={token} user={user} profile={currentViewProfile} />}
          {activeTab === "aura" && <AuraTab profile={currentViewProfile} />}
          {activeTab === "sanctuary3d" && <CosmicSanctuary3D profile={currentViewProfile} />}
          {activeTab === "goals" && <GoalsTab profile={currentViewProfile} />}
          {activeTab === "akashic" && <AkashicTab profile={currentViewProfile} />}
          {activeTab === "meditation" && <MeditationTab profile={currentViewProfile} />}
          {activeTab === "chat" && <ChatTab token={token} profile={currentViewProfile} />}
          {activeTab === "account" && (
            <AccountTab
              token={token}
              user={user}
              profile={profile}
              onUserUpdated={(u, p) => {
                setUser(u);
                setProfile(p);
                setActiveProfile(p);
              }}
            />
          )}

          {/* PORTAL WIDE FOOTER NOTICE */}
          <footer className="mt-16 pt-8 pb-4 border-t border-teal-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/Screenshot_2026-10-27_2.03.24_AM_ca2d4c2e.png" 
                alt="Affinity Lifestyle Consulting Logo" 
                className="h-8 w-auto object-contain bg-white/95 p-0.5 rounded-lg border border-teal-500/25 shadow-sm"
              />
              <span className="font-serif font-semibold text-slate-200">Affinity Lifestyle Consulting</span>
            </div>
            <p className="text-[11px] text-slate-400 italic text-center sm:text-right">
              The analysis and interpretation is the intellectual property of Affinity lifestyle consulting.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

