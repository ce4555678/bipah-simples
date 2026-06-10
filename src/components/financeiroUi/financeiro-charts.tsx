"use client"

import type { FinancialEntry } from "./types"

interface FinanceiroChartsProps {
  entries: FinancialEntry[]
  currentBalance: number
  totalSangria: number
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

function buildBalanceHistory(entries: FinancialEntry[]) {
  let balance = 0
  return entries.map((entry) => {
    balance += entry.type === "sangria" ? -entry.amount : entry.amount
    return { date: entry.date, balance }
  })
}

function buildTypeTotals(entries: FinancialEntry[]) {
  return entries.reduce(
    (totals, entry) => {
      totals[entry.type] += entry.amount
      return totals
    },
    { sangria: 0, fechamento: 0 }
  )
}

export function FinanceiroCharts({
  entries,
  currentBalance,
  totalSangria,
}: FinanceiroChartsProps) {
  const history = buildBalanceHistory(entries)
  const totals = buildTypeTotals(entries)
  const maxBalance = Math.max(
    ...history.map((item) => item.balance),
    currentBalance,
    100
  )
  const minBalance = Math.min(...history.map((item) => item.balance), 0)
  const balanceRange = Math.max(maxBalance - minBalance, 1)

  const points = history
    .map((item, index) => {
      const x = history.length === 1 ? 10 : (index * 100) / (history.length - 1)
      const y = 35 - ((item.balance - minBalance) / balanceRange) * 28
      return `${x},${y}`
    })
    .join(" ")

  const maxTotal = Math.max(totals.sangria, totals.fechamento, 1)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Gráfico de saldo
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              Saldo ao longo do tempo
            </h2>
          </div>
          <div className="rounded-3xl bg-muted/60 px-4 py-3 text-right">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Caixa atual
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(currentBalance)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Sangria acumulada:{" "}
              <span className="font-semibold text-foreground">
                {formatCurrency(totalSangria)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl bg-muted/10 p-4">
          <svg viewBox="0 0 100 40" className="h-48 w-full">
            <defs>
              <linearGradient id="balanceGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`M${points}`}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              fill="url(#balanceGradient)"
              points={`${points} ${history.length === 0 ? "100,35 0,35" : `100,35 0,35`}`}
            />
            {history.map((item, index) => {
              const x =
                history.length === 1 ? 10 : (index * 100) / (history.length - 1)
              const y = 35 - ((item.balance - minBalance) / balanceRange) * 28
              return <circle key={index} cx={x} cy={y} r="1.5" fill="#4f46e5" />
            })}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-4">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Máximo do período
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {formatCurrency(maxBalance)}
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-4">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Mínimo do período
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {formatCurrency(minBalance)}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Movimentos
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground">
              Sangrias vs Fechamentos
            </h2>
          </div>
          <div className="rounded-3xl bg-muted/60 px-4 py-3 text-right">
            <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Total registrado
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatCurrency(totals.sangria + totals.fechamento)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {(["sangria", "fechamento"] as const).map((type) => {
            const value = totals[type]
            const width = (value / maxTotal) * 100
            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span className="capitalize">{type}</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(value)}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted/50">
                  <div
                    className={`h-full rounded-full ${type === "sangria" ? "bg-destructive" : "bg-emerald-500"}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
