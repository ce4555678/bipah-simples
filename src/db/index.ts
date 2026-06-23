import { drizzle } from "drizzle-orm/sqlite-proxy"
import Database from "@tauri-apps/plugin-sql"

let sqlite: Awaited<ReturnType<typeof Database.load>> | null = null

async function getSqlite() {
  if (!sqlite) {
    sqlite = await Database.load("sqlite:bipahsimples.db")
  }

  try {
    await sqlite.execute("PRAGMA journal_mode = WAL;")
  } catch (error) {
    console.error("Erro ao definir o modo WAL:", error)
  }
  return sqlite
}

export const db = drizzle(
  async (sql, params, method) => {
    const sqliteInstance = await getSqlite()
    const query = sql.trimStart().toLowerCase()

    if (query.startsWith("select")) {
      const rows = (await sqliteInstance.select(sql, params)) as Record<
        string,
        unknown
      >[]

      return {
        rows:
          method === "get"
            ? rows[0]
              ? Object.values(rows[0])
              : []
            : rows.map((row) => Object.values(row)),
      }
    }

    await sqliteInstance.execute(sql, params)

    return {
      rows: [],
    }
  },
  {
    // logger: true,
  }
)
