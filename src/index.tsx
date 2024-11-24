import { AdminView, RenderItem } from './admin';
import { routeConstants } from './shared';

import { Hono } from 'hono';
import {
  getItem,
  getItems,
  getRawActions,
  getRawFlavors,
  getRawRoutes,
  RawItem,
} from './queries';
import { aggregateItems } from './mappers';
import { rewriteRoutes, rewriteFlavors, rewriteActions } from './writes';

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

  await rewriteRoutes(+id, routeIds);
  await rewriteFlavors(+id, flavorIds);
  await rewriteActions(+id, actionIds);

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

export default app;
