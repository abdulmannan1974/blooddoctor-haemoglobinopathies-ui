import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DiagnosticSummary } from "@/components/blocks/diagnostic-summary"
import { KeyFactsPanel } from "@/components/blocks/key-facts-panel"
import { SectionHeading } from "@/components/blocks/section-heading"
import { TeachingSummary } from "@/components/content/teaching-summary"
import { CompareButton } from "@/components/shared/compare-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { displayValue } from "@/lib/format"
import { getAllCases, getAllVariants, getCaseByNumber } from "@/lib/data"

export const dynamicParams = false

export function generateStaticParams() {
  return getAllCases().map((item) => ({
    caseNumber: item.caseNumber,
  }))
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseNumber: string }>
}) {
  const { caseNumber } = await params
  const caseRecord = getCaseByNumber(caseNumber)

  if (!caseRecord) {
    notFound()
  }

  const relatedVariants = getAllVariants().filter((variant) =>
    caseRecord.relatedVariants.includes(variant.slug)
  )

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Case detail"
        title={`Case ${caseRecord.caseNumber}: ${caseRecord.title}`}
        description={caseRecord.clinicalFindings || caseRecord.description || "No narrative summary recorded for this case."}
        action={
          <div className="flex flex-wrap gap-3">
            <Suspense fallback={<Button size="sm" disabled>Loading compare</Button>}>
              <CompareButton recordId={caseRecord.caseNumber} />
            </Suspense>
            <Button asChild variant="outline">
              <Link href="/cases">Back to case atlas</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {caseRecord.phenotypeTags.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
        {caseRecord.ethnicity ? <Badge variant="outline">{caseRecord.ethnicity}</Badge> : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DiagnosticSummary
          summary={caseRecord.clinicalFindings || caseRecord.description || "No case narrative recorded."}
          notes={[caseRecord.labFindings, caseRecord.characterization, caseRecord.bioRadComments].filter(Boolean)}
        />
        <KeyFactsPanel
          title="Case facts"
          facts={[
            { label: "Hb class", value: displayValue(caseRecord.hbClass) },
            { label: "Hb name", value: displayValue(caseRecord.hbName) },
            { label: "Genotype", value: displayValue(caseRecord.hbGenotype) },
            { label: "Retention time", value: displayValue(caseRecord.retentionTime) },
            { label: "Ethnicity", value: displayValue(caseRecord.ethnicity) },
            { label: "Reference lab", value: displayValue(caseRecord.referenceLab) },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Indices and specimen details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Haemoglobin", value: displayValue(caseRecord.haemoglobin) },
              { label: "RBC", value: displayValue(caseRecord.rbc) },
              { label: "MCV", value: displayValue(caseRecord.mcv) },
              { label: "MCH", value: displayValue(caseRecord.mch) },
              { label: "RDW", value: displayValue(caseRecord.rdw) },
              { label: "Ferritin", value: displayValue(caseRecord.ferritin) },
              { label: "Gender", value: displayValue(caseRecord.gender) },
              { label: "Age", value: displayValue(caseRecord.age) },
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
            <CardTitle>Related variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedVariants.length ? (
              relatedVariants.map((variant) => (
                <Link
                  key={variant.slug}
                  href={`/variants/${variant.slug}`}
                  className="block rounded-2xl border border-border/60 bg-background/75 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <p className="font-medium">{variant.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {variant.mutation || variant.clinicalSummary || "Open variant profile"}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No related variants were resolved from the current case labels.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {caseRecord.teachingSummary ? (
        <TeachingSummary content={caseRecord.teachingSummary} />
      ) : null}
    </div>
  )
}
