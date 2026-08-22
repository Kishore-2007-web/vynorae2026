import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  ShieldCheck, 
  ShieldAlert, 
  Calculator,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function TestSuite() {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    const data = await apiService.runTestSuite();
    setTestResults(data);
    setIsRunning(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Deterministic Rule Engine Validation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-mono">
            Automated Engine Test Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Interactive verification of all 6 core test cases required to validate deterministic score accuracy and critical safety override rules.
          </p>
        </div>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/80 hover:scale-[1.02] active:scale-95 transition-all font-mono tracking-wider border border-emerald-400/30"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Verification...' : 'Run All Test Cases'}</span>
        </button>
      </div>

      {/* Summary Callout Banner */}
      {testResults && (
        <div className={`p-6 rounded-2xl border flex items-center justify-between gap-4 shadow-2xl ${
          testResults.allPassed
            ? 'cmd-card-emerald text-emerald-300'
            : 'cmd-card-crimson text-rose-300'
        }`}>
          <div className="flex items-center gap-3.5">
            {testResults.allPassed ? (
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
              </div>
            ) : (
              <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-inner">
                <XCircle className="w-8 h-8 shrink-0" />
              </div>
            )}
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-wider font-mono">
                {testResults.allPassed ? 'ALL TEST SUITE CASES PASSED 100%' : 'SOME TEST CASES FAILED'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                {testResults.passedCount} of {testResults.total} deterministic evaluation test assertions passed successfully.
              </p>
            </div>
          </div>

          <span className="font-mono font-black text-xl px-4 py-1.5 bg-[#04070a] rounded-xl border border-emerald-950 text-white shadow-inner">
            {testResults.passedCount} / {testResults.total}
          </span>
        </div>
      )}

      {/* Test Cases Grid */}
      <div className="space-y-4">
        {testResults?.results?.map((tc, idx) => (
          <div key={tc.id} className="cmd-card p-5 rounded-2xl border border-emerald-950/80 space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-950/80 pb-3">
              <div className="flex items-center gap-3">
                {tc.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-mono">{tc.name}</h4>
                  <span className="text-xs text-slate-400 font-mono">Domain: {tc.domain}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Risk Score: <strong className="text-white font-bold">{tc.riskScore}/100</strong></span>
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                  tc.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm'
                }`}>
                  {tc.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>

            {/* Signal Values & Trace */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-[#04070a]/90 p-3.5 rounded-xl border border-emerald-950/80">
              <div>Conf: <span className="text-emerald-400 font-bold">{tc.signals.confidence}%</span></div>
              <div>Uncert: <span className="text-amber-400 font-bold">{tc.signals.uncertainty}%</span></div>
              <div>Fairness: <span className="text-purple-400 font-bold">{tc.signals.fairnessRisk}%</span></div>
              <div>Impact: <span className="text-rose-400 font-bold">{tc.signals.potentialImpact}%</span></div>
            </div>

            <div className="text-xs text-slate-300 bg-[#080d14] p-3.5 rounded-xl border border-emerald-950/80 font-sans space-y-1">
              <div className="flex items-center justify-between mb-1 text-slate-400 font-mono text-[11px]">
                <span>Expected Tier: <strong className="text-white">{tc.expectedTier}</strong></span>
                <span>Actual Tier: <strong className="text-emerald-400 font-bold">{tc.actualTier}</strong></span>
              </div>
              <p className="text-slate-400 italic">"{tc.summary}"</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

