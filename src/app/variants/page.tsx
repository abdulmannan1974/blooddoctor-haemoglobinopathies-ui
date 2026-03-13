import type { ExplorerSearchState } from "@/types/domain"

import { SectionHeading } from "@/components/blocks/section-heading"
import { VariantsExplorer } from "@/components/explorers/variants-explorer"
import { getAllVariants, getVariantFilterOptions } from "@/lib/data"

export default async function VariantsPage({
  searchParams,
}: {
  searchParams: Promise<ExplorerSearchState>
}) {
  const params = await searchParams

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Sebia explorer"
        title="Variant explorer"
        description="Search structurally normalised Sebia Atlas records by name, mutation, chain, migration zone, and zygosity."
      />
      <VariantsExplorer
        records={getAllVariants()}
        options={getVariantFilterOptions()}
        initialState={params}
      />
    </div>
  )
}

