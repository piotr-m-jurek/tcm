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

export const foodActions = sqliteTable('food-actions', {
  id: int().primaryKey({ autoIncrement: true }),
  foodId: integer('food_id').references(() => foodList.id),
  actionId: integer('action_id').references(() => action.id),
});

export const route = sqliteTable('route', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
  shortName: text('short_name').unique().notNull(),
});

export const foodRoutes = sqliteTable('food-routes', {
  id: int().primaryKey({ autoIncrement: true }),
  foodId: integer('food_id').references(() => foodList.id),
  routeId: integer('route_id').references(() => route.id),
});

export const flavor = sqliteTable('flavor', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().unique().notNull(),
  symbol: text().unique(),
});

export const foodFlavors = sqliteTable('food-flavors', {
  id: int().primaryKey({ autoIncrement: true }),
  foodId: integer('food_id').references(() => foodList.id),
  flavorId: integer('flavor_id').references(() => flavor.id),
});
