"use client"

import { useState } from "react"
import Link from "next/link"
import { RotateCcw, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { RiskAssessment, RiskDomainKey, RiskDomainScoreMap } from "@/types/domain"
import { createRiskAssessmentFromScores } from "@/lib/risk"

type VariantRiskProfile = {
  slug: string
  name: string
  globinChains: string[]
  mutation: string
  clinicalSummary: string
  scores: RiskDomainScoreMap
  assessment: RiskAssessment
}

const DOMAIN_OPTIONS: Array<{
  key: RiskDomainKey
  label: string
  helper: string
  options: Array<{ value: string; label: string }>
}> = [
  {
    key: "sickle",
    label: "SCD potential",
    helper: "Highest weight because sickling crises carry the largest immediate risk burden.",
    options: [
      { value: "0", label: "No sickling signal" },
      { value: "40", label: "Documented sickling relevance (+40)" },
    ],
  },
  {
    key: "stability",
    label: "Stability",
    helper: "Captures unstable haemoglobins, haemolysis risk, and oxidant sensitivity.",
    options: [
      { value: "0", label: "Stable or no signal" },
      { value: "15", label: "Slightly unstable (+15)" },
      { value: "25", label: "Unstable (+25)" },
      { value: "35", label: "Very unstable (+35)" },
    ],
  },
  {
    key: "clinical",
    label: "Clinical severity",
    helper: "Reflects symptom burden, anaemia severity, and transfusion-level impact.",
    options: [
      { value: "0", label: "No clear clinical burden" },
      { value: "5", label: "Mild burden (+5)" },
      { value: "10", label: "Moderate burden (+10)" },
      { value: "20", label: "Severe burden (+20)" },
    ],
  },
  {
    key: "oxygen",
    label: "O2 affinity",
    helper: "Used for cyanosis or erythrocytosis risk from altered oxygen delivery.",
    options: [
      { value: "0", label: "Normal or no signal" },
      { value: "10", label: "Altered affinity (+10)" },
      { value: "15", label: "Greatly decreased affinity (+15)" },
    ],
  },
  {
    key: "thal",
    label: "Thalassaemia interaction",
    helper: "Marks variants likely to worsen in thalassaemia or thal-relevant combinations.",
    options: [
      { value: "0", label: "No interaction detected" },
      { value: "15", label: "Relevant thalassaemia interaction (+15)" },
    ],
  },
  {
    key: "heinz",
    label: "Heinz body formation",
    helper: "A practical proxy for oxidative damage and unstable-haemoglobin behaviour.",
    options: [
      { value: "0", label: "No Heinz body signal" },
      { value: "10", label: "Heinz bodies present (+10)" },
    ],
  },
  {
    key: "genetic",
    label: "Genetic compound risk",
    helper: "Captures compound heterozygosity, co-inherited variants, and combination effects.",
    options: [
      { value: "0", label: "No compound-risk signal" },
      { value: "10", label: "Compound or co-inherited risk (+10)" },
    ],
  },
]

const TOKEN_STYLES: Record<
  RiskAssessment["colorToken"],
  {
    card: string
    badge: string
    number: string
    progress: string
  }
> = {
  "risk-high": {
    card: "border-rose-300/70 bg-rose-500/5",
    badge: "border-rose-300/70 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    number: "text-rose-700 dark:text-rose-300",
    progress: "bg-rose-500",
  },
  "risk-moderate": {
    card: "border-orange-300/70 bg-orange-500/5",
    badge: "border-orange-300/70 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    number: "text-orange-700 dark:text-orange-300",
    progress: "bg-orange-500",
  },
  "risk-low": {
    card: "border-amber-300/70 bg-amber-500/5",
    badge: "border-amber-300/70 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    number: "text-amber-700 dark:text-amber-300",
    progress: "bg-amber-500",
  },
  "risk-minimal": {
    card: "border-emerald-300/70 bg-emerald-500/5",
    badge: "border-emerald-300/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    number: "text-emerald-700 dark:text-emerald-300",
    progress: "bg-emerald-500",
  },
}

const BASELINE_SCORES: RiskDomainScoreMap = {
  sickle: 0,
  stability: 0,
  clinical: 0,
  oxygen: 0,
  thal: 0,
  heinz: 0,
  genetic: 0,
}

function toSelectValue(score: number) {
  return String(score)
}

export function RiskCalculatorClient({
  variants,
  initialVariantSlug,
}: {
  variants: VariantRiskProfile[]
  initialVariantSlug?: string
}) {
  const initialVariant =
    variants.find((variant) => variant.slug === initialVariantSlug) ?? null

  const [selectedVariantSlug, setSelectedVariantSlug] = useState<string>(
    initialVariant?.slug ?? ""
  )
  const [scores, setScores] = useState<RiskDomainScoreMap>(
    initialVariant?.scores ?? { ...BASELINE_SCORES }
  )

  const selectedVariant =
    variants.find((variant) => variant.slug === selectedVariantSlug) ?? null
  const assessment = createRiskAssessmentFromScores(scores)
  const styles = TOKEN_STYLES[assessment.colorToken]
  const progressWidth = `${Math.min((assessment.score / assessment.maxScore) * 100, 100)}%`

  function updateScore(key: RiskDomainKey, value: string) {
    setScores((current) => ({
      ...current,
      [key]: Number(value),
    }))
  }

  function resetToVariant() {
    setScores(selectedVariant?.scores ?? { ...BASELINE_SCORES })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <Card className="border border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Variant lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Select
                  value={selectedVariantSlug}
                  onValueChange={(value) => {
                    setSelectedVariantSlug(value)
                    const nextVariant =
                      variants.find((variant) => variant.slug === value) ?? null
                    setScores(nextVariant?.scores ?? { ...BASELINE_SCORES })
                  }}
                >
                  <SelectTrigger aria-label="Choose a variant for risk assessment">
                    <SelectValue placeholder="Select a variant to preload the calculator" />
                  </SelectTrigger>
                  <SelectContent>
                    {variants.map((variant) => (
                      <SelectItem key={variant.slug} value={variant.slug}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={resetToVariant}>
                    <RotateCcw className="size-4" />
                    Reset scores
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSelectedVariantSlug("")
                      setScores({ ...BASELINE_SCORES })
                    }}
                  >
                    Clear to manual mode
                  </Button>
                  {selectedVariant ? (
                    <Button asChild variant="ghost">
                      <Link href={`/variants/${selectedVariant.slug}`}>Open detail page</Link>
                    </Button>
                  ) : null}
                </div>
              </div>

              {selectedVariant ? (
                <div className="rounded-3xl border border-border/60 bg-background/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{selectedVariant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedVariant.globinChains.join(" | ") || "Variant profile"}
                      </p>
                    </div>
                    <Badge variant="outline" className={styles.badge}>
                      {selectedVariant.assessment.tier}
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {selectedVariant.clinicalSummary || "No clinical summary recorded."}
                  </p>
                  <div className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Mutation
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {selectedVariant.mutation || "Not available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border/70 bg-background/50 p-5 text-sm leading-6 text-muted-foreground">
                  Choose a known variant to preload the calculator, or leave the page in manual mode and score the domains directly.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Risk domains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {DOMAIN_OPTIONS.map((domain) => (
                <div
                  key={domain.key}
                  className="rounded-3xl border border-border/60 bg-background/80 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{domain.label}</p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {domain.helper}
                      </p>
                    </div>
                    <div className="min-w-[230px]">
                      <Select
                        value={toSelectValue(scores[domain.key])}
                        onValueChange={(value) => updateScore(domain.key, value)}
                      >
                        <SelectTrigger aria-label={domain.label}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {domain.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className={`border shadow-sm ${styles.card}`}>
            <CardHeader>
              <CardTitle>Live score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="text-center">
                <p className={`text-6xl font-black tracking-tight ${styles.number}`}>
                  {assessment.score}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  out of {assessment.maxScore}
                </p>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${styles.progress}`} style={{ width: progressWidth }} />
                </div>
                <Badge variant="outline" className={`mt-4 ${styles.badge}`}>
                  {assessment.tier}
                </Badge>
              </div>

              <div className="rounded-3xl border border-border/60 bg-background/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Rationale
                </p>
                <p className="mt-2 text-sm leading-6">{assessment.rationale}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Score breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.contributions.map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-semibold">+{item.score}</p>
                      <p className="text-xs text-muted-foreground">max {item.maxScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Clinical action guidance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Action level", value: assessment.actions.level },
                { label: "Specialist review", value: assessment.actions.specialist },
                {
                  label: "Genetic counselling",
                  value: assessment.actions.geneticCounselling,
                },
                { label: "Family screening", value: assessment.actions.familyScreening },
                { label: "Monitoring", value: assessment.actions.monitoring },
                { label: "Anaesthesia / surgery", value: assessment.actions.surgery },
                { label: "Pregnancy planning", value: assessment.actions.pregnancy },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-background/80 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/80 shadow-sm">
            <CardHeader>
              <CardTitle>Key flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.flags.map((flag) => (
                <div
                  key={flag}
                  className="flex gap-3 rounded-2xl border border-border/60 bg-background/80 p-4"
                >
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm leading-6">{flag}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
