import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src-tauri/drizzle',
  schema: './src/db/schema',
  dialect: 'sqlite',
//   dbCredentials: {
//     url: process.env.DB_FILE_NAME!,
//   },
});
