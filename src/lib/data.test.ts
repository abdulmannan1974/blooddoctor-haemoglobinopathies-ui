import { describe, expect, it } from "vitest"

import {
  getAllCases,
  getAllVariants,
  getCaseByNumber,
  getVariantBySlug,
  toCaseCompareRecord,
  toVariantCompareRecord,
} from "@/lib/data"

describe("data normalization", () => {
  it("loads the variant and case datasets from the parent workspace", () => {
    expect(getAllVariants().length).toBeGreaterThan(50)
    expect(getAllCases().length).toBeGreaterThan(100)
  })

  it("returns normalized detail records", () => {
    const variant = getVariantBySlug("hb-a2-babinga")
    const caseRecord = getCaseByNumber("1")

    expect(variant?.name).toBe("Hb A2-Babinga")
    expect(caseRecord?.title).toContain("H disease")
    expect(caseRecord?.phenotypeTags.length).toBeGreaterThan(0)
  })

  it("creates compare-ready view models", () => {
    const variant = getVariantBySlug("hb-a2-babinga")
    const caseRecord = getCaseByNumber("1")

    expect(variant).toBeTruthy()
    expect(caseRecord).toBeTruthy()

    expect(toVariantCompareRecord(variant!).rows.length).toBeGreaterThan(5)
    expect(toCaseCompareRecord(caseRecord!).rows.length).toBeGreaterThan(5)
  })
})

