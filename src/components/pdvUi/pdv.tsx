import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Barcode, Image as ImageIcon, ShoppingCart } from "lucide-react"

export default function PDVPage() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-4rem)] gap-4 p-4 lg:p-6 bg-muted/20 overflow-hidden">
      
      {/* LADO ESQUERDO (Visível apenas em desktop) */}
      <aside className="hidden lg:flex w-80 flex-col gap-4 shrink-0">
        <Card className="flex flex-col overflow-hidden border-none shadow-sm h-64">
          <div className="flex flex-1 items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-50" />
              <span className="text-sm font-medium">Sem imagem</span>
            </div>
          </div>
          <CardContent className="p-4 bg-card">
            <h3 className="font-semibold truncate">Produto Exemplo</h3>
            <p className="text-sm text-muted-foreground">Cód: 789123456789</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Valor Unitário</div>
            <div className="text-right text-2xl font-bold">R$ 0,00</div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardContent className="p-4">
            <div className="text-sm text-primary/80">Total do Item</div>
            <div className="text-right text-3xl font-bold text-primary">R$ 0,00</div>
          </CardContent>
        </Card>
      </aside>

      {/* CENTRO */}
      <main className="flex flex-1 flex-col gap-4 overflow-hidden">
        
        {/* Input de Código */}
        <div className="flex items-center gap-2 bg-card p-2 rounded-xl shadow-sm border">
          <Barcode className="h-6 w-6 ml-2 text-primary" />
          <Input
            autoFocus
            placeholder="Passe o leitor ou digite o código..."
            className="h-12 border-0 text-lg shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Lista de Produtos (Scroll responsivo) */}
        <Card className="flex-1 overflow-hidden border-none shadow-sm">
          <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Lista de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full w-full">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr className="text-muted-foreground">
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">Produto</th>
                    <th className="p-3 text-right">Qtde</th>
                    <th className="p-3 text-right">Unit</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 15 }).map((_, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="p-3 text-muted-foreground">{index + 1}</td>
                      <td className="p-3 font-medium">Produto Exemplo</td>
                      <td className="p-3 text-right">1</td>
                      <td className="p-3 text-right">10,00</td>
                      <td className="p-3 text-right font-bold">10,00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Totais (Grid responsivo) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 shrink-0">
          <Card className="border-none shadow-sm">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Recebido</div>
              <div className="text-xl font-bold">0,00</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Troco</div>
              <div className="text-xl font-bold">0,00</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-md bg-primary text-primary-foreground col-span-2 md:col-span-1">
            <CardContent className="p-3">
              <div className="text-xs opacity-80">Subtotal</div>
              <div className="text-3xl font-bold">0,00</div>
            </CardContent>
          </Card>
        </div>

        {/* Atalhos (Escondidos em telas muito pequenas para poupar espaço) */}
        <div className="hidden md:flex flex-wrap gap-4 text-xs text-muted-foreground pb-2">
          {["F2 Buscar", "F3 Qtd", "F4 Desc", "F5 Finalizar", "F8 Abrir Caixa", "ESC Sair"].map((item) => (
            <span key={item} className="flex items-center gap-1 bg-muted px-2 py-1 rounded border">
              {item}
            </span>
          ))}
        </div>
      </main>
    </div>
  )
}