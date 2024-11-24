import { Context } from 'hono';
import { UserView } from './views/user';
import { Layout } from './components/layout';
import {
  getItems,
  getRawRoutes,
  getRawActions,
  getRawFlavors,
  getRawTypes,
  getRawTemperatures,
} from './db/queries';
import { aggregateUserItems } from './db/mappers';

export const userView = async (c: Context) => {
  const items = await getItems();
  const rawRoutes = await getRawRoutes();
  const rawActions = await getRawActions();
  const rawFlavors = await getRawFlavors();
  const rawTypes = await getRawTypes();
  const rawTemperatures = await getRawTemperatures();

  const userItems = aggregateUserItems(items, {
    rawRoutes,
    rawActions,
    rawFlavors,
    rawTypes,
    rawTemperatures,
  });
  return c.html(
    <Layout>
      <UserView items={Object.values(userItems)} />
    </Layout>
  );
};
