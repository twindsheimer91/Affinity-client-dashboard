import React, { useState } from "react";
import { Sparkles, Eye, EyeOff, UserCheck, ShieldCheck, KeyRound } from "lucide-react";
import { auth, googleProvider, signInWithPopup } from "../firebase";
import { User } from "../types";

interface AuthProps {
  onSuccess: (token: string, user: User, profile: any) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [authMode, setAuthMode] = useState<"login" | "register" | "owner">("login");
  const [ownerLoginType, setOwnerLoginType] = useState<"pin" | "credentials">("pin");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.user.email,
          displayName: result.user.displayName,
          uid: result.user.uid,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to authenticate with Google.");
      onSuccess(data.token, data.user, data.profile || null);
    } catch (err: any) {
      console.error("Google sign in error", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup closed before completion.");
      } else {
        setError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create guest portal access.");
      }
      onSuccess(data.token, data.user, data.profile || null);
    } catch (err: any) {
      setError(err.message || "Failed to enter guest mode.");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Please enter your Owner PIN.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/owner-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid Owner PIN.");
      }

      onSuccess(data.token, data.user, data.profile || null);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate owner.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === "owner" && ownerLoginType === "pin") {
      return handleOwnerPinSubmit(e);
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    const endpoint = authMode === "owner"
      ? "/api/auth/owner-login"
      : authMode === "login"
      ? "/api/auth/login"
      : "/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred. Please try again.");
      }

      onSuccess(data.token, data.user, data.profile || null);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" id="auth-container">
      <div className="glass-card w-full max-w-md p-8 md:p-10 slide-in" id="auth-card">
        {/* Header logo / title */}
        <div className="text-center mb-6" id="auth-header">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4 elara-orb" id="auth-logo-bg">
            {authMode === "owner" ? (
              <KeyRound className="w-6 h-6 text-amber-300" id="auth-logo-icon" />
            ) : (
              <Sparkles className="w-6 h-6 text-teal-400" id="auth-logo-icon" />
            )}
          </div>
          <h1 className="text-3xl font-light tracking-widest cosmic-text text-white" id="auth-title">
            AFFINITY
          </h1>
          <p className="text-xs text-slate-400 mt-2 tracking-wider uppercase font-mono" id="auth-subtitle">
            {authMode === "owner"
              ? "Owner Access & Sovereign Command"
              : authMode === "login"
              ? "Re-enter the Cosmic Matrix"
              : "Initiate Your Soul Blueprint"}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 mb-6 border border-slate-800" id="auth-mode-selector">
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "login" ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Seeker Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === "register" ? "bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("owner");
              setOwnerLoginType("pin");
              setPin("");
              setEmail("");
              setPassword("");
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === "owner" 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm" 
                : "text-slate-400 hover:text-amber-300"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Owner Access</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center" id="auth-error">
            {error}
          </div>
        )}

        {/* OWNER ACCESS MODE: PIN (Default) or Credentials */}
        {authMode === "owner" && ownerLoginType === "pin" ? (
          <form onSubmit={handleOwnerPinSubmit} className="space-y-4" id="owner-pin-form">
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Executive Sovereign Security</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Enter your private 6-digit Owner PIN to unlock administrative authority.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono" htmlFor="owner-pin-input">
                Owner PIN
              </label>
              <input
                id="owner-pin-input"
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                className="cosmic-input text-base text-center tracking-widest font-mono text-amber-300 placeholder-slate-600 focus:border-amber-500/60"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              id="owner-pin-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Sovereign Portal ✦</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setOwnerLoginType("credentials");
                  setError("");
                }}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Or enter Master Email & Passkey ➔
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form">
            <div className="flex flex-col gap-1.5" id="email-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="auth-email">
                {authMode === "owner" 
                  ? "Master Owner Email" 
                  : authMode === "login" 
                  ? "Email Address or Username" 
                  : "Email Address"}
              </label>
              <input
                id="auth-email"
                type={authMode === "register" ? "email" : "text"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  authMode === "owner" 
                    ? "Enter master email" 
                    : authMode === "login" 
                    ? "e.g., seeker@cosmic.com or username" 
                    : "e.g., seeker@cosmic.com"
                }
                className="cosmic-input text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5" id="password-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="auth-password">
                {authMode === "owner" ? "Owner Security Passkey" : "Access Password"}
              </label>
              <div className="relative" id="password-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="cosmic-input text-sm w-full pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  id="toggle-password-btn"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 mt-2 flex items-center justify-center gap-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-lg ${
                authMode === "owner"
                  ? "bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950"
                  : "cosmic-btn"
              }`}
              id="auth-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
              ) : authMode === "owner" ? (
                "Unlock Sovereign Portal ✦"
              ) : authMode === "login" ? (
                "Unlock Portal ✦"
              ) : (
                "Begin Onboarding ✦"
              )}
            </button>

            {authMode === "owner" && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOwnerLoginType("pin");
                    setError("");
                  }}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                >
                  ← Return to PIN Access
                </button>
              </div>
            )}
          </form>
        )}

        {authMode !== "owner" && (
          <>
            <div className="relative my-5 flex items-center justify-center" id="auth-divider">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <span className="relative bg-[#0b1020] px-3 text-[10px] uppercase font-mono tracking-widest text-slate-500">Or Instant Access</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 mb-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 transition-all flex items-center justify-center gap-2.5 font-semibold text-xs tracking-wider shadow-lg"
              id="google-auth-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-teal-500/30 text-teal-200 hover:text-white transition-all flex items-center justify-center gap-2.5 font-medium text-xs tracking-wider shadow-lg"
              id="guest-auth-btn"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Continue as Guest (No Email Required) ✦</span>
            </button>
          </>
        )}

        <div className="text-center mt-6 pt-5 border-t border-white/5 text-xs text-slate-400" id="auth-footer">
          {authMode === "owner" ? (
            <p>
              Not the owner?{" "}
              <button
                onClick={() => {
                  setAuthMode("login");
                  setEmail("");
                  setPassword("");
                  setPin("");
                  setError("");
                }}
                className="text-teal-400 hover:underline hover:text-teal-300 font-medium transition-colors"
              >
                Return to Seeker Login
              </button>
            </p>
          ) : (
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "register" : "login");
                  setError("");
                }}
                className="text-teal-400 hover:underline hover:text-teal-300 font-medium transition-colors"
              >
                {authMode === "login" ? "Create New Account" : "Sign In to Existing Account"}
              </button>

              <button
                onClick={() => {
                  setAuthMode("owner");
                  setOwnerLoginType("pin");
                  setPin("");
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                className="text-amber-400 hover:underline hover:text-amber-300 font-mono text-[11px] flex items-center gap-1 font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Owner Access</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
