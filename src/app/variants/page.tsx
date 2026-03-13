import { Suspense } from "react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { VariantsExplorer } from "@/components/explorers/variants-explorer"
import { EmptyState } from "@/components/blocks/empty-state"
import { getAllVariants, getVariantFilterOptions } from "@/lib/data"

export default function VariantsPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Sebia explorer"
        title="Variant explorer"
        description="Search structurally normalised Sebia Atlas records by name, mutation, chain, migration zone, and zygosity."
      />
      <Suspense
        fallback={
          <EmptyState
            title="Loading explorer"
            description="Preparing variant filters and table view."
          />
        }
      >
        <VariantsExplorer
          records={getAllVariants()}
          options={getVariantFilterOptions()}
        />
      </Suspense>
    </div>
  )
}
