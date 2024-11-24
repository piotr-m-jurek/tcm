import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db } from '.';

export type RawRoute = Awaited<ReturnType<typeof getRawRoutes>>[number];
export const getRawRoutes = async () => await db.select().from(schema.route);

export type RawFlavor = Awaited<ReturnType<typeof getRawFlavors>>[number];
export const getRawFlavors = async () => await db.select().from(schema.flavor);

export type RawAction = Awaited<ReturnType<typeof getRawActions>>[number];
export const getRawActions = async () => await db.select().from(schema.action);

export type RawItem = Awaited<ReturnType<typeof getItem>>[number];
export const getItem = (id: number) =>
  db
    .select()
    .from(schema.foodList)
    .where(eq(schema.foodList.id, id))
    .leftJoin(schema.type, eq(schema.foodList.type, schema.type.id))
    .leftJoin(
      schema.temperature,
      eq(schema.foodList.temperature, schema.temperature.id)
    )
    .leftJoin(
      schema.foodActions,
      eq(schema.foodList.id, schema.foodActions.foodId)
    )
    .leftJoin(
      schema.foodFlavors,
      eq(schema.foodList.id, schema.foodFlavors.foodId)
    )
    .leftJoin(
      schema.foodRoutes,
      eq(schema.foodRoutes.foodId, schema.foodList.id)
    );

export const getItems = () =>
  db
    .select()
    .from(schema.foodList)
    .leftJoin(schema.type, eq(schema.foodList.type, schema.type.id))
    .leftJoin(
      schema.temperature,
      eq(schema.foodList.temperature, schema.temperature.id)
    )
    .leftJoin(
      schema.foodActions,
      eq(schema.foodList.id, schema.foodActions.foodId)
    )
    .leftJoin(
      schema.foodFlavors,
      eq(schema.foodList.id, schema.foodFlavors.foodId)
    )
    .leftJoin(
      schema.foodRoutes,
      eq(schema.foodRoutes.foodId, schema.foodList.id)
    );
