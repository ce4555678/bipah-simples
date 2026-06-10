"use client"

import { Spinner } from "@/components/ui/spinner"

export default function PageLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-muted/10 p-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm">
        <Spinner className="size-12 text-primary" />
        <div>
          <p className="text-lg font-semibold text-foreground">
            Carregando página...
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aguarde enquanto a interface é preparada.
          </p>
        </div>
      </div>
    </div>
  )
}
