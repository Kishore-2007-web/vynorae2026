/**
 * Deterministic Risk & Escalation Engine for Human-AI Decision Governance
 */

export const CRITICAL_DOMAINS = [
  'Healthcare',
  'Legal',
  'Government',
  'Industrial Safety'
];

export const ALL_DOMAINS = [
  'Healthcare',
  'Finance',
  'Recruitment / HR',
  'Legal',
  'Government',
  'Industrial Safety',
  'E-commerce'
];

export const DECISION_TIERS = {
  AI_DECISION: 'AI_DECISION',
  CAUTION: 'CAUTION',
  HUMAN_REVIEW: 'HUMAN_REVIEW'
};

/**
 * Calculates deterministic risk score and evaluates escalation tier & reasons.
 *
 * @param {Object} input
 * @param {string} input.domain
 * @param {number} input.confidence 0-100
 * @param {number} input.uncertainty 0-100
 * @param {number} input.fairnessRisk 0-100
 * @param {number} input.potentialImpact 0-100
 */
export function evaluateEscalation(input) {
  const domain = input.domain || 'Finance';
  const confidence = Math.min(100, Math.max(0, Number(input.confidence) || 0));
  const uncertainty = Math.min(100, Math.max(0, Number(input.uncertainty) || 0));
  const fairnessRisk = Math.min(100, Math.max(0, Number(input.fairnessRisk) || 0));
  const potentialImpact = Math.min(100, Math.max(0, Number(input.potentialImpact) || 0));

  const confidenceRisk = 100 - confidence;

  // Formula Breakdown
  const uncertaintyContrib = 0.30 * uncertainty;
  const fairnessContrib = 0.25 * fairnessRisk;
  const impactContrib = 0.30 * potentialImpact;
  const confidenceContrib = 0.15 * confidenceRisk;

  const rawScore = uncertaintyContrib + fairnessContrib + impactContrib + confidenceContrib;
  const riskScore = Math.round(rawScore);

  // Base Tier Assignment
  let baseTier = DECISION_TIERS.AI_DECISION;
  if (riskScore >= 61) {
    baseTier = DECISION_TIERS.HUMAN_REVIEW;
  } else if (riskScore >= 31) {
    baseTier = DECISION_TIERS.CAUTION;
  }

  // Override Evaluation
  const triggers = [];
  let isOverride = false;
  let finalTier = baseTier;

  // 1. High Impact in Critical Domain Override
  const isCriticalDomain = CRITICAL_DOMAINS.includes(domain);
  const isHighImpactOverride = potentialImpact >= 85 && isCriticalDomain;
  if (isHighImpactOverride) {
    isOverride = true;
    triggers.push({
      type: 'CRITICAL_IMPACT_OVERRIDE',
      label: 'High Potential Impact in Critical Domain',
      detail: `Potential impact (${potentialImpact}/100) >= 85 in high-stakes domain (${domain}). Mandatory human review required.`
    });
  }

  // 2. High Fairness Risk Override
  const isHighFairnessOverride = fairnessRisk >= 80;
  if (isHighFairnessOverride) {
    isOverride = true;
    triggers.push({
      type: 'HIGH_FAIRNESS_RISK',
      label: 'High Fairness / Bias Risk',
      detail: `Fairness risk (${fairnessRisk}/100) >= 80 poses ethical/compliance risk requiring human oversight.`
    });
  }

  // 3. High Uncertainty Override
  const isHighUncertaintyOverride = uncertainty >= 80;
  if (isHighUncertaintyOverride) {
    isOverride = true;
    triggers.push({
      type: 'HIGH_UNCERTAINTY',
      label: 'High Uncertainty Threshold Exceeded',
      detail: `Uncertainty (${uncertainty}/100) >= 80 indicates insufficient model reliability for auto-execution.`
    });
  }

  // Determine final tier considering overrides
  if (isHighImpactOverride || isHighFairnessOverride || isHighUncertaintyOverride) {
    finalTier = DECISION_TIERS.HUMAN_REVIEW;
  }

  // Base score trigger if score alone drove escalation
  if (riskScore >= 61 && !isOverride) {
    triggers.push({
      type: 'HIGH_RISK_SCORE',
      label: 'Elevated Risk Score',
      detail: `Calculated risk score (${riskScore}/100) exceeds safety threshold of 60.`
    });
  } else if (riskScore >= 31 && finalTier === DECISION_TIERS.CAUTION) {
    triggers.push({
      type: 'MODERATE_RISK_SCORE',
      label: 'Moderate Risk Score',
      detail: `Risk score (${riskScore}/100) requires verification before execution.`
    });
  } else if (finalTier === DECISION_TIERS.AI_DECISION) {
    triggers.push({
      type: 'SAFE_AUTOMATION',
      label: 'Low Risk Parameters',
      detail: 'Low uncertainty, low fairness risk, and controlled impact allow automatic AI execution.'
    });
  }

  // Summary message formulation
  let summary = '';
  if (finalTier === DECISION_TIERS.HUMAN_REVIEW) {
    if (confidence >= 85 && (isHighFairnessOverride || isHighImpactOverride)) {
      summary = 'High AI confidence does not guarantee a safe decision. Significant fairness and impact risks require human oversight.';
    } else if (isHighImpactOverride) {
      summary = `High impact decision in ${domain} domain requires human sign-off regardless of model confidence.`;
    } else if (isHighFairnessOverride) {
      summary = 'Significant fairness risk detected. Human expert must verify bias mitigation before proceeding.';
    } else if (isHighUncertaintyOverride) {
      summary = 'Model uncertainty is dangerously high. Human evaluation is mandatory.';
    } else {
      summary = `Calculated risk score of ${riskScore}/100 exceeds safe threshold. Human review required.`;
    }
  } else if (finalTier === DECISION_TIERS.CAUTION) {
    summary = `Risk score ${riskScore}/100. Additional verification recommended prior to execution.`;
  } else {
    summary = `Risk score ${riskScore}/100. Low risk signals allow safe automatic execution.`;
  }

  return {
    riskScore,
    rawScore,
    tier: finalTier,
    baseTier,
    isOverride,
    triggers,
    summary,
    formulaBreakdown: {
      confidenceRisk,
      uncertaintyContrib: Math.round(uncertaintyContrib * 100) / 100,
      fairnessContrib: Math.round(fairnessContrib * 100) / 100,
      impactContrib: Math.round(impactContrib * 100) / 100,
      confidenceContrib: Math.round(confidenceContrib * 100) / 100
    },
    signals: {
      confidence,
      uncertainty,
      fairnessRisk,
      potentialImpact,
      confidenceRisk
    }
  };
}
