import { useSearchParams } from "react-router";
import type { Route, Flavor, Temperature, Type, Action } from "../types";
import { useState } from "react";

export const getFiltersObject = (params: URLSearchParams) => {
  const type = params.get("type") ?? undefined;
  const temperature = params.get("temperature") ?? undefined;
  const routeIds = params.get("routeIds") ?? undefined;
  const actionIds = params.get("actionIds") ?? undefined;
  const flavorIds = params.get("flavorIds") ?? undefined;
  return { type, temperature, routeIds, actionIds, flavorIds };
};

export const Filters = ({
  types,
  temperatures,
  routes,
  actions,
  flavors,
}: {
  types: Type[] | undefined;
  temperatures: Temperature[] | undefined;
  routes: Route[] | undefined;
  actions: Action[] | undefined;
  flavors: Flavor[] | undefined;
}) => {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col gap-2">
      <div
        className={`flex flex-col sm:flex-row w-full sm:justify-between sticky top-0 bg-white flex-wrap overflow-hidden ${
          open ? "h-auto" : "h-0"
        }`}
      >
        <FilterSelect
          name="type"
          options={types ?? []}
          value={params.get("type") ?? ""}
          onChange={(value) => handleFilterChange("type", value)}
        />

        <FilterSelect
          name="temperature"
          options={temperatures ?? []}
          value={params.get("temperature") ?? ""}
          onChange={(value) => handleFilterChange("temperature", value)}
        />

        <FilterSelect
          name="routeIds"
          options={routes ?? []}
          value={params.get("routeIds") ?? ""}
          onChange={(value) => handleFilterChange("routeIds", value)}
        />

        <FilterSelect
          name="actionIds"
          options={actions ?? []}
          value={params.get("actionIds") ?? ""}
          onChange={(value) => handleFilterChange("actionIds", value)}
        />

        <FilterSelect
          name="flavorIds"
          options={flavors ?? []}
          value={params.get("flavorIds") ?? ""}
          onChange={(value) => handleFilterChange("flavorIds", value)}
        />
      </div>

      <div
        className="cursor-pointer flex items-center justify-center gap-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        {!open ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
            <>Filters</>
          </>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        )}
      </div>
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
