import { create } from "zustand"

interface SearchStore {
  input: string
  setSearch: (input: string) => void
}

export const useSearchProdutoStore = create<SearchStore>((set) => ({
  input: "",

  setSearch: (input) =>
    set({
      input: input,
    }),
}))
