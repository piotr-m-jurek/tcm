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

export const deleteItem_v2 = async (foodId: number) => {
  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) {
    return { error: 'Food not found' };
  }
  await prisma.food_actions.deleteMany({ where: { food_id: food.id } });
  await prisma.food_flavors.deleteMany({ where: { food_id: food.id } });
  await prisma.food_routes.deleteMany({ where: { food_id: food.id } });
  await prisma.food.delete({ where: { id: food.id } });

  return { message: `Food ${foodId} deleted` };
};

export const getItems_v2 = ({
  name,
  temperature,
  type,
  actionIds,
  flavorIds,
  routeIds,
}: {
  name?: string;
  temperature?: number;
  type?: number;
  actionIds?: number[];
  flavorIds?: number[];
  routeIds?: number[];
}) => {
  const where: Prisma.foodWhereInput = {
    name: { contains: name ?? '' },
  };

  if (temperature) {
    where.temperature = { id: { equals: temperature } };
  }

  if (type) {
    where.type = { id: { equals: type } };
  }

  if (actionIds && actionIds.length > 0) {
    where.food_actions = { some: { action_id: { in: actionIds } } };
  }

  if (flavorIds && flavorIds.length > 0) {
    where.food_flavors = { some: { flavor_id: { in: flavorIds } } };
  }

  if (routeIds && routeIds.length > 0) {
    where.food_routes = { some: { route_id: { in: routeIds } } };
  }

  return prisma.food.findMany({
    where,
    include: {
      food_actions: true,
      food_flavors: true,
      food_routes: true,
      temperature: true,
      type: true,
    },
  });
};
