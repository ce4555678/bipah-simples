"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { FinanceDialogMode } from "./types"

interface FinanceiroDialogProps {
  open: boolean
  mode: FinanceDialogMode
  amount: string
  description: string
  currentBalance: number
  onAmountChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function FinanceiroDialog({
  open,
  mode,
  amount,
  description,
  currentBalance,
  onAmountChange,
  onDescriptionChange,
  onClose,
  onConfirm,
}: FinanceiroDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "sangria" ? "Registrar sangria" : "Fechamento de caixa"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          {mode === "sangria" ? (
            <>
              <Input
                value={amount}
                onChange={(event) => onAmountChange(event.target.value)}
                placeholder="Valor da sangria"
              />
              <Input
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Motivo da sangria"
              />
            </>
          ) : (
            <>
              <div className="rounded-3xl border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Saldo atual disponível
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {formatCurrency(currentBalance)}
                </p>
              </div>
              <Input
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Observação para o fechamento de caixa"
              />
            </>
          )}
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            {mode === "sangria" ? "Registrar" : "Fechar caixa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
