import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db, prisma } from '.';

function createRelationIdObject(
  objectId: number,
  columnName: 'routeId' | 'actionId' | 'flavorId'
) {
  return (relationId: FormDataEntryValue) => ({
    foodId: objectId,
    [columnName]: +relationId,
  });
}

function createRelationIdObject_v2(
  objectId: number,
  columnName: 'route_id' | 'action_id' | 'flavor_id'
) {
  return (relationId: FormDataEntryValue) => ({
    food_id: objectId,
    [columnName]: +relationId,
  });
}

export async function rewriteActions_v2(
  id: number,
  actionIds: FormDataEntryValue[]
) {
  await prisma.food_actions.deleteMany({ where: { food_id: id } });
  const data = actionIds.map(createRelationIdObject_v2(id, 'action_id'));
  await prisma.food_actions.createMany({ data });
}

export async function rewriteActions(
  id: number,
  actionIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodActions).where(eq(schema.foodActions.foodId, id));
  if (actionIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodActions)
    .values(actionIds.map(createRelationIdObject(id, 'actionId')));
}

export async function rewriteFlavors_v2(
  id: number,
  flavorIds: FormDataEntryValue[]
) {
  await prisma.food_flavors.deleteMany({ where: { food_id: id } });
  const data = flavorIds.map(createRelationIdObject_v2(id, 'flavor_id'));
  await prisma.food_flavors.createMany({ data });
}

export async function rewriteFlavors(
  id: number,
  flavorIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodFlavors).where(eq(schema.foodFlavors.foodId, id));
  if (flavorIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodFlavors)
    .values(flavorIds.map(createRelationIdObject(id, 'flavorId')));
}

export async function rewriteRoutes_v2(
  id: number,
  routeIds: FormDataEntryValue[]
) {
  await prisma.food_routes.deleteMany({ where: { food_id: id } });
  const data = routeIds.map(createRelationIdObject_v2(id, 'route_id'));

  prisma.food_routes.createMany({ data });
}

export async function rewriteRoutes(
  id: number,
  routeIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodRoutes).where(eq(schema.foodRoutes.foodId, id));
  if (routeIds.length <= 0) {
    return;
  }
  await db
    .insert(schema.foodRoutes)
    .values(routeIds.map(createRelationIdObject(id, 'routeId')));
}

export async function rewriteItem_v2(
  id: number,
  { temperature, type }: { temperature?: number; type?: number }
) {
  await prisma.food.update({
    where: { id },
    data: {
      temperature: temperature ? { connect: { id: temperature } } : undefined,
      type: type ? { connect: { id: type } } : undefined,
    },
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
