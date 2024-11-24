import { aggregateAdminItems } from './db/mappers';
import { getItem, RawItem } from './db/queries';
import { Context } from 'hono';

import { getItems } from './db/queries';
import { getRawActions, getRawFlavors, getRawRoutes } from './db/queries';
import { rewriteActions, rewriteFlavors, rewriteRoutes } from './db/writes';
import { AdminView } from './views/admin';
import { RenderItem } from './views/admin/RenderItem';
import { routeConstants } from './shared';

export async function renderAdminView(c: Context) {
  const rawRoutes = await getRawRoutes();
  const rawFlavors = await getRawFlavors();
  const rawActions = await getRawActions();
  const items: RawItem[] = await getItems();

  const aggregated = aggregateAdminItems(items);

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
  const routeIds = formData.getAll(routeConstants.admin.routes);
  const flavorIds = formData.getAll(routeConstants.admin.flavors);
  const actionIds = formData.getAll(routeConstants.admin.actions);

  await rewriteRoutes(+id, routeIds);
  await rewriteFlavors(+id, flavorIds);
  await rewriteActions(+id, actionIds);

  const item = await getItem(+id);

  const aggregated = aggregateAdminItems(item);
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
