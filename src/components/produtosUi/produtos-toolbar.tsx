import { useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, XIcon } from "lucide-react"
import debounce from "lodash/debounce"
import { useNavigationStore } from "@/stores/navigation"
import { cn } from "@/lib/utils"

interface ProdutosToolbarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function ProdutosToolbar({
  search,
  onSearchChange,
}: ProdutosToolbarProps) {
  const { setView } = useNavigationStore()
  const ref = useRef<HTMLInputElement>(null)
  const inputSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange(value)
      }, 300),
    [onSearchChange]
  )

  function cleanInput() {
    onSearchChange("")
    inputSearch.cancel()
    ref.current?.focus()
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Catálogo
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Produtos</h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Gerencie o estoque de produtos do seu PDV com código, preço e
          quantidade em estoque.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            defaultValue={search}
            onChange={(e) => inputSearch(e.target.value)}
            placeholder="Buscar produto..."
            className="pr-3 pl-10"
            ref={ref}
          />
          <button
            onClick={cleanInput}
            className={cn(
              "absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground",
              search.trim() == "" && "hidden"
            )}
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <Button onClick={() => setView("new-produto")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo produto
        </Button>
      </div>
    </div>
  )
}
