import { create } from "zustand"

export type View = "pdv" | "produtos" | "clientes" | "financeiro" | "configuracoes"

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
