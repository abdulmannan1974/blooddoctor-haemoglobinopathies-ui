import { RiskCalculatorClient } from "@/components/risk/risk-calculator-client"
import { SectionHeading } from "@/components/blocks/section-heading"
import { getAllVariants } from "@/lib/data"
import { getVariantRiskAssessment, getVariantRiskScores } from "@/lib/risk"

export default function RiskCalculatorPage({
  searchParams,
}: {
  searchParams?: { variant?: string }
}) {
  const params = searchParams ?? {}
  const variants = getAllVariants()
    .map((variant) => ({
      slug: variant.slug,
      name: variant.name,
      globinChains: variant.globinChains,
      mutation: variant.mutation,
      clinicalSummary: variant.clinicalSummary,
      scores: getVariantRiskScores(variant),
      assessment: getVariantRiskAssessment(variant),
    }))
    .sort((left, right) => right.assessment.score - left.assessment.score)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Risk assessment"
        title="Molecular risk calculator for haemoglobin variants"
        description="This calculator is rebuilt from the current typed dataset rather than imported from the legacy single-file app. Select a known variant to preload the score, then refine the domains in real time for teaching, counselling, and review."
      />

      <RiskCalculatorClient
        variants={variants}
        initialVariantSlug={params.variant}
      />
    </div>
  )
}
