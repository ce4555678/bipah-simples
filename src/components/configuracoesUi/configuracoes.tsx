"use client"
import ConfiguracoesToolbar from "./configuracoes-toolbar"
import ConfiguracoesSection from "./configuracoes-section"
import ConfiguracoesForm from "./configuracoes-form"
import { useQuery } from "@tanstack/react-query"
import fetchConfig from "@/utils/fetchConfig"
import PageLoading from "../loading"
import formatCNPJ from "@/utils/formatCnpj"

// const PAPER_SIZE_KEY = "bipah-paper-size"


export default function ConfiguracoesPage() {
    const { data, status, error, isLoading} = useQuery({ queryKey: ['config'], queryFn: fetchConfig})

  if(isLoading) return <PageLoading/>


   if (status === "error") {
    return <div className="p-4 text-destructive">{error.message}</div>
  }


  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[min(100%,1200px)] flex-col gap-6 bg-muted/20 px-4 py-6 sm:px-6">
      <ConfiguracoesToolbar
        title="Configurações"
        description="Ajuste os dados da empresa, do terminal e da impressora térmica."
      />

<div className="grid gap-6 xl:grid-cols-[2fr_0.8fr]">
        <ConfiguracoesSection
          title="Dados do PDV"
          description="Atualize o nome da empresa, terminal, CNPJ, endereço e o nome da impressora térmica."
        >
          <ConfiguracoesForm
          />
        </ConfiguracoesSection>

        <div className="space-y-6">
          <ConfiguracoesSection
            title="Resumo atual"
            description="Confira os principais dados antes de salvar."
          >
            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Nome da empresa
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {data?.name}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Nome do terminal
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {data?.terminal}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  CNPJ
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {formatCNPJ(data?.cnpj || "")}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Endereço
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {data?.address}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Nome da impressora
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {data?.thermalPrinter || "Nenhuma selecionada"}
                </p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                  Tamanho do papel
                </p>
                <p className="mt-2 text-base font-semibold text-foreground">
                  {data?.paperSize || "Não definido"}
                </p>
              </div>
            </div>
          </ConfiguracoesSection>
        </div>
      </div>
    </div>
  )
}
