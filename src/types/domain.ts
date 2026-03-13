export type Fraction = {
  name: string
  value: string
  numericValue: number | null
}

export type ReferenceLink = {
  title: string
  url: string
  source: "reference" | "website"
}

export type FilterOption = {
  value: string
  label: string
  count: number
}

export type TeachingContent = {
  slug: string
  title: string
  excerpt: string
  body: string
  sourceFile: string
}

export type VariantRecord = {
  id: string
  type: "variant"
  slug: string
  name: string
  alternateNames: string[]
  statuses: string[]
  globinChains: string[]
  migrationZones: string[]
  migrationPositions: string[]
  fractions: Fraction[]
  references: ReferenceLink[]
  mutationStatus: string
  mutation: string
  mutationNomenclature: string
  comboWith: string
  comboMutation: string
  comboNomenclature: string
  rbc: string
  haemoglobin: string
  mcv: string
  mch: string
  bloodSmear: string
  otherAnalysis: string
  haematologyComments: string
  clinicalSummary: string
  geneticRisk: string
  stability: string
  oxygenAffinity: string
  ethnicity: string
  variantComments: string
  comments: string
  profileUrl: string
  isSickleRelevant: boolean
  isThalRelevant: boolean
  teachingSummary: TeachingContent | null
}

export type CaseRecord = {
  id: string
  type: "case"
  caseNumber: string
  slug: string
  title: string
  caption: string
  imageId: string
  retentionTime: string
  hbName: string
  hbGenotype: string
  hbClass: string
  description: string
  haemoglobin: string
  rbc: string
  mcv: string
  mch: string
  rdw: string
  ferritin: string
  clinicalFindings: string
  labFindings: string
  characterization: string
  ethnicity: string
  gender: string
  age: string
  referenceLab: string
  bioRadComments: string
  phenotypeTags: string[]
  relatedVariants: string[]
  teachingSummary: TeachingContent | null
}

export type CompareRecord = {
  id: string
  title: string
  subtitle: string
  kind: "variant" | "case"
  summary: string
  rows: Array<{
    label: string
    value: string
  }>
}

export type ExplorerSearchState = {
  q?: string
  sort?: string
  chain?: string
  zone?: string
  status?: string
  class?: string
  ethnicity?: string
  compare?: string
}

export type RiskTier =
  | "TIER 1 — HIGH RISK"
  | "TIER 2 — MODERATE RISK"
  | "TIER 3 — LOW RISK"
  | "TIER 4 — BENIGN/MINIMAL"

export type RiskActionLevel = "URGENT" | "IMPORTANT" | "ROUTINE" | "MINIMAL"

export type RiskDomainKey =
  | "sickle"
  | "stability"
  | "clinical"
  | "oxygen"
  | "thal"
  | "heinz"
  | "genetic"

export type RiskDomainScoreMap = Record<RiskDomainKey, number>

export type RiskDomainContribution = {
  key: RiskDomainKey
  label: string
  score: number
  maxScore: number
  detail: string
}

export type RiskActionGuidance = {
  level: RiskActionLevel
  specialist: string
  geneticCounselling: string
  familyScreening: string
  monitoring: string
  surgery: string
  pregnancy: string
}

export type RiskAssessment = {
  score: number
  maxScore: number
  tier: RiskTier
  actionLevel: RiskActionLevel
  colorToken: "risk-high" | "risk-moderate" | "risk-low" | "risk-minimal"
  rationale: string
  contributions: RiskDomainContribution[]
  flags: string[]
  actions: RiskActionGuidance
}
