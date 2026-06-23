import type { ProdutoInsert } from "@/db/schema/produto"
import { create } from "zustand"

interface EditProdutoStore {
  // Mudamos para aceitar null inicialmente ou um objeto parcial,
  // já que começar com um produto completo vazio não é válido para o TS.
  produto: ProdutoInsert | null
  setEditProduto: (produto: ProdutoInsert) => void
  clearEditProduto: () => void
}

export const useEditProdutoStore = create<EditProdutoStore>((set) => ({
  // Estado inicial como null é mais seguro se você não tiver os dados de início
  produto: null,

  // Atualiza o produto corretamente
  setEditProduto: (novoProduto) =>
    set({
      produto: novoProduto,
    }),

  // Uma função extra útil para limpar o estado quando fechar o modal/página
  clearEditProduto: () => set({ produto: null }),
}))
