import React, { useState } from "react";
import { Compass, Sparkles } from "lucide-react";
import { auth, db, doc, setDoc } from "../firebase";
import { Profile } from "../types";

interface OnboardingProps {
  token: string;
  onComplete: (profile: Profile) => void;
}

export default function Onboarding({ token, onComplete }: OnboardingProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("12:00");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !dateOfBirth) {
      setError("Please fill in all required fields (First name, Last name, and Date of Birth).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          timeOfBirth,
          placeOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred calculating your blueprint.");
      }

      // Persist to Firestore if user is authenticated via Firebase
      try {
        if (auth.currentUser) {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
            role: "user",
            firstName,
            lastName,
            dateOfBirth,
            timeOfBirth,
            placeOfBirth,
            computed: data.profile.computed,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (firestoreErr) {
        console.warn("Firestore sync optional error:", firestoreErr);
      }

      onComplete(data.profile);
    } catch (err: any) {
      setError(err.message || "Failed to submit profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" id="onboarding-container">
      <div className="glass-card w-full max-w-2xl p-8 md:p-12 slide-in" id="onboarding-card">
        {/* Progress header */}
        <div className="text-center mb-10" id="onboarding-header">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 mb-4 elara-orb" id="onboarding-logo-bg">
            <Compass className="w-7 h-7 text-teal-400" id="onboarding-logo-icon" />
          </div>
          <h2 className="text-3xl font-light tracking-wider cosmic-text text-white" id="onboarding-title">
            Cosmic Alignment
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-lg mx-auto" id="onboarding-subtitle">
            Enter your earthly incarnation coordinates. Our quantum matrix will synchronize your numerology, stellar map, Human Design grids, and bio-auric fields.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center" id="onboarding-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" id="onboarding-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="name-fields-grid">
            <div className="flex flex-col gap-2" id="firstname-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="onb-firstname">
                First Name <span className="text-teal-400">*</span>
              </label>
              <input
                id="onb-firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g., Alexander"
                className="cosmic-input text-sm"
                required
              />
            </div>

            <div className="flex flex-col gap-2" id="lastname-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="onb-lastname">
                Last Name <span className="text-teal-400">*</span>
              </label>
              <input
                id="onb-lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g., Vance"
                className="cosmic-input text-sm"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2" id="dob-group">
            <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="onb-dob">
              Date of Birth <span className="text-teal-400">*</span>
            </label>
            <input
              id="onb-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="cosmic-input text-sm text-white w-full appearance-none"
              required
            />
            <p className="text-[10px] text-slate-500" id="dob-tip">
              Required to calculate your Life Path number, Chinese Zodiac, and Solar/Lunar zodiac signs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="birth-coordinates-grid">
            <div className="flex flex-col gap-2" id="tob-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="onb-tob">
                Time of Birth (Optional)
              </label>
              <input
                id="onb-tob"
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="cosmic-input text-sm text-white w-full"
              />
              <p className="text-[10px] text-slate-500" id="tob-tip">
                Permits accurate computation of your Rising Sign (Ascendant) and Moon degree. Defaults to noon.
              </p>
            </div>

            <div className="flex flex-col gap-2" id="pob-group">
              <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase" htmlFor="onb-pob">
                Place of Birth (Optional)
              </label>
              <input
                id="onb-pob"
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="cosmic-input text-sm"
              />
              <p className="text-[10px] text-slate-500" id="pob-tip">
                Assists in geographical coordinates projection for local birth alignments.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="cosmic-btn-gold flex-1 py-4 flex items-center justify-center gap-2 text-base font-semibold"
              id="onb-submit-btn"
            >
              {loading ? (
                <div className="flex items-center gap-3" id="loading-spinner-box">
                  <span className="inline-block w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-xs tracking-widest uppercase font-bold text-slate-900">Configuring Cosmic Matrix...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2" id="onb-submit-content">
                  <Sparkles className="w-5 h-5" />
                  <span>Synchronize Blueprint ✦</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const samples = [
                  { first: "Luna", last: "Aether", dob: "1994-06-21", tob: "07:30", pob: "Sedona, AZ" },
                  { first: "Orion", last: "Sol", dob: "1988-11-11", tob: "14:15", pob: "Mount Shasta, CA" },
                  { first: "Aria", last: "Vance", dob: "1997-03-20", tob: "21:45", pob: "Glastonbury, UK" },
                  { first: "Zephyr", last: "Pheonix", dob: "1991-08-08", tob: "08:08", pob: "Kyoto, Japan" },
                ];
                const pick = samples[Math.floor(Math.random() * samples.length)];
                setFirstName(pick.first);
                setLastName(pick.last);
                setDateOfBirth(pick.dob);
                setTimeOfBirth(pick.tob);
                setPlaceOfBirth(pick.pob);
              }}
              className="py-4 px-5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-teal-500/30 text-teal-300 text-xs font-mono font-medium tracking-wider transition-all flex items-center justify-center gap-2"
              id="onb-sample-btn"
            >
              <span>🎲 Fill Sample Person</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
