"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CartItem } from "./types"

interface PdvTableProps {
  cart: CartItem[]
  selectedRow: number | null
  onSelectRow: (idx: number) => void
  changeQty: (idx: number, delta: number) => void
  removeItem: (idx: number) => void
}

export function PdvTable({
  cart,
  selectedRow,
  onSelectRow,
  changeQty,
  removeItem,
}: PdvTableProps) {
  const fmt = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b bg-muted/60 backdrop-blur-sm">
            <tr className="text-left text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <th className="w-10 px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Produto</th>
              <th className="w-28 px-4 py-3 text-center">Qtde</th>
              <th className="w-28 px-4 py-3 text-right">Unit.</th>
              <th className="w-28 px-4 py-3 text-right">Total</th>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-20 text-center text-muted-foreground"
                >
                  <ShoppingCart className="mx-auto mb-2 h-8 w-8 opacity-25" />
                  <p className="text-sm">Nenhum item na venda</p>
                  <p className="mt-1 text-xs opacity-60">
                    Passe o leitor ou pressione F2 para buscar
                  </p>
                </td>
              </tr>
            ) : (
              cart.map((item, idx) => (
                <tr
                  key={item.id}
                  tabIndex={0}
                  aria-selected={selectedRow === idx}
                  onClick={() => onSelectRow(idx)}
                  className={cn(
                    "group cursor-pointer border-b transition-colors outline-none last:border-0 focus-visible:ring-2 focus-visible:ring-primary/50",
                    selectedRow === idx
                      ? "bg-primary/5 ring-1 ring-primary/20 ring-inset"
                      : "hover:bg-muted/40"
                  )}
                >
                  <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.code}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition hover:border-primary hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          changeQty(idx, -1)
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-semibold tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        className="flex h-6 w-6 items-center justify-center rounded-md border text-muted-foreground transition hover:border-primary hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          changeQty(idx, 1)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                    {fmt(item.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {fmt(item.price * item.qty)}
                  </td>
                  <td className="px-2 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(idx)
                      }}
                      className="invisible rounded-md p-1 text-muted-foreground/50 transition group-hover:visible hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
