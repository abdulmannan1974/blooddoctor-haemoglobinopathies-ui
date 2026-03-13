import { describe, expect, it } from "vitest"

import { getVariantBySlug } from "@/lib/data"
import {
  createRiskAssessmentFromScores,
  getRiskTierInfo,
  getVariantRiskAssessment,
} from "@/lib/risk"

describe("risk assessment", () => {
  it("returns the correct tier thresholds", () => {
    expect(getRiskTierInfo(0).tier).toBe("TIER 4 — BENIGN/MINIMAL")
    expect(getRiskTierInfo(10).tier).toBe("TIER 3 — LOW RISK")
    expect(getRiskTierInfo(25).tier).toBe("TIER 2 — MODERATE RISK")
    expect(getRiskTierInfo(50).tier).toBe("TIER 1 — HIGH RISK")
  })

  it("creates an aggregate score from manual domain values", () => {
    const assessment = createRiskAssessmentFromScores({
      sickle: 40,
      stability: 25,
      clinical: 10,
      oxygen: 0,
      thal: 0,
      heinz: 10,
      genetic: 10,
    })

    expect(assessment.score).toBe(95)
    expect(assessment.tier).toBe("TIER 1 — HIGH RISK")
    expect(assessment.actions.level).toBe("URGENT")
  })

  it("derives a benign profile for a low-risk variant", () => {
    const variant = getVariantBySlug("hb-a2-babinga")

    expect(variant).toBeTruthy()

    const assessment = getVariantRiskAssessment(variant!)

    expect(assessment.score).toBe(0)
    expect(assessment.tier).toBe("TIER 4 — BENIGN/MINIMAL")
  })

  it("derives an urgent profile for a sickling unstable variant", () => {
    const variant = getVariantBySlug("hb-c-harlem")

    expect(variant).toBeTruthy()

    const assessment = getVariantRiskAssessment(variant!)

    expect(assessment.score).toBeGreaterThanOrEqual(50)
    expect(assessment.tier).toBe("TIER 1 — HIGH RISK")
  })
})
