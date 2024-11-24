import * as schema from '../db/schema';
import { AdminView, RenderItem } from './admin';
import { routeConstants } from './shared';

import { Hono } from 'hono';
import {
  db,
  getItem,
  getItems,
  getRawActions,
  getRawFlavors,
  getRawRoutes,
  RawItem,
} from './queries';
import { eq } from 'drizzle-orm';
import { aggregateItems } from './mappers';

const app = new Hono();

app.get('/admin', async (c) => {
  const rawRoutes = await getRawRoutes();
  const rawFlavors = await getRawFlavors();
  const rawActions = await getRawActions();
  const items: RawItem[] = await getItems();

  const aggregated = aggregateItems(items);

  return c.html(
    <AdminView
      routes={rawRoutes}
      flavors={rawFlavors}
      actions={rawActions}
      items={Object.values(aggregated)}
    />
  );
});

app.post('/api/item/:itemId', async (c) => {
  const id = c.req.param('itemId');
  const formData = await c.req.formData();
  const routeIds = formData.getAll(routeConstants.root.itemFormData.routes);
  const flavorIds = formData.getAll(routeConstants.root.itemFormData.flavors);
  const actionIds = formData.getAll(routeConstants.root.itemFormData.actions);

  await db.delete(schema.foodRoutes).where(eq(schema.foodRoutes.foodId, +id));
  await db
    .insert(schema.foodRoutes)
    .values(routeIds.map(createRelationIdObject(id, 'routeId')));

  await db.delete(schema.foodFlavors).where(eq(schema.foodFlavors.foodId, +id));
  await db
    .insert(schema.foodFlavors)
    .values(flavorIds.map(createRelationIdObject(id, 'flavorId')));

  await db.delete(schema.foodActions).where(eq(schema.foodActions.foodId, +id));
  await db
    .insert(schema.foodActions)
    .values(actionIds.map(createRelationIdObject(id, 'actionId')));

  const item = await getItem(+id);

  const aggregated = aggregateItems(item);
  const rawActions = await getRawActions();
  const rawFlavors = await getRawFlavors();
  const rawRoutes = await getRawRoutes();

  return c.html(
    <RenderItem
      item={aggregated[id]}
      actions={rawActions}
      flavors={rawFlavors}
      routes={rawRoutes}
    />
  );
});

function createRelationIdObject(
  objectId: string,
  columnName: 'routeId' | 'actionId' | 'flavorId'
) {
  return (relationId: FormDataEntryValue) => ({
    foodId: +objectId,
    [columnName]: +relationId,
  });
}

export default app;
