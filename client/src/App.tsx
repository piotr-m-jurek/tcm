import { useState } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";

const baseUrl = "http://localhost:3000/api";

async function fetchData<Type extends unknown[]>(
  url: string,
  rawParams?: Record<string, string>
): Promise<Type> {
  const params = Object.entries(rawParams ?? {}).filter(
    ([, value]) => value !== ""
  );
  const urlSearchParams = new URLSearchParams(params).toString();

  console.log({ params, urlSearchParams });
  const res = await fetch(`${baseUrl}/${url}?${urlSearchParams}`);
  return res.json();
}

type Food = {
  id: number;
  name: string;
  type_id: number;
  temperature_id: number;
  food_actions: { id: number; food_id: number; action_id: number }[];
  food_flavors: { id: number; food_id: number; flavor_id: number }[];
  food_routes: { id: number; route_id: number; food_id: number }[];
  temperature: { id: number; name: string; symbol: string };
  type: { id: number; name: string };
};

type Route = { id: number; name: string; short_name: string };
type Type = { id: number; name: string };
type Temperature = { id: number; name: string; symbol: string };
type Action = { id: number; name: string };
type Flavor = { id: number; name: string; symbol: string };

const tableHeaders = [
  "Name",
  "Temperature",
  "Routes",
  "Type",
  "Actions",
  "Flavors",
] as const;

const Filters = ({
  types,
  temperatures,
  routes,
  actions,
  flavors,
}: {
  types: Type[];
  temperatures: Temperature[];
  routes: Route[];
  actions: Action[];
  flavors: Flavor[];
}) => {
  const [params, setParams] = useSearchParams();

  const handleFilterChange = (filter: string, value: string) => {
    setParams((prev) => {
      if (value === "") {
        prev.delete(filter);
      } else {
        prev.set(filter, value);
      }
      return prev;
    });

  };

  return (
    <div className="flex flex-row gap-2 w-full justify-between sticky top-0 bg-white p-2">
      <select
        className="border p-2"
        name="type"
        onChange={(e) => {
          handleFilterChange(e.target.name, e.target.value);
        }}
        value={params.get("type") ?? ""}
      >
        <option value="" key="all-types">
          All types
        </option>
        {types.map((type) => (
          <option value={type.id} key={type.id}>
            {type.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2"
        onChange={(e) => {
          handleFilterChange(e.target.name, e.target.value);
        }}
        value={params.get("temperature") ?? ""}
      >
        <option value="">All temperatures</option>
        {temperatures.map((temperature) => (
          <option value={temperature.id} key={temperature.id}>
            {temperature.name}
          </option>
        ))}
      </select>

      <select
        name="routeIds"
        className="border p-2"
        onChange={(e) => {
          handleFilterChange(e.target.name, e.target.value);
        }}
        value={params.get("routeIds") ?? ""}
      >
        <option value="">All routes</option>
        {routes.map((route) => (
          <option value={route.id} key={route.id}>
            {route.short_name}
          </option>
        ))}
      </select>

      <select
        name="actionIds"
        className="border p-2"
        onChange={(e) => {
          handleFilterChange(e.target.name, e.target.value);
        }}
        value={params.get("actionIds") ?? ""}
      >
        <option value="">All actions</option>
        {actions.map((action) => (
          <option value={action.id} key={action.id}>
            {action.name}
          </option>
        ))}
      </select>

      <select
        name="flavorIds"
        className="border p-2"
        onChange={(e) => {
          handleFilterChange(e.target.name, e.target.value);
        }}
        value={params.get("flavorIds") ?? ""}
      >
        <option value="">All flavors</option>
        {flavors.map((flavor) => (
          <option value={flavor.id} key={flavor.id}>
            {flavor.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const getFilters = (params: URLSearchParams) => {
  const type = params.get("type") ?? null;
  const temperature = params.get("temperature") ?? null;
  const routeIds = params.get("routeIds") ?? null;
  const actionIds = params.get("actionIds") ?? null;
  const flavorIds = params.get("flavorIds") ?? null;
  return { type, temperature, routeIds, actionIds, flavorIds };
};

export function App() {
  const [params] = useSearchParams();
  const { type, temperature, routeIds, actionIds, flavorIds } = getFilters(params);

  const { isLoading, isError, data } = useGetIngredients();

  const foodsQuery = useQuery({
    queryKey: ["foods", type, temperature, routeIds, actionIds, flavorIds],
    queryFn: () =>
      fetchData<Food[]>("foods", {
        type: type?.toString() ?? "",
        temperature: temperature?.toString() ?? "",
        routeIds: routeIds?.toString() ?? "",
        actionIds: actionIds?.toString() ?? "",
        flavorIds: flavorIds?.toString() ?? "",
      }),
  });

  if (foodsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoading || isError ||foodsQuery.isError) {
    return <div>Tell Piotr that the app is not working</div>;
  }

  return (
    <div className="flex flex-col gap-4 flex-wrap bg-gray-100 size-full">
      <div className="flex flex-row gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
        {/* Filters */}
        <Filters
          types={data?.types ?? []}
          temperatures={data?.temperatures ?? []}
          routes={data?.routes ?? []}
          actions={data?.actions ?? []}
          flavors={data?.flavors ?? []}
        />

        {/* Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th className="border p-2" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foodsQuery.isLoading && (
              <tr>
                <td colSpan={tableHeaders.length} className="border p-2">
                  <div className="flex flex-row w-full justify-center items-center">
                    Loading...
                  </div>
                </td>
              </tr>
            )}
            {foodsQuery.isError && (
              <tr>
                <td colSpan={tableHeaders.length} className="border p-2">
                  Error loading foods
                </td>
              </tr>
            )}
            {foodsQuery.isSuccess &&
              foodsQuery.data?.map((food) => (
                <tr key={food.id}>
                  <td className="border p-2">{food.name}</td>
                  <td className="border p-2">{food.temperature.name}</td>
                  <td className="border p-2">
                    {food.food_routes
                      .map(
                        (route) =>
                          data?.routes?.find((r) => r.id === route.route_id)
                            ?.short_name
                      )
                      .join(", ")}
                  </td>
                  <td className="border p-2">{food.type.name}</td>
                  <td className="border p-2">
                    {food.food_actions
                      .map(
                        (action) =>
                          data?.actions?.find((a) => a.id === action.action_id)
                            ?.name
                      )
                      .join(", ")}
                  </td>
                  <td className="border p-2">
                    {food.food_flavors
                      .map((flavor) => {
                        const found = data?.flavors?.find(
                          (f) => f.id === flavor.flavor_id
                        );
                        return `${found?.name} (${found?.symbol})`;
                      })
                      .join(", ")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function useGetIngredients() {
  const routesQuery = useQuery({
    queryKey: ["routes"],
    queryFn: () => fetchData<Route[]>("routes"),
  });
  const typesQuery = useQuery({
    queryKey: ["types"],
    queryFn: () => fetchData<Type[]>("types"),
  });
  const temperaturesQuery = useQuery({
    queryKey: ["temperatures"],
    queryFn: () => fetchData<Temperature[]>("temperatures"),
  });
  const actionsQuery = useQuery({
    queryKey: ["actions"],
    queryFn: () => fetchData<Action[]>("actions"),
  });
  const flavorsQuery = useQuery({
    queryKey: ["flavors"],
    queryFn: () => fetchData<Flavor[]>("flavors"),
  });

return {
  isLoading:
    routesQuery.isLoading ||
    typesQuery.isLoading ||
    temperaturesQuery.isLoading ||
    actionsQuery.isLoading ||
    flavorsQuery.isLoading,
  isError:
    routesQuery.isError ||
    typesQuery.isError ||
    temperaturesQuery.isError ||
    actionsQuery.isError ||
    flavorsQuery.isError,
  data: {
    routes: routesQuery.data,
    types: typesQuery.data,
    temperatures: temperaturesQuery.data,
    actions: actionsQuery.data,
    flavors: flavorsQuery.data,
  },
};

}
