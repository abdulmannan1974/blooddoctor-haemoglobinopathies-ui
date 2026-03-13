import type { ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FilterToolbar({
  title,
  description,
  controls,
  chips,
}: {
  title: string
  description: string
  controls: ReactNode
  chips?: ReactNode
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="gap-2">
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {controls}
        {chips}
      </CardContent>
    </Card>
  )
}

