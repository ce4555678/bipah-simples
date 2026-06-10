import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "@/assets/bipah.svg"
export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="pointer-events-none">
          <div className="flex aspect-square size-10 items-center justify-center overflow-hidden rounded-xl">
            <img
              src={logo}
              alt="Bipah"
              className="h-full w-full object-contain"
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
