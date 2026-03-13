import type { ExplorerSearchState } from "@/types/domain"

import { CasesExplorer } from "@/components/explorers/cases-explorer"
import { SectionHeading } from "@/components/blocks/section-heading"
import { getAllCases, getCaseFilterOptions } from "@/lib/data"

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<ExplorerSearchState>
}) {
  const params = await searchParams

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Bio-Rad atlas"
        title="Case atlas"
        description="Navigate curated Bio-Rad teaching cases by class, ethnicity, phenotype signals, and key haematology indices."
      />
      <CasesExplorer
        records={getAllCases()}
        options={getCaseFilterOptions()}
        initialState={params}
      />
    </div>
  )
}

