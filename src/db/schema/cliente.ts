import { relations } from "drizzle-orm"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { vendasTable } from "./venda"

export const clientesTable = sqliteTable("clientes_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  phone: text(),
  document: text(),
  address: text(),
})

export const clientesRelations = relations(clientesTable, ({ many }) => ({
  compras: many(vendasTable),
}))

export type Client = typeof clientesTable.$inferSelect
export type ClientInsert = typeof clientesTable.$inferInsert
