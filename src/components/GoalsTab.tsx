import { useState } from "react";
import { Profile } from "../types";
import { Sparkles, Target, Compass, CheckCircle2, ShieldCheck } from "lucide-react";
import { LIFE_PATH_GOALS } from "../data/knowledge";

interface GoalsTabProps {
  profile: Profile;
}

export default function GoalsTab({ profile }: GoalsTabProps) {
  const comp = profile.computed;
  if (!comp) return null;

  const lp = comp.numerology.lifePath;

  // Retrieve customized goals from knowledge base if available
  const defaultGoals = [
    {
      title: "Point Zero Core Stillness Alignment",
      smart: "Establish a 23.5-minute Point Zero breathing meditation routine at 06:00 AM, 5 days a week, for 30 consecutive days.",
      action: "Set a recurring alarm, download the Solfeggio sound generator, and register compliance in your personal ledger.",
      timeframe: "30 Days",
      category: "Spiritual Integration"
    },
    {
      title: "Sovereign Focus Consolidation",
      smart: "De-clutter your daily calendars by offloading at least 3 non-essential systemic distractions, allocating 90 minutes of daily undisturbed creation time.",
      action: "Audit all active projects, select 2 key channels, and communicate boundaries to external entities.",
      timeframe: "14 Days",
      category: "Mental Clarity"
    },
    {
      title: "Bio-Field Somatic Grounding",
      smart: "Walk barefoot on natural soil/sand for 15 minutes daily to discharge electromagnetic fields, tracking heart rate and mental clarity indexes.",
      action: "Identify a natural green park or soil field close to your physical incarnation coordinates, and schedule daily groundings.",
      timeframe: "21 Days",
      category: "Somatic Grounding"
    }
  ];

  // Safely check for LIFE_PATH_GOALS and fall back
  const pathGoals = (LIFE_PATH_GOALS as any)[lp] || defaultGoals;

  // Track completed goals state locally for interactive fun!
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggleComplete = (idx: number) => {
    setCompleted({ ...completed, [idx]: !completed[idx] });
  };

  return (
    <div className="space-y-8 slide-in" id="goals-tab">
      {/* Header Banner */}
      <div className="glass-card p-8 md:p-10 relative overflow-hidden" id="goals-header-card">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded">Evolutionary Calibration</span>
        <h3 className="text-4xl font-light text-white font-serif mt-3" id="goals-main-title">
          SMART Goals: <span className="gold-text">Life Path {lp} Guidance</span>
        </h3>
        <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-3xl" id="goals-main-desc">
          Your Life Path number radiates a specific blueprint. The following objectives are mathematically calibrated to support your evolutionary trajectory, balancing divine vision with earthly, actionable precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="goals-grid">
        {/* Main interactive goals */}
        <div className="lg:col-span-2 space-y-6" id="goals-list-col">
          {pathGoals.map((goal: any, idx: number) => (
            <div 
              key={idx} 
              className={`glass-card p-6 flex items-start gap-4 transition-all duration-300 relative ${
                completed[idx] ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5"
              }`}
              id={`goal-item-${idx}`}
            >
              {/* Completed overlay */}
              {completed[idx] && (
                <div className="absolute top-4 right-4 text-emerald-400 flex items-center gap-1.5 text-xs font-mono font-bold" id={`complete-badge-${idx}`}>
                  <ShieldCheck className="w-4 h-4" /> COMPLETED
                </div>
              )}

              {/* Index icon */}
              <button 
                onClick={() => toggleComplete(idx)}
                className={`p-3 rounded-xl border flex-shrink-0 transition-colors ${
                  completed[idx] 
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                    : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-400"
                }`}
                id={`goal-checkbox-btn-${idx}`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>

              <div className="space-y-3" id={`goal-content-box-${idx}`}>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded">
                    {goal.category || "Evolutionary Objective"}
                  </span>
                  <h4 className={`text-lg font-semibold text-white mt-2 font-serif ${completed[idx] ? "line-through text-slate-500" : ""}`}>
                    {goal.title}
                  </h4>
                </div>

                <div className="space-y-2 text-sm text-slate-300" id={`goal-steps-${idx}`}>
                  <p id={`goal-step-smart-${idx}`}>
                    <strong className="text-amber-400/80 font-medium">SMART Formulation:</strong> {goal.smart}
                  </p>
                  <p className="text-xs text-slate-400" id={`goal-step-action-${idx}`}>
                    <strong className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Action Item:</strong> {goal.action}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-1" id={`goal-footer-${idx}`}>
                  <span>Timeframe: <strong className="text-white font-mono">{goal.timeframe || "Continuous"}</strong></span>
                  <span className="text-[10px] font-mono">ID: LP{lp}-OBJ{idx+1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar manifest pattern */}
        <div className="space-y-6" id="goals-sidebar">
          <div className="glass-card p-6" id="manifestation-card">
            <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4 border-b border-white/5 pb-3 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-400" /> Manifestation Dynamics
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To manifest your Life Path {lp} blueprint with sovereign speed:
            </p>
            <div className="space-y-4" id="manifestation-steps">
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1" id="mstep-1">
                <span className="font-bold text-amber-300">1. Alchemical Resonance</span>
                <p className="text-slate-400">Ensure your somatic physical body is completely still (Point Zero) before writing intention keys.</p>
              </div>
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1" id="mstep-2">
                <span className="font-bold text-amber-300">2. High Moral Craftsmanship</span>
                <p className="text-slate-400">Commit to beautiful, pristine execution. Do not compromise or skip micro-routines.</p>
              </div>
              <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs space-y-1" id="mstep-3">
                <span className="font-bold text-amber-300">3. Non-Attachment Zero</span>
                <p className="text-slate-400">Release the outcome to the infinite quantum matrix. Trust the vibration of the field.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export {};
