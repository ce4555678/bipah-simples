import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Decimal from "decimal.js"
import { useNavigationStore } from "@/stores/navigation"
import { ChevronLeftIcon, SaveIcon } from "lucide-react"
import { db } from "@/db"
import { produtosTable } from "@/db/schema/produto"

const formatarReal = (valorCru: string | number): string => {
  const valorString = typeof valorCru === "number" ? String(valorCru) : valorCru
  const valor = valorString.replace(/\D/g, "")

  if (!valor) return ""

  const valorDecimal = new Decimal(valor).div(100).toFixed(2)

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valorDecimal))
}

const parseCurrencyToCents = (display: string): number | undefined => {
  const digits = display.replace(/\D/g, "")
  return digits === "" ? undefined : Number(digits)
}

const produtoSchema = z.object({
  description: z.string("A descrição é obrigatória").min(1, "A descrição é obrigatória"),
  sku: z
    .string("A descrição é obrigatória")
    .min(1, "O SKU é obrigatório")
    .max(20, "código de barras muito grande"),
  precoCusto: z.number().int().min(0).optional(),
  precoVenda: z.number().int().min(0).optional(),
  markup: z.number().int().min(0).max(999).nullable().optional(),
})

export default function ProdutosNew() {
  const { setView } = useNavigationStore()
  const form = useForm<z.infer<typeof produtoSchema>>({
    resolver: zodResolver(produtoSchema)
  })

  function backProdutos() {
    setView("produtos")
  }

  const precoVenda = form.watch("precoVenda")
  const precoCusto = form.watch("precoCusto")

  React.useEffect(() => {
    if (precoVenda == null || precoCusto == null || precoCusto <= 0) {
      form.setValue("markup", null, {
        shouldDirty: true,
        shouldValidate: true,
      })

      return
    }

    const markup = new Decimal(precoVenda)
      .minus(precoCusto)
      .div(precoCusto)
      .mul(100)
      .toDecimalPlaces(0)
      .toNumber()

    form.setValue("markup", markup < 0 ? 0 : markup, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }, [precoVenda, precoCusto, form])

  async function onSubmit(data: z.infer<typeof produtoSchema>) {
    try {
      await db
        .insert(produtosTable)
        .values({
          ...data,
        })

      toast.success("Produto adicionado com sucesso")
      backProdutos()
    } catch (error) {
      console.error(error)

      toast.error("Ocorreu um erro ao adicionar produto")
    }
  }

  return (
    <div className="mb-8 flex w-full items-center justify-center">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Novo produto</CardTitle>
          <CardDescription>
            Cadastre um novo produto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-new-produto" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-new-produto-description">
                      Descrição
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-new-produto-description"
                      aria-invalid={fieldState.invalid}
                      placeholder="Descrição do produto"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="sku"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-new-produto-sku">SKU</FieldLabel>
                    <Input
                      {...field}
                      id="form-new-produto-sku"
                      aria-invalid={fieldState.invalid}
                      placeholder="Codigo de barras"
                      autoComplete="off"
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value.replace(/\D/g, ""))
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="precoVenda"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-new-produto-venda">
                      Preço de venda
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-new-produto-venda"
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      autoComplete="off"
                      value={
                        field.value != null ? formatarReal(field.value) : ""
                      }
                      onChange={(e) => {
                        const cents = parseCurrencyToCents(e.target.value)
                        field.onChange(cents)
                      }}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="precoCusto"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-new-produto-custo">
                      Preço de custo
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-new-produto-custo"
                      aria-invalid={fieldState.invalid}
                      placeholder="R$ 0,00"
                      autoComplete="off"
                      value={
                        field.value != null ? formatarReal(field.value) : ""
                      }
                      onChange={(e) => {
                        const cents = parseCurrencyToCents(e.target.value)
                        field.onChange(cents)
                      }}
                      onBlur={field.onBlur}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldDescription>
                {form.watch("markup") != null
                  ? `${form.watch("markup")}%`
                  : "Markup calculado automaticamente"}
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={backProdutos}>
              <ChevronLeftIcon /> Voltar
            </Button>
            <Button type="submit" form="form-new-produto">
              <SaveIcon /> Salvar
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
