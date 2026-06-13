"use client"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { Cliente } from "./types"

interface ClientesTableProps {
  clients: Cliente[]
  onEditClient: (client: Cliente) => void
  onDeleteClient: (id: string) => void
}

export function ClientesTable({
  clients,
  onEditClient,
  onDeleteClient,
}: ClientesTableProps) {
  return (
    <div className="flex-1 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-xs tracking-[0.16em] text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-3">Documento</th>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">E-mail</th>
              <th className="px-6 py-3">Telefone</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium text-foreground">
                    {client.document}
                  </td>
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.email ?? "-"}</td>
                  <td className="px-6 py-4">{client.phone ?? "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => onEditClient(client)}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDeleteClient(client.id)}
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
