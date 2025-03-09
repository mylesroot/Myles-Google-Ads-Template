"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { generateCopyAction } from "@/actions/ai-copy-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface GenerateCopyButtonProps {
  projectId: string
}

export function GenerateCopyButton({ projectId }: GenerateCopyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const result = await generateCopyAction(projectId)
      if (result.isSuccess) {
        toast({ title: "Success", description: result.message })
        router.refresh() // Refresh the page to reflect updated data
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate copy"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate Ad Copy"}
    </Button>
  )
}
