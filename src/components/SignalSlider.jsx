import React from 'react';

export default function SignalSlider({ label, value, onChange, description, icon: Icon, overrideNotice }) {
  const getBadgeColor = () => {
    if (label.includes('Confidence')) {
      if (value >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-950';
      if (value >= 60) return 'bg-emerald-950 text-slate-300 border-emerald-900';
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
    if (value >= 80) return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse shadow-sm shadow-rose-950';
    if (value >= 50) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  };

  const getSliderTrackGradient = () => {
    if (label.includes('Confidence')) {
      return `linear-gradient(90deg, #10b981 ${value}%, #060a10 ${value}%)`;
    }
    if (value >= 80) {
      return `linear-gradient(90deg, #f43f5e ${value}%, #060a10 ${value}%)`;
    }
    if (value >= 50) {
      return `linear-gradient(90deg, #f59e0b ${value}%, #060a10 ${value}%)`;
    }
    return `linear-gradient(90deg, #10b981 ${value}%, #060a10 ${value}%)`;
  };

  return (
    <div className="cmd-card p-4 rounded-xl border border-emerald-950/80 hover:border-emerald-500/40 transition-all duration-200">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-emerald-400" />}
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wide font-sans">
            {label}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-md border ${getBadgeColor()}`}>
            {value} / 100
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-normal leading-relaxed">
        {description}
      </p>

      {overrideNotice && (
        <div className="mb-2.5 text-[11px] font-bold text-rose-400 bg-rose-950/50 border border-rose-500/40 px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-mono animate-fadeIn shadow-inner">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
          <span>⚠️ {overrideNotice}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ background: getSliderTrackGradient() }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none border border-emerald-950/80"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>0 (Low)</span>
          <span>50 (Moderate)</span>
          <span>100 (High)</span>
        </div>
      </div>
    </div>
  );
}

