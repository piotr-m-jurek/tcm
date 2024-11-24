import { Layout } from '../../components/layout';

import type { RawAction, RawFlavor, RawRoute } from '../../db/queries';
import { AggregatedItem } from '../../db/mappers';
import { RenderItem } from './RenderItem';

export { AdminView };
export { RenderItem } from './RenderItem';

function AdminView({
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
