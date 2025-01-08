import { Context } from 'hono';
import { UserView } from './views/user';
import {
  getItems_v1,
  getRawRoutes_v1,
  getRawActions_v1,
  getRawFlavors_v1,
  getRawTypes_v1,
  getRawTemperatures_v1,
} from './db/queries';
import { aggregateUserItems } from './db/mappers';
import { FoodItem } from './views/user/FoodItem';

export const renderUserItems = async (c: Context) => {
  const items = await getItems_v1();

  const rawActions = await getRawActions_v1();
  const rawFlavors = await getRawFlavors_v1();
  const rawRoutes = await getRawRoutes_v1();
  const rawTemperatures = await getRawTemperatures_v1();
  const rawTypes = await getRawTypes_v1();

  const userItems = aggregateUserItems(items, {
    rawActions,
    rawFlavors,
    rawRoutes,
    rawTemperatures,
    rawTypes,
  });

  return c.html(
    <>
      {Object.values(userItems).map((item) => (
        <FoodItem item={item} />
      ))}
    </>
  );
};

export const renderUserView = async (c: Context) => {
  return c.render(<UserView />);
};
