import fs from "node:fs"
import path from "node:path"

import {
  buildExcerpt,
  cleanText,
  displayValue,
  normalizeLabel,
  parseNumber,
  slugify,
} from "@/lib/format"
import type {
  CaseRecord,
  CompareRecord,
  FilterOption,
  Fraction,
  ReferenceLink,
  TeachingContent,
  VariantRecord,
} from "@/types/domain"

const DATA_ROOT = path.resolve(process.cwd(), "data")
const CONTENT_ROOT = path.resolve(process.cwd(), "content", "teaching")

const VARIANT_DATA_FILE = "Sebia_Atlas_Hemoglobin_Cases_Complete_88.json"
const CASE_DATA_FILE = "BioRad_HPLC_Chromatogram_Cases_Complete_232.json"

const TEACHING_REGISTRY = [
  {
    file: "Haemoglobin D Variants.md",
    slugs: ["hb-d-punjab", "hb-d-los-angeles", "hb-d-iran", "hb-d-ouled-rabah", "hb-dhofar"],
  },
  {
    file: "Hb_Abruzzo_Clinical_Teaching_Document.md",
    slugs: ["hb-abruzzo"],
  },
] as const

type RawVariant = {
  name?: string
  slug?: string
  secondary_name?: string | null
  other_names?: string | null
  statuses?: string[]
  globin_chains?: string[]
  migration_zones?: string[]
  migration_positions?: string[]
  fractions?: Array<{ name?: string; value?: string }>
  references?: Array<{ title?: string; url?: string }>
  websites?: Array<{ url?: string }>
  is_scd?: boolean
  is_thal?: boolean
  mutation_status?: string
  mutation?: string
  mutation_nomenclature?: string
  combo_with?: string | null
  combo_mutation?: string | null
  combo_nomenclature?: string | null
  rbc?: string | null
  hb?: string | null
  mcv?: string | null
  mch?: string | null
  blood_smear?: string | null
  other_analysis?: string | null
  hemat_comments?: string | null
  clinical?: string | null
  genetic_risk?: string | null
  stability?: string | null
  o2_affinity?: string | null
  ethnicity?: string | null
  var_comments?: string | null
  comments?: string | null
  profile_url?: string | null
}

type RawCaseDataset = {
  cases: RawCase[]
}

type RawCase = {
  caseNumber?: string
  caption?: string
  imageId?: string
  retentionTime?: string
  hbName?: string
  hbGenotype?: string
  hbClass?: string
  description?: string
  hb_gdl?: string
  rbc?: string
  mcv?: string
  mch?: string
  rdw?: string
  ferritin?: string
  clinicalFindings?: string
  labFindings?: string
  characterization?: string
  ethnicity?: string
  gender?: string
  age?: string
  refLab?: string
  bioRadComments?: string
}

const jsonCache = new Map<string, unknown>()
let teachingContentCache: Map<string, TeachingContent> | null = null
let variantsCache: VariantRecord[] | null = null
let casesCache: CaseRecord[] | null = null

const readJson = (fileName: string) => {
  if (jsonCache.has(fileName)) {
    return jsonCache.get(fileName)
  }

  const filePath = path.join(DATA_ROOT, fileName)

  let lastError: unknown

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const raw = fs.readFileSync(filePath, "utf8").trim()

    if (!raw) {
      lastError = new Error(`Empty JSON payload for ${fileName}`)
      continue
    }

    try {
      const parsed = JSON.parse(raw)
      jsonCache.set(fileName, parsed)
      return parsed
    } catch (error) {
      lastError = error
    }
  }

  throw new Error(
    `Unable to parse ${fileName} from ${filePath}: ${
      lastError instanceof Error ? lastError.message : "Unknown error"
    }`
  )
}

const readTeachingContent = () => {
  if (teachingContentCache) {
    return teachingContentCache
  }

  const content = new Map<string, TeachingContent>()

  for (const entry of TEACHING_REGISTRY) {
    const filePath = path.join(CONTENT_ROOT, entry.file)
    if (!fs.existsSync(filePath)) {
      continue
    }

    const body = fs.readFileSync(filePath, "utf8")
    const firstHeading = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? entry.file.replace(/\.md$/, "")

    for (const slug of entry.slugs) {
      content.set(slug, {
        slug,
        title: firstHeading,
        body,
        excerpt: buildExcerpt(body),
        sourceFile: entry.file,
      })
    }
  }

  teachingContentCache = content
  return content
}

function toFractions(values: RawVariant["fractions"]): Fraction[] {
  return (values ?? [])
    .map((value) => ({
      name: cleanText(value.name),
      value: cleanText(value.value),
      numericValue: parseNumber(cleanText(value.value)),
    }))
    .filter((fraction) => fraction.name)
}

function toReferences(
  references: RawVariant["references"],
  websites: RawVariant["websites"]
): ReferenceLink[] {
  const output: ReferenceLink[] = []

  for (const reference of references ?? []) {
    const title = cleanText(reference.title)
    const url = cleanText(reference.url)
    if (title || url) {
      output.push({
        title: title || url,
        url,
        source: "reference",
      })
    }
  }

  for (const website of websites ?? []) {
    const url = cleanText(website.url)
    if (url) {
      output.push({
        title: url,
        url,
        source: "website",
      })
    }
  }

  return output
}

function toAlternateNames(raw: RawVariant) {
  return [
    cleanText(raw.secondary_name),
    ...(cleanText(raw.other_names)
      ? cleanText(raw.other_names)
          .split(/[,;]+/)
          .map((item) => cleanText(item))
      : []),
  ].filter(Boolean)
}

function derivePhenotypeTags(raw: RawCase) {
  const corpus = [
    cleanText(raw.hbName),
    cleanText(raw.hbGenotype),
    cleanText(raw.hbClass),
    cleanText(raw.description),
    cleanText(raw.clinicalFindings),
  ]
    .join(" ")
    .toLowerCase()

  const tags = new Set<string>()

  if (corpus.includes("alpha")) tags.add("Alpha")
  if (corpus.includes("beta")) tags.add("Beta")
  if (corpus.includes("thal")) tags.add("Thalassaemia")
  if (corpus.includes("sickle")) tags.add("Sickle")
  if (corpus.includes("compound")) tags.add("Compound")
  if (corpus.includes("variant")) tags.add("Variant")
  if (!tags.size) tags.add("Teaching case")

  return [...tags]
}

function attachTeachingContent(slugs: string[]) {
  const registry = readTeachingContent()
  return slugs.map((slug) => registry.get(slug)).find(Boolean) ?? null
}

export function getAllVariants() {
  if (variantsCache) {
    return variantsCache
  }

  const rawVariants = readJson(VARIANT_DATA_FILE) as RawVariant[]

  variantsCache = rawVariants.map((raw) => {
    const name = cleanText(raw.name)
    const slug = cleanText(raw.slug) || slugify(name)

    return {
      id: `variant:${slug}`,
      type: "variant",
      slug,
      name,
      alternateNames: toAlternateNames(raw),
      statuses: (raw.statuses ?? []).map((value) => normalizeLabel(value)),
      globinChains: (raw.globin_chains ?? []).map((value) => normalizeLabel(value)),
      migrationZones: (raw.migration_zones ?? []).map((value) => cleanText(value)),
      migrationPositions: (raw.migration_positions ?? []).map((value) => cleanText(value)),
      fractions: toFractions(raw.fractions),
      references: toReferences(raw.references, raw.websites),
      mutationStatus: cleanText(raw.mutation_status),
      mutation: cleanText(raw.mutation),
      mutationNomenclature: cleanText(raw.mutation_nomenclature),
      comboWith: cleanText(raw.combo_with),
      comboMutation: cleanText(raw.combo_mutation),
      comboNomenclature: cleanText(raw.combo_nomenclature),
      rbc: cleanText(raw.rbc),
      haemoglobin: cleanText(raw.hb),
      mcv: cleanText(raw.mcv),
      mch: cleanText(raw.mch),
      bloodSmear: cleanText(raw.blood_smear),
      otherAnalysis: cleanText(raw.other_analysis),
      haematologyComments: cleanText(raw.hemat_comments),
      clinicalSummary: cleanText(raw.clinical),
      geneticRisk: cleanText(raw.genetic_risk),
      stability: cleanText(raw.stability),
      oxygenAffinity: cleanText(raw.o2_affinity),
      ethnicity: cleanText(raw.ethnicity),
      variantComments: cleanText(raw.var_comments),
      comments: cleanText(raw.comments),
      profileUrl: cleanText(raw.profile_url),
      isSickleRelevant: Boolean(raw.is_scd),
      isThalRelevant: Boolean(raw.is_thal),
      teachingSummary: attachTeachingContent([slug, slugify(name)]),
    } satisfies VariantRecord
  })
  return variantsCache
}

export function getVariantBySlug(slug: string) {
  return getAllVariants().find((variant) => variant.slug === slug) ?? null
}

function buildRelatedVariants(caseRecord: Omit<CaseRecord, "relatedVariants" | "teachingSummary">) {
  const corpus = [caseRecord.hbName, caseRecord.hbGenotype, caseRecord.caption]
    .join(" ")
    .toLowerCase()

  return getAllVariants()
    .filter((variant) => {
      const candidateNames = [variant.name, ...variant.alternateNames]
        .map((value) => value.toLowerCase())
        .filter(Boolean)

      return candidateNames.some((candidate) => corpus.includes(candidate.replace(/^hb\s+/, "hb ")))
    })
    .slice(0, 3)
    .map((variant) => variant.slug)
}

export function getAllCases() {
  if (casesCache) {
    return casesCache
  }

  const rawDataset = readJson(CASE_DATA_FILE) as RawCaseDataset

  casesCache = rawDataset.cases.map((raw) => {
    const hbName = cleanText(raw.hbName)
    const caseNumber = cleanText(raw.caseNumber)
    const title = hbName || cleanText(raw.caption) || `Case ${caseNumber}`

    const baseRecord = {
      id: `case:${caseNumber}`,
      type: "case",
      caseNumber,
      slug: `case-${caseNumber}`,
      title,
      caption: cleanText(raw.caption),
      imageId: cleanText(raw.imageId),
      retentionTime: cleanText(raw.retentionTime),
      hbName,
      hbGenotype: cleanText(raw.hbGenotype),
      hbClass: normalizeLabel(cleanText(raw.hbClass)),
      description: cleanText(raw.description),
      haemoglobin: cleanText(raw.hb_gdl),
      rbc: cleanText(raw.rbc),
      mcv: cleanText(raw.mcv),
      mch: cleanText(raw.mch),
      rdw: cleanText(raw.rdw),
      ferritin: cleanText(raw.ferritin),
      clinicalFindings: cleanText(raw.clinicalFindings),
      labFindings: cleanText(raw.labFindings),
      characterization: cleanText(raw.characterization),
      ethnicity: normalizeLabel(cleanText(raw.ethnicity)),
      gender: cleanText(raw.gender),
      age: cleanText(raw.age),
      referenceLab: cleanText(raw.refLab),
      bioRadComments: cleanText(raw.bioRadComments),
      phenotypeTags: derivePhenotypeTags(raw),
    } satisfies Omit<CaseRecord, "relatedVariants" | "teachingSummary">

    const relatedVariants = buildRelatedVariants(baseRecord)

    return {
      ...baseRecord,
      relatedVariants,
      teachingSummary: attachTeachingContent(relatedVariants),
    } satisfies CaseRecord
  })
  return casesCache
}

export function getCaseByNumber(caseNumber: string) {
  return getAllCases().find((item) => item.caseNumber === caseNumber) ?? null
}

function buildFilterOptions(values: string[]) {
  const counts = new Map<string, number>()

  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([value, count]) => ({
      value,
      label: value,
      count,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
}

export function getVariantFilterOptions() {
  const variants = getAllVariants()

  return {
    chains: buildFilterOptions(variants.flatMap((variant) => variant.globinChains)),
    zones: buildFilterOptions(variants.flatMap((variant) => variant.migrationZones)),
    statuses: buildFilterOptions(variants.flatMap((variant) => variant.statuses)),
  } satisfies Record<string, FilterOption[]>
}

export function getCaseFilterOptions() {
  const cases = getAllCases()

  return {
    classes: buildFilterOptions(cases.map((item) => item.hbClass)),
    ethnicities: buildFilterOptions(cases.map((item) => item.ethnicity)),
  } satisfies Record<string, FilterOption[]>
}

export function getTeachingTopics() {
  return [...readTeachingContent().values()]
}

export function getDashboardOverview() {
  const variants = getAllVariants()
  const cases = getAllCases()

  const topVariantZones = buildFilterOptions(variants.flatMap((variant) => variant.migrationZones)).slice(0, 5)
  const topVariantChains = buildFilterOptions(variants.flatMap((variant) => variant.globinChains)).slice(0, 4)
  const topCaseClasses = buildFilterOptions(cases.map((item) => item.hbClass)).slice(0, 4)

  return {
    metrics: [
      {
        title: "Variant records",
        value: String(variants.length),
        description: "Curated Sebia Atlas profiles normalized for rapid lookup.",
      },
      {
        title: "Teaching cases",
        value: String(cases.length),
        description: "Bio-Rad atlas cases with phenotype and lab metadata.",
      },
      {
        title: "Teaching topics",
        value: String(getTeachingTopics().length),
        description: "Narrative summaries embedded directly into detail views.",
      },
      {
        title: "Compare-ready records",
        value: String(variants.length + cases.length),
        description: "All records are available for side-by-side review in v1.",
      },
    ],
    highlights: {
      topVariantZones,
      topVariantChains,
      topCaseClasses,
    },
  }
}

export function toVariantCompareRecord(variant: VariantRecord): CompareRecord {
  return {
    id: variant.slug,
    title: variant.name,
    subtitle: displayValue(variant.globinChains),
    kind: "variant",
    summary: variant.clinicalSummary || variant.haematologyComments || "Variant teaching profile",
    rows: [
      { label: "Status", value: displayValue(variant.statuses) },
      { label: "Migration zones", value: displayValue(variant.migrationZones) },
      { label: "Mutation", value: displayValue(variant.mutation) },
      { label: "HGVS", value: displayValue(variant.mutationNomenclature) },
      { label: "Clinical summary", value: displayValue(variant.clinicalSummary) },
      { label: "Genetic risk", value: displayValue(variant.geneticRisk) },
      { label: "Stability", value: displayValue(variant.stability) },
      { label: "O2 affinity", value: displayValue(variant.oxygenAffinity) },
      { label: "Ethnicity", value: displayValue(variant.ethnicity) },
      {
        label: "Fractions",
        value: variant.fractions.length
          ? variant.fractions.map((fraction) => `${fraction.name}: ${fraction.value || "n/a"}`).join(" | ")
          : "Not available",
      },
    ],
  }
}

export function toCaseCompareRecord(item: CaseRecord): CompareRecord {
  return {
    id: item.caseNumber,
    title: `Case ${item.caseNumber}`,
    subtitle: item.hbName || item.hbClass,
    kind: "case",
    summary: item.clinicalFindings || item.description || "Bio-Rad teaching case",
    rows: [
      { label: "Hb name", value: displayValue(item.hbName) },
      { label: "Hb class", value: displayValue(item.hbClass) },
      { label: "Genotype", value: displayValue(item.hbGenotype) },
      { label: "Retention time", value: displayValue(item.retentionTime) },
      { label: "Haemoglobin", value: displayValue(item.haemoglobin) },
      { label: "RBC", value: displayValue(item.rbc) },
      { label: "MCV", value: displayValue(item.mcv) },
      { label: "MCH", value: displayValue(item.mch) },
      { label: "Clinical findings", value: displayValue(item.clinicalFindings) },
      { label: "Lab findings", value: displayValue(item.labFindings) },
    ],
  }
}
