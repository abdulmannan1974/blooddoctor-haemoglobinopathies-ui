import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DiagnosticSummary } from "@/components/blocks/diagnostic-summary"
import { KeyFactsPanel } from "@/components/blocks/key-facts-panel"
import { ReferenceList } from "@/components/blocks/reference-list"
import { SectionHeading } from "@/components/blocks/section-heading"
import { TeachingSummary } from "@/components/content/teaching-summary"
import { CompareButton } from "@/components/shared/compare-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { displayValue } from "@/lib/format"
import { getAllVariants, getVariantBySlug } from "@/lib/data"

export const dynamicParams = false

export function generateStaticParams() {
  return getAllVariants().map((variant) => ({
    slug: variant.slug,
  }))
}

export default async function VariantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const variant = getVariantBySlug(slug)

  if (!variant) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Variant detail"
        title={variant.name}
        description={variant.clinicalSummary || variant.haematologyComments || "No summary recorded for this variant."}
        action={
          <div className="flex flex-wrap gap-3">
            <Suspense fallback={<Button size="sm" disabled>Loading compare</Button>}>
              <CompareButton recordId={variant.slug} />
            </Suspense>
            <Button asChild variant="outline">
              <Link href="/variants">Back to explorer</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {variant.globinChains.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
        {variant.statuses.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
        {variant.isSickleRelevant ? <Badge>Sickle relevance</Badge> : null}
        {variant.isThalRelevant ? <Badge variant="outline">Thal relevance</Badge> : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DiagnosticSummary
          summary={variant.clinicalSummary || "No clinical teaching summary was attached to this profile."}
          notes={[
            variant.haematologyComments,
            variant.variantComments,
            variant.comments,
          ].filter(Boolean)}
        />
        <KeyFactsPanel
          title="Classification facts"
          facts={[
            { label: "Migration zones", value: displayValue(variant.migrationZones) },
            { label: "Positions", value: displayValue(variant.migrationPositions) },
            { label: "Mutation", value: displayValue(variant.mutation) },
            { label: "HGVS", value: displayValue(variant.mutationNomenclature) },
            { label: "Genetic risk", value: displayValue(variant.geneticRisk) },
            { label: "Ethnicity", value: displayValue(variant.ethnicity) },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Laboratory and phenotype notes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "RBC", value: displayValue(variant.rbc) },
              { label: "Hb", value: displayValue(variant.haemoglobin) },
              { label: "MCV", value: displayValue(variant.mcv) },
              { label: "MCH", value: displayValue(variant.mch) },
              { label: "Blood smear", value: displayValue(variant.bloodSmear) },
              { label: "Other analysis", value: displayValue(variant.otherAnalysis) },
              { label: "Combo with", value: displayValue(variant.comboWith) },
              { label: "Combo mutation", value: displayValue(variant.comboMutation) },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-background/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Fractions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {variant.fractions.length ? (
              variant.fractions.map((fraction) => (
                <div key={fraction.name} className="rounded-2xl border border-border/60 bg-background/75 p-4">
                  <p className="font-medium">{fraction.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {fraction.value || "Not available"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No fraction values were captured for this profile.</p>
            )}
            {variant.profileUrl ? (
              <>
                <Separator />
                <a
                  href={variant.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open Sebia profile
                </a>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <ReferenceList references={variant.references} />

      {variant.teachingSummary ? (
        <TeachingSummary content={variant.teachingSummary} />
      ) : null}
    </div>
  )
}
