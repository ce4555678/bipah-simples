import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const configTable = sqliteTable("config_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text(),
  terminal: text(),
  cnpj: text(),
  address: text(),
  thermalPrinter: text("thermal_printer"),
})
