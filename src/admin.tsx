import { Layout } from './layout';
import { Select, Option } from './components/Select';
import { Button } from './components/Button';

import { routeConstants } from './shared';
import type { RawAction, RawFlavor, RawRoute } from './queries';
import { AggregatedItem } from './mappers';

type RenderCollection<Col> = {
  collection: Col[];
  name: string;
  selected: number[];
};

function RenderFlavors({
  collection,
  name,
  selected,
}: RenderCollection<RawFlavor>) {
  return (
    <Select name={name}>
      {collection.map((flavor) => (
        <Option
          name={name}
          value={flavor.id.toString()}
          selected={selected.includes(flavor.id)}
        >{`(${flavor.symbol}) ${flavor.name}`}</Option>
      ))}
    </Select>
  );
}

function RenderRoutes({
  collection,
  name,
  selected,
}: RenderCollection<RawRoute>) {
  return (
    <Select name={name}>
      {collection.map((route) => (
        <Option
          name={name}
          value={route.id.toString()}
          selected={selected.includes(route.id)}
        >{`${route.shortName}(${route.name})`}</Option>
      ))}
    </Select>
  );
}

function RenderActions({
  collection,
  name,
  selected,
}: RenderCollection<RawAction>) {
  return (
    <Select name={name}>
      {collection.map((action) => (
        <Option
          name={name}
          value={action.id.toString()}
          selected={selected.includes(action.id)}
        >
          {action.name}
        </Option>
      ))}
    </Select>
  );
}

export function RenderItem({
  item,
  routes,
  flavors,
  actions,
}: {
  item: AggregatedItem;
  routes: RawRoute[];
  flavors: RawFlavor[];
  actions: RawAction[];
}) {
  return (
    <div>
      <h1 class="text-2xl text-center">{item.food.name}</h1>
      <form
        class="flex flex-col gap-2 p-2 w-full max-w-[765px]"
        hx-post={`/api/item/${item.food.id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      >
        <div class="flex gap-2 justify-between">
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Routes</h1>
            <RenderRoutes
              name={routeConstants.root.itemFormData.routes}
              selected={item.routes}
              collection={routes}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Flavors</h1>
            <RenderFlavors
              name={routeConstants.root.itemFormData.flavors}
              collection={flavors}
              selected={item.flavors}
            />
          </div>
          <div class="flex flex-col gap w-full">
            <h1 class="text-2xl text-bold">Actions</h1>
            <RenderActions
              name={routeConstants.root.itemFormData.actions}
              collection={actions}
              selected={item.actions}
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

export function AdminView({
  items,
  actions,
  flavors,
  routes,
}: {
  items: AggregatedItem[];
  actions: RawAction[];
  flavors: RawFlavor[];
  routes: RawRoute[];
}) {
  return (
    <Layout>
      <div class="flex flex-col">
        <h1 class="text-4xl">Assign route</h1>
        {items.map((item) => (
          <RenderItem
            item={item}
            actions={actions}
            flavors={flavors}
            routes={routes}
          />
        ))}
      </div>
    </Layout>
  );
}
