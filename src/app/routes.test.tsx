// @vitest-environment jsdom

import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import CaseDetailPage from "@/app/cases/[caseNumber]/page"
import ComparePage from "@/app/compare/page"
import HomePage from "@/app/page"
import RiskCalculatorPage from "@/app/risk-calculator/page"
import VariantDetailPage from "@/app/variants/[slug]/page"

const replace = vi.fn()
const push = vi.fn()

vi.mock("next/navigation", () => ({
  usePathname: () => "/variants/hb-a2-babinga",
  useRouter: () => ({ replace, push }),
  useSearchParams: () => new URLSearchParams("compare=hb-a2-babinga,hb-a2-coburg"),
  notFound: () => {
    throw new Error("notFound")
  },
}))

describe("route rendering", () => {
  beforeEach(() => {
    replace.mockReset()
    push.mockReset()
  })

  it("renders the educator dashboard", async () => {
    render(await HomePage())

    expect(
      screen.getByRole("heading", {
        name: /a standardised haemoglobinopathy workspace/i,
      })
    ).toBeInTheDocument()
  })

  it("renders a variant detail page", async () => {
    render(
      await VariantDetailPage({
        params: Promise.resolve({ slug: "hb-a2-babinga" }),
      })
    )

    expect(
      screen.getByRole("heading", { name: "Hb A2-Babinga" })
    ).toBeInTheDocument()
    expect(screen.getByText(/classification facts/i)).toBeInTheDocument()
  })

  it("renders a case detail page", async () => {
    render(
      await CaseDetailPage({
        params: Promise.resolve({ caseNumber: "1" }),
      })
    )

    expect(
      screen.getByRole("heading", { name: /case 1: h disease/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/case facts/i)).toBeInTheDocument()
  })

  it("renders the comparison matrix for two variants", async () => {
    render(await ComparePage())

    expect(screen.getByText(/variant comparison matrix/i)).toBeInTheDocument()
    expect(screen.getAllByText(/hb a2/i).length).toBeGreaterThan(1)
  })

  it("renders the risk calculator route", async () => {
    render(
      await RiskCalculatorPage({
        searchParams: { variant: "hb-c-harlem" },
      })
    )

    expect(
      screen.getByRole("heading", {
        name: /molecular risk calculator for haemoglobin variants/i,
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/live score/i)).toBeInTheDocument()
  })
})
