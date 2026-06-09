import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Barcode, Image as ImageIcon, ShoppingCart } from "lucide-react"

export default function PDVPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 p-6 bg-muted/20">
      
      {/* LADO ESQUERDO - Detalhes do Item Atual */}
      <div className="flex w-80 flex-col gap-6">
        
        {/* Foto e Info do Produto */}
        <Card className="flex flex-col overflow-hidden border-none shadow-sm">
          <div className="flex h-56 items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-50" />
              <span className="text-sm font-medium">Sem imagem</span>
            </div>
          </div>
          <CardContent className="p-4 bg-card">
            <h3 className="font-semibold text-lg leading-none tracking-tight mb-1">
              Produto Exemplo
            </h3>
            <p className="text-sm text-muted-foreground">
              Cód: 789123456789
            </p>
          </CardContent>
        </Card>

        {/* Valores do Item */}
        <div className="flex flex-col gap-4">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Valor Unitário
              </div>
              <div className="text-right text-3xl font-bold tracking-tight">
                R$ 0,00
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total do Item
              </div>
              <div className="text-right text-3xl font-bold tracking-tight text-primary">
                R$ 0,00
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CENTRO - Área de Lançamento e Totais */}
      <div className="flex flex-1 flex-col gap-6">
        
        {/* Input Principal */}
        <Card className="border-none shadow-sm overflow-hidden ring-1 ring-border focus-within:ring-primary/50 focus-within:ring-2 transition-all">
          <div className="flex items-center px-4 bg-card">
            <Barcode className="h-6 w-6 text-primary/50 mr-2" />
            <Input
              autoFocus
              placeholder="Passe o leitor ou digite o código de barras..."
              className="h-16 border-0 text-lg shadow-none focus-visible:ring-0 px-0"
            />
          </div>
        </Card>

        {/* Lista de Produtos */}
        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-sm">
          <CardHeader className="py-4 border-b bg-muted/10">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Lista de Produtos
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b">
                  <tr className="text-muted-foreground">
                    <th className="py-3 px-4 text-left font-medium w-16">Item</th>
                    <th className="py-3 px-4 text-left font-medium w-32">Código</th>
                    <th className="py-3 px-4 text-left font-medium">Produto</th>
                    <th className="py-3 px-4 text-right font-medium w-24">Qtde</th>
                    <th className="py-3 px-4 text-right font-medium w-32">Unit (R$)</th>
                    <th className="py-3 px-4 text-right font-medium w-32">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <tr 
                      key={index} 
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-muted-foreground">
                        {String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="py-3 px-4">789123</td>
                      <td className="py-3 px-4 font-medium">Produto Exemplo Moderno</td>
                      <td className="py-3 px-4 text-right">1</td>
                      <td className="py-3 px-4 text-right">10,00</td>
                      <td className="py-3 px-4 text-right font-medium">10,00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Rodapé: Totais e Atalhos */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-6">
            
            <Card className="border-none shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Total Recebido
                </div>
                <div className="text-right text-3xl font-semibold">
                  R$ 0,00
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Troco
                </div>
                <div className="text-right text-3xl font-semibold">
                  R$ 0,00
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-primary-foreground/80 mb-2">
                  Subtotal
                </div>
                <div className="text-right text-5xl font-bold tracking-tighter">
                  R$ 0,00
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Atalhos */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 px-2 text-sm text-muted-foreground">
            <ShortcutKey k="F2" label="Buscar Produto" />
            <ShortcutKey k="F3" label="Quantidade" />
            <ShortcutKey k="F4" label="Desconto" />
            <ShortcutKey k="F5" label="Finalizar Venda" />
            <ShortcutKey k="F6" label="Cliente" />
            <ShortcutKey k="F7" label="Cancelar Item" />
            <ShortcutKey k="F8" label="Abrir Caixa" />
            <ShortcutKey k="ESC" label="Sair" />
          </div>
        </div>

      </div>
    </div>
  )
}

// Subcomponente simples para manter os atalhos padronizados
function ShortcutKey({ k, label }: { k: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground shadow-sm">
        {k}
      </kbd>
      <span>{label}</span>
    </div>
  )
}