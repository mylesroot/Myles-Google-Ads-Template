"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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

    setIsSubmitting(true)

    try {
      const result = await scrapeUrlsAction(urlInput)

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      toast({
        title: "URLs submitted successfully",
        description: `Project created with ${
          result.data.invalidUrls.length > 0
            ? `${result.data.invalidUrls.length} invalid URLs`
            : "all valid URLs"
        }`
      })

      setUrlInput("")

      if (onSuccess) {
        onSuccess(result.data.projectId, result.data.invalidUrls)
      }
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
          Enter one URL per line. We'll scrape the content and prepare it for
          RSA generation.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Textarea
            placeholder="https://example.com/product1&#10;https://example.com/product2&#10;https://example.com/product3"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            rows={5}
            className="resize-none"
            disabled={isSubmitting}
          />
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
