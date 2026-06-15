import { db } from "@/db"
import { produtosTable } from "@/db/schema/produto"
import { ItemVendaTable } from "@/db/schema/item-venda" // Ajuste o caminho do import se necessário
import { sql, eq, and, SQL, sum, desc } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const produtosFtsTable = sqliteTable("produtos_fts", {
  rowid: integer("rowid"),
  description: text("description"),
  sku: text("sku"),
})

const ITEMS_PER_PAGE = 10

const fetchProdutos = async ({ pageParam = 1, searchTerm = "" }) => {
  const offset = (pageParam - 1) * ITEMS_PER_PAGE

  const filters: SQL[] = []

  if (searchTerm && searchTerm.trim() !== "") {
    const sanitizedSearch = searchTerm.replace(/"/g, '""')
    filters.push(sql`produtos_fts MATCH ${sanitizedSearch}`)
  }

  const produtos = await db
    .select({
      id: produtosTable.id,
      description: produtosTable.description,
      sku: produtosTable.sku,
      precoVenda: produtosTable.precoVenda,
      precoCusto: produtosTable.precoCusto,
      active: produtosTable.active,
      // Usando sum() para agregar os dados da tabela de itens vendidos
      totalQuantidade: sum(ItemVendaTable.amount).mapWith(Number),
      totalVendido: sum(ItemVendaTable.totalPrice).mapWith(Number),
    })
    .from(produtosTable)
    .innerJoin(produtosFtsTable, eq(produtosTable.id, produtosFtsTable.rowid))
    // Left Join garante que produtos sem nenhuma venda ainda apareçam na listagem (com total 0 ou null)
    .leftJoin(ItemVendaTable, eq(produtosTable.id, ItemVendaTable.produtoId))
    .where(and(...filters, eq(produtosTable.active, true)))
    // Sempre que usamos funções agregadas (sum, count, etc), precisamos agrupar pelos campos do select
    .groupBy(produtosTable.id)
    .orderBy(desc(sum(ItemVendaTable.amount)))
    .limit(ITEMS_PER_PAGE)
    .offset(offset)

  const nextPage =
    produtos.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined

  return {
    produtos,
    nextPage,
  }
}

export default fetchProdutos
