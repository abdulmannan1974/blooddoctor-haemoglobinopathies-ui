import { Suspense } from "react"

import { EmptyState } from "@/components/blocks/empty-state"
import { SectionHeading } from "@/components/blocks/section-heading"
import { ComparePageClient } from "@/components/compare/compare-page-client"
import {
  getAllCases,
  getAllVariants,
  toCaseCompareRecord,
  toVariantCompareRecord,
} from "@/lib/data"

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Side-by-side review"
        title="Compare workspace"
        description="Select up to two variant records or two case records from the explorer pages, then review their core features in one consistent matrix."
      />
      <Suspense
        fallback={
          <EmptyState
            title="Loading compare workspace"
            description="Preparing selected records for side-by-side review."
          />
        }
      >
        <ComparePageClient
          caseRecords={getAllCases().map(toCaseCompareRecord)}
          variantRecords={getAllVariants().map(toVariantCompareRecord)}
        />
      </Suspense>
    </div>
  )
}
