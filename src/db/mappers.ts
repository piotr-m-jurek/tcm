import type {
  RawAction,
  RawFlavor,
  RawItem,
  RawRoute,
  RawTemperature,
  RawType,
} from '../db/queries';

export type AggregatedItem = {
  food: RawItem['food'];
  routes: number[];
  actions: number[];
  flavors: number[];
};

export const aggregateAdminItems = (items: RawItem[]) =>
  items.reduce((acc: Record<string, AggregatedItem>, item) => {
    if (!acc[item.food.id]) {
      acc[item.food.id] = createAdminItem(item);
    }

    acc[item.food.id] = aggregateAdminItem(acc[item.food.id], item);
    return acc;
  }, {});

export const aggregateAdminItem = (
  item: AggregatedItem,
  rawItem: RawItem
): AggregatedItem => {
  const newItem = { ...item };

  if (
    rawItem['food-routes']?.routeId &&
    !newItem.routes.includes(rawItem['food-routes']?.routeId)
  ) {
    newItem.routes.push(rawItem['food-routes']?.routeId);
  }

  if (
    rawItem['food-actions']?.actionId &&
    !newItem.actions.includes(rawItem['food-actions']?.actionId)
  ) {
    newItem.actions.push(rawItem['food-actions']?.actionId);
  }

  if (
    rawItem['food-flavors']?.flavorId &&
    !newItem.flavors.includes(rawItem['food-flavors'].flavorId)
  ) {
    newItem.flavors.push(rawItem['food-flavors'].flavorId);
  }

  return newItem;
};

export const createAdminItem = (item: RawItem): AggregatedItem => ({
  food: item.food,
  routes: [],
  actions: [],
  flavors: [],
});

export type UserItem = {
  food: RawItem['food'];
  routes: RawRoute[];
  actions: RawAction[];
  flavors: RawFlavor[];
  type: RawType | null;
  temperature: RawTemperature | null;
};

export const createUserItem = (item: RawItem): UserItem => ({
  food: item.food,
  routes: [],
  actions: [],
  flavors: [],
  type: null,
  temperature: null,
});

export const aggregateUserItem = (
  item: UserItem,
  rawItem: RawItem,
  {
    rawRoutes,
    rawActions,
    rawFlavors,
    rawTypes,
    rawTemperatures,
  }: {
    rawRoutes: RawRoute[];
    rawActions: RawAction[];
    rawFlavors: RawFlavor[];
    rawTypes: RawType[];
    rawTemperatures: RawTemperature[];
  }
): UserItem => {
  const newItem = { ...item };
  const itemRoutes = rawItem['food-routes'];
  const itemActions = rawItem['food-actions'];
  const itemFlavors = rawItem['food-flavors'];
  const foodType = rawItem.food.type;
  const foodTemperature = rawItem.food.temperature;

  const route = rawRoutes.find((r) => r.id === itemRoutes?.routeId);
  if (route && !newItem.routes.includes(route)) {
    newItem.routes.push(route);
  }

  const action = rawActions.find((r) => r.id === itemActions?.actionId);
  if (action && !newItem.actions.includes(action)) {
    newItem.actions.push(action);
  }

  const flavor = rawFlavors.find((r) => r.id === itemFlavors?.flavorId);
  if (flavor && !newItem.flavors.includes(flavor)) {
    newItem.flavors.push(flavor);
  }

  const type = rawTypes?.find((r) => r.id === foodType);
  if (type) {
    newItem.type = type;
  }

  const temperature = rawTemperatures.find((r) => r.id === foodTemperature);
  if (temperature) {
    newItem.temperature = temperature;
  }

  return newItem;
};

export const aggregateUserItems = (
  items: RawItem[],
  {
    rawRoutes,
    rawActions,
    rawFlavors,
    rawTypes,
    rawTemperatures,
  }: {
    rawRoutes: RawRoute[];
    rawActions: RawAction[];
    rawFlavors: RawFlavor[];
    rawTypes: RawType[];
    rawTemperatures: RawTemperature[];
  }
) =>
  items.reduce((acc: Record<string, UserItem>, item) => {
    if (!acc[item.food.id]) {
      acc[item.food.id] = createUserItem(item);
    }

    acc[item.food.id] = aggregateUserItem(acc[item.food.id], item, {
      rawRoutes,
      rawActions,
      rawFlavors,
      rawTypes,
      rawTemperatures,
    });

    return acc;
  }, {});
