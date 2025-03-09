"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectProject } from "@/db/schema"

interface CopyDisplayProps {
  project: SelectProject
}

export function CopyDisplay({ project }: CopyDisplayProps) {
  if (!project.generatedCopy) return <p>No copy generated yet.</p>

  return (
    <div className="space-y-4">
      {Object.entries(project.generatedCopy).map(([url, copy]) => (
        <Card key={url}>
          <CardHeader>
            <CardTitle>{url}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Headlines</h3>
            <ul className="list-disc pl-5">
              {copy.headlines.map((h, i) => (
                <li key={i}>
                  {h} ({h.length} chars)
                </li>
              ))}
            </ul>
            <h3 className="mt-4 font-semibold">Descriptions</h3>
            <ul className="list-disc pl-5">
              {copy.descriptions.map((d, i) => (
                <li key={i}>
                  {d} ({d.length} chars)
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
