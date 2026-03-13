// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { VariantsExplorer } from "@/components/explorers/variants-explorer"
import { getAllVariants, getVariantFilterOptions } from "@/lib/data"

const replace = vi.fn()

vi.mock("next/navigation", () => ({
  usePathname: () => "/variants",
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(""),
}))

describe("VariantsExplorer", () => {
  beforeEach(() => {
    replace.mockReset()
  })

  it("persists search state into the URL", () => {
    render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 8)}
        options={getVariantFilterOptions()}
        initialState={{}}
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
        initialState={{}}
      />
    )

    const link = screen.getByRole("link", { name: "Hb A2-Babinga" })
    expect(link).toHaveAttribute("href", "/variants/hb-a2-babinga")

    fireEvent.click(screen.getAllByRole("button", { name: /add to compare/i })[0])
    expect(screen.getByRole("link", { name: /open compare \(1\)/i })).toBeInTheDocument()
  })

  it("shows the empty state when no records match", () => {
    render(
      <VariantsExplorer
        records={getAllVariants().slice(0, 4)}
        options={getVariantFilterOptions()}
        initialState={{ q: "definitely-not-a-variant" }}
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
        initialState={{}}
      />
    )

    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
