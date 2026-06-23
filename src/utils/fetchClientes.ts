import { db } from "@/db"
import { clientesTable } from "@/db/schema/cliente"
import { sql, eq, and, SQL, count } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const clientesFtsTable = sqliteTable("clientes_fts", {
  rowid: integer("rowid"),
  name: text("name"),
})

const ITEMS_PER_PAGE = 10

const fetchClientes = async ({ pageParam = 1, searchTerm = "" }) => {
  const offset = pageParam * ITEMS_PER_PAGE

  const filters: SQL[] = []

  if (searchTerm && searchTerm.trim() !== "") {
    const sanitizedSearch = searchTerm.replace(/"/g, '""')
    filters.push(sql`clientes_fts MATCH ${sanitizedSearch}`)
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined

  const [clientes, [{ totalClientes }]] = await Promise.all([
    db
      .select({
        id: clientesTable.id,
        name: clientesTable.name,
        phone: clientesTable.phone,
        document: clientesTable.document,
        address: clientesTable.address,
      })
      .from(clientesTable)
      .innerJoin(clientesFtsTable, eq(clientesTable.id, clientesFtsTable.rowid))
      .where(whereClause)
      .orderBy(clientesTable.name)
      .limit(ITEMS_PER_PAGE)
      .offset(offset),

    db
      .select({ totalClientes: count(clientesTable.id) })
      .from(clientesTable)
      .innerJoin(clientesFtsTable, eq(clientesTable.id, clientesFtsTable.rowid))
      .where(whereClause),
  ])

  const nextPage =
    clientes.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined

  return {
    clientes,
    nextPage,
    totalClientes,
  }
}

export default fetchClientes
