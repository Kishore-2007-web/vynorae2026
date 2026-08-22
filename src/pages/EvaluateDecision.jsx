import React, { useState, useEffect, useRef } from 'react';
import SignalSlider from '../components/SignalSlider';
import ResultCard from '../components/ResultCard';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { ALL_DOMAINS, evaluateEscalation } from '../engine/escalationEngine';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { apiService } from '../services/apiService';
import { 
  Sliders, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Send,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function EvaluateDecision({ selectedScenarioId, onNavigateToReviews, onNavigateToSimulator }) {
  const [domain, setDomain] = useState('Finance');
  const [description, setDescription] = useState('Evaluate commercial loan application for small business credit line expansion.');
  const [aiRecommendation, setAiRecommendation] = useState('Reject loan application due to predicted default risk score exceeding cutoff threshold.');
  
  const [signals, setSignals] = useState({
    confidence: 96,
    uncertainty: 4,
    fairnessRisk: 85,
    potentialImpact: 90
  });

  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [loggedToast, setLoggedToast] = useState(false);

  const resultRef = useRef(null);

  // Live recalculation on input change
  useEffect(() => {
    const evalRes = evaluateEscalation({
      domain,
      confidence: signals.confidence,
      uncertainty: signals.uncertainty,
      fairnessRisk: signals.fairnessRisk,
      potentialImpact: signals.potentialImpact
    });
    setEvaluationResult({
      domain,
      description,
      aiRecommendation,
      signals: { ...signals },
      evaluation: evalRes
    });
  }, [domain, description, aiRecommendation, signals]);

  useEffect(() => {
    if (selectedScenarioId) {
      const found = DEMO_SCENARIOS.find(s => s.id === selectedScenarioId);
      if (found) {
        loadScenario(found);
      }
    }
  }, [selectedScenarioId]);

  const loadScenario = (scenario) => {
    setDomain(scenario.domain);
    setDescription(scenario.description);
    setAiRecommendation(scenario.aiRecommendation);
    setSignals({ ...scenario.signals });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSliderChange = (key, val) => {
    setSignals(prev => ({ ...prev, [key]: val }));
  };

  const handleSynthesizeAI = async () => {
    setIsGeneratingAI(true);
    const mock = await apiService.generateAIDecision(domain);
    setDescription(mock.description);
    setAiRecommendation(mock.aiRecommendation);
    setSignals({ ...mock.signals });
    setIsGeneratingAI(false);
  };

  const handleAnalyzeDecision = async () => {
    setIsAnalyzing(true);
    
    setAnalysisStepText('ANALYZING SIGNALS...');
    setAnalysisProgress(30);
    await new Promise(r => setTimeout(r, 200));

    setAnalysisStepText('ASSESSING UNCERTAINTY...');
    setAnalysisProgress(55);
    await new Promise(r => setTimeout(r, 200));

    setAnalysisStepText('EVALUATING FAIRNESS...');
    setAnalysisProgress(80);
    await new Promise(r => setTimeout(r, 200));

    setAnalysisStepText('CALCULATING IMPACT...');
    setAnalysisProgress(100);
    await new Promise(r => setTimeout(r, 200));

    const payload = {
      domain,
      description,
      aiRecommendation,
      signals
    };

    const res = await apiService.evaluateDecision(payload);
    if (res && res.record) {
      setEvaluationResult(res.record);
    }

    setIsAnalyzing(false);
    setLoggedToast(true);

    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      setLoggedToast(false);
    }, 3500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-950/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase font-mono">
            DECISION ANALYSIS STUDIO
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Input decision context and signals to execute deterministic risk score analysis and enforce mandatory human escalation rules.
          </p>
        </div>

        <button
          onClick={handleSynthesizeAI}
          disabled={isGeneratingAI}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all shadow-md hover:border-emerald-400 font-mono"
        >
          <Sparkles className={`w-4 h-4 text-emerald-400 ${isGeneratingAI ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAI ? 'Synthesizing Decision...' : 'Synthesize AI Context'}</span>
        </button>
      </div>

      {/* Predefined Crisis Scenarios Bar */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
          <Zap className="w-4 h-4 text-emerald-400" />
          Predefined Crisis Scenarios (Click to Load)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.slice(0, 3).map((scenario) => {
            const isFeatured = scenario.isFeatured;
            return (
              <button
                key={scenario.id}
                onClick={() => loadScenario(scenario)}
                className={`text-left p-4.5 rounded-2xl border transition-all relative overflow-hidden group shadow-lg ${
                  isFeatured
                    ? 'cmd-card-crimson hover:border-rose-400 hover:scale-[1.01]'
                    : 'cmd-card hover:border-emerald-500/50 hover:scale-[1.01]'
                }`}
              >
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-bl-xl shadow font-mono">
                    KEY DEMO CASE ★
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-2 font-mono">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase border ${
                    scenario.expectedTier === 'AI_DECISION' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    scenario.expectedTier === 'CAUTION' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {scenario.tag}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{scenario.domain}</span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {scenario.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-2">
                  {scenario.keyPoint}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form & Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context Inputs */}
        <div className="lg:col-span-1 space-y-5 cmd-card p-6 rounded-2xl border border-emerald-950/80 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-950 pb-3 font-mono">
            1. Context & AI Recommendation
          </h3>

          {/* Domain Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">Target Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-[#04070a] text-white text-xs font-medium rounded-xl px-3.5 py-3 border border-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
            >
              {ALL_DOMAINS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Decision Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">Decision Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Should this commercial credit loan application be approved?"
              className="w-full bg-[#04070a] text-white text-xs font-medium rounded-xl p-3 border border-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 leading-relaxed shadow-inner"
            />
          </div>

          {/* AI Recommendation */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">AI Model Recommendation</label>
            <textarea
              rows={3}
              value={aiRecommendation}
              onChange={(e) => setAiRecommendation(e.target.value)}
              placeholder="e.g. Reject the loan application based on credit default prediction model."
              className="w-full bg-[#04070a] text-emerald-300 font-mono text-xs rounded-xl p-3 border border-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 leading-relaxed shadow-inner"
            />
          </div>
        </div>

        {/* Right Column: Signal Sliders */}
        <div className="lg:col-span-2 space-y-5 cmd-card p-6 rounded-2xl border border-emerald-950/80 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 border-b border-emerald-950 pb-3 font-mono">
            2. Structured Evaluation Signals (0 - 100)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SignalSlider
              label="AI Model Confidence"
              value={signals.confidence}
              onChange={(val) => handleSliderChange('confidence', val)}
              description="Model certainty level. Higher values reduce confidence risk contribution."
            />

            <SignalSlider
              label="Model Uncertainty"
              value={signals.uncertainty}
              onChange={(val) => handleSliderChange('uncertainty', val)}
              description="Epistemic/data uncertainty. Values >= 80 trigger override."
              overrideNotice={signals.uncertainty >= 80 ? "Uncertainty Override Active (>= 80)" : null}
            />

            <SignalSlider
              label="Fairness / Bias Risk"
              value={signals.fairnessRisk}
              onChange={(val) => handleSliderChange('fairnessRisk', val)}
              description="Potential disparate impact & compliance risk. Values >= 80 force human review."
              overrideNotice={signals.fairnessRisk >= 80 ? "Fairness Override Active (>= 80)" : null}
            />

            <SignalSlider
              label="Potential Impact"
              value={signals.potentialImpact}
              onChange={(val) => handleSliderChange('potentialImpact', val)}
              description="Severity of decision consequence. Values >= 85 in critical domains force human review."
              overrideNotice={signals.potentialImpact >= 85 ? "Critical Impact Override Active (>= 85)" : null}
            />
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-emerald-950/80">
            {isAnalyzing ? (
              <div className="space-y-1.5 bg-[#04070a] p-3 rounded-xl border border-emerald-500/40 flex-1 shadow-inner font-mono">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                  <span>{analysisStepText}</span>
                  <span>{analysisProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-emerald-950">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-200 shadow-[0_0_8px_#10b981]" style={{ width: `${analysisProgress}%` }}></div>
                </div>
              </div>
            ) : loggedToast ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-2 rounded-xl flex items-center gap-2 animate-fadeIn shadow-md font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evaluation Committed to Audit Trail!
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 italic font-mono">
                * Risk index score updates live in real-time as you adjust sliders.
              </span>
            )}

            <button
              onClick={handleAnalyzeDecision}
              disabled={isAnalyzing}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/80 hover:scale-[1.02] active:scale-95 transition-all shrink-0 font-mono tracking-wider border border-emerald-400/30"
            >
              <Send className="w-4 h-4" />
              <span>ANALYZE DECISION</span>
            </button>
          </div>
        </div>

      </div>

      {/* Result Outcome Display */}
      {evaluationResult && (
        <div ref={resultRef} className="space-y-6">
          <ResultCard
            evaluation={evaluationResult.evaluation}
            domain={evaluationResult.domain}
            onSendToReview={onNavigateToReviews}
            onOpenSimulator={() => setShowSimulator(!showSimulator)}
          />

          {showSimulator && (
            <WhatIfSimulator
              initialDomain={evaluationResult.domain}
              initialSignals={evaluationResult.signals}
            />
          )}
        </div>
      )}

    </div>
  );
}

