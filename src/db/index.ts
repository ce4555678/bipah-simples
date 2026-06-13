import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";

const sqlite = await Database.load("sqlite:bipahsimples.db");

export const db = drizzle(async (sql, params, method) => {
  if (/^select/i.test(sql.trimStart())) {
    const rows: any[] = await sqlite.select(sql, params);
    const mapped = rows.map(Object.values);
    return { rows: method === "all" ? mapped : (mapped[0] ?? []) };
  }
  await sqlite.execute(sql, params);
  return { rows: [] };
});