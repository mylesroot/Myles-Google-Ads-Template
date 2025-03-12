"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface BackButtonProps {
  label?: string
  className?: string
  href?: string
}

export function BackButton({
  label = "Back",
  className = "",
  href
}: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Link href={href} passHref>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 px-2 ${className}`}
          asChild
        >
          <div>
            <ArrowLeft className="size-4" />
            {label}
          </div>
        </Button>
      </Link>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 px-2 ${className}`}
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  )
}
