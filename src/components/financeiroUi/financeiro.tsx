"use client"

import { useMemo, useState } from "react"
import { FinanceiroToolbar } from "./financeiro-toolbar"
import { FinanceiroCharts } from "./financeiro-charts"
import { FinanceiroTable } from "./financeiro-table"
import { FinanceiroDialog } from "./financeiro-dialog"
import type { FinancialEntry, FinanceDialogMode } from "./types"

const INITIAL_ENTRIES: FinancialEntry[] = [
  {
    id: "1",
    type: "sangria",
    amount: 150.0,
    description: "Sangria de caixa inicial",
    date: new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  },
]

export default function FinanceiroPage() {
  const [entries, setEntries] = useState<FinancialEntry[]>(INITIAL_ENTRIES)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<FinanceDialogMode>("sangria")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")

  const currentBalance = useMemo(
    () =>
      entries.reduce(
        (total, entry) =>
          total + entry.amount * (entry.type === "sangria" ? -1 : 1),
        0
      ),
    [entries]
  )

  const totalSangria = useMemo(
    () =>
      entries
        .filter((entry) => entry.type === "sangria")
        .reduce((total, entry) => total + entry.amount, 0),
    [entries]
  )

  const lastClosure = useMemo(() => {
    const closure = [...entries]
      .filter((entry) => entry.type === "fechamento")
      .pop()
    return closure?.date
  }, [entries])

  const openDialog = (mode: FinanceDialogMode) => {
    setDialogMode(mode)
    setAmount("")
    setDescription("")
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setAmount("")
    setDescription("")
  }

  const handleConfirm = () => {
    if (dialogMode === "sangria") {
      const value = Number(amount.replace(",", "."))
      if (!value || value <= 0) return
      setEntries((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          type: "sangria",
          amount: value,
          description: description.trim() || "Sangria registrada",
          date: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        },
      ])
    } else {
      setEntries((current) => [
        ...current,
        {
          id: `${Date.now()}`,
          type: "fechamento",
          amount: currentBalance,
          description: description.trim() || "Fechamento de caixa",
          date: new Date().toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        },
      ])
    }

    closeDialog()
  }

  const handleDeleteEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id))
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[min(100%,1200px)] flex-col gap-6 bg-muted/20 px-4 py-6 sm:px-6">
      <FinanceiroToolbar
        currentBalance={currentBalance}
        totalSangria={totalSangria}
        lastClosure={lastClosure}
        onNewSangria={() => openDialog("sangria")}
        onCloseRegister={() => openDialog("fechamento")}
      />
      <FinanceiroCharts
        entries={entries}
        currentBalance={currentBalance}
        totalSangria={totalSangria}
      />
      <FinanceiroTable entries={entries} onDeleteEntry={handleDeleteEntry} />
      <FinanceiroDialog
        open={dialogOpen}
        mode={dialogMode}
        amount={amount}
        description={description}
        currentBalance={currentBalance}
        onAmountChange={setAmount}
        onDescriptionChange={setDescription}
        onClose={closeDialog}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
