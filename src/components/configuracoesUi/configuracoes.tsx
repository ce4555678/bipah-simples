"use client"

import { useState } from "react"
import ConfiguracoesToolbar from "./configuracoes-toolbar"
import ConfiguracoesSection from "./configuracoes-section"
import ConfiguracoesForm from "./configuracoes-form"
import type { ConfiguracoesValues } from "./types"

const INITIAL_CONFIG: ConfiguracoesValues = {
  terminalName: "PDV 01",
  defaultPaymentMethod: "Dinheiro",
  appearance: "system",
  receiptLayout: "standard",
  automaticCashClose: false,
}

export default function ConfiguracoesPage() {
  const [values, setValues] = useState<ConfiguracoesValues>(INITIAL_CONFIG)
  const [saved, setSaved] = useState(false)

  const handleChange = (
    field: keyof ConfiguracoesValues,
    value: string | boolean
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[min(100%,1200px)] flex-col gap-6 bg-muted/20 px-4 py-6 sm:px-6">
      <ConfiguracoesToolbar
        title="Configurações"
        description="Personalize seu ambiente de PDV com preferências de terminal, recibo e comportamento de fechamento."
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <ConfiguracoesSection
          title="Preferências do sistema"
          description="Ajuste o nome do terminal, o modo de exibição e o layout do recibo."
        >
          <ConfiguracoesForm
            values={values}
            onChange={handleChange}
            onSave={handleSave}
          />
        </ConfiguracoesSection>

        <div className="space-y-6">
          <ConfiguracoesSection
            title="Resumo atual"
            description="Confira os principais parâmetros de configuração antes de salvar."
          >
            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Nome do terminal
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {values.terminalName}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Aparência
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {values.appearance}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Layout do recibo
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {values.receiptLayout}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Fechamento automático
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {values.automaticCashClose ? "Ativado" : "Desativado"}
                </p>
              </div>
            </div>
          </ConfiguracoesSection>

          <ConfiguracoesSection
            title="Ajuda rápida"
            description="Acesse os itens importantes para configurar o seu PDV de maneira eficiente."
          >
            <div className="grid gap-3">
              <div className="rounded-3xl border border-border bg-muted p-4">
                <p className="text-sm font-medium text-foreground">
                  Pagamento padrão
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usado como primeira opção no checkout.
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-muted p-4">
                <p className="text-sm font-medium text-foreground">Aparência</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha entre claro, escuro ou usar o tema do sistema.
                </p>
              </div>
            </div>
          </ConfiguracoesSection>
        </div>
      </div>

      {saved && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Configurações salvas com sucesso.
        </div>
      )}
    </div>
  )
}
