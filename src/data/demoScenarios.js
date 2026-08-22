/**
 * Predefined Demo Scenarios for Human-AI Decision Escalation Engine
 */

export const DEMO_SCENARIOS = [
  {
    id: 'scenario-1-safe',
    tag: 'SCENARIO 1',
    title: 'Safe Automation',
    domain: 'E-commerce',
    description: 'Automatically issue a $15 promotional credit refund to a loyal customer for a delayed package delivery.',
    aiRecommendation: 'Approve instant $15 store credit credit memo and send automated apology email.',
    signals: {
      confidence: 98,
      uncertainty: 2,
      fairnessRisk: 5,
      potentialImpact: 10
    },
    badgeColor: 'emerald',
    expectedTier: 'AI_DECISION',
    keyPoint: 'Low impact, low fairness risk, high confidence. Perfect candidate for automatic AI execution.'
  },
  {
    id: 'scenario-2-uncertainty',
    tag: 'SCENARIO 2',
    title: 'Uncertainty Escalation',
    domain: 'Healthcare',
    description: 'Classify pulmonary nodule suspicion level from chest CT scan and recommend treatment protocol.',
    aiRecommendation: 'Classify nodule as Stage II indeterminate risk; recommend follow-up scan in 6 months.',
    signals: {
      confidence: 61,
      uncertainty: 45,
      fairnessRisk: 10,
      potentialImpact: 90
    },
    badgeColor: 'amber',
    expectedTier: 'HUMAN_REVIEW',
    keyPoint: 'High clinical impact combined with elevated model uncertainty triggers mandatory medical review.'
  },
  {
    id: 'scenario-3-unsafe-confidence',
    tag: 'KEY DEMO CASE ★',
    title: 'High Confidence But Unsafe',
    domain: 'Finance',
    description: 'Evaluate commercial loan application for small business expansion credit facility.',
    aiRecommendation: 'Reject loan application due to predicted default risk score exceeding cutoff threshold.',
    signals: {
      confidence: 96,
      uncertainty: 4,
      fairnessRisk: 85,
      potentialImpact: 90
    },
    isFeatured: true,
    badgeColor: 'rose',
    expectedTier: 'HUMAN_REVIEW',
    keyPoint: 'HIGH AI CONFIDENCE DOES NOT EQUAL SAFETY. High fairness risk and financial impact demand human governance.'
  },
  {
    id: 'scenario-4-hr-recruitment',
    tag: 'SCENARIO 4',
    title: 'Automated Resume Screening',
    domain: 'Recruitment / HR',
    description: 'Filter applicant candidate pool for senior engineering role based on parsed resume history.',
    aiRecommendation: 'Disqualify candidate due to non-traditional education background.',
    signals: {
      confidence: 88,
      uncertainty: 15,
      fairnessRisk: 82,
      potentialImpact: 65
    },
    badgeColor: 'purple',
    expectedTier: 'HUMAN_REVIEW',
    keyPoint: 'High fairness risk in hiring models overrides medium confidence to prevent automated bias.'
  },
  {
    id: 'scenario-5-industrial-safety',
    tag: 'SCENARIO 5',
    title: 'Turbine Safety Shutdown',
    domain: 'Industrial Safety',
    description: 'Determine emergency pressure release valve activation for offshore power generator.',
    aiRecommendation: 'Initiate partial pressure vent cycle without full emergency power shutdown.',
    signals: {
      confidence: 92,
      uncertainty: 8,
      fairnessRisk: 0,
      potentialImpact: 95
    },
    badgeColor: 'cyan',
    expectedTier: 'HUMAN_REVIEW',
    keyPoint: 'Critical safety domain with 95/100 impact triggers safety override protocol.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-101',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    domain: 'E-commerce',
    description: 'Automatically issue a $15 promotional credit refund to a loyal customer for a delayed package delivery.',
    aiRecommendation: 'Approve instant $15 store credit credit memo and send automated apology email.',
    signals: { confidence: 98, uncertainty: 2, fairnessRisk: 5, potentialImpact: 10 },
    evaluation: {
      riskScore: 6,
      tier: 'AI_DECISION',
      isOverride: false,
      summary: 'Risk score 6/100. Low risk signals allow safe automatic execution.'
    },
    humanReview: null
  },
  {
    id: 'aud-102',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    domain: 'Healthcare',
    description: 'Classify pulmonary nodule suspicion level from chest CT scan and recommend treatment protocol.',
    aiRecommendation: 'Classify nodule as Stage II indeterminate risk; recommend follow-up scan in 6 months.',
    signals: { confidence: 61, uncertainty: 45, fairnessRisk: 10, potentialImpact: 90 },
    evaluation: {
      riskScore: 60,
      tier: 'HUMAN_REVIEW',
      isOverride: true,
      summary: 'High impact decision in Healthcare domain requires human sign-off regardless of model confidence.'
    },
    humanReview: {
      status: 'APPROVED',
      reviewer: 'Dr. Sarah Lin (Pulmonology Specialist)',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      notes: 'Reviewed CT scan slices 14-22. Concur with recommendation for 6-month CT follow-up.'
    }
  },
  {
    id: 'aud-103',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    domain: 'Finance',
    description: 'Evaluate commercial loan application for small business expansion credit facility.',
    aiRecommendation: 'Reject loan application due to predicted default risk score exceeding cutoff threshold.',
    signals: { confidence: 96, uncertainty: 4, fairnessRisk: 85, potentialImpact: 90 },
    evaluation: {
      riskScore: 50,
      tier: 'HUMAN_REVIEW',
      isOverride: true,
      summary: 'High AI confidence does not guarantee a safe decision. Significant fairness and impact risks require human oversight.'
    },
    humanReview: {
      status: 'OVERRIDDEN',
      reviewer: 'Marcus Vance (Senior Credit Committee Chair)',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      notes: 'Overrode AI rejection. Applicant provided audited cash flow collateral documentation mitigating zip code bias in automated model.'
    }
  }
];
