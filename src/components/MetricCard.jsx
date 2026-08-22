import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) {
  const colorMap = {
    emerald: {
      pod: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-950/50',
      glow: 'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/10'
    },
    amber: {
      pod: 'border-amber-500/40 text-amber-400 bg-amber-500/10 shadow-lg shadow-amber-950/50',
      glow: 'group-hover:border-amber-500/60 group-hover:shadow-amber-500/10'
    },
    rose: {
      pod: 'border-rose-500/40 text-rose-400 bg-rose-500/10 shadow-lg shadow-rose-950/50',
      glow: 'group-hover:border-rose-500/60 group-hover:shadow-rose-500/10'
    }
  };

  const styleObj = colorMap[color] || colorMap.emerald;

  return (
    <div className={`cmd-card p-5 border border-emerald-950/80 transition-all duration-300 shadow-xl relative overflow-hidden group hover:-translate-y-0.5 ${styleObj.glow}`}>
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400/90 font-mono">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${styleObj.pod} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2 relative z-10">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-slate-400 font-mono">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400 font-normal leading-relaxed relative z-10">
          {subtitle}
        </p>
      )}
    </div>
  );
}

