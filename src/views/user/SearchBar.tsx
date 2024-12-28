import { ToggleInput } from '../../components/ToggleInput';
import {
  getRawActions,
  getRawFlavors,
  getRawRoutes,
  getRawTemperatures,
  getRawTypes,
} from '../../db/queries';
import { routeConstants } from '../../shared/routes';

export async function SearchBar() {
  const routes = await getRawRoutes();
  const actions = await getRawActions();
  const flavors = await getRawFlavors();
  const types = await getRawTypes();
  const temperatures = await getRawTemperatures();

  const initialState = {
    [routeConstants.user.routes]: [],
    [routeConstants.user.flavors]: [],
    [routeConstants.user.actions]: [],
    [routeConstants.user.temperature]: [],
    [routeConstants.user.type]: [],
  };
  return (
    <form x-data={JSON.stringify(initialState)}>
      <div class="mb-6">
        <input
          type="text"
          name="query"
          placeholder="Search foods..."
          class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* <!-- Filter Options --> */}
      <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <details>
          <summary>Actions</summary>
          {actions.map((action) => (
            <ToggleInput
              name={routeConstants.user.actions}
              label={action.name}
              value={action.id}
            />
          ))}
        </details>

        <details>
          <summary>Temperatures</summary>
          {temperatures.map((temp) => (
            <ToggleInput
              name={routeConstants.user.temperature}
              label={`${temp.symbol} ${temp.name}`}
              value={temp.id}
            />
          ))}
        </details>
        <details>
          <summary>Routes</summary>{' '}
          {routes.map((route) => (
            <ToggleInput
              name={routeConstants.user.routes}
              value={route.id}
              label={`${route.shortName} ${route.name}`}
            />
          ))}
        </details>

        <details>
          <summary>Flavors</summary>{' '}
          {flavors.map((flavor) => (
            <ToggleInput
              name={routeConstants.user.routes}
              value={flavor.id}
              label={flavor.name}
            />
          ))}
        </details>

        <details>
          <summary>Types</summary>
          {types.map((type) => (
            <ToggleInput
              name={routeConstants.user.type}
              value={type.id}
              label={type.name}
            />
          ))}
        </details>
      </div>
    </form>
  );
}
