
export type Food = {
  id: number;
  name: string;
  type_id: number;
  temperature_id: number;
  food_action_ids: number[];
  food_flavor_ids: number[];
  food_route_ids: number[];
};

export type UpdateFoodPayload = {
  id: number;
  name: string;
  type_id: number;
  temperature_id: number;
  food_action_ids: number[];
  food_flavor_ids: number[];
  food_route_ids: number[];
}

export type CreateFoodPayload = {
  name: string;
  temperature_id: number;
  type_id: number; 
  food_action_ids: number[]
  food_flavor_ids: number[];
  food_route_ids: number[];
}


export type Route = { id: number; name: string; short_name: string };
export type Type = { id: number; name: string };
export type Temperature = { id: number; name: string; symbol: string };
export type Action = { id: number; name: string };
export type Flavor = { id: number; name: string; symbol: string };
