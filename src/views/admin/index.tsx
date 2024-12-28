import { Layout } from '../../components/layout';

import type {
  RawAction,
  RawFlavor,
  RawRoute,
  RawTemperature,
  RawType,
} from '../../db/queries';
import { AggregatedItem } from '../../db/mappers';
import { RenderItem } from './RenderItem';

export { AdminView };
export { RenderItem } from './RenderItem';

function AdminView({
  items,
  rawTemperatures,
  rawTypes,
  rawActions,
  rawFlavors,
  rawRoutes,
}: {
  items: AggregatedItem[];
  rawActions: RawAction[];
  rawFlavors: RawFlavor[];
  rawRoutes: RawRoute[];
  rawTemperatures: RawTemperature[];
  rawTypes: RawType[];
}) {
  return (
    <Layout>
      <div class="flex flex-col w-full gap-4">
        <h1 class="text-4xl text-center">Assign route</h1>
        <br />
        <div class="flex flex-col">
          {items.map((item) => (
            <RenderItem
              item={item}
              actions={rawActions}
              flavors={rawFlavors}
              routes={rawRoutes}
              temperatures={rawTemperatures}
              types={rawTypes}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
