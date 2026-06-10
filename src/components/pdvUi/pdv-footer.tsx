"use client"

import { Input } from "@/components/ui/input"

interface PdvFooterProps {
  received: string
  setReceived: (value: string) => void
  subtotal: number
  change: number
  cartLength: number
}

function KbdBadge({ label }: { label: string }) {
  const [key, description] = label.split(" ")
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold shadow-sm">
        {key}
      </kbd>
      <span>{description}</span>
    </span>
  )
}

export function PdvFooter({
  received,
  setReceived,
  subtotal,
  change,
}: PdvFooterProps) {
  return (
    <footer className="shrink-0 border-t bg-card">
      <div className="grid grid-cols-3 divide-x">
        <div className="p-3">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Recebido
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">R$</span>
            <Input
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              className="w-full bg-transparent px-0 text-xl font-bold tabular-nums outline-none placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        <div className="p-3">
          <p className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            Troco
          </p>
          <p
            className={
              "mt-1 text-xl font-bold tabular-nums " +
              (change < 0 && received !== ""
                ? "text-destructive"
                : "text-foreground")
            }
          >
            {received
              ? change < 0
                ? `− ${Math.abs(change).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`
                : change.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
              : "—"}
          </p>
        </div>

        <div className="bg-primary/5 p-3">
          <p className="text-[11px] font-medium tracking-wider text-primary/70 uppercase">
            Total
          </p>
          <p className="mt-1 text-2xl font-bold text-primary tabular-nums">
            {subtotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <div className="hidden flex-wrap gap-3 border-t px-4 py-2 md:flex">
        {[
          "F2 Buscar",
          "F3 +Qtd",
          "F4 −Qtd",
          "F5 Finalizar",
          "Del Remover",
          "↑↓ Navegar",
          "ESC Leitor",
        ].map((label) => (
          <KbdBadge key={label} label={label} />
        ))}
      </div>
    </footer>
  )
}
