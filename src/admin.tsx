import { aggregateAdminItems } from './db/mappers';
import {
  getItem_v1,
  getItems,
  getRawTemperatures_v1,
  getRawTypes_v1,
  RawItem_v1,
} from './db/queries';
import { Context } from 'hono';

import { getItems_v1 } from './db/queries';
import {
  getRawActions_v1,
  getRawFlavors_v1,
  getRawRoutes_v1,
} from './db/queries';
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
  const rawRoutes = await getRawRoutes_v1();
  const rawFlavors = await getRawFlavors_v1();
  const rawActions = await getRawActions_v1();
  const rawTemperatures = await getRawTemperatures_v1();
  const rawTypes = await getRawTypes_v1();
  const items_v1: RawItem_v1[] = await getItems_v1();
  const items = await getItems();
  console.log('item_v1', items_v1[0]);
  console.log('item', items[0]);

  const aggregated = aggregateAdminItems(items_v1);

  return c.render(
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

  const item = await getItem_v1(+id);

  const aggregated = aggregateAdminItems(item);
  const rawActions = await getRawActions_v1();
  const rawFlavors = await getRawFlavors_v1();
  const rawRoutes = await getRawRoutes_v1();
  const rawTemperatures = await getRawTemperatures_v1();
  const rawTypes = await getRawTypes_v1();

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
