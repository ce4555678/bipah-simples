import { int, real, sqliteTable } from "drizzle-orm/sqlite-core"
import { produtosTable } from "./produto";
import { vendasTable } from "./venda";
import { relations } from "drizzle-orm";

export const ItemVendaTable = sqliteTable("item_venda_table", {
  id: int().primaryKey({ autoIncrement: true }),
  produtoId: int("produto_id").notNull().references(() => produtosTable.id, { onDelete: "restrict" }),
    vendaId: int("venda_id").notNull().references(() => vendasTable.id, { onDelete: "cascade" }),
  amount: real().notNull(),
  UnitPrice: int("unit_price").notNull(),
  totalPrice: int("total_price").notNull(),
})

export const ItemVendaRelations = relations(ItemVendaTable, ({ one }) => ({
    item: one(produtosTable, {
        fields: [ItemVendaTable.produtoId],
        references: [produtosTable.id],
    }),
        venda: one(vendasTable, {
        fields: [ItemVendaTable.vendaId],
        references: [vendasTable.id],
    }),
}));
