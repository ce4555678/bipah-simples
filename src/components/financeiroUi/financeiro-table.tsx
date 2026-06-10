"use client"

import { Button } from "@/components/ui/button"
import type { FinancialEntry } from "./types"

interface FinanceiroTableProps {
  entries: FinancialEntry[]
  onDeleteEntry: (id: string) => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function FinanceiroTable({
  entries,
  onDeleteEntry,
}: FinanceiroTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-muted/50 text-xs tracking-[0.16em] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3 text-right">Valor</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-16 text-center text-sm text-muted-foreground"
                >
                  Nenhum movimento registrado.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-4 text-muted-foreground">
                    {entry.date}
                  </td>
                  <td className="px-4 py-4 font-medium text-foreground">
                    {entry.type === "sangria" ? "Sangria" : "Fechamento"}
                  </td>
                  <td className="px-4 py-4">{entry.description}</td>
                  <td className="px-4 py-4 text-right text-foreground tabular-nums">
                    {formatCurrency(entry.amount)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => onDeleteEntry(entry.id)}
                    >
                      Remover
                    </Button>
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
