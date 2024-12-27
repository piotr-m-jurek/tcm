import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db } from '.';

export type RawRoute = Awaited<ReturnType<typeof getRawRoutes>>[number];
export const getRawRoutes = async () => await db.select().from(schema.route);

export type RawFlavor = Awaited<ReturnType<typeof getRawFlavors>>[number];
export const getRawFlavors = async () => await db.select().from(schema.flavor);

export type RawType = Awaited<ReturnType<typeof getRawTypes>>[number];
export const getRawTypes = async () => await db.select().from(schema.type);

export type RawTemperature = Awaited<
  ReturnType<typeof getRawTemperatures>
>[number];
export const getRawTemperatures = async () =>
  await db.select().from(schema.temperature);

export type RawAction = Awaited<ReturnType<typeof getRawActions>>[number];
export const getRawActions = async () => await db.select().from(schema.action);

export type RawItem = Awaited<ReturnType<typeof getItem>>[number];

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

export const getItem = (id: number) =>
  getItems().where(eq(schema.foodList.id, id));