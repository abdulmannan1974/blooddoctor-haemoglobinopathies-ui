"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"

import { ComparisonMatrix } from "@/components/blocks/comparison-matrix"
import { EmptyState } from "@/components/blocks/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompareRecord } from "@/types/domain"

export function ComparePageClient({
  caseRecords,
  variantRecords,
}: {
  caseRecords: CompareRecord[]
  variantRecords: CompareRecord[]
}) {
  const searchParams = useSearchParams()

  const { isCaseCompare, records } = useMemo(() => {
    const compareIds = searchParams.get("compare")?.split(",").filter(Boolean) ?? []
    const caseCompare = compareIds.length > 0 && compareIds.every((item) => /^\d+$/.test(item))

    return {
      isCaseCompare: caseCompare,
      records: caseCompare
        ? caseRecords.filter((record) => compareIds.includes(record.id))
        : variantRecords.filter((record) => compareIds.includes(record.id)),
    }
  }, [caseRecords, searchParams, variantRecords])

  if (records.length !== 2) {
    return (
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
    )
  }

  return (
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
  )
}

