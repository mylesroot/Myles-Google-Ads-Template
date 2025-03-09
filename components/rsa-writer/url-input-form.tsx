"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { scrapeUrlsAction } from "@/actions/scrape-actions"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface UrlInputFormProps {
  onSuccess?: (projectId: string, invalidUrls: string[]) => void
  onError?: (error: Error) => void
}

export function UrlInputForm({ onSuccess, onError }: UrlInputFormProps) {
  const router = useRouter()
  const [projectName, setProjectName] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!urlInput.trim()) {
      toast({
        variant: "destructive",
        title: "No URLs provided",
        description: "Please enter at least one URL"
      })
      return
    }

    if (!projectName.trim()) {
      toast({
        variant: "destructive",
        title: "No project name provided",
        description: "Please enter a project name"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await scrapeUrlsAction(projectName, urlInput)

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      toast({
        title: "URLs submitted successfully",
        description: `Project "${projectName}" created with ${
          result.data.invalidUrls.length > 0
            ? `${result.data.invalidUrls.length} invalid URLs`
            : "all valid URLs"
        }`
      })

      setProjectName("")
      setUrlInput("")

      if (onSuccess) {
        onSuccess(result.data.projectId, result.data.invalidUrls)
      }

      // Redirect to the project page
      router.push(`/rsa-writer/projects/${result.data.projectId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting URLs",
        description:
          error instanceof Error ? error.message : "An unknown error occurred"
      })

      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error("An unknown error occurred")
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit URLs for Scraping</CardTitle>
        <CardDescription>
          Enter URLs and a project name. We'll scrape the content and prepare it
          for RSA generation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="https://example.com/product1&#10;https://example.com/product2&#10;https://example.com/product3"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            rows={5}
            className="resize-none"
            disabled={isSubmitting}
          />
          <div>
            <label
              htmlFor="project-name"
              className="mb-1 block text-sm font-medium"
            >
              Project Name (Used to organise your URLs)
            </label>
            <Input
              id="project-name"
              placeholder="Spring Sale Products / Men's Collection"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit URLs"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
