import type { RawItem } from './queries';

export type AggregatedItem = {
  food: RawItem['food'];
  routes: number[];
  actions: number[];
  flavors: number[];
};

export const aggregateItems = (items: RawItem[]) =>
  items.reduce((acc: Record<string, AggregatedItem>, item) => {
    if (!acc[item.food.id]) {
      acc[item.food.id] = createAggregatedItem(item);
    }

    acc[item.food.id] = aggregateItem(acc[item.food.id], item);
    return acc;
  }, {});

export const aggregateItem = (
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

export const createAggregatedItem = (item: RawItem): AggregatedItem => ({
  food: item.food,
  routes: [],
  actions: [],
  flavors: [],
});
