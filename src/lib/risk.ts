import type {
  RiskActionGuidance,
  RiskAssessment,
  RiskDomainContribution,
  RiskDomainKey,
  RiskDomainScoreMap,
  RiskTier,
  VariantRecord,
} from "@/types/domain"

const MAX_RISK_SCORE = 145

const DOMAIN_CONFIG: Array<{
  key: RiskDomainKey
  label: string
  maxScore: number
}> = [
  { key: "sickle", label: "SCD potential", maxScore: 40 },
  { key: "stability", label: "Stability", maxScore: 35 },
  { key: "clinical", label: "Clinical severity", maxScore: 20 },
  { key: "oxygen", label: "O2 affinity", maxScore: 15 },
  { key: "thal", label: "Thalassaemia interaction", maxScore: 15 },
  { key: "heinz", label: "Heinz body formation", maxScore: 10 },
  { key: "genetic", label: "Genetic compound risk", maxScore: 10 },
]

const NO_DATA_VALUES = ["", "n/a", "na", "no data", "not available", "unknown"]

function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase()
}

function hasMeaningfulText(value: string | null | undefined) {
  return !NO_DATA_VALUES.includes(normalizeText(value))
}

function describeContribution(key: RiskDomainKey, score: number) {
  switch (key) {
    case "sickle":
      return score
        ? "Sickling relevance is documented and treated as the highest-weight domain."
        : "No sickling relevance detected from the normalized profile."
    case "stability":
      if (score >= 35) return "Very unstable phenotype with major haemolysis risk."
      if (score >= 25) return "Unstable phenotype with likely haemolysis risk."
      if (score >= 15) return "Mild or stress-related instability is documented."
      return "No instability concern identified from the current profile."
    case "clinical":
      if (score >= 20) return "Severe clinical burden or transfusion dependence is described."
      if (score >= 10) return "Moderate symptomatic disease burden is described."
      if (score >= 5) return "Only mild clinical impact is described."
      return "No clinical severity markers detected."
    case "oxygen":
      if (score >= 15) return "Greatly decreased oxygen affinity with cyanosis risk."
      if (score >= 10) return "Altered oxygen affinity with erythrocytosis or cyanosis implications."
      return "No oxygen affinity concern detected."
    case "thal":
      return score
        ? "Thalassaemia interaction or thal-relevant context is present."
        : "No thalassaemia interaction signal detected."
    case "heinz":
      return score
        ? "Heinz bodies or oxidant-haemolysis markers are present."
        : "No Heinz body signal detected."
    case "genetic":
      return score
        ? "Compound inheritance or co-inherited variant risk is documented."
        : "No compound-risk signal detected."
  }
}

export function getRiskTierInfo(score: number): {
  tier: RiskTier
  actionLevel: RiskActionGuidance["level"]
  colorToken: RiskAssessment["colorToken"]
} {
  if (score >= 50) {
    return {
      tier: "TIER 1 — HIGH RISK",
      actionLevel: "URGENT",
      colorToken: "risk-high",
    }
  }

  if (score >= 25) {
    return {
      tier: "TIER 2 — MODERATE RISK",
      actionLevel: "IMPORTANT",
      colorToken: "risk-moderate",
    }
  }

  if (score >= 10) {
    return {
      tier: "TIER 3 — LOW RISK",
      actionLevel: "ROUTINE",
      colorToken: "risk-low",
    }
  }

  return {
    tier: "TIER 4 — BENIGN/MINIMAL",
    actionLevel: "MINIMAL",
    colorToken: "risk-minimal",
  }
}

export function getRiskActionGuidance(score: number): RiskActionGuidance {
  if (score >= 50) {
    return {
      level: "URGENT",
      specialist: "Immediate haemoglobinopathy specialist review",
      geneticCounselling: "Mandatory pre-test and family counselling",
      familyScreening: "Screen first-degree relatives promptly",
      monitoring: "Regular haematology follow-up is required",
      surgery: "Flag for anaesthesia and peri-operative planning",
      pregnancy: "Pre-conception counselling is essential",
    }
  }

  if (score >= 25) {
    return {
      level: "IMPORTANT",
      specialist: "Specialist review is recommended",
      geneticCounselling: "Counselling should be arranged",
      familyScreening: "Consider family screening based on context",
      monitoring: "Monitor for complications and phenotype drift",
      surgery: "Inform anaesthesia team before procedures",
      pregnancy: "Offer counselling before pregnancy planning",
    }
  }

  if (score >= 10) {
    return {
      level: "ROUTINE",
      specialist: "Review if symptoms or discordant results emerge",
      geneticCounselling: "Counselling if clinically indicated",
      familyScreening: "Selective family studies may help",
      monitoring: "Baseline investigations and awareness are sufficient",
      surgery: "Routine precautions with awareness of the variant",
      pregnancy: "Reassurance with targeted counselling if needed",
    }
  }

  return {
    level: "MINIMAL",
    specialist: "Specialist referral is usually not required",
    geneticCounselling: "Not routinely required",
    familyScreening: "Not routinely required",
    monitoring: "No active monitoring usually needed",
    surgery: "Standard precautions are adequate",
    pregnancy: "Reassurance",
  }
}

export function createRiskAssessmentFromScores(scores: RiskDomainScoreMap): RiskAssessment {
  const contributions: RiskDomainContribution[] = DOMAIN_CONFIG.map((domain) => ({
    key: domain.key,
    label: domain.label,
    score: scores[domain.key],
    maxScore: domain.maxScore,
    detail: describeContribution(domain.key, scores[domain.key]),
  }))

  const score = contributions.reduce((total, item) => total + item.score, 0)
  const tierInfo = getRiskTierInfo(score)
  const activeContributions = contributions.filter((item) => item.score > 0)
  const rationale = activeContributions.length
    ? activeContributions.map((item) => `${item.label} (+${item.score})`).join("; ")
    : "No elevated risk domains detected from the current profile."

  const flags = [
    scores.sickle > 0
      ? "Sickling relevance is present and should anchor counselling."
      : "No sickling signal detected.",
    scores.stability >= 25
      ? "Instability raises haemolysis and oxidant sensitivity concerns."
      : scores.stability > 0
        ? "Mild instability suggests caution under oxidative stress."
        : "No instability concern detected.",
    scores.oxygen >= 15
      ? "Greatly decreased oxygen affinity can mislead pulse oximetry."
      : scores.oxygen > 0
        ? "Altered oxygen affinity may drive erythrocytosis or cyanosis."
        : "No oxygen-affinity concern detected.",
    scores.thal > 0
      ? "Compound thalassaemia interaction may worsen phenotype."
      : "No thalassaemia interaction detected.",
  ]

  return {
    score,
    maxScore: MAX_RISK_SCORE,
    tier: tierInfo.tier,
    actionLevel: tierInfo.actionLevel,
    colorToken: tierInfo.colorToken,
    rationale,
    contributions,
    flags,
    actions: getRiskActionGuidance(score),
  }
}

function deriveStabilityScore(variant: VariantRecord) {
  const stability = normalizeText(variant.stability)
  const combined = [
    stability,
    normalizeText(variant.haematologyComments),
    normalizeText(variant.variantComments),
    normalizeText(variant.comments),
  ].join(" ")

  if (combined.includes("very unstable")) return 35
  if (combined.includes("unstable") && !combined.includes("slight")) return 25
  if (
    combined.includes("slightly unstable") ||
    combined.includes("mildly unstable") ||
    combined.includes("mild instability")
  ) {
    return 15
  }

  return 0
}

function deriveClinicalScore(variant: VariantRecord) {
  const combined = [
    normalizeText(variant.clinicalSummary),
    normalizeText(variant.haematologyComments),
    normalizeText(variant.comments),
    normalizeText(variant.geneticRisk),
  ].join(" ")

  if (
    combined.includes("transfusion") ||
    combined.includes("severe") ||
    combined.includes("splenectomy") ||
    combined.includes("organ damage")
  ) {
    return 20
  }

  if (
    combined.includes("moderate") ||
    combined.includes("anaemia") ||
    combined.includes("anemia") ||
    combined.includes("hemolytic") ||
    combined.includes("haemolytic")
  ) {
    return 10
  }

  if (combined.includes("mild") || combined.includes("compensated")) {
    return 5
  }

  return 0
}

function deriveOxygenScore(variant: VariantRecord) {
  const affinity = normalizeText(variant.oxygenAffinity)
  if (!affinity || NO_DATA_VALUES.includes(affinity)) return 0
  if (affinity.includes("greatly decreased")) return 15
  if (
    affinity.includes("decreased") ||
    affinity.includes("increased") ||
    affinity.includes("high") ||
    affinity.includes("low")
  ) {
    return 10
  }
  return 0
}

function deriveThalScore(variant: VariantRecord) {
  const combined = [
    variant.isThalRelevant ? "thal" : "",
    variant.comboWith,
    variant.geneticRisk,
    variant.clinicalSummary,
    variant.comments,
    variant.haematologyComments,
    variant.globinChains.join(" "),
  ]
    .map(normalizeText)
    .join(" ")

  return combined.includes("thal") ? 15 : 0
}

function deriveHeinzScore(variant: VariantRecord) {
  const combined = [
    variant.bloodSmear,
    variant.otherAnalysis,
    variant.haematologyComments,
    variant.comments,
  ]
    .map(normalizeText)
    .join(" ")

  return combined.includes("heinz") ? 10 : 0
}

function deriveGeneticScore(variant: VariantRecord) {
  const combined = [
    variant.comboWith,
    variant.comboMutation,
    variant.comboNomenclature,
    variant.geneticRisk,
    variant.clinicalSummary,
    variant.comments,
  ]
    .map(normalizeText)
    .join(" ")

  if (!hasMeaningfulText(variant.comboWith) && !combined.includes("compound")) {
    return 0
  }

  return 10
}

export function getVariantRiskScores(variant: VariantRecord): RiskDomainScoreMap {
  return {
    sickle: variant.isSickleRelevant ? 40 : 0,
    stability: deriveStabilityScore(variant),
    clinical: deriveClinicalScore(variant),
    oxygen: deriveOxygenScore(variant),
    thal: deriveThalScore(variant),
    heinz: deriveHeinzScore(variant),
    genetic: deriveGeneticScore(variant),
  }
}

export function getVariantRiskAssessment(variant: VariantRecord) {
  return createRiskAssessmentFromScores(getVariantRiskScores(variant))
}
