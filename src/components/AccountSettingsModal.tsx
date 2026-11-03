import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  User as UserIcon,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { User } from "../types";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  token: string | null;
  onUserUpdated: (updatedUser: User) => void;
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  user,
  token,
  onUserUpdated,
}: AccountSettingsModalProps) {
  const [email, setEmail] = useState(user.email.endsWith("@affinity.local") ? "" : user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate inputs
    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (!email && !newPassword) {
      setErrorMessage("Please enter an email to update or a new password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim() || undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update account credentials.");
      }

      setSuccessMessage("Your account credentials were successfully updated!");
      onUserUpdated(data.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Auto close after 2.5s if success
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2200);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const isProvisionedInitial = Boolean(user.mustAddEmail);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-20"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70 pr-14">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Account Credentials & Security
              </h2>
              <p className="text-xs text-slate-400">
                Manage your login email, username, and access password
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {isProvisionedInitial && (
            <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 space-y-1 text-xs text-teal-200">
              <div className="flex items-center gap-2 font-bold text-teal-100">
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Account Setup in Progress</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Your manager provisioned this account for you. Add your personal email address and choose your own secure password so you can access your profile at any time.
              </p>
            </div>
          )}

          {/* Account Overview Tag */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <UserIcon className="w-4 h-4 text-teal-400" />
              <span>Username:</span>
              <strong className="text-white font-mono">{user.username || "Standard User"}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              {user.mustAddEmail ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Email Required
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              )}
            </div>
          </div>

          {/* Success / Error Messages */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>Your Personal Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@domain.com"
              className="cosmic-input text-sm w-full"
            />
            <p className="text-[11px] text-slate-500">
              Used for account recovery and official dossier notifications.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-mono">
              Change Password
            </div>

            {!isProvisionedInitial && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="cosmic-input text-sm w-full"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="cosmic-input text-sm w-full"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="cosmic-input text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 shadow-teal-500/20"
            >
              {loading ? (
                <span>Saving Credentials...</span>
              ) : (
                <>
                  <span>Save Account Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
