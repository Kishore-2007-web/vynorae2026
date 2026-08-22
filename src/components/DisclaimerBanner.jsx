import React, { useState } from 'react';
import { Shield, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/40 to-slate-950/70 border-b border-emerald-500/25 backdrop-blur-md text-emerald-300 text-xs px-4 py-1.5 flex items-center justify-between gap-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Shield className="w-3.5 h-3.5" />
        </div>
        <p className="font-medium text-emerald-200/90 text-[11px] font-mono">
          <strong className="text-emerald-400 font-bold uppercase tracking-wider">Safety Governance Prototype:</strong> Simulated human-AI escalation engine for hackathon demonstration.
        </p>
      </div>
      <button 
        onClick={() => setDismissed(true)} 
        className="text-emerald-400/70 hover:text-emerald-200 transition-colors p-1 rounded-md hover:bg-emerald-900/40"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

