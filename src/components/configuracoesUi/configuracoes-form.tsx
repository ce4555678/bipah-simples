import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import fetchConfig from "@/utils/fetchConfig"
import { useEffect, useState } from "react"
import listThemalPrinter from "@/utils/list-thermal-printer"
import { toast } from "sonner"
import { configTable } from "@/db/schema/config"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import formatCNPJ from "@/utils/formatCnpj"



function stripMask(value: string) {
  return value.replace(/\D/g, "")
}

const formSchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório."),
  terminal: z.string().min(1, "Nome do terminal é obrigatório."),
  cnpj: z.string().superRefine((v, ctx) => {
    if (stripMask(v).length !== 14) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CNPJ inválido.",
      })
    }
  }),
  address: z.string().min(1, "Endereço é obrigatório."),
  thermalPrinter: z.string().min(1, "Selecione uma impressora."),
  paperSize: z.string().min(1, "Selecione o tamanho do papel."),
})

export default function ConfiguracoesForm() {
  const PAPER_SIZE_KEY = "bipah-paper-size"
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ["config"], queryFn: fetchConfig })
  const [printers, setPrinters] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: data?.address,
      cnpj: formatCNPJ(stripMask(data?.cnpj ?? "")),
      name: data?.name,
      paperSize: data?.paperSize,
      terminal: data?.terminal,
      thermalPrinter: data?.thermalPrinter,
    },
  })

  const onPrinters = () => {
    listThemalPrinter()
      .then((list) => {
        if (Array.isArray(list)) {
          setPrinters(list)
        }
      })
      .catch(() => {
        setPrinters([])
      })
  }

  useEffect(() => {
    onPrinters()
  }, [])

  // Reseta o formulário quando os dados chegam do servidor
  useEffect(() => {
    if (data) {
      form.reset({
        address: data.address,
        cnpj: formatCNPJ(stripMask(data.cnpj ?? "")),
        name: data.name,
        paperSize: data.paperSize,
        terminal: data.terminal,
        thermalPrinter: data.thermalPrinter,
      })
    }
  }, [data, form])

  const editConfig = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const [config] = await db.select().from(configTable)
      window.localStorage.setItem(PAPER_SIZE_KEY, values.paperSize)

      const payload = {
        ...values,
        cnpj: stripMask(values.cnpj), // salva só os 14 dígitos
      }

      if (!config) {
        await db.insert(configTable).values(payload)
        return
      }

      await db
        .update(configTable)
        .set(payload)
        .where(eq(configTable.id, config.id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] })
      toast.success("Configurações alteradas com sucesso!")
    },
    onError: (error) => {
      console.log(error)
      toast.error("Erro ao alterar configurações")
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    editConfig.mutate(values)
  }

  return (
    <form
      id="configuracoes-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-3xl"
    >
      <FieldGroup className="grid gap-6">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cfg-name">Nome da empresa</FieldLabel>
                <Input
                  {...field}
                  id="cfg-name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="terminal"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cfg-terminal">Nome do terminal</FieldLabel>
                <Input
                  {...field}
                  id="cfg-terminal"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="cnpj"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cfg-cnpj">CNPJ</FieldLabel>
                <Input
                  {...field}
                  id="cfg-cnpj"
                  inputMode="numeric"
                  maxLength={18}
                  onChange={(e) => {
                    const digits = stripMask(e.target.value)
                    field.onChange(formatCNPJ(digits) || digits)
                  }}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cfg-address">Endereço</FieldLabel>
                <Input
                  {...field}
                  id="cfg-address"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="thermalPrinter"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nome da impressora</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Selecione uma impressora" />
                  </SelectTrigger>
                  <SelectContent>
                    {printers.map((printer) => (
                      <SelectItem key={printer} value={printer}>
                        {printer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="paperSize"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tamanho do papel</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm</SelectItem>
                    <SelectItem value="80mm">80mm</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Salvar configurações</Button>
        </div>
      </FieldGroup>
    </form>
  )
}