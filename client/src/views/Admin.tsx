import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Layout } from '../components/Layout';
import { fetchData, patchData, postData } from '../lib/request';
import { useGetIngredients } from '../lib/useGetIngredients';
import { Filters, getFiltersObject } from '../components/Filters';
import {
  type Action,
  type CreateFoodPayload,
  type Flavor,
  type Food,
  type Route,
  type Temperature,
  type Type,
} from '../lib/types';
import { useSearchParams } from 'react-router';
import { match, P } from 'ts-pattern';
import {
  getFoodActionNameById,
  getFoodFlavorNameById,
  getFoodRouteNameById,
} from '../lib';
import { FoodForm } from '@/components/FoodForm';
import React from 'react';
import { Button } from '@/components/ui/button';

const emptyFood: CreateFoodPayload = {
  name: '',
  type_id: 0,
  temperature_id: 0,
  food_route_ids: [],
  food_action_ids: [],
  food_flavor_ids: [],
};

const tableHeaders = [
  'Name',
  'Temperature',
  'Routes',
  'Type',
  'Actions',
  'Flavors',
  'Edit',
] as const;

type Mode =
  | { type: 'create'; food: CreateFoodPayload }
  | { type: 'update'; food: Food }
  | { type: 'view' };

export function AdminPage() {
  const [mode, setMode] = useState<Mode>({ type: 'view' });
  const [searchParams] = useSearchParams();
  const params = getFiltersObject(searchParams);

  const { data } = useGetIngredients();
  const queryClient = useQueryClient();

  const foodsQuery = useQuery({
    queryKey: ['foods', params],
    queryFn: () => fetchData<Food[]>('foods', params),
  });

  const updateMutation = useMutation({
    mutationFn: async (food: Food) => {
      const formData = new FormData();
      formData.append('name', food.name);
      formData.append('temperature', food.temperature_id.toString());
      formData.append('type', food.type_id.toString());

      const actionIds = food.food_action_ids.join(',');
      formData.append('actionIds', actionIds);

      const flavorIds = food.food_flavor_ids.join(',');
      formData.append('flavorIds', flavorIds);

      const routeIds = food.food_route_ids.join(',');
      formData.append('routeIds', routeIds);

      return patchData(`foods/${food.id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['foods']);
      setMode({ type: 'view' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (food: CreateFoodPayload) => {
      const formData = new FormData();
      formData.append('name', food.name);
      formData.append('temperature', food.temperature_id.toString());
      formData.append('type', food.type_id.toString());

      const actionIds = food.food_action_ids.join(',');
      formData.append('actionIds', actionIds);

      const flavorIds = food.food_flavor_ids.join(',');
      formData.append('flavorIds', flavorIds);

      const routeIds = food.food_route_ids.join(',');
      formData.append('routeIds', routeIds);

      return postData('foods', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['foods']);
      setMode({ type: 'view' });
    },
  });

  function handleRowEditClick(food: Food) {
    setMode({ type: 'update', food });
  }

  function handleCreateClick() {
    setMode({ type: 'create', food: emptyFood });
  }

  function handleCancelClick() {
    setMode({ type: 'view' });
  }

  function handleSubmitCreate() {
    if (mode.type === 'create') {
      createMutation.mutate(mode.food);
    }
  }

  function handleSaveClick() {
    if (mode.type === 'update') {
      updateMutation.mutate(mode.food);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 flex-wrap bg-gray-100 h-full overflow-y-auto">
        <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
          <Filters {...data} />
          {match(mode)
            .with({ type: 'view' }, () => null)
            .otherwise((mode) => (
              <Dialog
                title={match(mode.type)
                  .with('create', () => 'Add New Food')
                  .with('update', () => 'Edit Food')
                  .exhaustive()}
                onClose={handleCancelClick}
              >
                <FoodForm
                  mode={mode}
                  routes={data.routes ?? []}
                  types={data.types ?? []}
                  flavors={data.flavors ?? []}
                  temperatures={data.temperatures ?? []}
                  actions={data.actions ?? []}
                  onCancel={handleCancelClick}
                  onSubmit={handleSaveClick}
                />
              </Dialog>
            ))}

          <Button
            variant="default"
            className="w-full"
            onClick={handleCreateClick}
          >
            New Item
          </Button>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full  ">
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
                  .with({ isLoading: true }, () => <LoadingTable />)
                  .with({ isError: true, error: P.select() }, (error) => (
                    <ErrorTable error={String(error)} />
                  ))
                  .with(
                    { isError: false, isLoading: false, isSuccess: true },
                    ({ data: foods }) =>
                      foods.map((food) => (
                        <React.Fragment key={food.id}>
                          <FoodRow
                            food={food}
                            types={data.types}
                            routes={data.routes}
                            actions={data.actions}
                            flavors={data.flavors}
                            temperatures={data.temperatures}
                            onEdit={handleRowEditClick}
                          />
                        </React.Fragment>
                      ))
                  )
                  .otherwise(() => null)}
              </tbody>
            </table>
          </div>
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
  onEdit,
}: {
  food: Food;
  routes: Route[] | undefined;
  actions: Action[] | undefined;
  flavors: Flavor[] | undefined;
  temperatures: Temperature[] | undefined;
  types: Type[] | undefined;
  onEdit: (food: Food) => void;
}) {
  return (
    <tr key={food.id}>
      <td className="border p-2">{food.name}</td>
      <td className="border p-2">
        {temperatures?.find((t) => t.id === food.temperature_id)?.name}
      </td>
      <td className="border p-2">
        {food.food_route_ids.map(getFoodRouteNameById(routes)).join(', ')}
      </td>
      <td className="border p-2">
        {types?.find((t) => t.id === food.type_id)?.name}
      </td>
      <td className="border p-2">
        {food.food_action_ids.map(getFoodActionNameById(actions)).join(', ')}
      </td>
      <td className="border p-2">
        {food.food_flavor_ids.map(getFoodFlavorNameById(flavors)).join(', ')}
      </td>
      <td className="border p-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(food)}>
            Edit
          </Button>
        </div>
      </td>
    </tr>
  );
}

function LoadingTable() {
  return (
    <tr>
      <td colSpan={tableHeaders.length} className="border p-2">
        <div className="flex flex-row w-full justify-center items-center">
          Loading...
        </div>
      </td>
    </tr>
  );
}

function ErrorTable({ error }: { error: string }) {
  return (
    <tr>
      <td colSpan={tableHeaders.length} className="border p-2">
        Error loading foods
      </td>
      <td>{error}</td>
    </tr>
  );
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-2 flex items-center justify-center bg-slate-500/50 ">
      <dialog
        open
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inset-0 z-2 flex items-center justify-center bg-black bg-opacity-40 rounded-lg"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 min-w-[450px] max-w-lg w-full relative flex flex-col gap-5">
          <div className="flex">
            <h2 className="text-xl">{title}</h2>
            <button
              className="text-gray-500 hover:text-gray-700 text-2xl ml-auto"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </div>
  );
}
