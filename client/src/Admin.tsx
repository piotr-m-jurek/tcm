import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";

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
type Action = { id: number; name: string; symbol: string };
type Flavor = { id: number; name: string; symbol: string };

const tableHeaders = [
  "Name",
  "Temperature",
  "Routes",
  "Type",
  "Actions",
  "Flavors",
  "Edit",
] as const;

export function AdminPage() {
  const [type, setType] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [route, setRoute] = useState<number | null>(null);
  const [action, setAction] = useState<number | null>(null);
  const [flavor, setFlavor] = useState<number | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [newFood, setNewFood] = useState(false);

  const queryClient = useQueryClient();

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

  const updateMutation = useMutation({
    mutationFn: async (food: Food) => {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("temperature", food.temperature_id.toString());
      formData.append("type", food.type_id.toString());
      
      const actionIds = food.food_actions.map(a => a.action_id).join(",");
      formData.append("actionIds", actionIds);
      
      const flavorIds = food.food_flavors.map(f => f.flavor_id).join(",");
      formData.append("flavorIds", flavorIds);
      
      const routeIds = food.food_routes.map(r => r.route_id).join(",");
      formData.append("routeIds", routeIds);

      const res = await fetch(`${baseUrl}/foods/${food.id}`, {
        method: "PATCH",
        body: formData,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
      setEditingFood(null);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (food: Omit<Food, "id">) => {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("temperature", food.temperature_id.toString());
      formData.append("type", food.type_id.toString());
      
      const actionIds = food.food_actions.map(a => a.action_id).join(",");
      formData.append("actionIds", actionIds);
      
      const flavorIds = food.food_flavors.map(f => f.flavor_id).join(",");
      formData.append("flavorIds", flavorIds);
      
      const routeIds = food.food_routes.map(r => r.route_id).join(",");
      formData.append("routeIds", routeIds);

      const res = await fetch(`${baseUrl}/foods`, {
        method: "POST",
        body: formData,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
      setNewFood(false);
    },
  });

  function handleEditClick(food: Food) {
    setEditingFood({ ...food });
  }

  function handleSaveClick() {
    if (editingFood) {
      updateMutation.mutate(editingFood);
    }
  }

  function handleCreateClick() {
    if (editingFood) {
      createMutation.mutate(editingFood as Omit<Food, "id">);
    }
  }

  function handleCancelClick() {
    setEditingFood(null);
    setNewFood(false);
  }

  return (
    <div className="flex flex-col gap-4 flex-wrap bg-gray-100 size-full">
      <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        
        {/* Filters */}
        <div className="flex flex-row gap-1 w-full justify-start sticky top-0 bg-white p-2 flex-wrap">
          <select
            className="border p-2"
            onChange={(e) => {
              setType(Number(e.target.value) || null);
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
              setTemperature(Number(e.target.value) || null);
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
              setRoute(Number(e.target.value) || null);
            }}
            value={route ?? ""}
          >
            <option value="">All routes</option>
            {routesQuery.data?.map((route) => (
              <option value={route.id} key={route.id}>
                {route.name} ({route.short_name})
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => {
              setAction(Number(e.target.value) || null);
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
              setFlavor(Number(e.target.value) || null);
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


        {/* Edit Form */}
        {editingFood && (
          <div className="border p-4 rounded bg-gray-50">
            <h2 className="text-xl mb-4">{newFood ? "Add New Food" : "Edit Food"}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full border p-2"
                  value={editingFood.name}
                  onChange={(e) => setEditingFood({...editingFood, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block mb-1">Type</label>
                <select 
                  className="w-full border p-2"
                  value={editingFood.type_id}
                  onChange={(e) => setEditingFood({...editingFood, type_id: Number(e.target.value)})}
                >
                  {typesQuery.data?.map((type) => (
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
                  value={editingFood.temperature_id}
                  onChange={(e) => setEditingFood({...editingFood, temperature_id: Number(e.target.value)})}
                >
                  {temperaturesQuery.data?.map((temp) => (
                    <option value={temp.id} key={temp.id}>
                      {temp.name} ({temp.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1">Routes</label>
                <select 
                  className="w-full border p-2"
                  multiple
                  value={editingFood.food_routes.map(r => r.route_id.toString())}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setEditingFood({
                      ...editingFood, 
                      food_routes: selectedOptions.map(routeId => ({
                        id: 0,
                        food_id: editingFood.id,
                        route_id: routeId
                      }))
                    });
                  }}
                >
                  {routesQuery.data?.map((route) => (
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
                  value={editingFood.food_actions.map(a => a.action_id.toString())}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setEditingFood({
                      ...editingFood, 
                      food_actions: selectedOptions.map(actionId => ({
                        id: 0,
                        food_id: editingFood.id,
                        action_id: actionId
                      }))
                    });
                  }}
                >
                  {actionsQuery.data?.map((action) => (
                    <option value={action.id} key={action.id}>
                      {action.name} ({action.symbol})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1">Flavors</label>
                <select 
                  className="w-full border p-2"
                  multiple
                  value={editingFood.food_flavors.map(f => f.flavor_id.toString())}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
                    setEditingFood({
                      ...editingFood, 
                      food_flavors: selectedOptions.map(flavorId => ({
                        id: 0,
                        food_id: editingFood.id,
                        flavor_id: flavorId
                      }))
                    });
                  }}
                >
                  {flavorsQuery.data?.map((flavor) => (
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
                onClick={handleCancelClick}
              >
                Cancel
              </button>
              {newFood ? (
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleCreateClick}
                >
                  Create
                </button>
              ) : (
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              )}
            </div>
          </div>
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
                            ?.short_name
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
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button 
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                        onClick={() => handleEditClick(food)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
