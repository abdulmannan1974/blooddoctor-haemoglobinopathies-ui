import type { ReactNode } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function DataTable({
  columns,
  rows,
  emptyState,
}: {
  columns: string[]
  rows: Array<Array<ReactNode>>
  emptyState: ReactNode
}) {
  if (!rows.length) {
    return emptyState
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead key={column} className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="align-top">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

