import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Sliders, 
  RotateCcw, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingReviewsCount = 0, onQuickLoadDemo }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'evaluate', label: 'Evaluate Decision', icon: Sliders },
    { id: 'simulator', label: 'What-If Simulator', icon: RotateCcw },
    { 
      id: 'reviews', 
      label: 'Human Review', 
      icon: UserCheck, 
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : null
    },
    { id: 'audit', label: 'Audit Log', icon: FileText },
    { id: 'tests', label: 'Test Suite', icon: CheckCircle2 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#04070a]/90 backdrop-blur-xl border-b border-emerald-950/80 shadow-xl shadow-black/40">
      
      {/* Top Security & Status Bar */}
      <div className="bg-[#020406]/90 border-b border-emerald-950/80 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-emerald-400/90 tracking-wider">
        <div className="flex items-center gap-2 font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>DOOMSDAY GOVERNANCE ENGINE // ONLINE</span>
        </div>

        <div className="flex items-center gap-4 text-emerald-400 font-bold">
          <span className="text-emerald-300/90">{timeStr}</span>
          <span className="text-emerald-950">|</span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50 text-[10px]">
            STATUS: <span className="text-emerald-400">OPERATIONAL</span>
          </span>
        </div>
      </div>

      {/* Main Command Bar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/50 p-0.5 shadow-lg shadow-emerald-950/60 group-hover:border-emerald-400 group-hover:shadow-emerald-500/20 transition-all flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ShieldAlert className="w-5.5 h-5.5 text-emerald-400 group-hover:scale-110 transition-transform relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight font-sans">
                  AEGIS<span className="text-emerald-400">.AI</span>
                </span>
                <span className="text-[10px] font-bold font-mono tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase shadow-sm">
                  DECISION ENGINE
                </span>
              </div>
              <p className="text-xs text-emerald-400/70 font-medium hidden md:block">
                AI handles what it can. Humans handle what it shouldn't.
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative border ${
                    isActive
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-white hover:bg-emerald-950/40 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse font-mono">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Key Hackathon Demo Case CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={onQuickLoadDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/80 hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all border border-emerald-400/40 font-mono tracking-wide"
              title="Load Key Hackathon Demo Case: High Confidence But Unsafe"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-100 fill-emerald-100/30" />
              <span className="hidden sm:inline">⚡ LOAD DOOMSDAY CASE</span>
              <span className="sm:hidden">KEY DEMO</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 gap-1.5 border-t border-emerald-950/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 rounded-full bg-rose-500 text-white font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

