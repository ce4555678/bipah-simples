"use client"

import { Button } from "@/components/ui/button"
import { ArrowDownCircle, CheckCircle2, DollarSign, Wallet } from "lucide-react"

interface FinanceiroToolbarProps {
  currentBalance: number
  totalSangria: number
  lastClosure?: string
  onNewSangria: () => void
  onCloseRegister: () => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function FinanceiroToolbar({
  currentBalance,
  totalSangria,
  lastClosure,
  onNewSangria,
  onCloseRegister,
}: FinanceiroToolbarProps) {
  return (
    <div className="mx-auto flex w-full flex-col gap-6 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Wallet className="h-5 w-5" />
            <p className="text-xs tracking-[0.2em] uppercase">Caixa atual</p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {formatCurrency(currentBalance)}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <ArrowDownCircle className="h-5 w-5" />
            <p className="text-xs tracking-[0.2em] uppercase">
              Total de sangrias
            </p>
          </div>
          <p className="mt-4 text-3xl font-semibold text-foreground">
            {formatCurrency(totalSangria)}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-xs tracking-[0.2em] uppercase">
              Último fechamento
            </p>
          </div>
          <p className="mt-4 text-sm text-foreground">
            {lastClosure ?? "Ainda não fechado"}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center gap-3 text-muted-foreground">
            <DollarSign className="h-5 w-5" />
            <p className="text-xs tracking-[0.2em] uppercase">Próximo passo</p>
          </div>
          <p className="mt-4 text-sm text-foreground">
            Faça uma sangria ou feche o caixa para gerar o relatório.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          variant="outline"
          onClick={onNewSangria}
          className="w-full gap-2 sm:w-auto"
        >
          Registrar sangria
        </Button>
        <Button onClick={onCloseRegister} className="w-full gap-2 sm:w-auto">
          Fechamento de caixa
        </Button>
      </div>
    </div>
  )
}
