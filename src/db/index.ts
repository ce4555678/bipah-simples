import { drizzle } from "drizzle-orm/sqlite-proxy"
import Database from "@tauri-apps/plugin-sql"

const sqlite =
  await Database.load(
    "sqlite:bipahsimples.db"
  )

export const db = drizzle(
  async (
    sql,
    params,
    method
  ) => {
    const query =
      sql
        .trimStart()
        .toLowerCase()

    if (
      query.startsWith(
        "select"
      )
    ) {
      const rows =
        (await sqlite.select(
          sql,
          params
        )) as Record<
          string,
          unknown
        >[]

      return {
        rows:
          method === "get"
            ? rows[0]
              ? Object.values(
                  rows[0]
                )
              : []
            : rows.map(
                (row) =>
                  Object.values(
                    row
                  )
              ),
      }
    }

    await sqlite.execute(
      sql,
      params
    )

    return {
      rows: [],
    }
  },
  {
    // logger: true,
  }
)