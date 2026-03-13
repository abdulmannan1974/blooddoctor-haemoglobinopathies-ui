import "@testing-library/jest-dom/vitest"

import { afterEach, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import { createElement } from "react"

afterEach(() => {
  cleanup()
})

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => createElement("a", { href, ...props }, children),
}))
