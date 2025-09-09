import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router';
import { Filters, getFiltersObject } from '../components/Filters';
import type { Food } from '../lib/types';
import { Layout } from '../components/Layout';
import { fetchData } from '../lib/request';
import { useGetIngredients } from '../lib/useGetIngredients';
import { match, P } from 'ts-pattern';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import {
  getFoodActionNameById,
  getFoodFlavorNameById,
  getFoodRouteNameById,
  getFoodTypeNameById,
  getTemperatureNameById,
} from '@/lib';

const tableHeaders = ['Name'] as const;

export function App() {
  const [searchParams] = useSearchParams();
  const params = getFiltersObject(searchParams);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const ingredientsQuery = useGetIngredients();

  const foodsQuery = useQuery({
    queryKey: ['foods', params],
    queryFn: () => fetchData<Food[]>('foods', params),
  });

  if (ingredientsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (ingredientsQuery.isError) {
    return <div>Error loading ingredients</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 flex-wrap bg-gray-100 h-full overflow-y-auto">
        <div className="flex flex-col gap-4 flex-wrap max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-md my-4 w-full">
          {match(ingredientsQuery)
            .with({ isError: true }, () => <div>Error loading ingredients</div>)
            .with({ isLoading: true }, () => <div>Loading...</div>)
            .with(
              {
                isError: false,
                isLoading: false,
                data: P.nonNullable,
              },
              ({ data }) => {
                console.log(data);
                return <Filters data={data} />;
              }
            )
            .otherwise((things) => {
              console.error(things);
              return <>Something fatal happened</>;
            })}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {tableHeaders.map((header) => (
                    <th className="border p-2 whitespace-nowrap" key={header}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {match(foodsQuery)
                  .with({ isError: true }, () => (
                    <tr>
                      <td colSpan={tableHeaders.length} className="border p-2">
                        Error loading foods
                      </td>
                    </tr>
                  ))
                  .with({ isLoading: true }, () => (
                    <tr>
                      <td colSpan={tableHeaders.length} className="border p-2">
                        <div className="flex flex-row w-full justify-center items-center">
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ))
                  .with(
                    {
                      isSuccess: true,
                      isLoading: false,
                      isError: false,
                      data: P.nonNullable.select(),
                    },
                    (food) =>
                      food.map((food) => (
                        <tr key={food.id} onClick={() => setSelectedFood(food)}>
                          <td className="border p-2">{food.name}</td>
                        </tr>
                      ))
                  )
                  .otherwise(() => null)}
              </tbody>
            </table>

            <Dialog
              open={selectedFood !== null}
              onOpenChange={() => setSelectedFood(null)}
            >
              {selectedFood !== null && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{selectedFood!.name}</DialogTitle>
                  </DialogHeader>
                  <FoodDetails
                    food={selectedFood!}
                    data={ingredientsQuery.data}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FoodDetails({
  food,
  data,
}: {
  food: Food;
  data: ReturnType<typeof useGetIngredients>['data'];
}) {
  return (
    <div>
      <div>{getFoodTypeNameById(data.types)(food.type_id)}</div>
      <div>
        {getTemperatureNameById(data.temperatures)(food.temperature_id)}
      </div>

      <div>
        {food.food_route_ids.map(getFoodRouteNameById(data.routes)).join(', ')}
      </div>

      <div>
        {food.food_action_ids
          .map(getFoodActionNameById(data.actions))
          .join(', ')}
      </div>
      <div>
        {food.food_flavor_ids
          .map(getFoodFlavorNameById(data.flavors))
          .join(', ')}
      </div>
    </div>
  );
}

const loadingState = { isLoading: true };
const errorState = { isError: true };
const fetchedState = { isSuccess: true, isLoading: false, isError: false };
