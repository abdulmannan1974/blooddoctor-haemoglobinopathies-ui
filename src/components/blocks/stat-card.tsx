import type { LucideIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon?: LucideIcon
}) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-3xl font-semibold tracking-tight">
            {value}
          </CardTitle>
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-primary/10 p-2 text-primary">
            <Icon className="size-4" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

