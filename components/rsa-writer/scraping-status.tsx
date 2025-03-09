"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { SelectProject } from "@/db/schema"

interface ScrapingStatusProps {
  project?: SelectProject
  invalidUrls?: string[]
}

export function ScrapingStatus({
  project,
  invalidUrls = []
}: ScrapingStatusProps) {
  const [progress, setProgress] = useState(0)

  // Extract progress information from project status if available
  useEffect(() => {
    if (!project) return

    if (project.status?.startsWith("scraping")) {
      const match = project.status.match(/scraping (\d+)\/(\d+)/)
      if (match && match.length === 3) {
        const [_, completed, total] = match
        setProgress(Math.round((parseInt(completed) / parseInt(total)) * 100))
      } else {
        setProgress(10) // Default progress when scraping has just started
      }
    } else if (project.status === "completed") {
      setProgress(100)
    } else if (project.status === "failed") {
      setProgress(0)
    }
  }, [project])

  if (!project) return null

  const isCompleted = project.status === "completed"
  const isFailed = project.status === "failed"
  const isScraping =
    project.status?.startsWith("scraping") || project.status === "pending"

  return (
    <AnimatePresence>
      {(isScraping || isCompleted || isFailed) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {isCompleted
                  ? "Scraping Completed"
                  : isFailed
                    ? "Scraping Failed"
                    : "Scraping in Progress"}
              </CardTitle>
              <CardDescription>
                {isCompleted
                  ? `Successfully scraped ${project.urls.length - invalidUrls.length} URLs`
                  : isFailed
                    ? "Failed to scrape URLs"
                    : `Scraping ${project.urls.length} URLs...`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isScraping && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {isCompleted && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="size-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    All URLs have been scraped successfully. Your data is ready
                    for the next step.
                  </AlertDescription>
                </Alert>
              )}

              {isFailed && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to scrape URLs. Please try again or contact support.
                  </AlertDescription>
                </Alert>
              )}

              {invalidUrls.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Invalid URLs</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      The following URLs could not be processed:
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {invalidUrls.slice(0, 5).map((url, index) => (
                        <li key={index} className="break-all">
                          {url}
                        </li>
                      ))}
                      {invalidUrls.length > 5 && (
                        <li>...and {invalidUrls.length - 5} more</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
