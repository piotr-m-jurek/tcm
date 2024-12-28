import { Button } from '../../components/Button';
import { Select, Option } from '../../components/Select';
import { SingleSelectInput } from '../../components/SingleSelectInput';
import { ToggleInput } from '../../components/ToggleInput';
import { AggregatedItem } from '../../db/mappers';
import {
  RawFlavor,
  RawRoute,
  RawAction,
  RawTemperature,
  RawType,
} from '../../db/queries';
import { routeConstants } from '../../shared/routes';

type RenderCollection<Col> = {
  collection: Col[];
  name: string;
  item: AggregatedItem;
};

function RenderFlavors({
  collection,
  name,
  item,
}: RenderCollection<RawFlavor>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((flavor) => (
        <ToggleInput
          name={name}
          label={`${flavor.symbol} ${flavor.name}`}
          value={flavor.id}
          checked={item?.flavors?.includes(flavor.id)}
        />
      ))}
    </div>
  );
}

function RenderRoutes({ collection, name, item }: RenderCollection<RawRoute>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((route) => (
        <ToggleInput
          name={name}
          label={`${route.shortName} ${route.name}`}
          value={route.id}
          checked={item.routes.includes(route.id)}
        />
      ))}
    </div>
  );
}

function RenderActions({
  collection,
  name,
  item,
}: RenderCollection<RawAction>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((action) => (
        <ToggleInput
          name={name}
          label={`${action.name}`}
          value={action.id}
          checked={item.actions.includes(action.id)}
        />
      ))}
    </div>
  );
}

function RenderTemperature({
  name,
  collection,
  item,
}: {
  name: string;
  collection: RawTemperature[];
  item: AggregatedItem;
}) {
  return (
    <>
      {collection.map((temperature) => (
        <SingleSelectInput
          name={name}
          value={temperature.id}
          label={`${temperature.symbol} ${temperature.name}`}
          checked={item.food.temperature === temperature.id}
        />
      ))}
    </>
  );
}

function RenderType({
  name,
  collection,
  item,
}: {
  name: string;
  collection: RawType[];
  item: AggregatedItem;
}) {
  return (
    <div class="grid grid-cols-2 grid-rows-8 gap-2">
      {collection.map((type) => (
        <SingleSelectInput
          name={name}
          value={type.id}
          label={type.name}
          checked={item.food.type === type.id}
        />
      ))}
    </div>
  );
}

export function RenderItem({
  item,
  routes,
  flavors,
  actions,
  temperatures,
  types,
}: {
  item: AggregatedItem;
  routes: RawRoute[];
  flavors: RawFlavor[];
  actions: RawAction[];
  temperatures: RawTemperature[];
  types: RawType[];
}) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-gray-500',
    'bg-blue-500',
    'bg-sky-500',
  ];

  return (
    <div class={`${colors[(item.food.temperature ?? 0) - 1]}/40`}>
      <h1 class="text-2xl text-center">{item.food.name}</h1>
      <form
        class="flex flex-col gap-2 p-2 w-full "
        hx-post={`/api/item/${item.food.id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      >
        <div class="flex gap-2 justify-between">
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Routes</h1>
            <RenderRoutes
              item={item}
              name={routeConstants.admin.routes}
              collection={routes}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Flavors</h1>
            <RenderFlavors
              item={item}
              name={routeConstants.admin.flavors}
              collection={flavors}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Actions</h1>
            <RenderActions
              item={item}
              name={routeConstants.admin.actions}
              collection={actions}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Temperature</h1>
            <RenderTemperature
              name={routeConstants.admin.temperature}
              collection={temperatures}
              item={item}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Type</h1>
            <RenderType
              name={routeConstants.admin.type}
              collection={types}
              item={item}
            />
          </div>
        </div>
        <Button align="center" type="submit">
          Save
          <p class="htmx-indicator">loading</p>
        </Button>
      </form>
    </div>
  );
}
