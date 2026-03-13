import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Layers3,
  Microscope,
  NotebookPen,
} from "lucide-react"

import { SectionHeading } from "@/components/blocks/section-heading"
import { StatCard } from "@/components/blocks/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardOverview, getTeachingTopics } from "@/lib/data"

export default function HomePage() {
  const overview = getDashboardOverview()
  const teachingTopics = getTeachingTopics().slice(0, 3)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Clinical educator dashboard"
        title="A standardised haemoglobinopathy workspace for rapid teaching and comparison"
        description="Browse curated variant profiles, move through structured Bio-Rad teaching cases, and compare records side by side inside one consistent shadcn-driven UI."
        action={
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/variants">Open variant explorer</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cases">Review case atlas</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-4">
        {overview.metrics.map((metric, index) => {
          const icons = [Layers3, Microscope, NotebookPen, Activity]
          const Icon = icons[index]

          return (
            <StatCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={Icon}
            />
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>What this rebuild standardises</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              "Persistent dashboard shell with one navigation system for all screens.",
              "Shared filter, table, compare, and detail blocks built from shadcn primitives.",
              "JSON-first data normalization so the UI does not parse raw files inline.",
              "Embedded teaching summaries on detail pages whenever local narrative content exists.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-border/60 bg-background/80 p-4 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Quick launch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                href: "/risk-calculator",
                title: "Risk calculator",
                description: "Preload any variant and refine the risk domains live.",
              },
              {
                href: "/variants",
                title: "Variant explorer",
                description: "Search by name, mutation, chain, zone, and zygosity.",
              },
              {
                href: "/cases",
                title: "Case atlas",
                description: "Browse Bio-Rad cases by class, ethnicity, and phenotype clues.",
              },
              {
                href: "/compare",
                title: "Compare workspace",
                description: "Open a side-by-side matrix for two variant or two case records.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start justify-between rounded-2xl border border-border/60 bg-background/80 p-4 transition hover:border-primary/40 hover:bg-primary/5"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 text-primary" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.15fr]">
        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Top variant zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.highlights.topVariantZones.map((item) => (
              <div key={item.value} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Top globin chains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.highlights.topVariantChains.map((item) => (
              <div key={item.value} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <span className="font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Teaching topics embedded in v1</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachingTopics.map((topic) => (
              <div key={topic.slug} className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <p className="font-medium">{topic.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {topic.excerpt}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
