import { ProdutosTable } from "./produtos-table"
import { ProdutosToolbar } from "./produtos-toolbar"
import { useSearchStore } from "@/stores/search"

export default function ProdutosPage() {
  const search = useSearchStore()

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-6 bg-muted/20 p-6">
      <ProdutosToolbar
        search={search.input}
        onSearchChange={search.setSearch}
      />
      <ProdutosTable />
    </div>
  )
}
