"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { db } from "@/db"
import { clientesTable, type Client } from "@/db/schema/cliente"
import { eq } from "drizzle-orm"
import { toast } from "sonner"

interface DeleteClienteDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClienteDialog({
  client,
  open,
  onOpenChange,
}: DeleteClienteDialogProps) {
  const queryClient = useQueryClient()

  const deleteCliente = useMutation({
    mutationFn: async (id: number) => {
      await db.delete(clientesTable).where(eq(clientesTable.id, id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      toast.success("Cliente excluído")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Erro ao excluir cliente")
    },
  })

  if (!client) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir cliente</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir <strong>{client.name}</strong>? Esta
            ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => deleteCliente.mutate(client.id)}
            disabled={deleteCliente.status === "pending"}
          >
            {deleteCliente.status === "pending"
              ? "Excluindo..."
              : "Confirmar exclusão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
