import React, { useEffect, useState } from 'react';
import MetricCard from '../components/MetricCard';
import { apiService } from '../services/apiService';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  ArrowUpRight,
  Sparkles,
  Sliders
} from 'lucide-react';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function Dashboard({ onNavigate, onLoadDemoScenario }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await apiService.getMetrics();
    setMetrics(data);
  };

  const pieData = metrics ? [
    { name: 'AI Cleared (🟢)', value: metrics.aiDecisions || 0, color: '#10b981' },
    { name: 'Caution (🟡)', value: metrics.cautionCases || 0, color: '#f59e0b' },
    { name: 'Human Review (🔴)', value: metrics.humanReviews || 0, color: '#f43f5e' }
  ] : [];

  const barData = metrics?.domainBreakdown ? metrics.domainBreakdown.map(d => ({
    domain: d.domain.split(' ')[0],
    AI: d.aiCount,
    Caution: d.cautionCount,
    Human: d.humanCount
  })) : [];

  const autoPercent = metrics?.total > 0 ? Math.round(((metrics?.aiDecisions || 0) / metrics.total) * 100) : 74;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#04070a]/95 backdrop-blur-xl border border-emerald-500/40 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-1">
          {label && <p className="font-bold text-white uppercase mb-1 border-b border-emerald-950 pb-1">{label}</p>}
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill || entry.color }} />
              <span className="text-slate-300 font-medium">{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="cmd-card-emerald p-6 lg:p-8 rounded-2xl border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>DOOMSDAY CRISIS DECISION GOVERNANCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-mono">
              Human-AI Decision <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Escalation Engine</span>
            </h1>

            <p className="text-sm text-emerald-200/90 font-medium leading-relaxed italic">
              "AI handles what it can. Humans handle what it shouldn't."
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
              <button
                onClick={() => onNavigate('evaluate')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/80 hover:scale-[1.02] active:scale-95 transition-all border border-emerald-400/40"
              >
                <Sliders className="w-4 h-4" />
                <span>Evaluate a Decision</span>
              </button>

              <button
                onClick={onLoadDemoScenario}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 font-semibold text-xs transition-all shadow-md hover:border-emerald-400"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Key Demo Case (High Conf But Unsafe)</span>
              </button>
            </div>
          </div>

          {/* AI Control Summary Block */}
          <div className="bg-[#04070a]/90 backdrop-blur-xl p-5 rounded-2xl border border-emerald-500/30 font-mono space-y-3 shrink-0 min-w-[250px] shadow-2xl">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider border-b border-emerald-950/80 pb-2">
              <span>AI DECISION CONTROL</span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ONLINE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>AUTOMATION:</span>
                <span className="text-emerald-400 font-bold font-mono">{autoPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>HUMAN OVERSIGHT:</span>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px]">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>RISK LEVEL:</span>
                <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-[10px]">MODERATE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Readout Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Decisions"
          value={metrics?.total || 0}
          subtitle="Monitored decision stream"
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="AI Decisions"
          value={metrics?.aiDecisions || 0}
          subtitle="🟢 Safe cleared automation"
          icon={ShieldCheck}
          color="emerald"
        />
        <MetricCard
          title="Human Reviews"
          value={metrics?.humanReviews || 0}
          subtitle="🔴 Required expert intervention"
          icon={ShieldAlert}
          color="rose"
        />
        <MetricCard
          title="Escalation Rate"
          value={`${metrics?.escalationRate || 0}%`}
          subtitle={`Avg Risk: ${metrics?.avgRiskScore || 0}/100`}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Outcome Breakdown Donut */}
        <div className="cmd-card p-5 rounded-2xl border border-emerald-950/80 space-y-3">
          <div className="flex items-center justify-between font-mono border-b border-emerald-950 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Outcome Distribution
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900">Live Breakdown</span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {pieData.length > 0 && metrics?.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="#04070a"
                    strokeWidth={3}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs font-mono text-slate-500">No evaluations recorded</div>
            )}
          </div>
        </div>

        {/* Sector Bar Chart */}
        <div className="lg:col-span-2 cmd-card p-5 rounded-2xl border border-emerald-950/80 space-y-3">
          <div className="flex items-center justify-between font-mono border-b border-emerald-950 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Escalation Tiers by Sector
            </h3>
            <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-900">7 Core Domains</span>
          </div>

          <div className="h-56 w-full">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="domain" stroke="#047857" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#047857" fontSize={10} fontFamily="monospace" allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="AI" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Caution" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Human" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">No domain data</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Stream */}
      <div className="cmd-card p-5 rounded-2xl border border-emerald-950/80 space-y-3">
        <div className="flex items-center justify-between font-mono border-b border-emerald-950 pb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Recent Decision Feed
          </h3>
          <button
            onClick={() => onNavigate('audit')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 uppercase transition-colors"
          >
            Audit Log <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-emerald-950/60">
          {metrics?.recent && metrics.recent.length > 0 ? (
            metrics.recent.map((rec) => (
              <div key={rec.id} className="py-3 flex flex-wrap items-center justify-between gap-4 hover:bg-emerald-950/40 px-3 rounded-xl transition-all text-xs font-mono group">
                <div className="flex items-center gap-3.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    rec.evaluation.tier === 'HUMAN_REVIEW' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                    rec.evaluation.tier === 'CAUTION' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">{rec.domain}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{rec.id}</span>
                    </div>
                    <p className="text-slate-400 line-clamp-1 max-w-lg font-sans text-xs mt-0.5">{rec.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-200 block">Risk: {rec.evaluation.riskScore}/100</span>
                    <span className="text-[10px] text-slate-400 block">Conf: {rec.signals.confidence}%</span>
                  </div>
                  <button
                    onClick={() => onNavigate('audit')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-950 border border-transparent hover:border-emerald-800 transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-xs font-mono text-slate-500">No recent evaluations</div>
          )}
        </div>
      </div>

    </div>
  );
}

