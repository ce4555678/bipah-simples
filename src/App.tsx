import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "./stores/navigation"
import { lazy, Suspense } from "react"
import PageLoading from "./components/loading"
import { ThemeToggle } from "./components/theme-toggle"
import { Toaster } from "./components/ui/sonner"

const Pdv = lazy(() => import("@/components/pdvUi/pdv"))
const Produtos = lazy(() => import("@/components/produtosUi/produtos"))
const Financeiro = lazy(() => import("@/components/financeiroUi/financeiro"))
const Configuracoes = lazy(
  () => import("@/components/configuracoesUi/configuracoes")
)
const Clientes = lazy(() => import("@/components/clientesUi/clientes"))
const ProdutosEdit = lazy(() => import("@/components/produtosUi/produtos-edit"))
const ProdutosNew = lazy(() => import("@/components/produtosUi/produtos-new"))

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
          <div className="flex w-full items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">
              {currentView === "pdv" && "Frente de Caixa"}
              {currentView === "produtos" && "Produtos"}
              {currentView === "financeiro" && "Financeiro"}
              {currentView === "clientes" && "Clientes"}
              {currentView === "configuracoes" && "Configurações"}
            </h1>
          </div>
          <span className="pr-4">
            <ThemeToggle />
          </span>
        </header>
        <Suspense fallback={<PageLoading />}>
          {currentView === "pdv" && <Pdv />}
          {currentView === "produtos" && <Produtos />}
          {currentView === "clientes" && <Clientes />}
          {currentView === "financeiro" && <Financeiro />}
          {currentView === "configuracoes" && <Configuracoes />}
          {currentView === "edit-produto" && <ProdutosEdit />}
          {currentView === "new-produto" && <ProdutosNew />}
        </Suspense>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  )
}
