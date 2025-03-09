"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SelectProject } from "@/db/schema/projects-schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Save,
  Zap,
  ZapOff
} from "lucide-react"
import { updateGeneratedCopyAction } from "@/actions/db/projects-actions"
import {
  generateCopyAction,
  generateSingleCopyAction
} from "@/actions/ai-copy-actions"
import { openAIService } from "@/lib/services/openai-service"

interface ProjectDetailProps {
  project: SelectProject
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const router = useRouter()
  const [selectedUrl, setSelectedUrl] = useState<string | null>(
    project.urls.length > 0 ? project.urls[0] : null
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Get the generated copy for the selected URL
  const generatedCopy = project.generatedCopy as Record<string, any> | null
  const urlCopy =
    selectedUrl && generatedCopy ? generatedCopy[selectedUrl] : null

  // Get the URL's scraped data
  const scrapedData = project.scrapedData as Record<string, any> | null
  const urlScrapedData =
    selectedUrl && scrapedData ? scrapedData[selectedUrl] : null

  const hasValidScrapedData = urlScrapedData && urlScrapedData.success === true

  // Function to get site name and title from metadata
  const getSiteInfo = (url: string) => {
    if (!scrapedData || !scrapedData[url] || !scrapedData[url].metadata) {
      // If metadata is not available, return a default display
      return url.replace(/^https?:\/\//, "")
    }

    const metadata = scrapedData[url].metadata || {}

    // Try to get og:site_name or fallback to hostname
    let siteName =
      metadata["og:site_name"] || new URL(url).hostname.replace(/^www\./, "")

    // Try to get og:title or fallback to title or URL
    let title =
      metadata["og:title"] || metadata.title || url.replace(/^https?:\/\//, "")

    // If we have both, format as "siteName // title"
    if (siteName && title && siteName !== title) {
      return `${siteName} // ${title}`
    }

    // If we only have one, return it
    return title || siteName || url.replace(/^https?:\/\//, "")
  }

  const handleGenerateCopy = async () => {
    if (!selectedUrl || isGenerating || project.status === "generating") return

    // Check if the URL has valid scraped data
    if (!hasValidScrapedData) {
      toast({
        variant: "destructive",
        title: "Invalid data",
        description: "This URL doesn't have valid scraped data."
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateSingleCopyAction(project.id, selectedUrl)

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      toast({
        title: "Copy generated successfully",
        description: "Your ad copy has been generated and saved."
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating copy",
        description:
          error instanceof Error ? error.message : "An unknown error occurred"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateAllCopy = async () => {
    if (isGeneratingAll || project.status === "generating") return

    // Check if there's any valid scraped data
    if (!scrapedData || Object.keys(scrapedData).length === 0) {
      toast({
        variant: "destructive",
        title: "No scraped data",
        description:
          "There is no valid scraped data for any URLs in this project."
      })
      return
    }

    // Check if at least one URL has valid scraped data
    const hasAtLeastOneValidUrl = Object.values(scrapedData).some(
      data => data && data.success === true
    )

    if (!hasAtLeastOneValidUrl) {
      toast({
        variant: "destructive",
        title: "Invalid data",
        description: "None of the URLs have valid scraped data."
      })
      return
    }

    setIsGeneratingAll(true)
    try {
      const result = await generateCopyAction(project.id)

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      toast({
        title: "Copy generation started",
        description: `Generating copy for ${result.data.generatedCount} URLs. This may take a few minutes.`
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating copy",
        description:
          error instanceof Error ? error.message : "An unknown error occurred"
      })
    } finally {
      setIsGeneratingAll(false)
    }
  }

  const handleSaveCopy = async (
    headlines: string[],
    descriptions: string[]
  ) => {
    if (!selectedUrl || isSaving || !generatedCopy) return

    setIsSaving(true)
    try {
      const updatedCopy = {
        ...generatedCopy,
        [selectedUrl]: {
          ...generatedCopy[selectedUrl],
          headlines,
          descriptions
        }
      }

      const result = await updateGeneratedCopyAction(project.id, updatedCopy)

      if (!result.isSuccess) {
        throw new Error(result.message)
      }

      toast({
        title: "Copy saved successfully",
        description: "Your changes have been saved."
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error saving copy",
        description:
          error instanceof Error ? error.message : "An unknown error occurred"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline"
        label: string
      }
    > = {
      pending: { variant: "outline", label: "Pending" },
      scraping: { variant: "secondary", label: "Scraping" },
      generating: { variant: "secondary", label: "Generating" },
      completed: { variant: "default", label: "Completed" },
      review: { variant: "default", label: "Review" },
      failed: { variant: "destructive", label: "Failed" }
    }

    const statusInfo = statusMap[status] || {
      variant: "outline",
      label: status
    }

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/rsa-writer/projects")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.status && getStatusBadge(project.status)}
        </div>
        <Button
          onClick={handleGenerateAllCopy}
          disabled={isGeneratingAll || project.status === "generating"}
        >
          {isGeneratingAll || project.status === "generating" ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating All...
            </>
          ) : (
            <>
              <Zap className="mr-2 size-4" />
              Generate All Copy
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* URL list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Scraped pages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-1">
                {project.urls.map((url, index) => (
                  <div key={index} className="group relative">
                    <Button
                      variant={selectedUrl === url ? "default" : "outline"}
                      className="h-auto w-full justify-start py-2 pr-6 text-xs"
                      onClick={() => setSelectedUrl(url)}
                    >
                      <span className="truncate">{getSiteInfo(url)}</span>
                    </Button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Visit website"
                      className="text-muted-foreground hover:text-primary absolute right-1.5 top-1/2 -translate-y-1/2"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content area */}
        <div className="md:col-span-2">
          {selectedUrl ? (
            <>
              <Card className="mb-4">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    <span className="truncate">{getSiteInfo(selectedUrl)}</span>
                    {!urlCopy && (
                      <Button
                        onClick={handleGenerateCopy}
                        disabled={
                          isGenerating || project.status === "generating"
                        }
                        size="sm"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 size-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 size-3" />
                            Generate Copy
                          </>
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>

              {urlCopy ? (
                <CopyEditor
                  key={selectedUrl}
                  initialHeadlines={urlCopy.headlines}
                  initialDescriptions={urlCopy.descriptions}
                  onSave={handleSaveCopy}
                  onRegenerate={handleGenerateCopy}
                  isRegenerating={isGenerating}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4 text-sm">
                      No copy has been generated for this URL yet. Click the
                      button above to generate copy for this URL only, or use
                      the "Generate All Copy" button at the top to generate copy
                      for all URLs in this project.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm">
                  Select a URL from the list to view or generate copy.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

interface CopyEditorProps {
  initialHeadlines: string[]
  initialDescriptions: string[]
  onSave: (headlines: string[], descriptions: string[]) => void
  onRegenerate: () => void
  isRegenerating: boolean
}

function CopyEditor({
  initialHeadlines,
  initialDescriptions,
  onSave,
  onRegenerate,
  isRegenerating
}: CopyEditorProps) {
  const [headlines, setHeadlines] = useState<string[]>(initialHeadlines)
  const [descriptions, setDescriptions] =
    useState<string[]>(initialDescriptions)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("headlines")

  useEffect(() => {
    setHeadlines(initialHeadlines)
    setDescriptions(initialDescriptions)
  }, [initialHeadlines, initialDescriptions])

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...headlines]
    newHeadlines[index] = value
    setHeadlines(newHeadlines)
  }

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions]
    newDescriptions[index] = value
    setDescriptions(newDescriptions)
  }

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      await onSave(headlines, descriptions)
    } catch (error) {
      console.error("Error saving copy:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium">
          {activeTab === "headlines" ? "Headlines" : "Descriptions"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            size="sm"
            variant="outline"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="mr-2 size-3 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 size-3" />
                Regenerate
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={isSaving} size="sm">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-3 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-3" />
                Save
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="headlines">
              Headlines ({headlines.length})
            </TabsTrigger>
            <TabsTrigger value="descriptions">
              Descriptions ({descriptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="headlines" className="space-y-4">
            <div className="mb-2">
              <span className="text-muted-foreground text-sm font-medium">
                Headlines
              </span>
            </div>
            <div className="space-y-3">
              {headlines.map((headline, index) => (
                <div key={index} className="space-y-1">
                  <Input
                    value={headline}
                    onChange={e => handleHeadlineChange(index, e.target.value)}
                    maxLength={30}
                    className="w-full"
                    placeholder={`Headline ${index + 1}`}
                  />
                  <div className="flex justify-end">
                    <span className="text-muted-foreground text-xs">
                      {headline.length}/30
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="descriptions" className="space-y-4">
            <div className="mb-2">
              <span className="text-muted-foreground text-sm font-medium">
                Descriptions
              </span>
            </div>
            <div className="space-y-3">
              {descriptions.map((description, index) => (
                <div key={index} className="space-y-1">
                  <Textarea
                    value={description}
                    onChange={e =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    maxLength={90}
                    className="w-full resize-none"
                    rows={3}
                    placeholder={`Description ${index + 1}`}
                  />
                  <div className="flex justify-end">
                    <span className="text-muted-foreground text-xs">
                      {description.length}/90
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
