import { prisma } from '.';
import { Prisma } from '@prisma/client';

export type RawRoute = Prisma.PromiseReturnType<typeof getRawRoutes>[number];
export const getRawRoutes = async () => prisma.route.findMany();

export type RawFlavor = Prisma.PromiseReturnType<typeof getRawFlavors>[number];
export const getRawFlavors = async () => await prisma.flavor.findMany();

export type RawType = Prisma.PromiseReturnType<typeof getRawTypes>[number];
export const getRawTypes = async () => await prisma.type.findMany();

export type RawTemperature = Prisma.PromiseReturnType<
  typeof getRawTemperatures
>[number];
export const getRawTemperatures = async () =>
  await prisma.temperature.findMany();

export type RawAction = Prisma.PromiseReturnType<typeof getRawActions>[number];
export const getRawActions = async () => await prisma.action.findMany();

export type RawItem = Prisma.PromiseReturnType<typeof getItems>[number];

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

export const deleteItem = async (foodId: number) => {
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

export const getItems = ({
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
