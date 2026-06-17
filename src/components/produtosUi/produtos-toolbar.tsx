import { memo, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, XIcon } from "lucide-react"
import debounce from "lodash/debounce"
import { useNavigationStore } from "@/stores/navigation"
import { cn } from "@/lib/utils"
import { useSearchStore } from "@/stores/search"

function ProdutosToolbar() {
  const { setView } = useNavigationStore()
  const ref = useRef<HTMLInputElement>(null)
  const { input, setSearch } = useSearchStore()

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value) // ← só atualiza o store após 300ms
    }, 300)
  ).current

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value) // ← imediato, sem lag
    debouncedSearch(e.target.value) // ← debounced pro store
  }

  function cleanInput() {
    debouncedSearch.cancel()
    setSearch("")
    setSearch("")
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
            value={input} // ← controlado pelo estado local
            onChange={handleChange}
            placeholder="Buscar produto..."
            className="pr-3 pl-10"
            ref={ref}
          />
          <button
            onClick={cleanInput}
            className={cn(
              "absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground",
              input.trim() == "" && "hidden"
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

export default memo(ProdutosToolbar)
