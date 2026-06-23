"use client"

import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { db } from "@/db"
import { clientesTable, type Client } from "@/db/schema/cliente"
import { eq } from "drizzle-orm"

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .optional()

const clienteSchema = z.object({
  document: z.string().trim().min(1, "Documento é obrigatório"),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  phone: optionalString,
  address: optionalString,
})

type ClienteFormValues = z.infer<typeof clienteSchema>

interface ClientesEditDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientesEditDialog({
  client,
  open,
  onOpenChange,
}: ClientesEditDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      document: client?.document ?? "",
      name: client?.name ?? "",
      phone: client?.phone ?? "",
      address: client?.address ?? "",
    },
  })

  useEffect(() => {
    if (!client) return

    form.reset({
      document: client.document ?? "",
      name: client.name ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
    })
  }, [client, form])

  const editCliente = useMutation({
    mutationFn: async (data: ClienteFormValues) => {
      if (!client) {
        throw new Error("Cliente não encontrado")
      }

      await db
        .update(clientesTable)
        .set({
          document: data.document,
          name: data.name,
          phone: data.phone,
          address: data.address,
        })
        .where(eq(clientesTable.id, client.id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast.success("Cliente atualizado")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Erro ao atualizar cliente")
    },
  })

  function onSubmit(values: ClienteFormValues) {
    editCliente.mutate(values)
  }

  if (!client) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
        </DialogHeader>

        <form
          className="grid gap-4 pt-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="document"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cliente-edit-document">
                    Documento
                  </FieldLabel>
                  <Input
                    {...field}
                    id="cliente-edit-document"
                    placeholder="CPF / CNPJ"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cliente-edit-name">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="cliente-edit-name"
                    placeholder="Nome do cliente"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="cliente-edit-phone">Telefone</FieldLabel>
                  <Input
                    {...field}
                    id="cliente-edit-phone"
                    placeholder="(00) 00000-0000"
                    autoComplete="off"
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
                  <FieldLabel htmlFor="cliente-edit-address">
                    Endereço
                  </FieldLabel>
                  <Input
                    {...field}
                    id="cliente-edit-address"
                    placeholder="Rua, número, bairro"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={editCliente.status === "pending"}>
              {editCliente.status === "pending"
                ? "Salvando..."
                : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
