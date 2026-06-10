export type FinancialEntryType = "sangria" | "fechamento"

export interface FinancialEntry {
  id: string
  type: FinancialEntryType
  amount: number
  description: string
  date: string
}

export type FinanceDialogMode = "sangria" | "fechamento"
