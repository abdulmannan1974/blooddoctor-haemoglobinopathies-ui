"use client"

import { startTransition, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function GlobalSearchEntry() {
  const router = useRouter()
  const [scope, setScope] = useState<"variants" | "cases">("variants")
  const [query, setQuery] = useState("")
  const hasTypedRef = useRef(false)

  function buildSearchUrl(nextScope: "variants" | "cases", nextQuery: string) {
    const path = nextScope === "variants" ? "/variants" : "/cases"
    const params = new URLSearchParams()
    const trimmedQuery = nextQuery.trim()

    if (trimmedQuery) {
      params.set("q", trimmedQuery)
    }

    return params.toString() ? `${path}?${params.toString()}` : path
  }

  useEffect(() => {
    if (!hasTypedRef.current) {
      return
    }

    const timer = window.setTimeout(() => {
      const nextUrl = buildSearchUrl(scope, query)

      startTransition(() => {
        router.replace(nextUrl)
      })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [query, router, scope])

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    hasTypedRef.current = true
    const nextUrl = buildSearchUrl(scope, query)

    startTransition(() => {
      router.push(nextUrl)
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/65 md:flex-row md:items-center"
    >
      <div className="grid flex-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
        <Select
          value={scope}
          onValueChange={(value: "variants" | "cases") => {
            hasTypedRef.current = true
            setScope(value)
          }}
        >
          <SelectTrigger aria-label="Search scope">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="variants">Variant explorer</SelectItem>
            <SelectItem value="cases">Case atlas</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(event) => {
            hasTypedRef.current = true
            setQuery(event.target.value)
          }}
          placeholder="Search by Hb name, mutation, genotype, or teaching topic"
          aria-label="Global search"
        />
      </div>
      <Button type="submit" className="gap-2">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  )
}
