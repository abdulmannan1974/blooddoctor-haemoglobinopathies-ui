"use client"

import { startTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Scale } from "lucide-react"

import { Button } from "@/components/ui/button"

function nextCompareList(ids: string[], value: string) {
  if (ids.includes(value)) {
    return ids.filter((item) => item !== value)
  }

  return [...ids, value].slice(-2)
}

export function CompareButton({
  recordId,
  compareIds = [],
  onChange,
}: {
  recordId: string
  compareIds?: string[]
  onChange?: (value: string[]) => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedIds =
    searchParams.get("compare")?.split(",").filter(Boolean) ?? compareIds

  const isSelected = selectedIds.includes(recordId)
  const isDisabled = selectedIds.length >= 2 && !isSelected

  function onToggle() {
    const nextIds = nextCompareList(selectedIds, recordId)
    onChange?.(nextIds)

    const params = new URLSearchParams(searchParams.toString())
    if (nextIds.length) {
      params.set("compare", nextIds.join(","))
    } else {
      params.delete("compare")
    }

    startTransition(() => {
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
    })
  }

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className="gap-2"
      disabled={isDisabled}
      onClick={onToggle}
    >
      <Scale className="size-4" />
      {isSelected ? "Selected" : "Add to compare"}
    </Button>
  )
}
