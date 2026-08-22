import React from 'react';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { Sparkles, Sliders } from 'lucide-react';

export default function SimulatorPage() {
  const featuredScenario = DEMO_SCENARIOS.find(s => s.isFeatured) || DEMO_SCENARIOS[2];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div className="border-b border-emerald-950/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
          <Sliders className="w-4 h-4" />
          <span>Interactive Risk Sensitivity Sandbox</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1 uppercase font-mono">
          What-If Risk Simulator
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Demonstrate how changing individual signals affects the calculated risk score and decision outcome tier in real time. Prove that confidence alone cannot prevent escalation when impact or fairness risks exist.
        </p>
      </div>

      {/* Simulator Instance */}
      <WhatIfSimulator
        initialDomain={featuredScenario.domain}
        initialSignals={featuredScenario.signals}
      />

    </div>
  );
}

