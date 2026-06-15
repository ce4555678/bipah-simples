"use client"

import { type RefObject } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Scan, CreditCard } from "lucide-react"

interface PdvHeaderProps {
  inputRef: RefObject<HTMLInputElement | null>
  code: string
  setCode: (value: string) => void
  onSubmit: () => void
  onOpenSearch: () => void
  onOpenFinish: () => void
  finishDisabled: boolean
}

export function PdvHeader({
  inputRef,
  code,
  setCode,
  onSubmit,
  onOpenSearch,
  onOpenFinish,
  finishDisabled,
}: PdvHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b bg-card px-4 py-3">
      <div className="flex items-center gap-2 text-primary">
        <Scan className="h-5 w-5" />
        <span className="hidden text-sm font-semibold sm:block">PDV</span>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="relative flex flex-1 items-center">
        <Input
          ref={inputRef}
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Código de barras ou SKU..."
          className="h-10 border-0 bg-transparent pl-0 text-base shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onOpenSearch}
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden rounded border bg-muted px-1 py-0 font-mono text-[10px] sm:block">
                F2
              </kbd>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Buscar produto (F2)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={finishDisabled}
              onClick={onOpenFinish}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Finalizar</span>
              <kbd className="hidden rounded border border-primary-foreground/30 bg-primary-foreground/10 px-1 py-0 font-mono text-[10px] sm:block">
                F5
              </kbd>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Finalizar venda (F5)</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
