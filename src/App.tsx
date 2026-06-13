import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigationStore } from "./stores/navigation"
import { lazy, Suspense, useEffect, useEffectEvent } from "react"
import PageLoading from "./components/loading"
import { ThemeToggle } from "./components/theme-toggle"
import Database from "@tauri-apps/plugin-sql"

const Pdv = lazy(() => import("@/components/pdvUi/pdv"))
const Produtos = lazy(() => import("@/components/produtosUi/produtos"))
const Financeiro = lazy(() => import("@/components/financeiroUi/financeiro"))
const Configuracoes = lazy(
  () => import("@/components/configuracoesUi/configuracoes")
)
const Clientes = lazy(() => import("@/components/clientesUi/clientes"))

export default function App() {
  const { currentView } = useNavigationStore()

  const testSql = useEffectEvent(async () => {
    const db = await Database.load("sqlite:test.db")

    try {
      await db.execute(`
    CREATE VIRTUAL TABLE teste_fts
    USING fts5(texto)
  `)

      console.log("FTS5 disponível")
    } catch (e) {
      console.log("FTS5 NÃO disponível", e)
    }
  })
  useEffect(() => {
    testSql()
  }, [])
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
        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
        <Suspense fallback={<PageLoading />}>
          {currentView === "pdv" && <Pdv />}
          {currentView === "produtos" && <Produtos />}
          {currentView === "clientes" && <Clientes />}
          {currentView === "financeiro" && <Financeiro />}
          {currentView === "configuracoes" && <Configuracoes />}
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
