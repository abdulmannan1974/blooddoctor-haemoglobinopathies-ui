"use client"

import Link from "next/link"
import { startTransition, useDeferredValue, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { DataTable } from "@/components/blocks/data-table"
import { EmptyState } from "@/components/blocks/empty-state"
import { FilterToolbar } from "@/components/blocks/filter-toolbar"
import { CompareButton } from "@/components/shared/compare-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ExplorerSearchState, FilterOption, VariantRecord } from "@/types/domain"

type VariantExplorerProps = {
  records: VariantRecord[]
  options: {
    chains: FilterOption[]
    zones: FilterOption[]
    statuses: FilterOption[]
  }
  initialState: ExplorerSearchState
}

function sortVariants(records: VariantRecord[], sort: string) {
  const items = [...records]

  if (sort === "zone") {
    return items.sort((left, right) =>
      (left.migrationZones[0] ?? "").localeCompare(right.migrationZones[0] ?? "")
    )
  }

  if (sort === "chain") {
    return items.sort((left, right) =>
      (left.globinChains[0] ?? "").localeCompare(right.globinChains[0] ?? "")
    )
  }

  return items.sort((left, right) => left.name.localeCompare(right.name))
}

export function VariantsExplorer({
  records,
  options,
  initialState,
}: VariantExplorerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState(initialState.q ?? "")
  const [chain, setChain] = useState(initialState.chain ?? "all")
  const [zone, setZone] = useState(initialState.zone ?? "all")
  const [status, setStatus] = useState(initialState.status ?? "all")
  const [sort, setSort] = useState(initialState.sort ?? "name")
  const [compareIds, setCompareIds] = useState(
    initialState.compare?.split(",").filter(Boolean) ?? []
  )
  const deferredQuery = useDeferredValue(query)

  function syncUrl(nextState: Record<string, string>) {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(nextState)) {
      if (value && value !== "all") {
        params.set(key, value)
      }
    }

    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    })
  }

  function updateState(partial: Partial<Record<"q" | "chain" | "zone" | "status" | "sort" | "compare", string>>) {
    const nextState = {
      q: partial.q ?? query,
      chain: partial.chain ?? chain,
      zone: partial.zone ?? zone,
      status: partial.status ?? status,
      sort: partial.sort ?? sort,
      compare: partial.compare ?? compareIds.join(","),
    }

    syncUrl(nextState)
  }

  const visibleRecords = sortVariants(
    records.filter((record) => {
      const haystack = [
        record.name,
        ...record.alternateNames,
        record.mutation,
        record.mutationNomenclature,
        record.clinicalSummary,
      ]
        .join(" ")
        .toLowerCase()

      if (deferredQuery && !haystack.includes(deferredQuery.toLowerCase())) {
        return false
      }

      if (chain !== "all" && !record.globinChains.includes(chain)) {
        return false
      }

      if (zone !== "all" && !record.migrationZones.includes(zone)) {
        return false
      }

      if (status !== "all" && !record.statuses.includes(status)) {
        return false
      }

      return true
    }),
    sort
  )

  const rows = visibleRecords.map((record) => [
    <div key={`${record.slug}-name`} className="space-y-2">
      <Link
        href={`/variants/${record.slug}`}
        className="text-sm font-semibold text-foreground hover:text-primary"
      >
        {record.name}
      </Link>
      <p className="text-xs text-muted-foreground">
        {(record.alternateNames.join(", ") || "No alternate names listed")}
      </p>
    </div>,
    <div key={`${record.slug}-classification`} className="space-y-2">
      <p>{record.globinChains.join(", ") || "Not available"}</p>
      <div className="flex flex-wrap gap-2">
      {record.statuses.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>,
    <div key={`${record.slug}-migration`} className="space-y-1 text-sm text-muted-foreground">
      <p>{record.migrationZones.join(", ") || "Not available"}</p>
      <p>{record.mutation || record.mutationNomenclature || "No mutation label"}</p>
    </div>,
    <p key={`${record.slug}-clinical`} className="max-w-md text-sm text-muted-foreground">
      {record.clinicalSummary || record.haematologyComments || "No clinical summary recorded."}
    </p>,
    <div key={`${record.slug}-actions`} className="flex flex-wrap gap-2">
      <CompareButton
        recordId={record.slug}
        compareIds={compareIds}
        onChange={(nextIds) => {
          setCompareIds(nextIds)
          updateState({ compare: nextIds.join(",") })
        }}
      />
      <Button asChild size="sm" variant="ghost">
        <Link href={`/variants/${record.slug}`}>Open</Link>
      </Button>
    </div>,
  ])

  return (
    <div className="space-y-6">
      <FilterToolbar
        title="Variant filters"
        description="Search across names and mutations, then narrow by chain, migration zone, or zygosity."
        controls={
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value
                setQuery(nextValue)
                updateState({ q: nextValue })
              }}
              placeholder="Search Hb name, mutation, or notes"
              aria-label="Search variants"
            />
            <Select
              value={chain}
              onValueChange={(value) => {
                setChain(value)
                updateState({ chain: value })
              }}
            >
              <SelectTrigger aria-label="Filter by globin chain">
                <SelectValue placeholder="Globin chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All chains</SelectItem>
                {options.chains.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={zone}
              onValueChange={(value) => {
                setZone(value)
                updateState({ zone: value })
              }}
            >
              <SelectTrigger aria-label="Filter by migration zone">
                <SelectValue placeholder="Migration zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All zones</SelectItem>
                {options.zones.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                updateState({ status: value })
              }}
            >
              <SelectTrigger aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {options.statuses.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        chips={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={sort}
              onValueChange={(value) => {
                setSort(value)
                updateState({ sort: value })
              }}
            >
              <SelectTrigger className="w-full md:w-52" aria-label="Sort variants">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort: name</SelectItem>
                <SelectItem value="zone">Sort: migration zone</SelectItem>
                <SelectItem value="chain">Sort: globin chain</SelectItem>
              </SelectContent>
            </Select>
            {compareIds.length ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/compare?compare=${compareIds.join(",")}`}>
                  Open compare ({compareIds.length})
                </Link>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("")
                setChain("all")
                setZone("all")
                setStatus("all")
                setSort("name")
                setCompareIds([])
                syncUrl({})
              }}
            >
              Clear all
            </Button>
          </div>
        }
      />
      <DataTable
        columns={["Variant", "Classification", "Migration / mutation", "Clinical teaching notes", "Actions"]}
        rows={rows}
        emptyState={
          <EmptyState
            title="No variants match the current filters"
            description="Try clearing one or more filters, or search for a broader mutation label."
          />
        }
      />
    </div>
  )
}
