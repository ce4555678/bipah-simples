"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface ClientesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onNewClient: () => void
}

export function ClientesToolbar({
  search,
  onSearchChange,
  onNewClient,
}: ClientesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          CRM
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Clientes
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Gerencie seus clientes — nome, documento, e contato.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar cliente..."
            className="pr-3 pl-10"
          />
        </div>

        <Button className="gap-2" onClick={onNewClient}>
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>
    </div>
  )
}
