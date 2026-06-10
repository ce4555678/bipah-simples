"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Product } from "./types"

interface ProdutosTableProps {
  products: Product[]
  onEditProduct: (product: Product) => void
  onDeleteProduct: (id: string) => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function ProdutosTable({
  products,
  onEditProduct,
  onDeleteProduct,
}: ProdutosTableProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-xs tracking-[0.16em] text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3">Código</th>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3 text-right">Preço</th>
              <th className="px-6 py-3 text-right">Estoque</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {product.code}
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4 text-right text-foreground tabular-nums">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onEditProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
