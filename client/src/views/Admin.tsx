import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Layout } from '../components/Layout';
import { fetchData, patchData, postData } from '../lib/request';
import { useGetIngredients } from '../lib/useGetIngredients';
import { Filters, getFiltersObject } from '../components/Filters';
import { type CreateFoodPayload, type Food } from '../lib/types';
import { useSearchParams } from 'react-router';
import { match, P } from 'ts-pattern';
import {
  foodToFormData,
  getFoodActionNameById,
  getFoodFlavorNameById,
  getFoodRouteNameById,
  getFoodTypeNameById,
  getTemperatureNameById,
} from '../lib';
import { FoodForm } from '@/components/FoodForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';

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
      const formData = foodToFormData(food);
      return patchData(`foods/${food.id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['foods']);
      setMode({ type: 'view' });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (food: CreateFoodPayload) => {
      const formData = foodToFormData(food);
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

  function handleFoodFormSubmit() {
    if (mode.type === 'create') {
      createMutation.mutate(mode.food);
      return;
    }
    if (mode.type === 'update') {
      updateMutation.mutate(mode.food);
      return;
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 flex-wrap bg-gray-100 h-full overflow-y-auto">
        <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4">
          <Filters data={data} />
          {match(mode)
            .with({ type: 'view' }, () => null)
            .otherwise((mode) => (
              <Dialog open onOpenChange={handleCancelClick}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {match(mode.type)
                        .with('create', () => 'Add New Food')
                        .with('update', () => 'Edit Food')
                        .exhaustive()}
                    </DialogTitle>
                  </DialogHeader>
                  <FoodForm
                    mode={mode}
                    data={data}
                    onCancel={handleCancelClick}
                    onSubmit={handleFoodFormSubmit}
                  />
                </DialogContent>
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
            <table className="w-full">
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
                        <FoodRow
                          food={food}
                          data={data}
                          onEdit={handleRowEditClick}
                          key={food.id}
                        />
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
  data: { routes, actions, flavors, temperatures, types },
  onEdit,
}: {
  food: Food;
  data: ReturnType<typeof useGetIngredients>['data'];
  onEdit: (food: Food) => void;
}) {
  return (
    <tr key={food.id}>
      <td className="border p-2">{food.name}</td>
      <td className="border p-2">
        {getTemperatureNameById(temperatures)(food.temperature_id) ??
          'undefined temperature'}
      </td>
      <td className="border p-2">
        {food.food_route_ids.map(getFoodRouteNameById(routes)).join(', ')}
      </td>
      <td className="border p-2">
        {getFoodTypeNameById(types)(food.type_id) ?? 'undefined type'}
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
