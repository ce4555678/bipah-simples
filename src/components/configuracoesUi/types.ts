export type AppearanceMode = "light" | "dark" | "system"
export type ReceiptLayout = "standard" | "compact"

export interface ConfiguracoesValues {
  terminalName: string
  appearance: AppearanceMode
  receiptLayout: ReceiptLayout
  automaticCashClose: boolean
  defaultPaymentMethod: string
}
