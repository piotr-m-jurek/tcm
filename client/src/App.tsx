import { useState } from "react";
import { useQuery } from "react-query";

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

export function App() {
  const [type, setType] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [route, setRoute] = useState<number | null>(null);
  const [action, setAction] = useState<number | null>(null);
  const [flavor, setFlavor] = useState<number | null>(null);

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

  const foodsQuery = useQuery({
    queryKey: ["foods", type, temperature, route, action, flavor],
    queryFn: () =>
      fetchData<Food[]>("foods", {
        type: type?.toString() ?? "",
        temperature: temperature?.toString() ?? "",
        route: route?.toString() ?? "",
        action: action?.toString() ?? "",
        flavor: flavor?.toString() ?? "",
      }),
  });
  // For compatibility with existing code

  return (
    <div className="flex flex-col gap-4 flex-wrap bg-gray-100 size-full">
      <div className="flex flex-row gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
        {/* Filters */}
        <div className="flex flex-row gap-2 w-full justify-between sticky top-0 bg-white p-2">
          <select
            className="border p-2"
            onChange={(e) => {
              setType(Number(e.target.value));
            }}
            value={type ?? ""}
          >
            <option value="" key="all-types">
              All types
            </option>
            {typesQuery.data?.map((type) => (
              <option value={type.id} key={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => {
              setTemperature(Number(e.target.value));
            }}
            value={temperature ?? ""}
          >
            <option value="">All temperatures</option>
            {temperaturesQuery.data?.map((temperature) => (
              <option value={temperature.id} key={temperature.id}>
                {temperature.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => {
              setRoute(Number(e.target.value));
            }}
          >
            <option value="">All routes</option>
            {routesQuery.data?.map((route) => (
              <option value={route.id} key={route.id}>
                {route.short_name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => {
              setAction(Number(e.target.value));
            }}
            value={action ?? ""}
          >
            <option value="">All actions</option>
            {actionsQuery.data?.map((action) => (
              <option value={action.id} key={action.id}>
                {action.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => {
              setFlavor(Number(e.target.value));
            }}
            value={flavor ?? ""}
          >
            <option value="">All flavors</option>
            {flavorsQuery.data?.map((flavor) => (
              <option value={flavor.id} key={flavor.id}>
                {flavor.name}
              </option>
            ))}
          </select>
        </div>

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
                          routesQuery.data?.find((r) => r.id === route.route_id)
                            ?.name
                      )
                      .join(", ")}
                  </td>
                  <td className="border p-2">{food.type.name}</td>
                  <td className="border p-2">
                    {food.food_actions
                      .map(
                        (action) =>
                          actionsQuery.data?.find(
                            (a) => a.id === action.action_id
                          )?.name
                      )
                      .join(", ")}
                  </td>
                  <td className="border p-2">
                    {food.food_flavors
                      .map(
                        (flavor) =>
                          flavorsQuery.data?.find(
                            (f) => f.id === flavor.flavor_id
                          )?.name
                      )
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
