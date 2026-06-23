"use client"

import { useState } from "react"
import ClientesToolbar from "./clientes-toolbar"
import ClientesTable from "./clientes-table"
import { ClientesDialog } from "./clientes-dialog"

export default function ClientesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-6 bg-muted/20 p-6">
      <ClientesToolbar onNewCliente={() => setDialogOpen(true)} />
      <ClientesTable />
      <ClientesDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
