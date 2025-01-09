import { Context } from 'hono';
import { UserView } from './views/user';
import {
  getItems,
  getRawRoutes,
  getRawActions,
  getRawFlavors,
  getRawTypes,
  getRawTemperatures,
} from './db/queries';
import { aggregateUserItems } from './db/mappers';
import { FoodItem } from './views/user/FoodItem';
import { SearchBar } from './views/user/SearchBar';

export const renderUserItems = async (c: Context) => {
  const items = await getItems();

  const rawActions = await getRawActions();
  const rawFlavors = await getRawFlavors();
  const rawRoutes = await getRawRoutes();
  const rawTemperatures = await getRawTemperatures();
  const rawTypes = await getRawTypes();

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

export const renderSearchView = async (c: Context) => {
  // TODO: get those from search params
  const selectedRoutes: number[] = [];
  const selectedFlavors: number[] = [];
  const selectedTemperatures: number[] = [];
  const selectedTypes: number[] = [];
  const selectedActions: number[] = [];

  return c.html(
    <>
      <SearchBar
        selectedFlavors={selectedFlavors}
        selectedRoutes={selectedRoutes}
        selectedTypes={selectedTypes}
        selectedTemperatures={selectedTemperatures}
        selectedActions={selectedActions}
      />
    </>
  );
};
