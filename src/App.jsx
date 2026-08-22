import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import Dashboard from './pages/Dashboard';
import EvaluateDecision from './pages/EvaluateDecision';
import SimulatorPage from './pages/SimulatorPage';
import HumanReview from './pages/HumanReview';
import AuditLog from './pages/AuditLog';
import TestSuite from './pages/TestSuite';
import { apiService } from './services/apiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);

  useEffect(() => {
    updatePendingCount();
  }, [activeTab]);

  const updatePendingCount = async () => {
    try {
      const logs = await apiService.getAuditLogs();
      const count = logs.filter(l => l.evaluation?.tier === 'HUMAN_REVIEW' && !l.humanReview).length;
      setPendingReviewsCount(count);
    } catch (e) {}
  };

  const handleQuickLoadKeyDemo = () => {
    setSelectedScenarioId('scenario-3-unsafe-confidence');
    setActiveTab('evaluate');
  };

  return (
    <div className="min-h-screen bg-[#04070a] text-slate-100 flex flex-col font-sans selection:bg-emerald-950 selection:text-emerald-300">
      
      {/* Top Classification Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Navigation Command Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingReviewsCount={pendingReviewsCount}
        onQuickLoadDemo={handleQuickLoadKeyDemo}
      />

      {/* Main Content Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={(tab) => setActiveTab(tab)}
            onLoadDemoScenario={handleQuickLoadKeyDemo}
          />
        )}

        {activeTab === 'evaluate' && (
          <EvaluateDecision
            selectedScenarioId={selectedScenarioId}
            onNavigateToReviews={() => setActiveTab('reviews')}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorPage />
        )}

        {activeTab === 'reviews' && (
          <HumanReview
            onRefreshNav={(cnt) => setPendingReviewsCount(cnt)}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLog />
        )}

        {activeTab === 'tests' && (
          <TestSuite />
        )}
      </main>

      {/* Doomsday Green Footer */}
      <footer className="border-t border-emerald-950/80 bg-[#020406]/90 backdrop-blur-xl py-6 px-4 sm:px-6 lg:px-8 mt-16 text-xs font-mono text-emerald-400/80 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-extrabold text-xs border border-emerald-700/50 shadow-md shadow-emerald-950">
              Æ
            </div>
            <span className="font-semibold text-slate-200 font-sans tracking-wide">AEGIS.AI — Human-AI Decision Escalation Engine</span>
          </div>

          <div className="text-center font-mono text-[11px] text-emerald-400/90 italic bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
            "AI handles what it can. Humans handle what it shouldn't."
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-lg bg-[#04070a] border border-emerald-800/60 text-[10px] text-emerald-400 font-mono flex items-center gap-2 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Engine Status: Operational</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
