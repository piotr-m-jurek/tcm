import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../db/schema';
const sqlite = new Database(process.env.DB_FILE_NAME);
import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { AdminView } from './admin';
import { routeConstants } from './shared';
const db = drizzle(sqlite);

const app = new Hono();

export type AdminItems = Awaited<ReturnType<typeof getItems>>;
const getItems = async () => {
  return await db
    .select()
    .from(schema.foodList)
    .leftJoin(
      schema.temperature,
      eq(schema.foodList.temperature, schema.temperature.id)
    )
    .leftJoin(schema.type, eq(schema.foodList.type, schema.type.id))
    .leftJoin(
      schema.foodRoutes,
      eq(schema.foodList.id, schema.foodRoutes.foodId)
    );
};

app.get('/admin', async (c) => {
  const routes = await db.select().from(schema.route);
  const flavors = await db.select().from(schema.flavor);
  const actions = await db.select().from(schema.action);
  const items = await getItems();

  console.log(items);
  return c.html(
    <AdminView
      routes={routes}
      flavors={flavors}
      actions={actions}
      items={items}
    />
  );
});

app.post('/api/item/:itemId', async (c) => {
  const id = c.req.param('itemId');
  const formData = await c.req.formData();
  const routeIds = formData.getAll(routeConstants.root.itemFormData.routes);
  const flavorIds = formData.getAll(routeConstants.root.itemFormData.flavors);
  const actionIds = formData.getAll(routeConstants.root.itemFormData.actions);

  console.log({ id, routeIds, flavorIds, actionIds });
  await db.delete(schema.foodRoutes).where(eq(schema.foodRoutes.foodId, +id));
  await db.delete(schema.foodFlavors).where(eq(schema.foodFlavors.foodId, +id));
  await db.delete(schema.foodActions).where(eq(schema.foodActions.foodId, +id));
  await db
    .insert(schema.foodRoutes)
    .values(routeIds.map(createRelationIdObject(id, 'routeId')));

  await db
    .insert(schema.foodFlavors)
    .values(flavorIds.map(createRelationIdObject(id, 'flavorId')));

  await db
    .insert(schema.foodActions)
    .values(actionIds.map(createRelationIdObject(id, 'actionId')));
  return c.newResponse(null, 204);
});

function createRelationIdObject(
  objectId: string,
  columnName: 'routeId' | 'actionId' | 'flavorId'
) {
  return (relationId: FormDataEntryValue) => {
    const ret = {
      foodId: +objectId,
      [columnName]: +relationId,
    };
    console.log({ ret });
    return ret;
  };
}

export default app;
console.log('Hello via Bun!');
