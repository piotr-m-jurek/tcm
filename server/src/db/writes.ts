import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db, prisma } from '.';
import { getItem_v2 } from './queries';

function createRelationIdObject_v2(
  objectId: number,
  columnName: 'route_id' | 'action_id' | 'flavor_id'
) {
  return (relationId: number) => ({
    food_id: objectId,
    [columnName]: relationId,
  });
}

export async function createActions_v2(foodId: number, actionIds: number[]) {
  const data = actionIds.map(createRelationIdObject_v2(foodId, 'action_id'));
  await prisma.food_actions.createMany({ data });
}

export async function updateActions_v2(foodId: number, actionIds: number[]) {
  await prisma.food_actions.deleteMany({ where: { food_id: foodId } });
  await createActions_v2(foodId, actionIds);
}

export async function createFlavors_v2(foodId: number, flavorIds: number[]) {
  const data = flavorIds.map(createRelationIdObject_v2(foodId, 'flavor_id'));
  await prisma.food_flavors.createMany({ data });
}

export async function updateFlavors_v2(foodId: number, flavorIds: number[]) {
  await prisma.food_flavors.deleteMany({ where: { food_id: foodId } });
  await createFlavors_v2(foodId, flavorIds);
}

export async function createRoutes_v2(foodId: number, routeIds: number[]) {
  const data = routeIds.map(createRelationIdObject_v2(foodId, 'route_id'));
  await prisma.food_routes.createMany({ data });
}

export async function updateRoutes_v2(foodId: number, routeIds: number[]) {
  await prisma.food_routes.deleteMany({ where: { food_id: foodId } });
  await createRoutes_v2(foodId, routeIds);
}

export async function createItem_v2({
  name,
  temperature,
  type,
  actionIds,
  flavorIds,
  routeIds,
}: {
  name: string;
  temperature?: number;
  type?: number;
  actionIds: number[];
  flavorIds: number[];
  routeIds: number[];
}) {
  const food = await prisma.food.create({
    data: {
      name,
      temperature: temperature ? { connect: { id: temperature } } : undefined,
      type: type ? { connect: { id: type } } : undefined,
    },
  });

  await createActions_v2(food.id, actionIds);
  await createFlavors_v2(food.id, flavorIds);
  await createRoutes_v2(food.id, routeIds);

  return food;
}

export async function updateItem_v2(
  id: number,
  {
    name,
    temperature,
    type,
    actionIds,
    flavorIds,
    routeIds,
  }: {
    name: string;
    temperature?: number;
    type?: number;
    actionIds: number[];
    flavorIds: number[];
    routeIds: number[];
  }
) {
  await prisma.food.update({
    where: { id },
    data: {
      name,
      temperature: temperature ? { connect: { id: temperature } } : undefined,
      type: type ? { connect: { id: type } } : undefined,
    },
  });

  await updateActions_v2(id, actionIds);
  await updateFlavors_v2(id, flavorIds);
  await updateRoutes_v2(id, routeIds);

  return getItem_v2(id);
}

// ================
// ==== OLD API====
// ================

function createRelationIdObject(
  objectId: number,
  columnName: 'routeId' | 'actionId' | 'flavorId'
) {
  return (relationId: number) => ({
    foodId: objectId,
    [columnName]: relationId,
  });
}

export async function rewriteItem(
  id: number,
  { temperature, type }: { temperature?: number; type?: number }
) {
  await db
    .update(schema.foodList)
    .set({ temperature, type })
    .where(eq(schema.foodList.id, id));
}

export async function rewriteActions(id: number, actionIds: number[]) {
  await db.delete(schema.foodActions).where(eq(schema.foodActions.foodId, id));
  if (actionIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodActions)
    .values(actionIds.map(createRelationIdObject(id, 'actionId')));
}

export async function rewriteRoutes(id: number, routeIds: number[]) {
  await db.delete(schema.foodRoutes).where(eq(schema.foodRoutes.foodId, id));
  if (routeIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodRoutes)
    .values(routeIds.map(createRelationIdObject(id, 'routeId')));
}

export async function rewriteFlavors(id: number, flavorIds: number[]) {
  await db.delete(schema.foodFlavors).where(eq(schema.foodFlavors.foodId, id));
  if (flavorIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodFlavors)
    .values(flavorIds.map(createRelationIdObject(id, 'flavorId')));
}
