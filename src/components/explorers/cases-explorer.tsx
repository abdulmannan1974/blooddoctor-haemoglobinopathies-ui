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
import type { CaseRecord, ExplorerSearchState, FilterOption } from "@/types/domain"

type CasesExplorerProps = {
  records: CaseRecord[]
  options: {
    classes: FilterOption[]
    ethnicities: FilterOption[]
  }
  initialState: ExplorerSearchState
}

function sortCases(records: CaseRecord[], sort: string) {
  const items = [...records]

  if (sort === "name") {
    return items.sort((left, right) => left.title.localeCompare(right.title))
  }

  if (sort === "ethnicity") {
    return items.sort((left, right) => left.ethnicity.localeCompare(right.ethnicity))
  }

  return items.sort((left, right) => Number(left.caseNumber) - Number(right.caseNumber))
}

export function CasesExplorer({
  records,
  options,
  initialState,
}: CasesExplorerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState(initialState.q ?? "")
  const [variantClass, setVariantClass] = useState(initialState.class ?? "all")
  const [ethnicity, setEthnicity] = useState(initialState.ethnicity ?? "all")
  const [sort, setSort] = useState(initialState.sort ?? "number")
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

  function updateState(partial: Partial<Record<"q" | "class" | "ethnicity" | "sort" | "compare", string>>) {
    syncUrl({
      q: partial.q ?? query,
      class: partial.class ?? variantClass,
      ethnicity: partial.ethnicity ?? ethnicity,
      sort: partial.sort ?? sort,
      compare: partial.compare ?? compareIds.join(","),
    })
  }

  const visibleRecords = sortCases(
    records.filter((record) => {
      const haystack = [
        record.title,
        record.hbName,
        record.hbGenotype,
        record.hbClass,
        record.clinicalFindings,
        record.labFindings,
      ]
        .join(" ")
        .toLowerCase()

      if (deferredQuery && !haystack.includes(deferredQuery.toLowerCase())) {
        return false
      }

      if (variantClass !== "all" && record.hbClass !== variantClass) {
        return false
      }

      if (ethnicity !== "all" && record.ethnicity !== ethnicity) {
        return false
      }

      return true
    }),
    sort
  )

  const rows = visibleRecords.map((record) => [
    <div key={`${record.caseNumber}-case`} className="space-y-2">
      <Link
        href={`/cases/${record.caseNumber}`}
        className="text-sm font-semibold text-foreground hover:text-primary"
      >
        Case {record.caseNumber}: {record.title}
      </Link>
      <p className="text-xs text-muted-foreground">
        {record.caption || "Bio-Rad teaching case"}
      </p>
    </div>,
    <div key={`${record.caseNumber}-classification`} className="space-y-2">
      <p>{record.hbClass || "Not available"}</p>
      <div className="flex flex-wrap gap-2">
        {record.phenotypeTags.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </div>,
    <div key={`${record.caseNumber}-indices`} className="space-y-1 text-sm text-muted-foreground">
      <p>Retention: {record.retentionTime || "n/a"}</p>
      <p>Hb: {record.haemoglobin || "n/a"} g/dL</p>
      <p>MCV: {record.mcv || "n/a"}</p>
    </div>,
    <p key={`${record.caseNumber}-clinical`} className="max-w-md text-sm text-muted-foreground">
      {record.clinicalFindings || record.description || "No case narrative recorded."}
    </p>,
    <div key={`${record.caseNumber}-actions`} className="flex flex-wrap gap-2">
      <CompareButton
        recordId={record.caseNumber}
        compareIds={compareIds}
        onChange={(nextIds) => {
          setCompareIds(nextIds)
          updateState({ compare: nextIds.join(",") })
        }}
      />
      <Button asChild size="sm" variant="ghost">
        <Link href={`/cases/${record.caseNumber}`}>Open</Link>
      </Button>
    </div>,
  ])

  return (
    <div className="space-y-6">
      <FilterToolbar
        title="Case filters"
        description="Search by case title, genotype, or narrative findings, then narrow by class or ethnicity."
        controls={
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={query}
              onChange={(event) => {
                const nextValue = event.target.value
                setQuery(nextValue)
                updateState({ q: nextValue })
              }}
              placeholder="Search case number, Hb name, genotype, or findings"
              aria-label="Search cases"
            />
            <Select
              value={variantClass}
              onValueChange={(value) => {
                setVariantClass(value)
                updateState({ class: value })
              }}
            >
              <SelectTrigger aria-label="Filter by case class">
                <SelectValue placeholder="Case class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All classes</SelectItem>
                {options.classes.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={ethnicity}
              onValueChange={(value) => {
                setEthnicity(value)
                updateState({ ethnicity: value })
              }}
            >
              <SelectTrigger aria-label="Filter by ethnicity">
                <SelectValue placeholder="Ethnicity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ethnicities</SelectItem>
                {options.ethnicities.map((option) => (
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
              <SelectTrigger className="w-full md:w-52" aria-label="Sort cases">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">Sort: case number</SelectItem>
                <SelectItem value="name">Sort: title</SelectItem>
                <SelectItem value="ethnicity">Sort: ethnicity</SelectItem>
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
                setVariantClass("all")
                setEthnicity("all")
                setSort("number")
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
        columns={["Case", "Classification", "Indices", "Clinical narrative", "Actions"]}
        rows={rows}
        emptyState={
          <EmptyState
            title="No cases match the current filters"
            description="Try broadening the query or clearing the class and ethnicity filters."
          />
        }
      />
    </div>
  )
}
