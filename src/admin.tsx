import { aggregateAdminItems } from './db/mappers';
import {
  getItem,
  getRawTemperatures,
  getRawTypes,
  RawItem,
} from './db/queries';
import { Context } from 'hono';

import { getItems } from './db/queries';
import { getRawActions, getRawFlavors, getRawRoutes } from './db/queries';
import {
  rewriteActions,
  rewriteFlavors,
  rewriteItem,
  rewriteRoutes,
} from './db/writes';
import { AdminView } from './views/admin';
import { RenderItem } from './views/admin/RenderItem';
import { routeConstants } from './shared/routes';

export async function renderAdminView(c: Context) {
  const rawRoutes = await getRawRoutes();
  const rawFlavors = await getRawFlavors();
  const rawActions = await getRawActions();
  const rawTemperatures = await getRawTemperatures();
  const rawTypes = await getRawTypes();
  const items: RawItem[] = await getItems();

  const aggregated = aggregateAdminItems(items);

  return c.html(
    <AdminView
      rawTemperatures={rawTemperatures}
      rawTypes={rawTypes}
      rawRoutes={rawRoutes}
      rawFlavors={rawFlavors}
      rawActions={rawActions}
      items={Object.values(aggregated)}
    />
  );
}

export async function updateItem(c: Context) {
  const id = c.req.param('itemId');
  const formData = await c.req.formData();
  const routeIds = formData.getAll(routeConstants.admin.routes) ?? [];
  const flavorIds = formData.getAll(routeConstants.admin.flavors) ?? [];
  const actionIds = formData.getAll(routeConstants.admin.actions) ?? [];
  const temperatureId = formData.get(routeConstants.admin.temperature) ?? -1;
  const typeId = formData.get(routeConstants.admin.type) ?? -1;

  if (!id) {
    return;
  }
  if (+temperatureId < 0) {
    return c.text('invalid temperatureId:' + temperatureId, 400);
  }

  if (+typeId < 0) {
    return c.text('invalid typeid' + typeId, 400);
  }

  await rewriteRoutes(+id, routeIds);
  await rewriteFlavors(+id, flavorIds);
  await rewriteActions(+id, actionIds);

  await rewriteItem(+id, { temperature: +temperatureId, type: +typeId });

  const item = await getItem(+id);

  const aggregated = aggregateAdminItems(item);
  const rawActions = await getRawActions();
  const rawFlavors = await getRawFlavors();
  const rawRoutes = await getRawRoutes();
  const rawTemperatures = await getRawTemperatures();
  const rawTypes = await getRawTypes();

  return c.html(
    <RenderItem
      temperatures={rawTemperatures}
      types={rawTypes}
      item={aggregated[id]}
      actions={rawActions}
      flavors={rawFlavors}
      routes={rawRoutes}
    />
  );
}
