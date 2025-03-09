/*
<ai_context>
This client component provides the footer for the marketing layout.
</ai_context>
*/

"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Linkedin, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Terms of Service
          </Link>
          <a
            href="https://www.linkedin.com/in/myles-r-097705a3/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="size-5" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCZ7B9qgfCgxdvhNtaJiMz0g"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">YouTube</span>
            <Youtube className="size-5" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center space-x-2 md:justify-start">
            <Image
              src="/logo.png"
              alt="Ad Conversions Logo"
              width={24}
              height={24}
              className="size-6"
            />
            <span className="text-sm font-semibold">Ad Conversions</span>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs md:text-left">
            &copy; {currentYear} Ad Conversions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
