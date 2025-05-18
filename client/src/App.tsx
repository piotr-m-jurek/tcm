import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
import { Filters, getFiltersObject } from "./components/Filters";
import type { Flavor, Action, Food, Temperature, Route, Type } from "./types";

const baseUrl = "http://localhost:3000/api";

async function fetchData<Type extends unknown[]>(
  url: string,
  rawParams?: Record<string, string>
): Promise<Type> {
  const params = Object.entries(rawParams ?? {}).filter(
    ([, value]) => value !== ""
  );
  const urlSearchParams = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/${url}?${urlSearchParams}`);
  return res.json();
}

const tableHeaders = [
  "Name",
  "Temperature",
  "Routes",
  "Type",
  "Actions",
  "Flavors",
] as const;



export function App() {
  const [params] = useSearchParams();
  const { type, temperature, routeIds, actionIds, flavorIds } = getFiltersObject(params);

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
    <div className="flex flex-col gap-4 flex-wrap bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4 w-full">

        <Filters
          types={data?.types ?? []}
          temperatures={data?.temperatures ?? []}
          routes={data?.routes ?? []}
          actions={data?.actions ?? []}
          flavors={data?.flavors ?? []}
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th className="border p-2 whitespace-nowrap" key={header}>
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
