// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { VariantsExplorer } from "@/components/explorers/variants-explorer"
import { getAllVariants, getVariantFilterOptions } from "@/lib/data"

const replace = vi.fn()
let currentSearch = ""

vi.mock("next/navigation", () => ({
  usePathname: () => "/variants",
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(currentSearch),
}))

describe("VariantsExplorer", () => {
  beforeEach(() => {
    replace.mockReset()
    currentSearch = ""
  })

  it("persists search state into the URL", () => {
    render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 8)}
        options={getVariantFilterOptions()}
      />
    )

    fireEvent.change(screen.getByLabelText(/search variants/i), {
      target: { value: "Coburg" },
    })

    expect(replace).toHaveBeenCalledWith(expect.stringContaining("q=Coburg"))
  })

  it("renders row links and compare actions", () => {
    render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 4)}
        options={getVariantFilterOptions()}
      />
    )

    const link = screen.getByRole("link", { name: "Hb A2-Babinga" })
    expect(link).toHaveAttribute("href", "/variants/hb-a2-babinga")

    fireEvent.click(screen.getAllByRole("button", { name: /add to compare/i })[0])
    expect(replace).toHaveBeenCalledWith(expect.stringContaining("compare=hb-a2-babinga"))
  })

  it("shows the empty state when no records match", () => {
    currentSearch = "q=definitely-not-a-variant"

    render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 4)}
        options={getVariantFilterOptions()}
      />
    )

    expect(
      screen.getByText(/no variants match the current filters/i)
    ).toBeInTheDocument()
  })

  it("has no obvious accessibility violations", async () => {
    const { container } = render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 6)}
        options={getVariantFilterOptions()}
      />
    )

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
