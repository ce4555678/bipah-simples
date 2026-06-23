import { create } from "zustand"

interface SearchStore {
  input: string
  setSearch: (input: string) => void
}

export const useSearchClienteStore = create<SearchStore>((set) => ({
  input: "",

  setSearch: (input) =>
    set({
      input: input,
    }),
}))
