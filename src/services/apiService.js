import { evaluateEscalation } from '../engine/escalationEngine.js';
import { DEMO_SCENARIOS, INITIAL_AUDIT_LOGS } from '../data/demoScenarios.js';

const LOCAL_STORAGE_KEY = 'human_ai_escalation_audit_logs';

function getLocalAuditLogs() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

function saveLocalAuditLogs(logs) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

export const apiService = {
  // 1. Fetch Metrics
  async getMetrics() {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const logs = getLocalAuditLogs();
    const total = logs.length;
    const aiDecisions = logs.filter(l => l.evaluation.tier === 'AI_DECISION').length;
    const cautionCases = logs.filter(l => l.evaluation.tier === 'CAUTION').length;
    const humanReviews = logs.filter(l => l.evaluation.tier === 'HUMAN_REVIEW').length;
    const escalationRate = total > 0 ? Math.round((humanReviews / total) * 100) : 0;
    const avgRiskScore = total > 0 ? Math.round(logs.reduce((acc, l) => acc + l.evaluation.riskScore, 0) / total) : 0;

    return {
      total,
      aiDecisions,
      cautionCases,
      humanReviews,
      escalationRate,
      avgRiskScore,
      recent: logs.slice(0, 5)
    };
  },

  // 2. Fetch Predefined Demo Scenarios
  async getScenarios() {
    try {
      const res = await fetch('/api/scenarios');
      if (res.ok) return await res.json();
    } catch (e) {}
    return DEMO_SCENARIOS;
  },

  // 3. Evaluate Decision
  async evaluateDecision(payload) {
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback Client Engine Calculation
    const evaluation = evaluateEscalation({
      domain: payload.domain,
      confidence: payload.signals.confidence,
      uncertainty: payload.signals.uncertainty,
      fairnessRisk: payload.signals.fairnessRisk,
      potentialImpact: payload.signals.potentialImpact
    });

    const record = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      domain: payload.domain,
      description: payload.description || 'No description provided.',
      aiRecommendation: payload.aiRecommendation || 'No recommendation provided.',
      signals: { ...payload.signals },
      evaluation,
      humanReview: null
    };

    const currentLogs = getLocalAuditLogs();
    const updated = [record, ...currentLogs];
    saveLocalAuditLogs(updated);
    return { success: true, record };
  },

  // 4. Fetch Audit Logs
  async getAuditLogs(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/audit-log?${params}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    let logs = getLocalAuditLogs();
    if (filters.domain && filters.domain !== 'ALL') {
      logs = logs.filter(l => l.domain === filters.domain);
    }
    if (filters.tier && filters.tier !== 'ALL') {
      logs = logs.filter(l => l.evaluation.tier === filters.tier);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      logs = logs.filter(l =>
        l.description.toLowerCase().includes(q) ||
        l.aiRecommendation.toLowerCase().includes(q) ||
        l.domain.toLowerCase().includes(q)
      );
    }
    return logs;
  },

  // 5. Submit Human Review
  async submitHumanReview(recordId, reviewPayload) {
    try {
      const res = await fetch(`/api/reviews/${recordId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const logs = getLocalAuditLogs();
    const index = logs.findIndex(r => r.id === recordId);
    if (index !== -1) {
      logs[index].humanReview = {
        ...reviewPayload,
        timestamp: new Date().toISOString()
      };
      saveLocalAuditLogs(logs);
      return { success: true, record: logs[index] };
    }
    return { success: false, error: 'Record not found' };
  },

  // 6. Synthetic AI Decision Suggestion
  async generateAIDecision(domain) {
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Smart Fallback
    const DOMAIN_DEFAULTS = {
      Healthcare: {
        description: 'Classify tumor growth rate from longitudinal MRI scan series.',
        aiRecommendation: 'Classify as progressive disease; schedule follow-up biopsy.',
        signals: { confidence: 78, uncertainty: 32, fairnessRisk: 15, potentialImpact: 90 }
      },
      Finance: {
        description: 'Evaluate revolving credit line extension for high net worth applicant.',
        aiRecommendation: 'Approve $50,000 credit line increase at standard index rate.',
        signals: { confidence: 94, uncertainty: 6, fairnessRisk: 20, potentialImpact: 75 }
      },
      'Recruitment / HR': {
        description: 'Rank software engineering applicants for fast-track interview scheduling.',
        aiRecommendation: 'Shortlist top 5% based on automated skill challenge score.',
        signals: { confidence: 85, uncertainty: 15, fairnessRisk: 75, potentialImpact: 60 }
      },
      Legal: {
        description: 'Review non-compete clause compliance under updated state labor regulations.',
        aiRecommendation: 'Flag non-compete section as unenforceable under SB-142.',
        signals: { confidence: 91, uncertainty: 9, fairnessRisk: 10, potentialImpact: 80 }
      },
      Government: {
        description: 'Automate housing assistance voucher eligibility calculation.',
        aiRecommendation: 'Approve Tier 2 rental assistance subsidy voucher.',
        signals: { confidence: 96, uncertainty: 4, fairnessRisk: 65, potentialImpact: 85 }
      },
      'Industrial Safety': {
        description: 'Assess pipeline pressure sensor anomaly alert in refinery sector B.',
        aiRecommendation: 'Issue automated alert without immediate safety shutdown.',
        signals: { confidence: 80, uncertainty: 20, fairnessRisk: 0, potentialImpact: 95 }
      },
      'E-commerce': {
        description: 'Automatically process product return request for opened electronics.',
        aiRecommendation: 'Approve return label with 10% restocking fee deduction.',
        signals: { confidence: 97, uncertainty: 3, fairnessRisk: 5, potentialImpact: 15 }
      }
    };
    return DOMAIN_DEFAULTS[domain] || DOMAIN_DEFAULTS.Finance;
  },

  // 7. Run Test Suite
  async runTestSuite() {
    try {
      const res = await fetch('/api/tests');
      if (res.ok) return await res.json();
    } catch (e) {}

    const testCases = [
      { id: 'test-1', name: 'Test 1: Low Risk → AI Decision', domain: 'E-commerce', signals: { confidence: 95, uncertainty: 5, fairnessRisk: 10, potentialImpact: 10 }, expectedTier: 'AI_DECISION' },
      { id: 'test-2', name: 'Test 2: Medium Risk → Caution', domain: 'Finance', signals: { confidence: 70, uncertainty: 40, fairnessRisk: 30, potentialImpact: 45 }, expectedTier: 'CAUTION' },
      { id: 'test-3', name: 'Test 3: High Risk Score → Human Review', domain: 'Finance', signals: { confidence: 40, uncertainty: 70, fairnessRisk: 65, potentialImpact: 75 }, expectedTier: 'HUMAN_REVIEW' },
      { id: 'test-4', name: 'Test 4: High Fairness Risk (>= 80) → Human Review Override', domain: 'Recruitment / HR', signals: { confidence: 96, uncertainty: 5, fairnessRisk: 85, potentialImpact: 40 }, expectedTier: 'HUMAN_REVIEW' },
      { id: 'test-5', name: 'Test 5: High Uncertainty (>= 80) → Human Review Override', domain: 'E-commerce', signals: { confidence: 50, uncertainty: 82, fairnessRisk: 20, potentialImpact: 20 }, expectedTier: 'HUMAN_REVIEW' },
      { id: 'test-6', name: 'Test 6: High Impact (>= 85) in Critical Domain (Healthcare) → Human Review Override', domain: 'Healthcare', signals: { confidence: 98, uncertainty: 2, fairnessRisk: 5, potentialImpact: 90 }, expectedTier: 'HUMAN_REVIEW' }
    ];

    const results = testCases.map(tc => {
      const evalRes = evaluateEscalation({
        domain: tc.domain,
        confidence: tc.signals.confidence,
        uncertainty: tc.signals.uncertainty,
        fairnessRisk: tc.signals.fairnessRisk,
        potentialImpact: tc.signals.potentialImpact
      });
      const passed = evalRes.tier === tc.expectedTier;
      return { ...tc, actualTier: evalRes.tier, riskScore: evalRes.riskScore, isOverride: evalRes.isOverride, summary: evalRes.summary, passed };
    });

    return { allPassed: results.every(r => r.passed), total: results.length, passedCount: results.filter(r => r.passed).length, results };
  },

  // 8. Reset Demo Data
  async resetDemoData() {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}

    saveLocalAuditLogs(INITIAL_AUDIT_LOGS);
    return { success: true, count: INITIAL_AUDIT_LOGS.length };
  }
};
