import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './db/schema';
const sqlite = new Database(process.env.DB_FILE_NAME);
const db = drizzle(sqlite);

const actions = await db.select().from(schema.action);
const flavor = await db.select().from(schema.flavor);
const type = await db.select().from(schema.type);
const foodList = await db.select().from(schema.foodList);
const route = await db.select().from(schema.route);
const temperature = await db.select().from(schema.temperature);
console.log(actions, flavor, type, foodList, route, temperature);
console.log('Hello via Bun!');
