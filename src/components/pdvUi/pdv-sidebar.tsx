"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package } from "lucide-react"
import type { CartItem } from "./types"

interface PdvSidebarProps {
  featured: CartItem | null
  totalItems: number
  cartLength: number
  subtotal: number
}

const shortcuts: [string, string][] = [
  ["F2", "Buscar produto"],
  ["F3", "+1 quantidade"],
  ["F4", "-1 quantidade"],
  ["F5", "Finalizar venda"],
  ["Del", "Remover item"],
  ["↑↓", "Navegar itens"],
  ["ESC", "Voltar ao leitor"],
]

export function PdvSidebar({
  featured,
  totalItems,
  cartLength,
  subtotal,
}: PdvSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-3 border-r bg-muted/20 p-4 xl:flex">
      <div className="rounded-xl border bg-card p-3 shadow-sm">
        <div className="mb-2 flex h-28 items-center justify-center rounded-lg bg-muted/50">
          <Package
            className={
              featured
                ? "h-12 w-12 text-muted-foreground/40"
                : "h-10 w-10 text-muted-foreground/20"
            }
          />
        </div>
        {featured ? (
          <>
            <p className="truncate text-sm font-semibold">{featured.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cód: {featured.code}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Unitário</span>
              <span className="text-sm font-bold">
                {featured.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Qtde × Subtotal
              </span>
              <span className="font-bold text-primary">
                {featured.qty} ×{" "}
                {featured.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </>
        ) : (
          <p className="mt-1 text-center text-xs text-muted-foreground">
            Nenhum produto selecionado
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Itens</span>
          <Badge variant="secondary">{totalItems}</Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Linhas</span>
          <span className="font-medium">{cartLength}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">
            {subtotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>

      <div className="mt-auto rounded-xl border bg-card p-3 shadow-sm">
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          Atalhos
        </p>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {shortcuts.map(([key, description]) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="min-w-7 rounded border bg-muted px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold">
                {key}
              </kbd>
              {description}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
