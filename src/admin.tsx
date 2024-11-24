import { aggregateItems } from './mappers';
import { getItem, RawItem } from './queries';
import { Context } from 'hono';

import { getItems } from './queries';
import { getRawActions, getRawFlavors, getRawRoutes } from './queries';
import { rewriteActions } from './writes';
import { rewriteFlavors } from './writes';
import { routeConstants } from './shared';
import { rewriteRoutes } from './writes';
import { AdminView, RenderItem } from './views/admin';

export async function renderAdminView(c: Context) {
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
}

export async function updateItem(c: Context) {
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
}
