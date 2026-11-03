import React, { useState, useEffect } from "react";
import { X, UserPlus, Sparkles, RefreshCw, Check, Trash2, Users, Compass } from "lucide-react";
import { Profile } from "../types";
import { calculateBlueprint } from "../utils/calculations";

interface GuestProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: Profile | null;
  mainProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
}

export default function GuestProfileModal({
  isOpen,
  onClose,
  currentProfile,
  mainProfile,
  onSelectProfile,
}: GuestProfileModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("12:00");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [savedSubjects, setSavedSubjects] = useState<Profile[]>([]);

  // Load saved guest profiles from site backend & localStorage
  useEffect(() => {
    // 1. Fetch from site backend
    fetch("/api/profiles/guest-subjects")
      .then((res) => res.json())
      .then((data) => {
        if (data.guestSubjects && Array.isArray(data.guestSubjects)) {
          setSavedSubjects(data.guestSubjects);
          try {
            localStorage.setItem("affinity_guest_subjects", JSON.stringify(data.guestSubjects));
          } catch (e) {}
        }
      })
      .catch((e) => {
        console.error("Failed to load guest subjects from server:", e);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem("affinity_guest_subjects");
          if (stored) {
            setSavedSubjects(JSON.parse(stored));
          }
        } catch (err) {}
      });
  }, []);

  if (!isOpen) return null;

  const handleCalculateAndSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth) return;

    const computed = calculateBlueprint(
      firstName.trim(),
      lastName.trim(),
      dateOfBirth,
      timeOfBirth || "12:00",
      placeOfBirth?.trim() || ""
    );

    const newProfile: Profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      timeOfBirth: timeOfBirth || "12:00",
      placeOfBirth: placeOfBirth?.trim() || "",
      computed,
    };

    // Save to list locally
    const updated = [newProfile, ...savedSubjects.filter(p => p.firstName.toLowerCase() !== newProfile.firstName.toLowerCase() || p.dateOfBirth !== newProfile.dateOfBirth)].slice(0, 15);
    setSavedSubjects(updated);
    try {
      localStorage.setItem("affinity_guest_subjects", JSON.stringify(updated));
    } catch (err) {}

    // Persist to site backend so manager and server have it permanently saved
    try {
      await fetch("/api/profiles/guest-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: newProfile }),
      });
    } catch (err) {
      console.error("Failed to save guest profile to site backend:", err);
    }

    onSelectProfile(newProfile);
    onClose();
  };

  const handleQuickSample = () => {
    const samples = [
      { first: "Elena", last: "Rostova", dob: "1992-04-12", tob: "09:15", pob: "Vienna, Austria" },
      { first: "Marcus", last: "Vane", dob: "1985-09-28", tob: "22:00", pob: "Seattle, WA" },
      { first: "Chloe", last: "Solstice", dob: "1999-12-21", tob: "06:45", pob: "Boulder, CO" },
      { first: "Julian", last: "Kairo", dob: "1990-07-07", tob: "11:11", pob: "Athens, Greece" },
    ];
    const s = samples[Math.floor(Math.random() * samples.length)];
    setFirstName(s.first);
    setLastName(s.last);
    setDateOfBirth(s.dob);
    setTimeOfBirth(s.tob);
    setPlaceOfBirth(s.pob);
  };

  const handleDeleteSubject = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = savedSubjects[indexToDelete];
    const filtered = savedSubjects.filter((_, idx) => idx !== indexToDelete);
    setSavedSubjects(filtered);
    localStorage.setItem("affinity_guest_subjects", JSON.stringify(filtered));

    if ((target as any).id) {
      fetch(`/api/profiles/guest-subjects/${(target as any).id}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const isCurrentMain = mainProfile && currentProfile && currentProfile.firstName === mainProfile.firstName && currentProfile.dateOfBirth === mainProfile.dateOfBirth;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in" 
      id="guest-profile-modal-overlay"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-teal-500/30 shadow-2xl relative max-h-[90vh] overflow-y-auto" 
        id="guest-profile-modal-card"
      >
        {/* Top-Right Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors z-20"
          id="close-modal-btn"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 pr-10" id="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white font-light">Input Guest / Other Person's Info</h3>
              <p className="text-xs text-slate-400">Temporarily analyze charts & reports for any person without needing an email.</p>
            </div>
          </div>
        </div>

        {/* Current Active Subject Indicator */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-teal-500/30 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" id="active-subject-badge">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-teal-400 font-bold block">Currently Viewing Profile</span>
            <div className="text-base font-semibold text-white mt-0.5">
              {currentProfile ? `${currentProfile.firstName} ${currentProfile.lastName}` : "No profile selected"}
              {isCurrentMain && <span className="ml-2 text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">Primary Account</span>}
            </div>
            {currentProfile && (
              <p className="text-xs text-slate-400">
                DOB: {currentProfile.dateOfBirth} • {currentProfile.computed?.astrology?.sunSign || "Zodiac"} • LP {currentProfile.computed?.numerology?.lifePath || "?"}
              </p>
            )}
          </div>

          {mainProfile && !isCurrentMain && (
            <button
              onClick={() => {
                onSelectProfile(mainProfile);
                onClose();
              }}
              className="py-2 px-3.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-medium transition-all flex items-center gap-1.5 shrink-0"
              id="reset-to-main-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-300" />
              <span>Reset to My Main Profile</span>
            </button>
          )}
        </div>

        {/* Form to Input New Subject */}
        <form onSubmit={handleCalculateAndSwitch} className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800" id="guest-input-form">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-teal-400" /> Input Person's Birth Coordinates
            </span>
            <button
              type="button"
              onClick={handleQuickSample}
              className="text-[11px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 font-mono"
              id="quick-sample-fill-btn"
            >
              <Sparkles className="w-3 h-3" /> Auto-fill Sample Person
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-400">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="cosmic-input text-xs py-2.5"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-400">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Jenkins"
                className="cosmic-input text-xs py-2.5"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-400">Date of Birth *</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="cosmic-input text-xs py-2.5 text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-400">Time of Birth</label>
              <input
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="cosmic-input text-xs py-2.5 text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-semibold text-slate-400">Place of Birth</label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="e.g. Chicago, IL"
                className="cosmic-input text-xs py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cosmic-btn-gold w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-semibold"
            id="calculate-and-view-btn"
          >
            <Compass className="w-4 h-4 text-slate-900" />
            <span>Generate & View This Person's Blueprint ✦</span>
          </button>
        </form>

        {/* Previously Entered Saved Guest Subjects List */}
        {savedSubjects.length > 0 && (
          <div className="mt-6 space-y-3" id="saved-subjects-list">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recently Input Profiles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {savedSubjects.map((subject, idx) => {
                const isSelected = currentProfile && currentProfile.firstName === subject.firstName && currentProfile.dateOfBirth === subject.dateOfBirth;
                return (
                  <div
                    key={`${subject.firstName}-${subject.dateOfBirth}-${idx}`}
                    onClick={() => {
                      onSelectProfile(subject);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-500/15 border-teal-400/50 text-white"
                        : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span>{subject.firstName} {subject.lastName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-300" />}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        DOB: {subject.dateOfBirth} • {subject.computed?.astrology?.sunSign || ""}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSubject(idx, e)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
