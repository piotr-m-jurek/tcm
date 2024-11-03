import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// one to one relations
export const type = sqliteTable('type', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
});

export const temperature = sqliteTable('temperature', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
  symbol: text().unique(),
});

export const foodList = sqliteTable('food', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: integer('type_id').references(() => type.id),
  temperature: integer('temperature_id').references(() => temperature.id),
});

// one to many relations
export const action = sqliteTable('action', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
});

export const route = sqliteTable('route', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
  shortName: text('short_name').unique().notNull(),
});

export const flavor = sqliteTable('flavor', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
  symbol: text().unique(),
});
