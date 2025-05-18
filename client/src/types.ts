// TODO: make this file shareable between client and server

export type Food = {
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

export type Route = { id: number; name: string; short_name: string };
export type Type = { id: number; name: string };
export type Temperature = { id: number; name: string; symbol: string };
export type Action = { id: number; name: string };
export type Flavor = { id: number; name: string; symbol: string };
