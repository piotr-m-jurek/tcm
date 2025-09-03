import { PrismaBetterSQLite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaBetterSQLite3({
  url: 'file:./tcm.db',
});

export const prisma = new PrismaClient({
  datasourceUrl: process.env.DB_FILE_NAME,
  // adapter,
});
