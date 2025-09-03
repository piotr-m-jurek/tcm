import type { CreateFoodPayload, Food } from "./types";

export const isAdmin = () => {
  return import.meta.env.VITE_ENV === "development";
};

export const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchData<Type extends unknown[]>(
  url: string,
  rawParams?: Record<string, string | undefined>
): Promise<Type> {
  const params = Object.entries(rawParams ?? {}).filter(
    ([, value]) => value !== undefined
  ) as [string, string][];

  const urlSearchParams = new URLSearchParams(params).toString();

  const res = await fetch(`${baseUrl}/${url}?${urlSearchParams}`);
  const json = await res.json();
  return json
}

export async function patchData<Type extends unknown[]>(
  url: string,
  body: FormData
): Promise<Type> {
  const res = await fetch(`${baseUrl}/${url}`, { method: "PATCH", body, });
  return res.json();
}

export async function postData<Type extends unknown[]>(
  url: string,
  body: FormData
): Promise<Type> {
  const res = await fetch(`${baseUrl}/${url}`, { method: "POST", body, });
  return res.json();
}

export function foodToFormData (food: CreateFoodPayload) {
  const formData = new FormData();

  formData.append("name", food.name);
  formData.append("temperature", food.temperature_id.toString());
  formData.append("type", food.type_id.toString());
  formData.append("actionIds", food.food_action_ids.join(","));
  formData.append("flavorIds", food.food_flavor_ids.join(","));
  formData.append("routeIds", food.food_route_ids.join(","));
  return formData
}
