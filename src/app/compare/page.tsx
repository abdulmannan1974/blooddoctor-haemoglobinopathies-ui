import Link from "next/link"

import { ComparisonMatrix } from "@/components/blocks/comparison-matrix"
import { EmptyState } from "@/components/blocks/empty-state"
import { SectionHeading } from "@/components/blocks/section-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getAllCases,
  getAllVariants,
  toCaseCompareRecord,
  toVariantCompareRecord,
} from "@/lib/data"

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ compare?: string }>
}) {
  const compareIds = (await searchParams).compare?.split(",").filter(Boolean) ?? []
  const isCaseCompare = compareIds.length > 0 && compareIds.every((item) => /^\d+$/.test(item))

  const records = isCaseCompare
    ? getAllCases()
        .filter((record) => compareIds.includes(record.caseNumber))
        .map(toCaseCompareRecord)
    : getAllVariants()
        .filter((record) => compareIds.includes(record.slug))
        .map(toVariantCompareRecord)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Side-by-side review"
        title="Compare workspace"
        description="Select up to two variant records or two case records from the explorer pages, then review their core features in one consistent matrix."
      />

      {records.length === 2 ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {records.map((record) => (
              <Card key={record.id} className="border border-border/70 bg-card/80 shadow-sm">
                <CardHeader>
                  <CardTitle>{record.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{record.subtitle}</p>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {record.summary}
                </CardContent>
              </Card>
            ))}
          </div>
          <ComparisonMatrix
            title={isCaseCompare ? "Case comparison matrix" : "Variant comparison matrix"}
            records={records}
          />
        </div>
      ) : (
        <EmptyState
          title="Select exactly two records to compare"
          description="Use the add-to-compare buttons in the variant explorer or case atlas, then reopen this page once two records are selected."
          action={
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/variants">Open variants</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cases">Open cases</Link>
              </Button>
            </div>
          }
        />
      )}
    </div>
  )
}
