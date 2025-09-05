import type {
  Action,
  CreateFoodPayload,
  Flavor,
  Food,
  Route,
  Temperature,
  Type,
} from './types';

export const isAdmin = () => {
  return import.meta.env.VITE_ENV === 'development';
};

export function foodToFormData(food: CreateFoodPayload) {
  const formData = new FormData();

  formData.append('name', food.name);
  formData.append('temperature', food.temperature_id.toString());
  formData.append('type', food.type_id.toString());
  formData.append('actionIds', food.food_action_ids.join(','));
  formData.append('flavorIds', food.food_flavor_ids.join(','));
  formData.append('routeIds', food.food_route_ids.join(','));

  return formData;
}

export const getFoodFlavorNameById =
  (items: Flavor[] | undefined) => (item: number) => {
    const found = items?.find((f) => f.id === item);
    if (!found) {
      return;
    }
    return found.name;
  };

export const getFoodRouteNameById =
  (routes: Route[] | undefined) => (route: Food['food_route_ids'][number]) => {
    const found = routes?.find((r) => r.id === route);
    if (!found) {
      return;
    }
    return found.name;
  };

export const getFoodActionNameById =
  (actions: Action[] | undefined) =>
  (action: Food['food_action_ids'][number]) => {
    const found = actions?.find((a) => a.id === action);
    if (!found) {
      return;
    }
    return found.name;
  };

export const getTemperatureNameById =
  (temperatures: Temperature[] | undefined) =>
  (temperature: Food['temperature_id']) => {
    const found = temperatures?.find((t) => t.id === temperature);
    if (!found) {
      return;
    }
    return getTemperatureName(found);
  };

const getTemperatureName = (temperature: Temperature | undefined) =>
  temperature?.name ?? 'unknown temperature';

export const getTemperatureOptionById =
  (temperatures: Temperature[] | undefined) =>
  (temperature: Food['temperature_id']) => {
    const found = temperatures?.find((t) => t.id === temperature);
    return getTemperatureOption(found);
  };

export const getTemperatureOption = (temperature: Temperature | undefined) => ({
  label: getTemperatureName(temperature),
  value: temperature?.id.toString() ?? '-1',
});

export const getFoodTypeName = (type: Type) => type.name;

export const getFoodTypeNameById =
  (types: Type[] | undefined) => (type: Food['type_id']) => {
    const found = types?.find((t) => t.id === type);
    if (!found) {
      return;
    }
    return getFoodTypeName(found);
  };
export const getFoodTypeNameOption = (type: Type) => {
  return {
    label: getFoodTypeName(type),
    value: type.id.toString(),
  };
};

export const getFoodTypeOption = (type: Type) => {
  return {
    label: getFoodTypeName(type),
    value: type?.id.toString() ?? '-1',
  };
};
export const getFoodTypeOptionById =
  (types: Type[]) => (type: Food['type_id']) => {
    const found = types.find((t) => t.id === type);
    if (!found) {
      return;
    }
    return getFoodTypeOption(found);
  };

export const getFoodFlavorOptionById =
  (flavors: Flavor[]) => (flavor: Food['food_flavor_ids'][number]) => {
    const found = flavors.find((f) => f.id === flavor);
    if (!found) {
      return;
    }
    return getFoodFlavorOption(found);
  };

export const getFoodRouteOptionById =
  (routes: Route[]) => (route: Food['food_route_ids'][number]) => {
    const found = routes.find((r) => r.id === route);
    if (!found) {
      return;
    }
    return getFoodRouteOption(found);
  };

export const getFoodActionOptionById =
  (actions: Action[]) => (action: Food['food_action_ids'][number]) => {
    const found = actions.find((a) => a.id === action);
    if (!found) {
      return;
    }
    return getFoodActionOption(found);
  };

export const getFoodRouteOption = (route: Route) => ({
  label: `${route?.short_name ?? 'unknown route'}`,
  value: route?.id.toString() ?? '-1',
});

export const getFoodActionOption = (action: Action) => ({
  label: action?.name ?? 'unknown action',
  value: action?.id.toString() ?? '-1',
});

export const getFoodFlavorOption = (flavor: Flavor) => ({
  label: flavor?.name ?? 'unknown flavor',
  value: flavor?.id.toString() ?? '-1',
});
