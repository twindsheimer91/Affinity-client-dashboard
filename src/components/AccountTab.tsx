import React, { useState, useEffect } from "react";
import { User, Profile } from "../types";
import { Sparkles, User as UserIcon, Mail, KeyRound, Calendar, Clock, MapPin, Compass, CheckCircle2, AlertCircle, Save, Layers, Heart, Sun, Brain } from "lucide-react";
import { calculateBlueprint } from "../utils/calculations";

interface AccountTabProps {
  token: string;
  user: User;
  profile: Profile;
  onUserUpdated: (updatedUser: User, updatedProfile: Profile) => void;
}

export default function AccountTab({ token, user, profile, onUserUpdated }: AccountTabProps) {
  // Form State
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Birth Coordinates
  const [dob, setDob] = useState(profile.dateOfBirth || "");
  const [tob, setTob] = useState(profile.timeOfBirth || "12:00");
  const [pob, setPob] = useState(profile.placeOfBirth || "");

  // Growth & Intentions
  const [bio, setBio] = useState((profile as any).bio || "");
  const [intentions, setIntentions] = useState((profile as any).intentions || "");
  const [relationshipStatus, setRelationshipStatus] = useState((profile as any).relationshipStatus || "exploring");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Live Blueprint Calculation Preview
  const [previewBlueprint, setPreviewBlueprint] = useState(profile.computed);

  useEffect(() => {
    if (firstName && dob) {
      try {
        const computed = calculateBlueprint(firstName, lastName, dob, tob || "12:00", pob || "");
        setPreviewBlueprint(computed);
      } catch (e) {
        // Keep existing
      }
    }
  }, [firstName, lastName, dob, tob, pob]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!dob) {
      setError("Date of birth is required to calculate your sacred Soul Blueprint.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: dob,
          timeOfBirth: tob,
          placeOfBirth: pob.trim(),
          bio: bio.trim(),
          intentions: intentions.trim(),
          relationshipStatus,
          email: email.trim(),
          newPassword: newPassword ? newPassword.trim() : undefined,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      onUserUpdated(data.user, data.profile);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16" id="account-settings-page">
      {/* Page Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900 border border-teal-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-wider font-bold">
              <UserIcon className="w-4 h-4 text-teal-400" />
              <span>Sovereign Identity & Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              My Profile & Soul Coordinates
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Update your account details, edit your birth coordinates to recalculate your Soul Blueprint, and record your personal growth intentions.
            </p>
          </div>

          {/* User Badge */}
          <div className="flex flex-col items-start sm:items-end gap-1 font-mono text-xs text-slate-400">
            <span className="text-[10px] text-teal-400/80 uppercase font-bold">Account Type</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold">
                {user.role === "manager" ? "Executive Manager" : user.isGuest ? "Guest Seeker" : "Sovereign Member"}
              </span>
              {user.username && <span className="text-slate-400 font-mono">@{user.username}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-rose-200 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-400 text-teal-200 text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
          <span>Profile and cosmic blueprint recalculation saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveAccount} className="space-y-6">
        {/* SECTION 1: CREDENTIALS & PERSONAL IDENTITY */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-300 font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <UserIcon className="w-4 h-4 text-teal-400" />
            <span>1. Personal Credentials & Login Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="cosmic-input text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="cosmic-input text-xs w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Email Address</span>
                {user.mustAddEmail && (
                  <span className="text-[10px] text-amber-300 font-mono font-bold animate-pulse">
                    Action Required
                  </span>
                )}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seeker@domain.com"
                  className="cosmic-input text-xs w-full pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Account Username</label>
              <input
                type="text"
                value={user.username ? `@${user.username}` : "@seeker"}
                disabled
                className="cosmic-input text-xs w-full opacity-60 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Change Password Sub-Panel */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span>Change Password (Leave blank to keep existing passkey)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 characters)"
                  className="cosmic-input text-xs w-full"
                />
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="cosmic-input text-xs w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SACRED BIRTH COORDINATES & LIVE BLUEPRINT */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-teal-300 font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-400" />
              <span>2. Sacred Birth Coordinates & Soul Blueprint</span>
            </h2>
            <span className="text-[10px] text-teal-400 font-mono">
              Live Blueprint Recalculation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" />
                <span>Date of Birth *</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="cosmic-input text-xs w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Time of Birth</span>
              </label>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="cosmic-input text-xs w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>Place of Birth</span>
              </label>
              <input
                type="text"
                value={pob}
                onChange={(e) => setPob(e.target.value)}
                placeholder="e.g. Geneva, Switzerland"
                className="cosmic-input text-xs w-full"
              />
            </div>
          </div>

          {/* Blueprint Live Recalculation Badges */}
          {previewBlueprint && (
            <div className="p-4 rounded-xl bg-slate-950 border border-teal-500/20 space-y-2 mt-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Calculated Blueprint Architecture:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">LIFE PATH</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {previewBlueprint.numerology?.lifePath}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">SUN SIGN</span>
                  <span className="font-bold text-teal-300 text-xs">
                    {previewBlueprint.astrology?.sunSign}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">HD TYPE</span>
                  <span className="font-bold text-indigo-300 text-xs truncate block">
                    {previewBlueprint.humanDesign?.type}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">AURA COLOR</span>
                  <span className="font-bold text-emerald-300 text-xs truncate block">
                    {previewBlueprint.aura?.color}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: INTENTIONS & FULFILLMENT PROFILE */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-lg">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-300 font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <Heart className="w-4 h-4 text-teal-400" />
            <span>3. Soul Intentions, Contentment Focus & Bio</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Personal Bio & Sovereign Manifesto
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your personal philosophy, life journey, or current spiritual discoveries..."
                rows={3}
                className="cosmic-input text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Core Growth & Deconditioning Focus
                </label>
                <input
                  type="text"
                  value={intentions}
                  onChange={(e) => setIntentions(e.target.value)}
                  placeholder="e.g. Deconditioning Solar Plexus, Emotional Sovereignty"
                  className="cosmic-input text-xs w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Relationship Dynamics Mode
                </label>
                <select
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value)}
                  className="cosmic-input text-xs w-full bg-slate-950"
                >
                  <option value="exploring">Open Exploration & Self-Sovereignty</option>
                  <option value="partnered">Deep Partner Connection (Synastry Focus)</option>
                  <option value="collaborative">Professional & Creative Collaborations</option>
                  <option value="solitude">Sacred Solitude & Inner Work</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-8 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.3)] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Recalculating & Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile & Recalculate Blueprint</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
