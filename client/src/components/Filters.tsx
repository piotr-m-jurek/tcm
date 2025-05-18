import { useSearchParams } from "react-router";
import type { Route, Flavor, Temperature, Type, Action } from "../types";

export const getFiltersObject = (params: URLSearchParams) => {
  const type = params.get("type") ?? null;
  const temperature = params.get("temperature") ?? null;
  const routeIds = params.get("routeIds") ?? null;
  const actionIds = params.get("actionIds") ?? null;
  const flavorIds = params.get("flavorIds") ?? null;
  return { type, temperature, routeIds, actionIds, flavorIds };
};

export const Filters = ({
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
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between sticky top-0 bg-white p-2 flex-wrap">
      <FilterSelect
        name="type"
        options={types}
        value={params.get("type") ?? ""}
        onChange={(value) => handleFilterChange("type", value)}
      />

      <FilterSelect
        name="temperature"
        options={temperatures}
        value={params.get("temperature") ?? ""}
        onChange={(value) => handleFilterChange("temperature", value)}
      />

      <FilterSelect
        name="routeIds"
        options={routes}
        value={params.get("routeIds") ?? ""}
        onChange={(value) => handleFilterChange("routeIds", value)}
      />

      <FilterSelect
        name="actionIds"
        options={actions}
        value={params.get("actionIds") ?? ""}
        onChange={(value) => handleFilterChange("actionIds", value)}
      />

	  <FilterSelect
        name="flavorIds"
        options={flavors}
        value={params.get("flavorIds") ?? ""}
        onChange={(value) => handleFilterChange("flavorIds", value)}
      />
    </div>
  );
};


const FilterSelect = ({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { id: number; name: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
	  className="border p-2 w-full sm:w-auto"
    >
      <option value="">All {name}</option>
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
