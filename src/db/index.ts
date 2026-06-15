import { drizzle } from "drizzle-orm/sqlite-proxy"
import Database from "@tauri-apps/plugin-sql"

const sqlite = await Database.load("sqlite:bipahsimples.db")

export const db = drizzle(
  async (sql, params, method) => {
    // 1. Se for uma query de leitura (SELECT)
    if (/^select/i.test(sql.trimStart())) {
      const rows: any[] = await sqlite.select(sql, params)
      // O Drizzle espera um array de arrays de valores para o sqlite-proxy raw mode
      const mapped = rows.map(Object.values)
      return { rows: method === "all" ? mapped : (mapped[0] ?? []) }
    }

    // 2. Se for comandos de mutação (INSERT, UPDATE, DELETE)
    // const result = await sqlite.execute(sql, params);

    // O Drizzle Proxy espera receber as linhas afetadas ou informações de sucesso
    return {
      rows: [],
      // Alguns drivers proxy usam metadados internos se fornecidos
    }
  },
  {
    // IMPORTANTE: Força o Drizzle a mapear corretamente os inputs do SQLite do Tauri
    // logger: true
  }
)
