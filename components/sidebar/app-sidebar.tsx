/*
<ai_context>
This client component provides the sidebar for the app.
</ai_context>
*/

"use client"

import { BookmarkIcon, PenLine, CreditCard } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

// Navigation data
const navItems = [
  {
    title: "RSA Writer",
    url: "/rsa-writer",
    icon: PenLine
  },
  {
    title: "Saved Ads / Projects",
    url: "/rsa-writer/projects",
    icon: BookmarkIcon
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center">
          <div className="flex w-full items-center gap-2">
            <div className="relative size-8 shrink-0 group-data-[collapsible=icon]:mx-auto">
              <Image
                src="/logo.png"
                alt="Ad Conversions Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">
              Ad Conversions
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
