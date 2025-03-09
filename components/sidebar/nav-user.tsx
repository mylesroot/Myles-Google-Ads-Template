/*
<ai_context>
This client component provides a user button for the sidebar via Clerk.
</ai_context>
*/

"use client"

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { UserButton, useUser } from "@clerk/nextjs"

export function NavUser() {
  const { user } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 font-medium">
        <UserButton afterSignOutUrl="/" />
        <span className="group-data-[collapsible=icon]:hidden">
          {user?.fullName}
        </span>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
