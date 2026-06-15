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

interface ProdutosDialogProps {
  open: boolean
  // editing: Product | null
  code: string
  name: string
  price: string
  stock: string
  onCodeChange: (value: string) => void
  onNameChange: (value: string) => void
  onPriceChange: (value: string) => void
  onStockChange: (value: string) => void
  onClose: () => void
  onSave: () => void
}

export function ProdutosDialog({
  open,
  // editing,
  code,
  name,
  price,
  stock,
  onCodeChange,
  onNameChange,
  onPriceChange,
  onStockChange,
  onClose,
  onSave,
}: ProdutosDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {/* {editing ? "Editar produto" : "Novo produto"} */}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <Input
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Código de barras"
          />
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Nome do produto"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              value={price}
              onChange={(event) => onPriceChange(event.target.value)}
              placeholder="Preço"
            />
            <Input
              value={stock}
              onChange={(event) => onStockChange(event.target.value)}
              placeholder="Estoque"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          {/* <Button onClick={onSave}>{editing ? "Salvar" : "Adicionar"}</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
