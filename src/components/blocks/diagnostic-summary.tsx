import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DiagnosticSummary({
  title = "Diagnostic summary",
  summary,
  notes,
}: {
  title?: string
  summary: string
  notes?: string[]
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-foreground">{summary}</p>
        {notes?.length ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {notes.map((note) => (
              <li key={note} className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                {note}
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}

