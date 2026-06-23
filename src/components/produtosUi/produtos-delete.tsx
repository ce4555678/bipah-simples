"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { db } from "@/db"
import { produtosTable } from "@/db/schema/produto"
import { eq } from "drizzle-orm"
import { toast } from "sonner"

interface DeleteProdutoDialogProps {
  productName: string
  id: number
}

export function DeleteProdutoDialog({
  productName,
  id,
}: DeleteProdutoDialogProps) {
  const queryClient = useQueryClient()

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await db
        .update(produtosTable)
        .set({
          active: false,
        })
        .where(eq(produtosTable.id, id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["produtos"],
      })

      toast.success("Produto excluído")
    },

    onError: () => {
      toast.error("Erro ao excluir")
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir produto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o produto{" "}
            <strong>{productName}</strong>? Esta ação não poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => deleteProduct.mutate(id)}
          >
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
