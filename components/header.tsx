/*
<ai_context>
This client component provides the header for the app.
</ai_context>
*/

"use client"

import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from "@clerk/nextjs"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

// Navigation links that will scroll to sections
const navLinks = [
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" }
]

// Links only visible when signed in
const signedInLinks = [{ href: "/rsa-writer", label: "Dashboard" }]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Check if current path is a blog path
  const isBlogPath = pathname?.includes("/blog")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle smooth scrolling to sections
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault()
    const element = document.getElementById(id.substring(1)) // Remove the # from the ID
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      if (isMenuOpen) toggleMenu() // Close mobile menu if open
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        isScrolled
          ? "bg-background/80 shadow-sm backdrop-blur-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center space-x-2 hover:cursor-pointer hover:opacity-80">
          <Image
            src="/logo.png"
            alt="Ad Conversions Logo"
            width={30}
            height={30}
            className="size-8"
          />
          <Link href="/" className="text-xl font-bold">
            Ad Conversions
          </Link>
        </div>

        {/* Only show navigation links if not on a blog page */}
        {!isBlogPath && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 space-x-6 font-medium md:flex">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => scrollToSection(e, link.href)}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}

            <Link
              href="/blog"
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
            >
              Blog
            </Link>

            <SignedIn>
              {signedInLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </SignedIn>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          <SignedOut>
            <div className="hidden sm:block">
              <SignInButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                >
                  Login
                </Button>
              </SignInButton>
            </div>

            <SignUpButton>
              <Button
                size="sm"
                className="bg-black text-sm font-medium text-white hover:bg-gray-800"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="bg-background border-t p-4 md:hidden">
          <ul className="space-y-3">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground block text-sm font-medium"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>
            {/* Only show navigation links if not on a blog page */}
            {!isBlogPath && (
              <>
                {navLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground block text-sm font-medium"
                      onClick={e => scrollToSection(e, link.href)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <SignedIn>
                  {signedInLinks.map(link => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground block text-sm font-medium"
                        onClick={toggleMenu}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </SignedIn>
              </>
            )}
            {/* Always show blog link if not already on blog page */}
            {!pathname?.startsWith("/blog") && (
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground block text-sm font-medium"
                  onClick={toggleMenu}
                >
                  Blog
                </Link>
              </li>
            )}
            <SignedOut>
              <li className="pt-2">
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm font-medium"
                  >
                    Login
                  </Button>
                </SignInButton>
              </li>
              <li className="pt-2">
                <SignUpButton>
                  <Button
                    size="sm"
                    className="w-full bg-black text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </li>
            </SignedOut>
          </ul>
        </nav>
      )}
    </header>
  )
}
