import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db, prisma } from '.';
import { Prisma } from '@prisma/client';

export type RawRoute = Awaited<ReturnType<typeof getRawRoutes>>[number];
export const getRawRoutes = async () => await db.select().from(schema.route);
export type RawRoute_v2 = Prisma.PromiseReturnType<
  typeof getRawRoutes_v2
>[number];
export const getRawRoutes_v2 = async () => prisma.route.findMany();

export type RawFlavor = Awaited<ReturnType<typeof getRawFlavors>>[number];
export const getRawFlavors = async () => await db.select().from(schema.flavor);
export type RawFlavor_v2 = Prisma.PromiseReturnType<
  typeof getRawFlavors_v2
>[number];
export const getRawFlavors_v2 = async () => await prisma.flavor.findMany();

export type RawType = Awaited<ReturnType<typeof getRawTypes>>[number];
export const getRawTypes = async () => await db.select().from(schema.type);
export type RawType_v2 = Prisma.PromiseReturnType<
  typeof getRawTypes_v2
>[number];
export const getRawTypes_v2 = async () => await prisma.type.findMany();

export type RawTemperature = Awaited<
  ReturnType<typeof getRawTemperatures>
>[number];
export const getRawTemperatures = async () =>
  await db.select().from(schema.temperature);
export type RawTemperature_v2 = Prisma.PromiseReturnType<
  typeof getRawTemperatures_v2
>[number];
export const getRawTemperatures_v2 = async () =>
  await prisma.temperature.findMany();

export type RawAction = Awaited<ReturnType<typeof getRawActions>>[number];
export const getRawActions = async () => await db.select().from(schema.action);

export type RawAction_v2 = Prisma.PromiseReturnType<
  typeof getRawActions_v2
>[number];
export const getRawActions_v2 = async () => await prisma.action.findMany();

export type RawItems = Awaited<ReturnType<typeof getItem>>[number];
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

export type RawItem_v2 = Prisma.PromiseReturnType<typeof getItems_v2>[number];

export const getItem_v2 = (id: number) =>
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

export const getItems_v2 = () =>
  prisma.food.findMany({
    include: {
      food_actions: true,
      food_flavors: true,
      food_routes: true,
      temperature: true,
      type: true,
    },
  });
