"use client"

import { startTransition, useState } from "react"
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

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextQuery = query.trim()
    const path = scope === "variants" ? "/variants" : "/cases"
    const params = new URLSearchParams()

    if (nextQuery) {
      params.set("q", nextQuery)
    }

    startTransition(() => {
      router.push(params.toString() ? `${path}?${params.toString()}` : path)
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/65 md:flex-row md:items-center"
    >
      <div className="grid flex-1 gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
        <Select value={scope} onValueChange={(value: "variants" | "cases") => setScope(value)}>
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
          onChange={(event) => setQuery(event.target.value)}
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

