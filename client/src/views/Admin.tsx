import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Layout } from "../components/Layout";
import { fetchData, patchData, postData } from "../lib";
import { useGetIngredients } from "../useGetIngredients";
import { Filters, getFiltersObject } from "../components/Filters";
import {
  type Action,
  type CreateFoodPayload,
  type Flavor,
  type Food,
  type Route,
  type Temperature,
  type Type,
} from "../types";
import { useSearchParams } from "react-router";
import { match } from "ts-pattern";

const tableHeaders = [
  "Name",
  "Temperature",
  "Routes",
  "Type",
  "Actions",
  "Flavors",
  "Edit",
] as const;

type Mode =
  | { type: "create"; food: CreateFoodPayload }
  | { type: "update"; food: Food }
  | { type: "view" };

export function AdminPage() {
  const [mode, setMode] = useState<Mode>({ type: "view" });
  const [searchParams] = useSearchParams();
  const params = getFiltersObject(searchParams);

  const { data } = useGetIngredients();
  const queryClient = useQueryClient();

  const foodsQuery = useQuery({
    queryKey: ["foods", params],
    queryFn: () => fetchData<Food[]>("foods", params),
  });

  const updateMutation = useMutation({
    mutationFn: async (food: Food) => {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("temperature", food.temperature_id.toString());
      formData.append("type", food.type_id.toString());

      const actionIds = food.food_action_ids.join(",");
      formData.append("actionIds", actionIds);

      const flavorIds = food.food_flavor_ids.join(",");
      formData.append("flavorIds", flavorIds);

      const routeIds = food.food_route_ids.join(",");
      formData.append("routeIds", routeIds);

      return patchData(`foods/${food.id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
      setMode({ type: "view" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (food: CreateFoodPayload) => {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("temperature", food.temperature_id.toString());
      formData.append("type", food.type_id.toString());

      const actionIds = food.food_action_ids.join(",");
      formData.append("actionIds", actionIds);

      const flavorIds = food.food_flavor_ids.join(",");
      formData.append("flavorIds", flavorIds);

      const routeIds = food.food_route_ids.join(",");
      formData.append("routeIds", routeIds);

      return postData("foods", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
      setMode({ type: "view" });
    },
  });

  function handleEditClick(food: Food) {
    setMode({ type: "update", food });
  }

  function handleSaveClick() {
    if (mode.type === "update") {
      updateMutation.mutate(mode.food);
    }
  }

  function handleCreateClick() {
    if (mode.type === "create") {
      createMutation.mutate(mode.food);
    }
  }

  function handleCancelClick() {
    setMode({ type: "view" });
  }

  function handleChange(delta: Partial<CreateFoodPayload>) {
    setMode((prev) => ({ ...prev, ...delta }));
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 flex-wrap bg-gray-100 size-full">
        <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
          <Filters {...data} />

          {/* Edit Form */}
          {mode.type !== "view" && (
            <FoodForm
              mode={mode}
              routes={data.routes}
              types={data.types}
              flavors={data.flavors}
              temperatures={data.temperatures}
              actions={data.actions}
              onChange={handleChange}
              onCancel={handleCancelClick}
              onSubmit={handleSaveClick}
            />
          )}

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
              {match(foodsQuery)
                .with({ isLoading: true }, () => (
                  <tr>
                    <td colSpan={tableHeaders.length} className="border p-2">
                      <div className="flex flex-row w-full justify-center items-center">
                        Loading...
                      </div>
                    </td>
                  </tr>
                ))
                .with({ isError: true }, () => (
                  <tr>
                    <td colSpan={tableHeaders.length} className="border p-2">
                      Error loading foods
                    </td>
                  </tr>
                ))
                .with({ isSuccess: true }, () =>
                  foodsQuery.data?.map((food) => (
                    <FoodRow
                      food={food}
                      routes={data.routes}
                      actions={data.actions}
                      flavors={data.flavors}
                      onClick={() => setMode({ type: "update", food })}
                    />
                  ))
                )
                .otherwise(() => null)}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function FoodRow({
  food,
  routes,
  actions,
  flavors,
  temperatures,
  types,

  onClick,
}: {
  food: Food;
  onClick: (food: Food) => void;
  routes?: Route[];
  actions?: Action[];
  flavors?: Flavor[];
  temperatures?: Temperature[];
  types?: Type[];
}) {
  return (
    <tr key={food.id}>
      <td className="border p-2">{food.name}</td>
      <td className="border p-2">
        {temperatures?.find((t) => t.id === food.temperature_id)?.name}
      </td>
      <td className="border p-2">
        {food.food_route_ids.map(getFoodRoute(routes)).join(", ")}
      </td>
      <td className="border p-2">
        {types?.find((t) => t.id === food.type_id)?.name}
      </td>
      <td className="border p-2">
        {food.food_action_ids.map(getFoodAction(actions)).join(", ")}
      </td>
      <td className="border p-2">
        {food.food_flavor_ids.map(getFoodFlavorName(flavors)).join(", ")}
      </td>
      <td className="border p-2">
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
            onClick={() => onClick(food)}
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}

function FoodForm({
  mode,
  routes,
  types,
  flavors,
  temperatures,
  actions,
  onChange,
  onCancel,
  onSubmit,
}: {
  mode:
    | { type: "create"; food: CreateFoodPayload }
    | { type: "update"; food: Food };
  routes: Route[] | undefined;
  flavors: Flavor[] | undefined;
  types: Type[] | undefined;
  actions: Action[] | undefined;
  temperatures: Temperature[] | undefined;
  onChange: (delta: Partial<CreateFoodPayload>) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="border p-4 rounded bg-gray-50">
      <h2 className="text-xl mb-4">
        {mode.type === "create" ? "Add New Food" : "Edit Food"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full border p-2"
            value={mode.food.name}
            onChange={(e) => onChange({ name: e.target.value })}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1">Type</label>
          <select
            className="w-full border p-2"
            value={mode.food.type_id}
            onChange={(e) => onChange({ type_id: Number(e.target.value) })}
            disabled
          >
            {types?.map((type) => (
              <option value={type.id} key={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Temperature</label>
          <select
            className="w-full border p-2"
            value={mode.food.temperature_id}
            onChange={(e) =>
              onChange({ temperature_id: Number(e.target.value) })
            }
            disabled
          >
            {temperatures?.map((temp) => (
              <option value={temp.id} key={temp.id}>
                {temp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Routes</label>
          <select
            className="w-full border p-2"
            multiple
            value={mode.food.food_route_ids.map(
              (route_id) =>
                routes?.find((route) => route.id === route_id)?.name ??
                "undefined route"
            )}
            onChange={(e) => {
              const food_route_ids = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              );
              onChange({ food_route_ids });
            }}
          >
            {routes?.map((route) => (
              <option value={route.id} key={route.id}>
                {route.name} ({route.short_name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Actions</label>
          <select
            className="w-full border p-2"
            multiple
            value={mode.food.food_action_ids.map(
              (action_id) =>
                actions?.find((action) => action.id === action_id)?.name ??
                "unknown action"
            )}
            onChange={(e) => {
              const food_action_ids = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              );
              onChange({ food_action_ids });
            }}
          >
            {actions?.map((action) => (
              <option value={action.id} key={action.id}>
                {action.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Flavors</label>
          <select
            className="w-full border p-2"
            multiple
            value={mode.food.food_flavor_ids.map(
              (flavor_id) =>
                flavors?.find((flavor) => flavor.id === flavor_id)?.name ??
                "unknown flavor"
            )}
            onChange={(e) => {
              const food_flavor_ids = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
              );
              onChange({ food_flavor_ids });
            }}
          >
            {flavors?.map((flavor) => (
              <option value={flavor.id} key={flavor.id}>
                {flavor.name} ({flavor.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={onSubmit}
        >
          {match(mode.type)
            .with("create", () => "Create")
            .with("update", () => "Save")
            .exhaustive()}
        </button>
      </div>
    </div>
  );
}

const getFoodFlavorName =
  (flavors: Flavor[] | undefined) => (food: Food["food_flavor_ids"][number]) =>
    flavors?.find((f) => f.id === food)?.name;

const getFoodRoute =
  (routes: Route[] | undefined) => (route: Food["food_route_ids"][number]) =>
    routes?.find((r) => r.id === route)?.short_name;

const getFoodAction =
  (actions: Action[] | undefined) =>
  (action: Food["food_action_ids"][number]) =>
    actions?.find((a) => a.id === action)?.name;
