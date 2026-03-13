import { ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReferenceLink } from "@/types/domain"

export function ReferenceList({
  title = "Evidence and links",
  references,
}: {
  title?: string
  references: ReferenceLink[]
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {references.length ? (
          <ul className="space-y-3">
            {references.map((reference) => (
              <li key={`${reference.source}-${reference.url}`} className="rounded-2xl border border-border/60 bg-background/75 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline">{reference.source}</Badge>
                </div>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <span>{reference.title}</span>
                  <ExternalLink className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No external references were attached to this record.</p>
        )}
      </CardContent>
    </Card>
  )
}

