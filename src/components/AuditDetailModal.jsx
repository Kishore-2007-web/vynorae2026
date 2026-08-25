import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, UserCheck, Calendar, Hash, HelpCircle, Calculator } from 'lucide-react';

export default function AuditDetailModal({ record, onClose }) {
  if (!record) return null;

  const { id, timestamp, domain, description, aiRecommendation, signals, evaluation, humanReview } = record;

  const isHuman = evaluation?.tier === 'HUMAN_REVIEW';
  const isCaution = evaluation?.tier === 'CAUTION';

  return (
    <div className="fixed inset-0 z-50 bg-[#04070a]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="cmd-card-emerald border border-emerald-500/40 rounded-2xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-950/80 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{id}</span>
                <span className="text-xs font-semibold font-mono px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {domain}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5 font-mono uppercase">
                Audit Record Dossiers
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-emerald-950 transition-colors border border-transparent hover:border-emerald-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timestamp & Outcome */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80 shadow-inner">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Timestamp: {new Date(timestamp).toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Risk Index: <strong className="text-white font-bold">{evaluation?.riskScore}/100</strong></span>
            {isHuman ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 font-mono shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5" />🔴 HUMAN REVIEW
              </span>
            ) : isCaution ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 font-mono shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" />🟡 CAUTION
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 font-mono shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />🟢 AI CLEARED
              </span>
            )}
          </div>
        </div>

        {/* Description & Recommendation */}
        <div className="space-y-3.5 text-xs">
          <div className="bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1.5 font-mono text-[10px]">Decision Context</span>
            <p className="text-slate-200 text-sm font-medium leading-relaxed">{description}</p>
          </div>

          <div className="bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1.5 font-mono text-[10px]">AI Recommendation</span>
            <p className="text-emerald-300 font-mono text-sm leading-relaxed">{aiRecommendation}</p>
          </div>
        </div>

        {/* Evaluation Signals Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#04070a]/90 p-3.5 rounded-xl border border-emerald-950/80 text-center">
            <span className="text-slate-400 block text-[11px]">AI Confidence</span>
            <span className="text-lg font-bold text-emerald-400">{signals?.confidence}%</span>
          </div>
          <div className="bg-[#04070a]/90 p-3.5 rounded-xl border border-emerald-950/80 text-center">
            <span className="text-slate-400 block text-[11px]">Uncertainty</span>
            <span className="text-lg font-bold text-amber-400">{signals?.uncertainty}%</span>
          </div>
          <div className="bg-[#04070a]/90 p-3.5 rounded-xl border border-emerald-950/80 text-center">
            <span className="text-slate-400 block text-[11px]">Fairness Risk</span>
            <span className="text-lg font-bold text-purple-400">{signals?.fairnessRisk}%</span>
          </div>
          <div className="bg-[#04070a]/90 p-3.5 rounded-xl border border-emerald-950/80 text-center">
            <span className="text-slate-400 block text-[11px]">Potential Impact</span>
            <span className="text-lg font-bold text-rose-400">{signals?.potentialImpact}%</span>
          </div>
        </div>

        {/* Triggers Breakdown */}
        <div className="bg-[#04070a]/90 p-4.5 rounded-xl border border-emerald-950/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2 font-mono">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Decision Triggers & Directive
          </h4>
          <p className="text-xs text-slate-300 mb-3 italic font-sans leading-relaxed">"{evaluation?.summary}"</p>
          <div className="space-y-2 text-xs font-mono">
            {evaluation?.triggers?.map((t, i) => (
              <div key={i} className="bg-[#080d14] p-3 rounded-xl border border-emerald-950/80 text-slate-300">
                <strong className="text-white">{t.label}:</strong> {t.detail}
              </div>
            ))}
          </div>
        </div>

        {/* Human Governance Audit Stamp */}
        <div className="bg-[#04070a]/90 p-4.5 rounded-xl border border-emerald-950/80 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-mono">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Human Review Status & Audit Stamp
          </h4>

          {humanReview ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Review Decision:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded text-[11px] border ${humanReview.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                    humanReview.status === 'OVERRIDDEN' ? 'bg-purple-950 text-purple-300 border-purple-800' : 'bg-rose-950 text-rose-400 border-rose-900'
                  }`}>
                  {humanReview.status}
                </span>
              </div>
              <div className="text-slate-400">
                Reviewer: <span className="text-white font-semibold">{humanReview.reviewer}</span>
              </div>
              <div className="text-slate-400">
                Review Date: <span className="text-white">{new Date(humanReview.timestamp).toLocaleString()}</span>
              </div>
              <div className="bg-[#080d14] p-3 rounded-xl border border-emerald-950/80 text-slate-300 italic font-sans">
                "{humanReview.notes}"
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic font-mono">
              {isHuman ? 'Pending action in Human Review Queue.' : 'Auto-processed; no human intervention required.'}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-emerald-950/80">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold font-mono bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 transition-colors shadow-md"
          >
            Close Detail View
          </button>
        </div>

      </div>
    </div>
  );
}

