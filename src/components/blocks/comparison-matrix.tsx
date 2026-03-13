import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompareRecord } from "@/types/domain"

export function ComparisonMatrix({
  title,
  records,
}: {
  title: string
  records: CompareRecord[]
}) {
  const rowLabels = records[0]?.rows.map((row) => row.label) ?? []

  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              <th className="w-52 border-b border-border/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Feature
              </th>
              {records.map((record) => (
                <th key={record.id} className="border-b border-border/70 px-4 py-3 align-top">
                  <div className="space-y-1">
                    <p className="font-semibold">{record.title}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {record.subtitle}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((label, rowIndex) => (
              <tr key={label}>
                <td className="border-b border-border/50 px-4 py-3 font-medium text-foreground">
                  {label}
                </td>
                {records.map((record) => (
                  <td key={`${record.id}-${label}`} className="border-b border-border/50 px-4 py-3 text-muted-foreground">
                    {record.rows[rowIndex]?.value ?? "Not available"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

