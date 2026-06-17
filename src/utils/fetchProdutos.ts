import { db } from "@/db"
import { produtosTable } from "@/db/schema/produto"
import { ItemVendaTable } from "@/db/schema/item-venda"
import { sql, eq, and, SQL, sum, desc, count } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const produtosFtsTable = sqliteTable("produtos_fts", {
  rowid: integer("rowid"),
  description: text("description"),
  sku: text("sku"),
})

const ITEMS_PER_PAGE = 10

const fetchProdutos = async ({ pageParam = 1, searchTerm = "" }) => {
  const offset = pageParam * ITEMS_PER_PAGE

  const filters: SQL[] = []

  if (searchTerm && searchTerm.trim() !== "") {
    const sanitizedSearch = searchTerm.replace(/"/g, '""')
    filters.push(sql`produtos_fts MATCH ${sanitizedSearch}`)
  }

  const whereClause = and(...filters, eq(produtosTable.active, true))

  const [produtos, [{ totalProdutos }]] = await Promise.all([
    db
      .select({
        id: produtosTable.id,
        description: produtosTable.description,
        sku: produtosTable.sku,
        precoVenda: produtosTable.precoVenda,
        precoCusto: produtosTable.precoCusto,
        active: produtosTable.active,
        totalQuantidade: sum(ItemVendaTable.amount).mapWith(Number),
        totalVendido: sum(ItemVendaTable.totalPrice).mapWith(Number),
      })
      .from(produtosTable)
      .innerJoin(produtosFtsTable, eq(produtosTable.id, produtosFtsTable.rowid))
      .leftJoin(ItemVendaTable, eq(produtosTable.id, ItemVendaTable.produtoId))
      .where(whereClause)
      .groupBy(produtosTable.id)
      .orderBy(desc(sum(ItemVendaTable.amount)))
      .limit(ITEMS_PER_PAGE)
      .offset(offset),

    db
      .select({ totalProdutos: count(produtosTable.id) })
      .from(produtosTable)
      .innerJoin(produtosFtsTable, eq(produtosTable.id, produtosFtsTable.rowid))
      .where(whereClause),
  ])

  const nextPage =
    produtos.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined

  return {
    produtos,
    nextPage,
    totalProdutos,
  }
}

export default fetchProdutos