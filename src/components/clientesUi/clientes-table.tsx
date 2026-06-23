import { useSearchClienteStore } from "@/stores/search-cliente"
import fetchClientes from "@/utils/fetchClientes"

import { useInfiniteQuery } from "@tanstack/react-query"

import { memo, useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"

import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Spinner } from "../ui/spinner"

import { Pencil, Trash2 } from "lucide-react"

import { ClientesEditDialog } from "./clientes-edit-dialog"
import { DeleteClienteDialog } from "./clientes-delete-dialog"

import type { Client } from "@/db/schema/cliente"

function ClientesTable() {
  const search = useSearchClienteStore()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const [deletingClient, setDeletingClient] = useState<Client | null>(null)

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
    queryKey: ["clientes", search.input],

    queryFn: ({ pageParam }) =>
      fetchClientes({
        pageParam,
        searchTerm: search.input,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) return

    fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const clientes = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.clientes) ?? []

    return Array.from(
      new Map(all.filter((c) => c?.id).map((c) => [c.id, c])).values()
    )
  }, [data])

  const totalClientes = data?.pages[0]?.totalClientes ?? 0

  if (status === "pending") {
    return (
      <div className="flex h-full items-center justify-center">
        Carregando clientes...
      </div>
    )
  }

  if (status === "error") {
    return <div className="p-4 text-destructive">{error.message}</div>
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border bg-card">
      <div className="flex items-center justify-center gap-1.5 py-2">
        <span className="font-semibold tabular-nums">{totalClientes}</span>

        <span className="text-muted-foreground">
          {totalClientes === 1 ? "cliente cadastrado" : "clientes cadastrados"}
        </span>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 border-b bg-background">
            <tr className="text-xs text-muted-foreground uppercase">
              <th className="px-4 py-3 text-left">Documento</th>

              <th className="px-4 py-3 text-left">Nome</th>

              <th className="px-4 py-3 text-left">Endereço</th>

              <th className="px-4 py-3 text-left">Telefone</th>

              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientes.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado
                </td>
              </tr>
            )}

            {clientes.map((client) => (
              <tr key={client.id} className="border-b hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">{client.document}</td>

                <td className="truncate px-4 py-3" title={client.name}>
                  {client.name}
                </td>

                <td className="truncate px-4 py-3" title={client.address ?? ""}>
                  {client.address ?? "-"}
                </td>

                <td className="px-4 py-3">{client.phone ?? "-"}</td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditingClient(client)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setDeletingClient(client)
                        setDeleteOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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

      <ClientesEditDialog
        client={editingClient}
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) setEditingClient(null)
          setEditOpen(open)
        }}
      />

      <DeleteClienteDialog
        client={deletingClient}
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) setDeletingClient(null)
          setDeleteOpen(open)
        }}
      />
    </div>
  )
}

export default memo(ClientesTable)
