import { db } from "@/db"
import { configTable } from "@/db/schema/config"

type Config = {
  name: string
  terminal: string
  cnpj: string
  address: string
  thermalPrinter: string
  paperSize: string
}

export default async function fetchConfig(): Promise<Config> {
  const defaults: Config = {
    name: "Minha Empresa",
    terminal: "PDV 01",
    cnpj: "00.000.000/0000-00",
    address: "Rua Exemplo, 123",
    thermalPrinter: "",
    paperSize: "80mm",
  }

  const [config] = await db.select().from(configTable)

  const PAPER_SIZE_KEY = "bipah-paper-size"

  const savedPaperSize =
    typeof window !== "undefined"
      ? window.localStorage.getItem(PAPER_SIZE_KEY)
      : null

  if (!config) {
    return {
      ...defaults,
      paperSize: savedPaperSize ?? defaults.paperSize,
    }
  }

  return {
    name: config.name ?? defaults.name,
    terminal: config.terminal ?? defaults.terminal,
    cnpj: config.cnpj ?? defaults.cnpj,
    address: config.address ?? defaults.address,
    thermalPrinter: config.thermalPrinter ?? defaults.thermalPrinter,
    paperSize: savedPaperSize ?? defaults.paperSize,
  }
}