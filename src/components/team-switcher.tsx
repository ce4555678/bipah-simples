"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import logo from "@/assets/bipah.svg"
import { cn } from "@/lib/utils"
export function TeamSwitcher() {
    const { state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          <div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-xl">
            <img
              src={logo}
              alt="Bipah"
              className={cn("h-full w-full object-cover", state === "collapsed" && "object-contain")}
            />
          </div>

          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold">Bipah</span>
            <span className="truncate text-xs text-muted-foreground">
              Simples
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
