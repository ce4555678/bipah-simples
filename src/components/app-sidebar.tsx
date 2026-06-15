"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DollarSignIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Frente de Caixa",
      view: "pdv",
      icon: ShoppingCartIcon,
    },
    {
      title: "Produtos",
      view: "produtos",
      icon: PackageIcon,
    },
    {
      title: "Clientes",
      view: "clientes",
      icon: UsersIcon,
    },
    {
      title: "Financeiro",
      view: "financeiro",
      icon: DollarSignIcon,
    },
    {
      title: "Configurações",
      view: "configuracoes",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
