"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Mail, Share2, Twitter, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import posthog from "posthog-js"

interface ShareButtonsProps {
  title: string
  url: string
  className?: string
}

export function ShareButtons({
  title,
  url,
  className = ""
}: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState<string>(url)
  const [canNativeShare, setCanNativeShare] = useState<boolean>(false)

  useEffect(() => {
    // Use the current URL if we're in the browser
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
      setCanNativeShare(!!navigator.share)
    }
  }, [url])

  const handleShare = (platform: string) => {
    posthog.capture("blog_post_shared", { platform, title })
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success("Link copied to clipboard")
      handleShare("copy")
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl
        })
        handleShare("native")
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err)
        }
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="mr-2 text-sm font-medium">Share:</span>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => {
          window.open(shareLinks.twitter, "_blank")
          handleShare("twitter")
        }}
        aria-label="Share on Twitter"
      >
        <Twitter size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => {
          window.open(shareLinks.facebook, "_blank")
          handleShare("facebook")
        }}
        aria-label="Share on Facebook"
      >
        <Facebook size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => {
          window.open(shareLinks.linkedin, "_blank")
          handleShare("linkedin")
        }}
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={() => {
          window.open(shareLinks.email, "_blank")
          handleShare("email")
        }}
        aria-label="Share via Email"
      >
        <Mail size={16} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        <Copy size={16} />
      </Button>

      {canNativeShare && (
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          onClick={nativeShare}
          aria-label="Native share"
        >
          <Share2 size={16} />
        </Button>
      )}
    </div>
  )
}
