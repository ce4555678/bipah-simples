"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Cliente } from "./types"

interface ClientesDialogProps {
  open: boolean
  editing: Cliente | null
  document: string
  name: string
  email: string
  phone: string
  onDocumentChange: (value: string) => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onClose: () => void
  onSave: () => void
}

export function ClientesDialog({
  open,
  editing,
  document,
  name,
  email,
  phone,
  onDocumentChange,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onClose,
  onSave,
}: ClientesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar cliente" : "Novo cliente"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <Input
            value={document}
            onChange={(event) => onDocumentChange(event.target.value)}
            placeholder="Documento (CPF/CNPJ)"
          />
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Nome"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="E-mail"
            />
            <Input
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder="Telefone"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>{editing ? "Salvar" : "Adicionar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
