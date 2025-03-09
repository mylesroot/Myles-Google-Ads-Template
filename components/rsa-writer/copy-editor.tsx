"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateGeneratedCopyAction } from "@/actions/db/projects-actions"
import { SelectProject } from "@/db/schema/projects-schema"

interface CopyEditorProps {
  project: SelectProject
}

type GeneratedCopy = Record<
  string,
  { headlines: string[]; descriptions: string[] }
>

export function CopyEditor({ project }: CopyEditorProps) {
  const [editedCopy, setEditedCopy] = useState<GeneratedCopy>(
    project.generatedCopy || {}
  )
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Sync local state with prop changes
  useEffect(() => {
    setEditedCopy(project.generatedCopy || {})
  }, [project.generatedCopy])

  // Handle input changes
  const handleChange = (
    url: string,
    type: "headlines" | "descriptions",
    index: number,
    value: string
  ) => {
    setEditedCopy(prev => {
      const newCopy = { ...prev }
      newCopy[url] = {
        ...newCopy[url],
        [type]: newCopy[url][type].map((item, i) =>
          i === index ? value : item
        )
      }
      return newCopy
    })
    setIsDirty(true)
  }

  // Save changes to the server
  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateGeneratedCopyAction(project.id, editedCopy)
    setIsSaving(false)

    if (result.isSuccess) {
      toast.success(result.message)
      setIsDirty(false)
    } else {
      toast.error(result.message)
    }
  }

  if (
    !project.generatedCopy ||
    Object.keys(project.generatedCopy).length === 0
  ) {
    return <p>No generated copy available to edit.</p>
  }

  return (
    <div className="space-y-6">
      {Object.entries(editedCopy).map(([url, copy]) => (
        <div key={url} className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-semibold">{url}</h3>

          {/* Headlines */}
          <div className="mb-4">
            <Label>Headlines (15)</Label>
            <div className="grid grid-cols-1 gap-2">
              {copy.headlines.map((headline, index) => (
                <Input
                  key={`headline-${index}`}
                  value={headline}
                  onChange={e =>
                    handleChange(url, "headlines", index, e.target.value)
                  }
                  placeholder={`Headline ${index + 1}`}
                  maxLength={30} // Google Ads RSA headline limit
                />
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <Label>Descriptions (4)</Label>
            <div className="grid grid-cols-1 gap-2">
              {copy.descriptions.map((desc, index) => (
                <Textarea
                  key={`desc-${index}`}
                  value={desc}
                  onChange={e =>
                    handleChange(url, "descriptions", index, e.target.value)
                  }
                  placeholder={`Description ${index + 1}`}
                  maxLength={90} // Google Ads RSA description limit
                  rows={3}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {isDirty && (
        <Button onClick={handleSave} disabled={isSaving} className="mt-4">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      )}
    </div>
  )
}
