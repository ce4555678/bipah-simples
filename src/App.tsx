import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "./stores/navigation"
import { lazy, Suspense } from "react"
import { Spinner } from "./components/ui/spinner"

const Pdv = lazy(() => import("@/components/pdvUi/pdv"))

export default function App() {
    const { currentView } = useNavigationStore()
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
           
          </div>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {currentView === "pdv" && "Frente de Caixa"}
          {currentView === "produtos" && "Produtos"}
          {currentView === "financeiro" && "Financeiro"}
          {currentView === "configuracoes" && "Configurações"}
        </h1>
      </div>
        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
        <Suspense fallback={<Spinner className="size-32 text-amber-700"/>}>
          {currentView === "pdv" && <Pdv />}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
