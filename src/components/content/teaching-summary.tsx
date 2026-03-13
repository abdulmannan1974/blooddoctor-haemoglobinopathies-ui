import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TeachingContent } from "@/types/domain"

export function TeachingSummary({ content }: { content: TeachingContent }) {
  return (
    <Card className="border border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Embedded from {content.sourceFile}
        </p>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none prose-headings:tracking-tight prose-p:leading-7 prose-a:text-primary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content.body}
        </ReactMarkdown>
      </CardContent>
    </Card>
  )
}

