import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Clock, 
  Calendar,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

export default function HumanReview({ onRefreshNav }) {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('Officer Vance (Senior Governance Committee)');
  const [notesMap, setNotesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const logs = await apiService.getAuditLogs();
    
    const pending = logs.filter(l => l.evaluation?.tier === 'HUMAN_REVIEW' && !l.humanReview);
    const completed = logs.filter(l => l.humanReview);

    setPendingReviews(pending);
    setCompletedReviews(completed);
    setLoading(false);

    if (onRefreshNav) onRefreshNav(pending.length);
  };

  const handleAction = async (recordId, status) => {
    const notes = notesMap[recordId] || (
      status === 'APPROVED' ? 'Approved AI decision after human risk verification.' :
      status === 'REJECTED' ? 'Rejected AI recommendation due to governance risk.' :
      'Overrode AI recommendation; applicant provided supplementary mitigating documentation.'
    );

    const res = await apiService.submitHumanReview(recordId, {
      status,
      reviewer: reviewerName,
      notes
    });

    if (res && res.success) {
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
            <UserCheck className="w-4 h-4" />
            <span>Human-in-the-Loop Governance Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-mono">
            Human Review Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            "The human is the final authority for escalated decisions." Review AI recommendations flagged by governance rules.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#04070a] p-3 rounded-2xl border border-emerald-950/80 text-xs font-mono shadow-inner">
          <span className="text-slate-400 font-bold">Reviewer Identity:</span>
          <input
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="bg-[#080d14] text-white font-bold px-3 py-1.5 rounded-xl border border-emerald-800/80 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono uppercase">
            <span>Pending Escalation Dossiers</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm animate-pulse">
              {pendingReviews.length} ACTION REQUIRED
            </span>
          </h2>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="cmd-card p-10 rounded-2xl border border-emerald-950/80 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase font-mono">Queue Cleared</h3>
            <p className="text-xs text-slate-400">No pending escalated decisions require human intervention at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingReviews.map((record) => {
              const { id, timestamp, domain, description, aiRecommendation, signals, evaluation } = record;
              return (
                <div 
                  key={id} 
                  className="cmd-card-crimson rounded-2xl p-6 border border-rose-500/40 shadow-2xl space-y-5 relative overflow-hidden"
                >
                  
                  {/* Card Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/80 pb-3.5">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-2 font-mono shadow-sm">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />🔴 MANDATORY HUMAN REVIEW
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#04070a] text-slate-200 border border-emerald-950 font-mono">
                        {domain}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span>ID: <strong className="text-white">{id}</strong></span>
                      <span>Risk Score: <strong className="text-rose-400 font-bold text-sm">{evaluation?.riskScore}/100</strong></span>
                    </div>
                  </div>

                  {/* Context & AI Recommendation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80">
                      <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1.5 font-mono text-[10px]">Decision Context</span>
                      <p className="text-slate-200 text-sm font-medium leading-relaxed">{description}</p>
                    </div>

                    <div className="bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1.5 font-mono text-[10px]">AI Recommendation</span>
                      <p className="text-emerald-300 font-mono text-sm leading-relaxed">{aiRecommendation}</p>
                    </div>
                  </div>

                  {/* Signals Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#04070a]/90 p-3 rounded-xl border border-emerald-950/80 text-center">
                      <span className="text-slate-400 text-[11px] block font-mono">Confidence</span>
                      <span className="text-base font-bold font-mono text-emerald-400">{signals.confidence}%</span>
                    </div>
                    <div className="bg-[#04070a]/90 p-3 rounded-xl border border-emerald-950/80 text-center">
                      <span className="text-slate-400 text-[11px] block font-mono">Uncertainty</span>
                      <span className="text-base font-bold font-mono text-amber-400">{signals.uncertainty}%</span>
                    </div>
                    <div className="bg-[#04070a]/90 p-3 rounded-xl border border-emerald-950/80 text-center">
                      <span className="text-slate-400 text-[11px] block font-mono">Fairness Risk</span>
                      <span className="text-base font-bold font-mono text-purple-400">{signals.fairnessRisk}%</span>
                    </div>
                    <div className="bg-[#04070a]/90 p-3 rounded-xl border border-emerald-950/80 text-center">
                      <span className="text-slate-400 text-[11px] block font-mono">Potential Impact</span>
                      <span className="text-base font-bold font-mono text-rose-400">{signals.potentialImpact}%</span>
                    </div>
                  </div>

                  {/* Escalation Summary */}
                  <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-500/30 text-xs text-rose-200 space-y-1 shadow-inner">
                    <strong className="text-white block font-bold font-mono uppercase tracking-wider">Engine Escalation Reason:</strong>
                    <p className="leading-relaxed">"{evaluation?.summary}"</p>
                  </div>

                  {/* Notes Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">Human Governance Rationale / Review Notes</label>
                    <textarea
                      rows={2}
                      value={notesMap[id] || ''}
                      onChange={(e) => setNotesMap({ ...notesMap, [id]: e.target.value })}
                      placeholder="Add official human review notes justifying approval, rejection, or override..."
                      className="w-full bg-[#04070a] text-white text-xs rounded-xl p-3 border border-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-rose-950/80">
                    <button
                      onClick={() => handleAction(id, 'APPROVED')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/80 hover:scale-[1.02] active:scale-95 transition-all font-mono tracking-wider"
                    >
                      <Check className="w-4 h-4" />
                      <span>[ AUTHORIZE ]</span>
                    </button>

                    <button
                      onClick={() => handleAction(id, 'REJECTED')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-950/80 hover:scale-[1.02] active:scale-95 transition-all font-mono tracking-wider"
                    >
                      <X className="w-4 h-4" />
                      <span>[ REJECT ]</span>
                    </button>

                    <button
                      onClick={() => handleAction(id, 'OVERRIDDEN')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 shadow-lg transition-all border border-slate-700 font-mono tracking-wider hover:scale-[1.02] active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                      <span>[ OVERRIDE AI ]</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Ledger */}
      {completedReviews.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-emerald-950/80">
          <h2 className="text-lg font-bold text-white flex items-center gap-2.5 font-mono uppercase">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>Completed Governance Reviews Ledger</span>
          </h2>

          <div className="space-y-3">
            {completedReviews.map((rec) => (
              <div key={rec.id} className="cmd-card p-4.5 rounded-2xl border border-emerald-950/80 text-xs flex flex-wrap items-center justify-between gap-4 shadow-lg">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] font-mono border ${
                      rec.humanReview.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      rec.humanReview.status === 'OVERRIDDEN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {rec.humanReview.status}
                    </span>
                    <span className="font-bold text-white font-mono">{rec.domain}</span>
                    <span className="text-slate-500 font-mono text-[10px]">{rec.id}</span>
                  </div>
                  <p className="text-slate-300 mt-1 line-clamp-1">{rec.description}</p>
                  <p className="text-slate-400 italic mt-1 text-[11px] bg-[#04070a] p-2 rounded-lg border border-emerald-950">"{rec.humanReview.notes}"</p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <div>Reviewer: <span className="text-white font-semibold">{rec.humanReview.reviewer}</span></div>
                  <div className="text-slate-500">{new Date(rec.humanReview.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

