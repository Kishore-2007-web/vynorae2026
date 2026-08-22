import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import AuditDetailModal from '../components/AuditDetailModal';
import { ALL_DOMAINS } from '../engine/escalationEngine';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye,
  Calendar
} from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalRecord, setActiveModalRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [selectedDomain, selectedTier, searchQuery]);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await apiService.getAuditLogs({
      domain: selectedDomain,
      tier: selectedTier,
      search: searchQuery
    });
    setLogs(data);
    setLoading(false);
  };

  const handleReset = async () => {
    if (window.confirm('Reset audit log dataset to initial demo state?')) {
      await apiService.resetDemoData();
      fetchLogs();
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Domain', 'Description', 'AI Recommendation', 'Confidence', 'Uncertainty', 'FairnessRisk', 'Impact', 'RiskScore', 'Tier', 'HumanStatus'];
    const rows = logs.map(l => [
      l.id,
      l.timestamp,
      `"${l.domain}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      `"${l.aiRecommendation.replace(/"/g, '""')}"`,
      l.signals.confidence,
      l.signals.uncertainty,
      l.signals.fairnessRisk,
      l.signals.potentialImpact,
      l.evaluation.riskScore,
      l.evaluation.tier,
      l.humanReview ? l.humanReview.status : 'PENDING'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `decision_governance_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            <FileText className="w-4 h-4" />
            <span>Decision Governance Audit Trail</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 font-mono uppercase">
            System Audit Log
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Complete immutable ledger recording AI recommendations, signal inputs, risk calculations, escalation outcomes, and human review actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/80 shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all border border-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="cmd-card p-4.5 rounded-2xl border border-emerald-950/80 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search description, domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#04070a] text-white text-xs font-medium rounded-xl pl-9 pr-3.5 py-2.5 border border-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
            />
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-[#04070a] text-white rounded-xl px-3.5 py-2.5 border border-emerald-950 focus:outline-none text-xs font-mono font-medium shadow-inner"
            >
              <option value="ALL">All Domains</option>
              {ALL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="bg-[#04070a] text-white rounded-xl px-3.5 py-2.5 border border-emerald-950 focus:outline-none text-xs font-mono font-medium shadow-inner"
            >
              <option value="ALL">All Outcome Tiers</option>
              <option value="AI_DECISION">🟢 AI Decision</option>
              <option value="CAUTION">🟡 Caution</option>
              <option value="HUMAN_REVIEW">🔴 Human Review</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono bg-[#04070a] px-3.5 py-2 rounded-xl border border-emerald-950">
          Total Records: <strong className="text-emerald-400">{logs.length}</strong>
        </div>

      </div>

      {/* Audit Log Data Table */}
      <div className="cmd-card rounded-2xl border border-emerald-950/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#04070a]/90 text-emerald-400 font-mono text-[11px] uppercase tracking-wider border-b border-emerald-950">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Domain</th>
                <th className="p-4">Decision Description</th>
                <th className="p-4 text-center">Signals (C/U/F/I)</th>
                <th className="p-4 text-center">Risk Score</th>
                <th className="p-4 text-center">Outcome Tier</th>
                <th className="p-4 text-center">Human Action</th>
                <th className="p-4 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-sans">
              {logs.length > 0 ? (
                logs.map((record) => {
                  const { id, timestamp, domain, description, signals, evaluation, humanReview } = record;
                  const isHuman = evaluation.tier === 'HUMAN_REVIEW';
                  const isCaution = evaluation.tier === 'CAUTION';

                  return (
                    <tr 
                      key={id}
                      onClick={() => setActiveModalRecord(record)}
                      className="hover:bg-emerald-950/40 cursor-pointer transition-colors group"
                    >
                      <td className="p-4 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 font-bold text-white whitespace-nowrap group-hover:text-emerald-300 transition-colors">
                        {domain}
                      </td>
                      <td className="p-4 text-slate-300 max-w-xs truncate text-xs font-medium">
                        {description}
                      </td>
                      <td className="p-4 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        <span className="text-emerald-400 font-bold">{signals.confidence}</span> / <span className="text-amber-400 font-bold">{signals.uncertainty}</span> / <span className="text-purple-400 font-bold">{signals.fairnessRisk}</span> / <span className="text-rose-400 font-bold">{signals.potentialImpact}</span>
                      </td>
                      <td className="p-4 text-center font-mono font-black text-white text-sm whitespace-nowrap">
                        {evaluation.riskScore}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {isHuman ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm">
                            🔴 HUMAN REVIEW
                          </span>
                        ) : isCaution ? (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
                            🟡 CAUTION
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                            🟢 AI DECISION
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {humanReview ? (
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            humanReview.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            humanReview.status === 'OVERRIDDEN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}>
                            {humanReview.status}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono text-[10px]">
                            {isHuman ? 'Pending' : 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-950 border border-transparent hover:border-emerald-800 transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-500 font-mono text-xs">
                    No matching audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Modal Drawer */}
      {activeModalRecord && (
        <AuditDetailModal
          record={activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
        />
      )}

    </div>
  );
}

