import { create } from "zustand"

export type View =
  | "pdv"
  | "produtos"
  | "clientes"
  | "financeiro"
  | "configuracoes"
  | "edit-produto"
  | "new-produto"

interface NavigationStore {
  currentView: View
  setView: (view: View) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentView: "pdv",

  setView: (view) =>
    set({
      currentView: view,
    }),
}))
