import { relations } from "drizzle-orm"
import { int, sqliteTable, text, blob } from "drizzle-orm/sqlite-core"
import { ItemVendaTable } from "./item-venda"

export const produtosTable = sqliteTable("produtos_table", {
  id: int().primaryKey({ autoIncrement: true }),
  description: text().notNull(),
  sku: text().unique().notNull(),
  image: blob("image"), // Armazena o buffer da imagem diretamente no banco local
  precoCusto: int("preco_custo").notNull().default(0),
  precoVenda: int("preco_venda").notNull().default(0),
  markup: int("markup").default(0),
  margemLucro: int("margem_lucro").default(0),
  active: int({
    mode: "boolean",
  }).default(true),
})

export const produtosRelations = relations(produtosTable, ({ many }) => ({
  itensVendas: many(ItemVendaTable),
}))

export type Produto = typeof produtosTable.$inferSelect
