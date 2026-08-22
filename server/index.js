import express from 'express';
import cors from 'cors';
import { evaluateEscalation, ALL_DOMAINS, CRITICAL_DOMAINS, DECISION_TIERS } from '../src/engine/escalationEngine.js';
import { DEMO_SCENARIOS } from '../src/data/demoScenarios.js';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Human-AI Decision Escalation Engine v1.0', timestamp: new Date().toISOString() });
});

// 2. Predefined Scenarios
app.get('/api/scenarios', (req, res) => {
  res.json(DEMO_SCENARIOS);
});

// 3. Evaluate Decision Endpoint
app.post('/api/evaluate', (req, res) => {
  try {
    const { domain, description, aiRecommendation, signals } = req.body;

    if (!domain || !signals) {
      return res.status(400).json({ error: 'Domain and signals are required.' });
    }

    const evaluation = evaluateEscalation({
      domain,
      confidence: signals.confidence,
      uncertainty: signals.uncertainty,
      fairnessRisk: signals.fairnessRisk,
      potentialImpact: signals.potentialImpact
    });

    const record = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      domain,
      description: description || 'No description provided.',
      aiRecommendation: aiRecommendation || 'No recommendation provided.',
      signals: {
        confidence: Number(signals.confidence),
        uncertainty: Number(signals.uncertainty),
        fairnessRisk: Number(signals.fairnessRisk),
        potentialImpact: Number(signals.potentialImpact)
      },
      evaluation,
      humanReview: null
    };

    const savedRecord = db.addAuditRecord(record);
    res.json({ success: true, record: savedRecord });
  } catch (err) {
    console.error('Error during evaluation API:', err);
    res.status(500).json({ error: 'Internal server error evaluating decision.' });
  }
});

// 4. Audit Log Endpoint
app.get('/api/audit-log', (req, res) => {
  try {
    const logs = db.getAuditLogs();
    const { domain, tier, search } = req.query;

    let filtered = [...logs];
    if (domain && domain !== 'ALL') {
      filtered = filtered.filter(l => l.domain === domain);
    }
    if (tier && tier !== 'ALL') {
      filtered = filtered.filter(l => l.evaluation.tier === tier);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.description.toLowerCase().includes(q) ||
        l.aiRecommendation.toLowerCase().includes(q) ||
        l.domain.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed fetching audit log.' });
  }
});

// 5. Submit Human Review
app.post('/api/reviews/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewer, notes } = req.body;

    if (!['APPROVED', 'REJECTED', 'OVERRIDDEN'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be APPROVED, REJECTED, or OVERRIDDEN.' });
    }

    const updated = db.updateHumanReview(id, {
      status,
      reviewer: reviewer || 'Human Governance Officer',
      notes: notes || 'No notes added.'
    });

    if (!updated) {
      return res.status(404).json({ error: 'Audit record not found.' });
    }

    res.json({ success: true, record: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed updating human review.' });
  }
});

// 6. Aggregated Dashboard Metrics
app.get('/api/metrics', (req, res) => {
  try {
    const logs = db.getAuditLogs();
    const total = logs.length;
    const aiDecisions = logs.filter(l => l.evaluation.tier === DECISION_TIERS.AI_DECISION).length;
    const cautionCases = logs.filter(l => l.evaluation.tier === DECISION_TIERS.CAUTION).length;
    const humanReviews = logs.filter(l => l.evaluation.tier === DECISION_TIERS.HUMAN_REVIEW).length;

    const escalationRate = total > 0 ? Math.round((humanReviews / total) * 100) : 0;
    const avgRiskScore = total > 0 ? Math.round(logs.reduce((acc, l) => acc + l.evaluation.riskScore, 0) / total) : 0;

    // Breakdown by domain
    const domainBreakdown = ALL_DOMAINS.map(d => {
      const dLogs = logs.filter(l => l.domain === d);
      return {
        domain: d,
        total: dLogs.length,
        aiCount: dLogs.filter(l => l.evaluation.tier === DECISION_TIERS.AI_DECISION).length,
        cautionCount: dLogs.filter(l => l.evaluation.tier === DECISION_TIERS.CAUTION).length,
        humanCount: dLogs.filter(l => l.evaluation.tier === DECISION_TIERS.HUMAN_REVIEW).length
      };
    });

    res.json({
      total,
      aiDecisions,
      cautionCases,
      humanReviews,
      escalationRate,
      avgRiskScore,
      domainBreakdown,
      recent: logs.slice(0, 5)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed computing metrics.' });
  }
});

// 7. Synthetic AI Generation Endpoint
app.post('/api/ai-generate', (req, res) => {
  const { domain, scenarioType } = req.body;
  const dom = domain || 'Finance';

  const MOCK_GEN = {
    Healthcare: {
      description: 'Evaluate patient eligibility for experimental oncology clinical trial standard protocol.',
      aiRecommendation: 'Approve enrolment in Phase II trial arm based on genomic markers.',
      signals: { confidence: 75, uncertainty: 35, fairnessRisk: 25, potentialImpact: 92 }
    },
    Finance: {
      description: 'Evaluate mortgage credit pre-approval for primary residential property purchase.',
      aiRecommendation: 'Pre-approve $450,000 jumbo loan with 6.2% fixed APR.',
      signals: { confidence: 91, uncertainty: 8, fairnessRisk: 40, potentialImpact: 75 }
    },
    'Recruitment / HR': {
      description: 'Filter candidates for executive leadership promotion shortlist.',
      aiRecommendation: 'Select candidate A based on performance ratings and 360 review score.',
      signals: { confidence: 84, uncertainty: 20, fairnessRisk: 81, potentialImpact: 70 }
    },
    Legal: {
      description: 'Assess contract liability clause risk for enterprise SaaS SLA agreement.',
      aiRecommendation: 'Flag Clause 14.2 for custom indemnification cap modification.',
      signals: { confidence: 89, uncertainty: 12, fairnessRisk: 15, potentialImpact: 88 }
    },
    Government: {
      description: 'Automate municipal zoning variance permit approval for small business signage.',
      aiRecommendation: 'Grant variance permit under section 4B municipal ordinance.',
      signals: { confidence: 95, uncertainty: 5, fairnessRisk: 10, potentialImpact: 30 }
    },
    'Industrial Safety': {
      description: 'Evaluate pressure vessel maintenance override timing during peak power operations.',
      aiRecommendation: 'Postpone scheduled maintenance cycle by 72 hours.',
      signals: { confidence: 82, uncertainty: 28, fairnessRisk: 0, potentialImpact: 95 }
    },
    'E-commerce': {
      description: 'Detect potential buyer fraud on high-value electronics order.',
      aiRecommendation: 'Require SMS 2-factor verification before fulfillment.',
      signals: { confidence: 94, uncertainty: 6, fairnessRisk: 8, potentialImpact: 20 }
    }
  };

  const selected = MOCK_GEN[dom] || MOCK_GEN.Finance;
  res.json(selected);
});

// 8. Automated Test Suite Validation Endpoint
app.get('/api/tests', (req, res) => {
  const testCases = [
    {
      id: 'test-1',
      name: 'Test 1: Low Risk → AI Decision',
      domain: 'E-commerce',
      signals: { confidence: 95, uncertainty: 5, fairnessRisk: 10, potentialImpact: 10 },
      expectedTier: DECISION_TIERS.AI_DECISION
    },
    {
      id: 'test-2',
      name: 'Test 2: Medium Risk → Caution',
      domain: 'Finance',
      signals: { confidence: 70, uncertainty: 40, fairnessRisk: 30, potentialImpact: 45 },
      expectedTier: DECISION_TIERS.CAUTION
    },
    {
      id: 'test-3',
      name: 'Test 3: High Risk Score → Human Review',
      domain: 'Finance',
      signals: { confidence: 40, uncertainty: 70, fairnessRisk: 65, potentialImpact: 75 },
      expectedTier: DECISION_TIERS.HUMAN_REVIEW
    },
    {
      id: 'test-4',
      name: 'Test 4: High Fairness Risk (>= 80) → Human Review Override',
      domain: 'Recruitment / HR',
      signals: { confidence: 96, uncertainty: 5, fairnessRisk: 85, potentialImpact: 40 },
      expectedTier: DECISION_TIERS.HUMAN_REVIEW
    },
    {
      id: 'test-5',
      name: 'Test 5: High Uncertainty (>= 80) → Human Review Override',
      domain: 'E-commerce',
      signals: { confidence: 50, uncertainty: 82, fairnessRisk: 20, potentialImpact: 20 },
      expectedTier: DECISION_TIERS.HUMAN_REVIEW
    },
    {
      id: 'test-6',
      name: 'Test 6: High Impact (>= 85) in Critical Domain (Healthcare) → Human Review Override',
      domain: 'Healthcare',
      signals: { confidence: 98, uncertainty: 2, fairnessRisk: 5, potentialImpact: 90 },
      expectedTier: DECISION_TIERS.HUMAN_REVIEW
    }
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
    return {
      ...tc,
      actualTier: evalRes.tier,
      riskScore: evalRes.riskScore,
      isOverride: evalRes.isOverride,
      summary: evalRes.summary,
      passed
    };
  });

  const allPassed = results.every(r => r.passed);
  res.json({ allPassed, total: results.length, passedCount: results.filter(r => r.passed).length, results });
});

// 9. Reset Demo Dataset Endpoint
app.post('/api/reset', (req, res) => {
  const resetLogs = db.resetDemoData();
  res.json({ success: true, count: resetLogs.length });
});

app.listen(PORT, () => {
  console.log(`Decision Escalation Engine API server running on port ${PORT}`);
});
