import ProdutosTable from "./produtos-table"
import ProdutosToolbar from "./produtos-toolbar"

export default function ProdutosPage() {
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-6 bg-muted/20 p-6">
      <ProdutosToolbar />
      <ProdutosTable />
    </div>
  )
}
