"use client"

import { useMemo, useState } from "react"
import { ClientesToolbar } from "./clientes-toolbar"
import { ClientesTable } from "./clientes-table"
import { ClientesDialog } from "./clientes-dialog"
import type { Cliente } from "./types"

const INITIAL_CLIENTS: Cliente[] = [
  {
    id: "1",
    document: "000.000.000-00",
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 99999-0000",
  },
  {
    id: "2",
    document: "111.111.111-11",
    name: "Maria Souza",
    email: "maria@example.com",
    phone: "(21) 98888-1111",
  },
]

export default function ClientesPage() {
  const [clients, setClients] = useState<Cliente[]>(INITIAL_CLIENTS)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [document, setDocument] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const filteredClients = useMemo(
    () =>
      clients.filter((c) =>
        [c.name, c.document, c.email, c.phone]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search.toLowerCase()))
      ),
    [clients, search]
  )

  const resetForm = () => {
    setEditing(null)
    setDocument("")
    setName("")
    setEmail("")
    setPhone("")
  }

  const openNewClient = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEditClient = (client: Cliente) => {
    setEditing(client)
    setDocument(client.document)
    setName(client.name)
    setEmail(client.email ?? "")
    setPhone(client.phone ?? "")
    setDialogOpen(true)
  }

  const closeDialog = () => {
    resetForm()
    setDialogOpen(false)
  }

  const saveClient = () => {
    if (!document.trim() || !name.trim()) return

    if (editing) {
      setClients((current) =>
        current.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                document: document.trim(),
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
              }
            : c
        )
      )
    } else {
      setClients((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          document: document.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
      ])
    }

    closeDialog()
  }

  const deleteClient = (id: string) => {
    setClients((current) => current.filter((c) => c.id !== id))
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col gap-6 bg-muted/20 p-6">
      <ClientesToolbar
        search={search}
        onSearchChange={setSearch}
        onNewClient={openNewClient}
      />
      <ClientesTable
        clients={filteredClients}
        onEditClient={openEditClient}
        onDeleteClient={deleteClient}
      />
      <ClientesDialog
        open={dialogOpen}
        editing={editing}
        document={document}
        name={name}
        email={email}
        phone={phone}
        onDocumentChange={setDocument}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onClose={closeDialog}
        onSave={saveClient}
      />
    </div>
  )
}
