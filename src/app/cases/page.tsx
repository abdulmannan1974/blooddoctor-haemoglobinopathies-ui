import { Suspense } from "react"

import { CasesExplorer } from "@/components/explorers/cases-explorer"
import { EmptyState } from "@/components/blocks/empty-state"
import { SectionHeading } from "@/components/blocks/section-heading"
import { getAllCases, getCaseFilterOptions } from "@/lib/data"

export default function CasesPage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Bio-Rad atlas"
        title="Case atlas"
        description="Navigate curated Bio-Rad teaching cases by class, ethnicity, phenotype signals, and key haematology indices."
      />
      <Suspense
        fallback={
          <EmptyState
            title="Loading case atlas"
            description="Preparing Bio-Rad case filters and table view."
          />
        }
      >
        <CasesExplorer
          records={getAllCases()}
          options={getCaseFilterOptions()}
        />
      </Suspense>
    </div>
  )
}
