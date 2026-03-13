import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyFactsPanel({
  title,
  facts,
}: {
  title: string
  facts: Array<{ label: string; value: string }>
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-2xl border border-border/60 bg-background/75 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">{fact.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

