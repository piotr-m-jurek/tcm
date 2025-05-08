import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import process from 'node:process';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
