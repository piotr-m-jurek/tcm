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
};

function RenderFlavors({ collection, name }: RenderCollection<RawFlavor>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((flavor) => (
        <ToggleInput
          name={name}
          label={`${flavor.symbol} ${flavor.name}`}
          value={flavor.id.toString()}
        />
      ))}
    </div>
  );
}

function RenderRoutes({ collection, name }: RenderCollection<RawRoute>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((route) => (
        <ToggleInput
          name={name}
          label={`${route.shortName} ${route.name}`}
          value={route.id.toString()}
        />
      ))}
    </div>
  );
}

function RenderActions({ collection, name }: RenderCollection<RawAction>) {
  return (
    <div class="flex flex-col gap-1">
      {collection.map((action) => (
        <ToggleInput
          name={name}
          label={`${action.name}`}
          value={action.id.toString()}
        />
      ))}
    </div>
  );
}

function RenderTemperature({
  name,
  collection,
}: {
  name: string;
  collection: RawTemperature[];
}) {
  return (
    <>
      {collection.map((temperature) => (
        <SingleSelectInput
          name={name}
          value={temperature.id}
          label={`${temperature.symbol} ${temperature.name}`}
        />
      ))}
    </>
  );
}

function RenderType({
  name,
  collection,
}: {
  name: string;
  collection: RawType[];
}) {
  return (
    <div class="grid grid-cols-2 grid-rows-8 gap-2">
      {collection.map((type) => (
        <SingleSelectInput name={name} value={type.id} label={type.name} />
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
  const initialState = JSON.stringify({
    [routeConstants.admin.flavors]: item.flavors.map(String),
    [routeConstants.admin.temperature]: `${item.food.temperature}`,
    [routeConstants.admin.type]: `${item.food.type}`,
    [routeConstants.admin.actions]: item.actions.map(String),
    [routeConstants.admin.routes]: item.routes.map(String),
  });

  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-gray-500',
    'bg-blue-500',
    'bg-sky-500',
  ];

  return (
    <div
      class={`${colors[(item.food.temperature ?? 0) - 1]}/40`}
      x-data={initialState}
    >
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
              name={routeConstants.admin.routes}
              collection={routes}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Flavors</h1>
            <RenderFlavors
              name={routeConstants.admin.flavors}
              collection={flavors}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Actions</h1>
            <RenderActions
              name={routeConstants.admin.actions}
              collection={actions}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Temperature</h1>
            <RenderTemperature
              name={routeConstants.admin.temperature}
              collection={temperatures}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Type</h1>
            <RenderType name={routeConstants.admin.type} collection={types} />
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
