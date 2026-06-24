import { list_thermal_printers } from "tauri-plugin-thermal-printer"
import type { PrinterInfo } from "tauri-plugin-thermal-printer"

async function listThemalPrinter(): Promise<string[]> {
  try {
    const response = await list_thermal_printers()
    return response.map((printer: PrinterInfo) => printer.name)
  } catch (error) {
    throw new Error("List printers failed: " + error)
  }
}
export default listThemalPrinter
