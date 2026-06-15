import { relations, sql } from "drizzle-orm"
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { clientesTable } from "./cliente"
import { ItemVendaTable } from "./item-venda"

type MetodoPagamento = "money" | "card" | "pix" | "voucher"

export const vendasTable = sqliteTable(
  "vendas_table",
  {
    id: int().primaryKey({ autoIncrement: true }),
    metodoPagamento: text("metodo_pagamento")
      .$type<MetodoPagamento>()
      .notNull(),
    desconto: int(),
    troco: int(),
    total: int().default(0).notNull(),
    status: text().$type<"pago" | "cancelada">().notNull().default("pago"),
    clienteId: int("cliente_id").references(() => clientesTable.id, {
      onDelete: "set null",
    }),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index("created_at_idx_vendas").on(table.createdAt),
    index("cliente_id_idx_vendas").on(table.clienteId),
  ]
)

export const vendasRelations = relations(vendasTable, ({ one, many }) => ({
  cliente: one(clientesTable, {
    fields: [vendasTable.clienteId],
    references: [clientesTable.id],
  }),
  itensVenda: many(ItemVendaTable),
}))
