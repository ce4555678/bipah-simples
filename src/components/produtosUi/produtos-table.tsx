import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchStore } from "@/stores/search"
import fetchProdutos from "@/utils/fetchProdutos"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { Spinner } from "../ui/spinner"
import Decimal from "decimal.js"
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

export function ProdutosTable() {
  const search = useSearchStore()

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "300px",
  })

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["produtos", search.input],
    queryFn: ({ pageParam }) =>
      fetchProdutos({ pageParam, searchTerm: search.input }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const produtos = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.produtos) ?? []
    return Array.from(new Map(all.map((p) => [p.id, p])).values())
  }, [data])

  if (status === "pending") {
    return (
      <div className="flex h-full items-center justify-center">
        Carregando produtos...
      </div>
    )
  }

  if (status === "error") {
    return <div className="p-4 text-destructive">{error.message}</div>
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border bg-card">
      <ScrollArea className="min-h-0 flex-1">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 border-b bg-white">
            <tr className="text-xs text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Nome / Descrição</th>
              <th className="px-4 py-3 text-right">Preço</th>
              <th className="px-4 py-3 text-right">Vendas</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="h-40 text-center text-muted-foreground"
                >
                  Nenhum produto encontrado
                </td>
              </tr>
            )}

            {produtos.map((produto) => {
              const preco = new Decimal(produto.precoVenda || 0)
              const vendas = new Decimal(produto.totalVendido || 0)
              return (
                <tr key={produto.id} className="border-b hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{produto.sku}</td>
                  <td className="truncate px-4 py-3">{produto.description}</td>
                  <td className="px-4 py-3 text-right text-green-800 tabular-nums">
                    {formatCurrency(preco.div(100).toNumber())}
                  </td>
                  <td className="px-4 py-3 text-right text-lime-800 tabular-nums">
                    {formatCurrency(vendas.div(100).toNumber())}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* INFINITE SCROLL */}
        {hasNextPage && (
          <div ref={ref} className="flex h-20 items-center justify-center">
            {isFetchingNextPage && (
              <span className="flex items-center gap-2">
                <Spinner className="size-5 text-amber-600" />
                Carregando...
              </span>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
