import { sql } from "drizzle-orm"
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const fluxoTable = sqliteTable(
  "fluxo_table",
  {
    id: int().primaryKey({ autoIncrement: true }),
    description: text(),
    valor: int().notNull().default(0),
    createdAt: int("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
      type: text().$type<"sangria" | "suprimento">().notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index("created_at_idx_fluxo").on(table.createdAt)]
)
