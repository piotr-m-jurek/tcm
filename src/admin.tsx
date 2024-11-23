import { Layout } from './layout';
import * as schema from '../db/schema';
import { Select, Option } from './components/Select';
import { Button } from './components/Button';

import { routeConstants } from './shared';

function RenderFlavors({ flavors, name }: { flavors: Flavor[]; name: string }) {
  return (
    <Select name={name}>
      {flavors.slice(1).map((flavor) => (
        <Option
          name={name}
          value={flavor.id}
        >{`(${flavor.symbol}) ${flavor.name}`}</Option>
      ))}
    </Select>
  );
}

function RenderRoutes({ routes, name }: { routes: Route[]; name: string }) {
  return (
    <Select name={name}>
      {routes.map((route) => (
        <Option
          name={name}
          value={route.id}
        >{`${route.shortName}(${route.name})`}</Option>
      ))}
    </Select>
  );
}

function RenderActions({ actions, name }: { actions: Action[]; name: string }) {
  return (
    <Select name={name}>
      {actions.map((action) => (
        <Option name={name} value={action.id}>
          {action.name}
        </Option>
      ))}
    </Select>
  );
}
type Item = typeof schema.foodList.$inferSelect;
type Action = typeof schema.action.$inferSelect;
type Flavor = typeof schema.flavor.$inferSelect;
type Route = typeof schema.route.$inferSelect;

function RenderItem({
  food,
  routes,
  flavors,
  actions,
}: {
  food: Item;
  routes: Route[];
  flavors: Flavor[];
  actions: Action[];
}) {
  return (
    <>
      <h1 class="text-2xl text-center">{food.name}</h1>
      <form
        class="flex flex-col gap-2 border p-2 w-full max-w-[765px]"
        hx-post={`/api/item/${food.id}`}
      >
        <div class="flex gap-2 justify-between">
          <div class="flex flex-col gap border">
            <h1 class="text-2xl text-bold">Routes</h1>
            <RenderRoutes
              name={routeConstants.root.itemFormData.routes}
              routes={routes}
            />
          </div>
          <div class="flex flex-col gap border h-full">
            <h1 class="text-2xl text-bold">Flavors</h1>
            <RenderFlavors
              name={routeConstants.root.itemFormData.flavors}
              flavors={flavors}
            />
          </div>
          <div class="flex flex-col gap border">
            <h1 class="text-2xl text-bold">Actions</h1>
            <RenderActions
              name={routeConstants.root.itemFormData.actions}
              actions={actions}
            />
          </div>
        </div>
        <Button align="center" type="submit">
          Save
          <p class="htmx-indicator">loading</p>
        </Button>
      </form>
    </>
  );
}
export function AdminView({
  items,
  actions,
  flavors,
  routes,
}: {
  items: { food: Item }[];
  actions: Action[];
  flavors: Flavor[];
  routes: Route[];
}) {
  return (
    <Layout>
      <div class="flex flex-col w-full">
        <h1 class="text-4xl">Assign route</h1>
        {items.map((item) => (
          <RenderItem
            food={item.food}
            actions={actions}
            flavors={flavors}
            routes={routes}
          />
        ))}
      </div>
    </Layout>
  );
}
