import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db, prisma } from '.';
import { Prisma } from '@prisma/client';

export type RawRoute = Awaited<ReturnType<typeof getRawRoutes_v1>>[number];
export const getRawRoutes_v1 = async () => await db.select().from(schema.route);

export type RawFlavor = Awaited<ReturnType<typeof getRawFlavors_v1>>[number];
export const getRawFlavors_v1 = async () =>
  await db.select().from(schema.flavor);

export type RawType = Awaited<ReturnType<typeof getRawTypes_v1>>[number];
export const getRawTypes_v1 = async () => await db.select().from(schema.type);

export type RawTemperature = Awaited<
  ReturnType<typeof getRawTemperatures_v1>
>[number];
export const getRawTemperatures_v1 = async () =>
  await db.select().from(schema.temperature);

export type RawAction = Awaited<ReturnType<typeof getRawActions_v1>>[number];
export const getRawActions_v1 = async () =>
  await db.select().from(schema.action);

export type RawItem_v1 = Awaited<ReturnType<typeof getItem_v1>>[number];

export type RawItem = Prisma.PromiseReturnType<typeof getItems>[number];
export const getItems = () =>
  prisma.food.findMany({
    include: {
      food_actions: true,
      food_flavors: true,
      food_routes: true,
      temperature: true,
      type: true,
    },
  });

export const getItems_v1 = () =>
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

export const getItem_v1 = (id: number) =>
  getItems_v1().where(eq(schema.foodList.id, id));

export const getItem = (id: number) =>
  prisma.food.findUnique({
    where: { id },
    include: {
      food_actions: true,
      food_flavors: true,
      food_routes: true,
      temperature: true,
      type: true,
    },
  });
