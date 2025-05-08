import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { RootLayout } from './layout';
import {
  deleteItem_v2,
  getItem_v2,
  getItems_v2,
  getRawActions_v2,
  getRawFlavors_v2,
  getRawRoutes_v2,
  getRawTemperatures_v2,
  getRawTypes_v2,
} from './db/queries';
import { createItem_v2, updateItem_v2 } from './db/writes';
import { z } from 'zod';

export const routes = {
  food: '/api/food/:foodId',
  adminView: '/admin',
  userView: '/',
  searchView: '/search',
  updateItem: '/api/item/:itemId',
  filteredItems: '/items',
  testingView: '/testing',
  testingViewData: '/testing/data',
} as const;

const app = new Hono();

app.use('*', RootLayout);
app.use('*', cors());
// =================
// ===== API =====
// =================

app.get('/api/foods', async (c) => {
  // filter by name, temperature, type, actionIds, flavorIds, routeIds
  const name = c.req.query('name');
  const temperature = c.req.query('temperature');
  const type = c.req.query('type');
  const actionIds = c.req.query('actionIds');
  const flavorIds = c.req.query('flavorIds');
  const routeIds = c.req.query('routeIds');
  const foods = await getItems_v2({
    name,
    temperature: temperature ? Number(temperature) : undefined,
    type: type ? Number(type) : undefined,
    actionIds: actionIds?.split(',').map((x) => Number(x)) ?? [],
    flavorIds: flavorIds?.split(',').map((x) => Number(x)) ?? [],
    routeIds: routeIds?.split(',').map((x) => Number(x)) ?? [],
  });
  return c.json(foods);
});

/**
 * Get a single food item by ID
 */
app.get('/api/foods/:foodId', async (c) => {
  const foodId = Number(c.req.param('foodId'));
  if (isNaN(foodId)) {
    // TODO: Better error handling
    return c.json({ error: 'Invalid food ID' }, 400);
  }
  const food = await getItem_v2(foodId);

  if (!food) {
    return c.json({ error: 'Food not found' }, 404);
  }
  return c.json(food);
});

/**
 * Create a new food item
 */
app.post('/api/foods', async (c) => {
  const formData = await c.req.formData();

  const formDataObj = {
    name: formData.get('name'),
    temperature: formData.get('temperature'),
    type: formData.get('type'),
    actionIds: formData.get('actionIds'),
    flavorIds: formData.get('flavorIds'),
    routeIds: formData.get('routeIds'),
  };

  const validatedData = FoodItemSchema.safeParse(formDataObj);
  if (!validatedData.success) {
    return c.json({ error: validatedData.error }, 400);
  }

  const food = await createItem_v2(validatedData.data);
  return c.json(food);
});

/**
 * Update a food item
 */
app.patch('/api/foods/:foodId', async (c) => {
  const foodId = Number(c.req.param('foodId'));
  if (isNaN(foodId)) {
    // TODO: Better error handling
    return c.json({ error: 'Invalid food ID' }, 400);
  }

  const formData = await c.req.formData();
  const formDataObj = {
    name: formData.get('name'),
    temperature: formData.get('temperature'),
    type: formData.get('type'),
    actionIds: formData.get('actionIds'),
    flavorIds: formData.get('flavorIds'),
    routeIds: formData.get('routeIds'),
  };

  const validatedData = FoodItemSchema.safeParse(formDataObj);
  if (!validatedData.success) {
    return c.json({ error: validatedData.error }, 400);
  }

  const food = await updateItem_v2(foodId, validatedData.data);

  return c.json(food);
});

/**
 * Delete a food item
 */
app.delete('/api/foods/:foodId', async (c) => {
  const foodId = Number(c.req.param('foodId'));
  if (isNaN(foodId)) {
    return c.json({ error: 'Invalid food ID' }, 400);
  }
  const result = await deleteItem_v2(foodId);
  if ('error' in result) {
    return c.json({ error: result.error }, 400);
  }
  return c.json({ message: result.message }, 200);
});

app.get('/api/routes', async (c) => {
  const routes = await getRawRoutes_v2();
  return c.json(routes);
});

app.get('/api/types', async (c) => {
  const types = await getRawTypes_v2();
  return c.json(types);
});

app.get('/api/temperatures', async (c) => {
  const temperatures = await getRawTemperatures_v2();
  return c.json(temperatures);
});

app.get('/api/actions', async (c) => {
  const actions = await getRawActions_v2();
  return c.json(actions);
});

app.get('/api/flavors', async (c) => {
  const flavors = await getRawFlavors_v2();
  return c.json(flavors);
});

const FoodItemSchema = z.object({
  name: z.string(),
  temperature: z.coerce.number(),
  type: z.coerce.number(),
  actionIds: z
    .string()
    .transform((str) => str.split(',').map((x) => Number(x))),
  flavorIds: z
    .string()
    .transform((str) => str.split(',').map((x) => Number(x))),
  routeIds: z.string().transform((str) => str.split(',').map((x) => Number(x))),
});

export default app;
