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
import { db } from "./db"
import { produtosTable } from "./db/schema/produto"
import { ItemVendaTable } from "./db/schema/item-venda"

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
    try {
      // await db.insert(produtosTable).values([
      // { sku: "7891234567890", description: "Coca-Cola Original 2L", precoCusto: 650, precoVenda: 999, markup: 53, margemLucro: 34, active: true },
      // { sku: "7891234567891", description: "Arroz Agulhinha Tipo 1 5kg", precoCusto: 1800, precoVenda: 2490, markup: 38, margemLucro: 27, active: true },
      // { sku: "7891234567892", description: "Feijão Carioca 1kg", precoCusto: 550, precoVenda: 798, markup: 45, margemLucro: 31, active: true },
      // { sku: "7891234567893", description: "Óleo de Soja 900ml", precoCusto: 420, precoVenda: 599, markup: 42, margemLucro: 29, active: true },
      // { sku: "7891234567894", description: "Açúcar Refinado 1kg", precoCusto: 310, precoVenda: 449, markup: 44, margemLucro: 30, active: true },
      // { sku: "7891234567895", description: "Café Torrado e Moído 500g", precoCusto: 1100, precoVenda: 1690, markup: 53, margemLucro: 34, active: true },
      // { sku: "7891234567896", description: "Leite UHT Integral 1L", precoCusto: 320, precoVenda: 459, markup: 43, margemLucro: 30, active: true },
      // { sku: "7891234567897", description: "Macarrão Espaguete 500g", precoCusto: 210, precoVenda: 349, markup: 66, margemLucro: 39, active: true },
      // { sku: "7891234567898", description: "Molho de Tomate Sachê 300g", precoCusto: 130, precoVenda: 219, markup: 68, margemLucro: 40, active: true },
      // {  sku: "7891234567899", description: "Sal Refinado 1kg", precoCusto: 110, precoVenda: 199, markup: 80, margemLucro: 44, active: true },
      // {  sku: "7891234567900", description: "Biscoito Recheado Chocolate 130g", precoCusto: 180, precoVenda: 299, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567901", description: "Detergente Líquido Neutro 500ml", precoCusto: 140, precoVenda: 249, markup: 77, margemLucro: 43, active: true },
      // {  sku: "7891234567902", description: "Sabão em Pó 800g", precoCusto: 850, precoVenda: 1299, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567903", description: "Amaciante de Roupas 2L", precoCusto: 920, precoVenda: 1490, markup: 61, margemLucro: 38, active: true },
      // {  sku: "7891234567904", description: "Creme Dental Tripla Ação 90g", precoCusto: 250, precoVenda: 419, markup: 67, margemLucro: 40, active: true },
      // {  sku: "7891234567905", description: "Sabonete em Barra 90g", precoCusto: 110, precoVenda: 199, markup: 80, margemLucro: 44, active: true },
      // {  sku: "7891234567906", description: "Shampoo Cabelos Normais 400ml", precoCusto: 740, precoVenda: 1199, markup: 62, margemLucro: 38, active: true },
      // {  sku: "7891234567907", description: "Condicionador Cabelos Normais 400ml", precoCusto: 810, precoVenda: 1299, markup: 60, margemLucro: 37, active: true },
      // {  sku: "7891234567908", description: "Papel Higiênico Folha Dupla l12", precoCusto: 1150, precoVenda: 1790, markup: 55, margemLucro: 35, active: true },
      // {  sku: "7891234567909", description: "Esponja de Aço l8", precoCusto: 190, precoVenda: 329, markup: 73, margemLucro: 42, active: true },
      // {  sku: "7891234567910", description: "Água Mineral Sem Gás 500ml", precoCusto: 80, precoVenda: 199, markup: 148, margemLucro: 59, active: true },
      // {  sku: "7891234567911", description: "Água Mineral Com Gás 500ml", precoCusto: 95, precoVenda: 229, markup: 141, margemLucro: 58, active: true },
      // {  sku: "7891234567912", description: "Suco de Uva Integral 1L", precoCusto: 980, precoVenda: 1499, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567913", description: "Refrigerante Guaraná 2L", precoCusto: 520, precoVenda: 799, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567914", description: "Cerveja Pilsen Lata 350ml", precoCusto: 240, precoVenda: 379, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567915", description: "Cerveja Puro Malte Garrafa 600ml", precoCusto: 550, precoVenda: 849, markup: 54, margemLucro: 35, active: true },
      // {  sku: "7891234567916", description: "Vinho Tinto Suave 750ml", precoCusto: 1200, precoVenda: 1990, markup: 65, margemLucro: 39, active: true },
      // {  sku: "7891234567917", description: "Farinha de Trigo Tipo 1 1kg", precoCusto: 290, precoVenda: 449, markup: 54, margemLucro: 35, active: true },
      // {  sku: "7891234567918", description: "Farinha de Mandioca 1kg", precoCusto: 410, precoVenda: 629, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567919", description: "Milho para Pipoca 500g", precoCusto: 230, precoVenda: 389, markup: 69, margemLucro: 40, active: true },
      // {  sku: "7891234567920", description: "Extrato de Tomate Copo 250g", precoCusto: 280, precoVenda: 429, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567921", description: "Sardinha em Óleo Lata 125g", precoCusto: 310, precoVenda: 499, markup: 60, margemLucro: 37, active: true },
      // {  sku: "7891234567922", description: "Atum Ralado em Óleo 170g", precoCusto: 480, precoVenda: 749, markup: 56, margemLucro: 35, active: true },
      // {  sku: "7891234567923", description: "Maionese Tradicional 500g", precoCusto: 450, precoVenda: 699, markup: 55, margemLucro: 35, active: true },
      // {  sku: "7891234567924", description: "Ketchup Tradicional 400g", precoCusto: 390, precoVenda: 599, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567925", description: "Mostarda Amarela 180g", precoCusto: 220, precoVenda: 369, markup: 67, margemLucro: 40, active: true },
      // {  sku: "7891234567926", description: "Vinagre de Álcool 500ml", precoCusto: 130, precoVenda: 229, markup: 76, margemLucro: 43, active: true },
      // {  sku: "7891234567927", description: "Azeite de Oliva Extra Virgem 500ml", precoCusto: 2800, precoVenda: 3990, markup: 42, margemLucro: 29, active: true },
      // {  sku: "7891234567928", description: "Manteiga com Sal 200g", precoCusto: 720, precoVenda: 1099, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567929", description: "Margarina com Sal 500g", precoCusto: 410, precoVenda: 649, markup: 58, margemLucro: 36, active: true },
      // {  sku: "7891234567930", description: "Leite Condensado TP 395g", precoCusto: 430, precoVenda: 629, markup: 46, margemLucro: 31, active: true },
      // {  sku: "7891234567931", description: "Creme de Leite TP 200g", precoCusto: 210, precoVenda: 329, markup: 56, margemLucro: 36, active: true },
      // {  sku: "7891234567932", description: "Achocolatado em Pó 400g", precoCusto: 530, precoVenda: 799, markup: 50, margemLucro: 33, active: true },
      // {  sku: "7891234567933", description: "Aveia em Flocos Finos 170g", precoCusto: 280, precoVenda: 449, markup: 60, margemLucro: 37, active: true },
      // {  sku: "7891234567934", description: "Cereal Matinal Milho 200g", precoCusto: 490, precoVenda: 749, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567935", description: "Gelatina Sabor Morango 25g", precoCusto: 90, precoVenda: 179, markup: 98, margemLucro: 49, active: true },
      // {  sku: "7891234567936", description: "Fermento Químico em Pó 100g", precoCusto: 290, precoVenda: 489, markup: 68, margemLucro: 40, active: true },
      // {  sku: "7891234567937", description: "Biscoito Água e Sal 350g", precoCusto: 320, precoVenda: 499, markup: 55, margemLucro: 35, active: true },
      // {  sku: "7891234567938", description: "Salgadinho de Milho Queijo 60g", precoCusto: 210, precoVenda: 399, markup: 90, margemLucro: 47, active: true },
      // {  sku: "7891234567939", description: "Batata Palha Tradicional 120g", precoCusto: 340, precoVenda: 549, markup: 61, margemLucro: 38, active: true },
      // {  sku: "7891234567940", description: "Pão de Forma Tradicional 500g", precoCusto: 450, precoVenda: 699, markup: 55, margemLucro: 35, active: true },
      // {  sku: "7891234567941", description: "Queijo Mussarela Fatiado 150g", precoCusto: 680, precoVenda: 998, markup: 46, margemLucro: 31, active: true },
      // {  sku: "7891234567942", description: "Presunto Cozido Fatiado 150g", precoCusto: 420, precoVenda: 649, markup: 54, margemLucro: 35, active: true },
      // {  sku: "7891234567943", description: "Iogurte Natural Integral 170g", precoCusto: 160, precoVenda: 279, markup: 74, margemLucro: 42, active: true },
      // {  sku: "7891234567944", description: "Requeijão Cremoso Tradicional 200g", precoCusto: 520, precoVenda: 799, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567945", description: "Suco de Caixinha TP 200ml", precoCusto: 110, precoVenda: 199, markup: 80, margemLucro: 44, active: true },
      // {  sku: "7891234567946", description: "Chá Mate Pronto Limão 1,5L", precoCusto: 480, precoVenda: 729, markup: 51, margemLucro: 34, active: true },
      // {  sku: "7891234567947", description: "Isotônico Sabor Frutas Cítricas 500ml", precoCusto: 360, precoVenda: 549, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567948", description: "Energético Lata 250ml", precoCusto: 450, precoVenda: 799, markup: 77, margemLucro: 43, active: true },
      // {  sku: "7891234567949", description: "Água de Coco Quadrada 1L", precoCusto: 650, precoVenda: 990, markup: 52, margemLucro: 34, active: true },
      // {  sku: "7891234567950", description: "Desinfetante Lavanda 1L", precoCusto: 310, precoVenda: 499, markup: 60, margemLucro: 37, active: true },
      // {  sku: "7891234567951", description: "Limpador Multiuso Tradicional 500ml", precoCusto: 220, precoVenda: 369, markup: 67, margemLucro: 40, active: true },
      // {  sku: "7891234567952", description: "Água Sanitária Garrafa 1L", precoCusto: 180, precoVenda: 299, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567953", description: "Sabão em Barra Azul 5x200g", precoCusto: 620, precoVenda: 949, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567954", description: "Saco para Lixo 50 Litros c10", precoCusto: 350, precoVenda: 599, markup: 71, margemLucro: 41, active: true },
      // {  sku: "7891234567955", description: "Esponja de Lava Louças c4", precoCusto: 190, precoVenda: 349, markup: 83, margemLucro: 45, active: true },
      // {  sku: "7891234567956", description: "Guardanapo de Papel Folha Simples c50", precoCusto: 120, precoVenda: 219, markup: 82, margemLucro: 45, active: true },
      // {  sku: "7891234567957", description: "Papel Alumínio Rolo 45cm x 4m", precoCusto: 270, precoVenda: 449, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567958", description: "Inseticida Aerosol Multi 400ml", precoCusto: 890, precoVenda: 1399, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567959", description: "Aparelho de Barbear Descartável c2", precoCusto: 380, precoVenda: 599, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567960", description: "Fio Dental Menta 50m", precoCusto: 410, precoVenda: 649, markup: 58, margemLucro: 36, active: true },
      // {  sku: "7891234567961", description: "Enxaguante Bucal Menta 500ml", precoCusto: 1120, precoVenda: 1690, markup: 50, margemLucro: 33, active: true },
      // {  sku: "7891234567962", description: "Hastes Flexíveis Algodão c75", precoCusto: 190, precoVenda: 329, markup: 73, margemLucro: 42, active: true },
      // {  sku: "7891234567963", description: "Algodão Hidrófilo Rolo 50g", precoCusto: 230, precoVenda: 399, markup: 73, margemLucro: 42, active: true },
      // {  sku: "7891234567964", description: "Curativo Adesivo Tradicional c10", precoCusto: 170, precoVenda: 299, markup: 75, margemLucro: 43, active: true },
      // {  sku: "7891234567965", description: "Desodorante Aerosol Masculino 150ml", precoCusto: 850, precoVenda: 1349, markup: 58, margemLucro: 37, active: true },
      // {  sku: "7891234567966", description: "Desodorante Aerosol Feminino 150ml", precoCusto: 850, precoVenda: 1349, markup: 58, margemLucro: 37, active: true },
      // {  sku: "7891234567967", description: "Protetor Solar FPS 30 120ml", precoCusto: 2100, precoVenda: 3290, markup: 56, margemLucro: 36, active: true },
      // {  sku: "7891234567968", description: "Sabonete Líquido Refil 200ml", precoCusto: 390, precoVenda: 599, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567969", description: "Creme para as Mãos Hidratante 50g", precoCusto: 480, precoVenda: 749, markup: 56, margemLucro: 35, active: true },
      // {  sku: "7891234567970", description: "Chocolate em Barra Ao Leite 90g", precoCusto: 380, precoVenda: 599, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567971", description: "Caixa de Bombom Variados 250g", precoCusto: 820, precoVenda: 1199, markup: 46, margemLucro: 31, active: true },
      // {  sku: "7891234567972", description: "Goma de Mascar Menta c4", precoCusto: 90, precoVenda: 199, markup: 121, margemLucro: 54, active: true },
      // {  sku: "7891234567973", description: "Bala de Goma Sabores Frutas 100g", precoCusto: 160, precoVenda: 299, markup: 86, margemLucro: 46, active: true },
      // {  sku: "7891234567974", description: "Amendoim Japonês Salgado 150g", precoCusto: 240, precoVenda: 399, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567975", description: "Torrada Tradicional Canapé 140g", precoCusto: 310, precoVenda: 499, markup: 60, margemLucro: 37, active: true },
      // {  sku: "7891234567976", description: "Goiabada Cascão Bloco 300g", precoCusto: 340, precoVenda: 549, markup: 61, margemLucro: 38, active: true },
      // {  sku: "7891234567977", description: "Doce de Leite Pastoso Pote 400g", precoCusto: 650, precoVenda: 999, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567978", description: "Geléia de Morango Pote 230g", precoCusto: 710, precoVenda: 1090, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567979", description: "Mel de Abelhas Bisnaga 200g", precoCusto: 950, precoVenda: 1499, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567980", description: "Ração para Gatos Sabor Peixe 1kg", precoCusto: 1100, precoVenda: 1690, markup: 53, margemLucro: 34, active: true },
      // {  sku: "7891234567981", description: "Ração para Cães Adultos Carne 1kg", precoCusto: 1050, precoVenda: 1590, markup: 51, margemLucro: 33, active: true },
      // {  sku: "7891234567982", description: "Petisco para Cães Bifinho 60g", precoCusto: 220, precoVenda: 399, markup: 81, margemLucro: 44, active: true },
      // {  sku: "7891234567983", description: "Areia Sanitária para Gatos 4kg", precoCusto: 720, precoVenda: 1199, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567984", description: "Fósforo de Madeira Maço c10", precoCusto: 290, precoVenda: 450, markup: 55, margemLucro: 35, active: true },
      // {  sku: "7891234567985", description: "Vela Branca Maço c8", precoCusto: 380, precoVenda: 599, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567986", description: "Carvão Vegetal Saco 3kg", precoCusto: 1200, precoVenda: 1890, markup: 57, margemLucro: 36, active: true },
      // {  sku: "7891234567987", description: "Acendedor Sólido para Churrasco c4", precoCusto: 250, precoVenda: 429, markup: 71, margemLucro: 41, active: true },
      // {  sku: "7891234567988", description: "Sal Grosso para Churrasco 1kg", precoCusto: 180, precoVenda: 299, markup: 66, margemLucro: 39, active: true },
      // {  sku: "7891234567989", description: "Farofa Pronta de Mandioca 400g", precoCusto: 310, precoVenda: 499, markup: 60, margemLucro: 37, active: true }
      // ])
      console.log("produtos criados")
    } catch (e) {
      console.log("produtos nao criados", e)
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
