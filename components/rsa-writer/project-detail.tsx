"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SelectProject } from "@/db/schema/projects-schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, RefreshCw, Save } from "lucide-react"
import { updateGeneratedCopyAction } from "@/actions/db/projects-actions"

interface ProjectDetailProps {
  project: SelectProject
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const router = useRouter()
  const [selectedUrl, setSelectedUrl] = useState<string | null>(
    project.urls.length > 0 ? project.urls[0] : null
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Get the generated copy for the selected URL
  const generatedCopy = project.generatedCopy as Record<string, any> | null
  const urlCopy =
    selectedUrl && generatedCopy ? generatedCopy[selectedUrl] : null

  const handleGenerateCopy = async () => {
    if (!selectedUrl || isGenerating) return

    setIsGenerating(true)
    // This would be replaced with an actual API call to generate copy
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock generated copy
      const mockCopy = {
        headlines: [
          "Discover Premium Quality Products Today",
          "Shop the Best Selection at Amazing Prices",
          "Exclusive Deals You Won't Find Elsewhere",
          "Top-Rated Products for Every Need",
          "Save Big on Your Favorite Items"
        ],
        descriptions: [
          "Find everything you need with our wide selection of high-quality products. Shop now and enjoy fast shipping, easy returns, and exceptional customer service.",
          "Explore our curated collection of premium products designed to exceed your expectations. Join thousands of satisfied customers who trust our brand."
        ]
      }

      // Update the project's generated copy
      const updatedCopy = {
        ...(generatedCopy || {}),
        [selectedUrl]: mockCopy
      }

      const result = await updateGeneratedCopyAction(project.id, updatedCopy)

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
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* URL list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>URLs ({project.urls.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.urls.map((url, index) => (
                  <Button
                    key={index}
                    variant={selectedUrl === url ? "default" : "outline"}
                    className="w-full justify-start truncate"
                    onClick={() => setSelectedUrl(url)}
                  >
                    {url.replace(/^https?:\/\//, "")}
                  </Button>
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
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{selectedUrl}</span>
                    {!urlCopy && (
                      <Button
                        onClick={handleGenerateCopy}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 size-4" />
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
                  initialHeadlines={urlCopy.headlines}
                  initialDescriptions={urlCopy.descriptions}
                  onSave={handleSaveCopy}
                  onRegenerate={handleGenerateCopy}
                  isRegenerating={isGenerating}
                />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      No copy has been generated for this URL yet. Click the
                      button above to generate copy.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
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
    setIsSaving(true)
    try {
      await onSave(headlines, descriptions)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ad Copy</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={isRegenerating || isSaving}
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 size-4" />
                  Regenerate
                </>
              )}
            </Button>
            <Button onClick={handleSave} disabled={isSaving || isRegenerating}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
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
            {headlines.map((headline, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2 text-sm font-medium">
                    Headline {index + 1}
                  </span>
                </div>
                <Input
                  value={headline}
                  onChange={e => handleHeadlineChange(index, e.target.value)}
                  maxLength={30}
                  className="w-full"
                />
                <div className="flex justify-end">
                  <span className="text-muted-foreground text-xs">
                    {headline.length}/30
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="descriptions" className="space-y-4">
            {descriptions.map((description, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2 text-sm font-medium">
                    Description {index + 1}
                  </span>
                </div>
                <Textarea
                  value={description}
                  onChange={e => handleDescriptionChange(index, e.target.value)}
                  maxLength={90}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <span className="text-muted-foreground text-xs">
                    {description.length}/90
                  </span>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
