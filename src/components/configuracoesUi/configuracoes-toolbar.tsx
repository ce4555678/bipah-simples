"use client"

import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

interface ConfiguracoesToolbarProps {
  title: string
  description: string
}

export default function ConfiguracoesToolbar({
  title,
  description,
}: ConfiguracoesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {title}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Button variant="outline" className="gap-2 self-start sm:self-auto">
        <Settings2 className="h-4 w-4" /> Ajustes gerais
      </Button>
    </div>
  )
}
