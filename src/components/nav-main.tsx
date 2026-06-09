import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useNavigationStore, type View } from "@/stores/navigation"
import type { LucideIcon } from "lucide-react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    view: string
    icon?: LucideIcon
  }[]
}) {
  const { currentView, setView } = useNavigationStore()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.view}>
            <SidebarMenuButton
              className="transition-all duration-200 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md"
              isActive={currentView === item.view}
              onClick={() => setView(item.view as View)}
              tooltip={item.title}
            >
              {item.icon && <item.icon className="size-4" />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
