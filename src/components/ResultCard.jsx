import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  HelpCircle, 
  ArrowRight,
  Calculator,
  Sliders,
  AlertOctagon
} from 'lucide-react';
import { DECISION_TIERS } from '../engine/escalationEngine';

export default function ResultCard({ evaluation, domain, onSendToReview, onOpenSimulator }) {
  if (!evaluation) return null;

  const { tier, riskScore, isOverride, triggers, summary, formulaBreakdown, signals } = evaluation;

  const isHuman = tier === DECISION_TIERS.HUMAN_REVIEW;
  const isCaution = tier === DECISION_TIERS.CAUTION;

  const config = isHuman
    ? {
        title: 'HUMAN REVIEW REQUIRED',
        subtext: 'AI AUTHORIZATION DENIED — MANDATORY HUMAN OVERSIGHT REQUIRED',
        badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm shadow-rose-950',
        cardClass: 'cmd-card-crimson',
        icon: ShieldAlert,
        iconColor: 'text-rose-400',
        accentBtn: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/60'
      }
    : isCaution
    ? {
        title: 'ADDITIONAL VERIFICATION RECOMMENDED',
        subtext: 'AI AUTHORIZATION RESTRICTED — PRE-EXECUTION VERIFICATION RECOMMENDED',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-950',
        cardClass: 'cmd-card-amber',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
        accentBtn: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white shadow-lg shadow-amber-950/60'
      }
    : {
        title: 'AI DECISION CLEARED',
        subtext: 'AUTOMATION AUTHORIZED — AUTOMATIC DISPATCH PERMITTED',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-950',
        cardClass: 'cmd-card-emerald',
        icon: ShieldCheck,
        iconColor: 'text-emerald-400',
        accentBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/60'
      };

  const Icon = config.icon;

  return (
    <div className={`${config.cardClass} p-6 lg:p-8 relative overflow-hidden transition-all shadow-2xl rounded-2xl`}>
      
      {/* Header Alert Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-emerald-950/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className={`p-3.5 rounded-2xl bg-[#04070a]/90 border border-emerald-950 shadow-inner ${config.iconColor}`}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${config.badgeColor}`}>
                {isHuman ? '🔴 Escalation Triggered' : isCaution ? '🟡 Caution Protocol' : '🟢 AI Cleared'}
              </span>
              {isOverride && (
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm">
                  ⚡ Critical Override
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1.5 font-mono uppercase">
              {config.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {config.subtext}
            </p>
          </div>
        </div>

        {/* Risk Score Index Badge */}
        <div className="flex items-center gap-4 bg-[#04070a]/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-950/80 shadow-2xl">
          <div className="text-right font-mono">
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Risk Index</div>
            <div className="text-2xl font-black text-white">{riskScore} <span className="text-xs text-slate-500">/ 100</span></div>
          </div>
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center font-mono text-xl font-black border ${config.badgeColor} shadow-inner`}>
            {riskScore}
          </div>
        </div>
      </div>

      {/* SIGNATURE MOMENT: High Confidence != Safe Decision Callout */}
      {isHuman && signals.confidence >= 85 && (
        <div className="mb-6 bg-[#04070a]/95 backdrop-blur-xl border-2 border-rose-500/50 p-5 rounded-2xl space-y-3.5 relative overflow-hidden shadow-2xl">
          {/* Ambient red pulse glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-400 font-mono border-b border-rose-950/80 pb-2">
            <span className="flex items-center gap-2 text-rose-400 font-extrabold">
              <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
              CRITICAL SAFETY DISCREPANCY
            </span>
            <span className="bg-rose-950/80 border border-rose-500/40 px-2.5 py-0.5 rounded text-[10px] text-rose-300">
              HIGH CONFIDENCE ≠ SAFE DECISION
            </span>
          </div>

          <div className="space-y-2.5 bg-[#06090e] p-4 rounded-xl border border-rose-950/80 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>AI MODEL CONFIDENCE ({signals.confidence}%):</span>
                <span className="text-emerald-400 font-bold">HIGH CONFIDENCE</span>
              </div>
              <div className="w-full h-2 bg-[#04070a] rounded-full overflow-hidden border border-emerald-950">
                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" style={{ width: `${signals.confidence}%` }}></div>
              </div>
            </div>

            <div className="text-center text-rose-400 font-black text-xs font-mono py-0.5 tracking-widest">BUT...</div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>FAIRNESS / BIAS RISK ({signals.fairnessRisk}%):</span>
                <span className="text-rose-400 font-bold">SEVERE RISK</span>
              </div>
              <div className="w-full h-2 bg-[#04070a] rounded-full overflow-hidden border border-rose-950">
                <div className="h-full bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" style={{ width: `${signals.fairnessRisk}%` }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-mono text-slate-300">
                <span>POTENTIAL CONSEQUENCE IMPACT ({signals.potentialImpact}%):</span>
                <span className="text-rose-400 font-bold">CRITICAL IMPACT</span>
              </div>
              <div className="w-full h-2 bg-[#04070a] rounded-full overflow-hidden border border-rose-950">
                <div className="h-full bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e]" style={{ width: `${signals.potentialImpact}%` }}></div>
              </div>
            </div>
          </div>

          <p className="text-xs text-rose-200 leading-relaxed font-semibold italic bg-rose-950/40 p-3 rounded-xl border border-rose-900/60">
            "High AI model confidence alone does not guarantee a safe decision. Severe fairness and consequence impact risks require human oversight."
          </p>
        </div>
      )}

      {/* Summary Message Banner */}
      <div className="mb-6 bg-[#04070a]/90 rounded-xl p-4 border border-emerald-950/80 shadow-inner">
        <p className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
          "{summary}"
        </p>
      </div>

      {/* Grid: Evaluation Factors & Math Contribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Factors */}
        <div className="bg-[#04070a]/90 p-4.5 rounded-xl border border-emerald-950/80">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3 font-mono">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Evaluation Factors & Active Triggers
          </h3>
          <ul className="space-y-2 text-xs">
            {triggers.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300 bg-[#080d14] p-3 rounded-xl border border-emerald-950/80">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">{t.label}: </span>
                  <span className="text-slate-300">{t.detail}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Formula Math */}
        <div className="bg-[#04070a]/90 p-4.5 rounded-xl border border-emerald-950/80 font-mono text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Risk Contribution Math
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-[#080d14] p-2.5 rounded-xl border border-emerald-950/80">
              <span className="text-slate-400">Uncertainty (30%):</span>
              <span className="text-white font-bold">+{formulaBreakdown?.uncertaintyContrib}</span>
            </div>
            <div className="flex justify-between items-center bg-[#080d14] p-2.5 rounded-xl border border-emerald-950/80">
              <span className="text-slate-400">Fairness Risk (25%):</span>
              <span className="text-white font-bold">+{formulaBreakdown?.fairnessContrib}</span>
            </div>
            <div className="flex justify-between items-center bg-[#080d14] p-2.5 rounded-xl border border-emerald-950/80">
              <span className="text-slate-400">Potential Impact (30%):</span>
              <span className="text-white font-bold">+{formulaBreakdown?.impactContrib}</span>
            </div>
            <div className="flex justify-between items-center bg-[#080d14] p-2.5 rounded-xl border border-emerald-950/80">
              <span className="text-slate-400">Confidence Risk (15%):</span>
              <span className="text-white font-bold">+{formulaBreakdown?.confidenceContrib}</span>
            </div>
            <div className="pt-2.5 border-t border-emerald-950 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-semibold">Final Calculated Index:</span>
              <span className="text-emerald-400 font-bold text-base">{riskScore} / 100</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-950/80">
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-[#060b12] hover:bg-emerald-950 border border-emerald-800/80 transition-all font-mono shadow-md"
        >
          <Sliders className="w-4 h-4 text-emerald-400" />
          Test in What-If Simulator
        </button>

        {isHuman && onSendToReview && (
          <button
            onClick={onSendToReview}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold ${config.accentBtn} shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 font-mono tracking-wide`}
          >
            <span>Proceed to Human Governance Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}

