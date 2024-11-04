import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../db/schema';
const sqlite = new Database(process.env.DB_FILE_NAME);
import { Hono } from 'hono';
import { Child, JSX, JSXNode, ReactElement } from 'hono/jsx';
import { eq } from 'drizzle-orm';
import { Layout } from './layout';
const db = drizzle(sqlite);

// const actions = await db.select().from(schema.action);
// const flavor = await db.select().from(schema.flavor);
// const type = await db.select().from(schema.type);
// const foodList = await db.select().from(schema.foodList);
// const route = await db.select().from(schema.route);
// const temperature = await db.select().from(schema.temperature);
// console.log(actions, flavor, type, foodList, route, temperature);

const app = new Hono();

app.get('/', async (c) => {
  const items = await db
    .select()
    .from(schema.foodList)
    .leftJoin(
      schema.temperature,
      eq(schema.foodList.temperature, schema.temperature.id)
    );
  const routes = await db.select().from(schema.route);
  return c.html(
    <Layout>
      {/*
      <pre>{JSON.stringify(c.req.queries())}</pre>
      <pre>{JSON.stringify(items, null, 2)}</pre>
      */}

      <div class="flex flex-col">
        <h1 class="text-4xl">Assign route</h1>
        {items.map((item) => {
          // for each item display dropdown with available routes, and button to submit form.
          // multiple routes then are sent to the backend where for the item id we can insert the relation.
          // item_id -> route_id1
          // item_id -> route_id2
          // item_id -> route_id3
          return (
            <>
              <h1 class="text-2xl text-center">{item.food.name}</h1>
              <form
                class="flex flex-col gap-2 border align-center justify-between"
                hx-post={`/api/item/${item.food.id}`}
                hx-swap="innerHTML"
              >
                {routes.map((route) => (
                  <label>
                    <input type="checkbox" value={route.name} />
                    {`${route.shortName}(${route.name})`}
                  </label>
                ))}
                <button
                  class="flex px-2 py-1 bg-gray-200 text-gray-800"
                  type="submit"
                >
                  Save
                  <p class="htmx-indicator">loading</p>
                </button>
              </form>
            </>
          );
        })}
      </div>
    </Layout>
  );
});

app.post('/api/item/:itemId', async (c) => {
  const id = c.req.param('itemId');
  const formData = await c.req.formData();
  console.log(id, formData);
});

export default app;
console.log('Hello via Bun!');
