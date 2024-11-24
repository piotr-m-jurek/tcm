import { eq } from 'drizzle-orm';
import * as schema from '../../db/schema';
import { db } from '.';

function createRelationIdObject(
  objectId: number,
  columnName: 'routeId' | 'actionId' | 'flavorId'
) {
  return (relationId: FormDataEntryValue) => ({
    foodId: objectId,
    [columnName]: +relationId,
  });
}

export async function rewriteActions(
  id: number,
  actionIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodActions).where(eq(schema.foodActions.foodId, id));
  await db
    .insert(schema.foodActions)
    .values(actionIds.map(createRelationIdObject(id, 'actionId')));
}

export async function rewriteFlavors(
  id: number,
  flavorIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodFlavors).where(eq(schema.foodFlavors.foodId, id));
  await db
    .insert(schema.foodFlavors)
    .values(flavorIds.map(createRelationIdObject(id, 'flavorId')));
}

export async function rewriteRoutes(
  id: number,
  routeIds: FormDataEntryValue[]
) {
  await db.delete(schema.foodRoutes).where(eq(schema.foodRoutes.foodId, id));
  await db
    .insert(schema.foodRoutes)
    .values(routeIds.map(createRelationIdObject(id, 'routeId')));
}
