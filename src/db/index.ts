import * as schema from '../../db/schema';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { PrismaClient } from '@prisma/client';

const sqlite = new Database(process.env.DB_FILE_NAME);
export const db = drizzle<typeof schema>(sqlite);

export const prisma = new PrismaClient();
