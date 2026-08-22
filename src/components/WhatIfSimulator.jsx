import React, { useState } from 'react';
import SignalSlider from './SignalSlider';
import { evaluateEscalation } from '../engine/escalationEngine';
import { Sliders, RotateCcw, ArrowRight, ShieldAlert, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';

export default function WhatIfSimulator({ initialDomain = 'Finance', initialSignals = { confidence: 96, uncertainty: 4, fairnessRisk: 85, potentialImpact: 90 } }) {
  const [domain, setDomain] = useState(initialDomain);
  const [signals, setSignals] = useState({ ...initialSignals });

  const baselineEval = evaluateEscalation({ domain: initialDomain, ...initialSignals });
  const currentEval = evaluateEscalation({ domain, ...signals });

  const scoreDiff = currentEval.riskScore - baselineEval.riskScore;
  const isTierChanged = currentEval.tier !== baselineEval.tier;

  const handleSliderChange = (key, val) => {
    setSignals(prev => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setDomain(initialDomain);
    setSignals({ ...initialSignals });
  };

  const getTierBadge = (tier) => {
    if (tier === 'HUMAN_REVIEW') {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center gap-1.5 shadow-sm"><ShieldAlert className="w-3.5 h-3.5" />🔴 HUMAN REVIEW</span>;
    }
    if (tier === 'CAUTION') {
      return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5 shadow-sm"><AlertTriangle className="w-3.5 h-3.5" />🟡 CAUTION</span>;
    }
    return <span className="px-2.5 py-1 rounded-md text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm"><ShieldCheck className="w-3.5 h-3.5" />🟢 AI DECISION</span>;
  };

  return (
    <div className="cmd-card-emerald rounded-2xl p-6 lg:p-8 border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight font-mono uppercase">
              Interactive "What-If" Sensitivity Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Modify decision conditions in real time to observe how the deterministic engine shifts escalation outcomes.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-bold font-mono px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/80 shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          Reset Baseline
        </button>
      </div>

      {/* Real-time Diff Comparison Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#04070a]/90 p-5 rounded-2xl border border-emerald-950/80 shadow-inner">
        
        {/* Baseline */}
        <div className="space-y-1.5 bg-[#080d14] p-3.5 rounded-xl border border-emerald-950/80">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Baseline Score</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-white font-mono">{baselineEval.riskScore}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
            {getTierBadge(baselineEval.tier)}
          </div>
        </div>

        {/* Transition Arrow */}
        <div className="flex items-center justify-center py-2 md:py-0">
          <div className="flex flex-col items-center bg-emerald-950/40 px-4 py-2 rounded-xl border border-emerald-900/60 shadow-md">
            <ArrowRight className="w-6 h-6 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-extrabold text-emerald-400 mt-0.5">
              Diff: {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} pts
            </span>
          </div>
        </div>

        {/* Simulated Outcome */}
        <div className="space-y-1.5 bg-[#080d14] p-3.5 rounded-xl border border-emerald-500/40 shadow-lg">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Simulated Outcome</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-emerald-400 font-mono">{currentEval.riskScore}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
            {getTierBadge(currentEval.tier)}
          </div>
        </div>

      </div>

      {/* Analysis Callout */}
      <div className="bg-[#04070a]/90 p-4 rounded-xl border border-emerald-950/80 text-xs font-sans">
        <span className="font-bold text-white font-mono uppercase text-emerald-400 mr-2">Engine Analysis: </span>
        <span className="text-slate-200 font-medium">
          {isTierChanged
            ? `Outcome shifted from ${baselineEval.tier} to ${currentEval.tier}. ${currentEval.summary}`
            : `Outcome remains ${currentEval.tier}. ${currentEval.summary}`}
        </span>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SignalSlider
          label="AI Model Confidence"
          value={signals.confidence}
          onChange={(val) => handleSliderChange('confidence', val)}
          description="Model certainty probability score."
        />

        <SignalSlider
          label="Model Uncertainty"
          value={signals.uncertainty}
          onChange={(val) => handleSliderChange('uncertainty', val)}
          description="Epistemic/data uncertainty."
          overrideNotice={signals.uncertainty >= 80 ? "Uncertainty Override Active (>= 80)" : null}
        />

        <SignalSlider
          label="Fairness / Bias Risk"
          value={signals.fairnessRisk}
          onChange={(val) => handleSliderChange('fairnessRisk', val)}
          description="Disparate impact & compliance risk."
          overrideNotice={signals.fairnessRisk >= 80 ? "Fairness Override Active (>= 80)" : null}
        />

        <SignalSlider
          label="Potential Impact"
          value={signals.potentialImpact}
          onChange={(val) => handleSliderChange('potentialImpact', val)}
          description="Severity of decision consequence."
          overrideNotice={signals.potentialImpact >= 85 ? "Critical Impact Override Active (>= 85)" : null}
        />
      </div>

    </div>
  );
}

