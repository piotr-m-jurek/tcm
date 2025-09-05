import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router';
import { Filters, getFiltersObject } from '../components/Filters';
import type { Action, Flavor, Food, Route } from '../lib/types';
import { Layout } from '../components/Layout';
import { fetchData } from '../lib/request';
import { useGetIngredients } from '../lib/useGetIngredients';
import { match, P } from 'ts-pattern';

const tableHeaders = [
  'Name',
  'Temperature',
  'Routes',
  'Type',
  'Actions',
  'Flavors',
] as const;

export function App() {
  const [searchParams] = useSearchParams();
  const params = getFiltersObject(searchParams);

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
      <div className="flex flex-col gap-4 flex-wrap bg-gray-100 min-h-screen">
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
                {match([foodsQuery, ingredientsQuery])
                  .with([{ isError: true }, { isError: true }], () => (
                    <tr>
                      <td colSpan={tableHeaders.length} className="border p-2">
                        Error loading foods
                      </td>
                    </tr>
                  ))
                  .with([{ isLoading: true }, { isLoading: true }], () => (
                    <tr>
                      <td colSpan={tableHeaders.length} className="border p-2">
                        <div className="flex flex-row w-full justify-center items-center">
                          Loading...
                        </div>
                      </td>
                    </tr>
                  ))
                  .with(
                    [
                      { isLoading: false, isError: false, data: P.nonNullable },
                      { isLoading: false, isError: false, data: P.nonNullable },
                    ],
                    ([{ data: food }, { data: data }]) =>
                      food?.map((food) => (
                        <tr key={food.id}>
                          <td className="border p-2">{food.name}</td>
                          <td className="border p-2">
                            {data?.temperatures?.find(
                              (t) => t.id === food.temperature_id
                            )?.name ?? 'undefined temperature'}
                          </td>
                          <td className="border p-2">
                            {food.food_route_ids
                              .map(getRouteName(data?.routes))
                              .join(', ')}
                          </td>
                          <td className="border p-2">
                            {data?.types?.find((t) => t.id === food.type_id)
                              ?.name ?? 'undefined type'}
                          </td>
                          <td className="border p-2">
                            {food.food_action_ids
                              .map(getActionName(data?.actions))
                              .join(', ')}
                          </td>
                          <td className="border p-2">
                            {food.food_flavor_ids
                              .map(getFlavorName(data?.flavors))
                              .join(', ')}
                          </td>
                        </tr>
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

function getFlavorName(flavors: Flavor[] | undefined) {
  return (flavor_id: number) => {
    const found = flavors?.find((f) => f.id === flavor_id);
    return `${found?.name} (${found?.symbol})`;
  };
}

function getActionName(actions: Action[] | undefined) {
  return (action_id: number) => {
    const found = actions?.find((a) => a.id === action_id);
    return found?.name ?? 'undefined action';
  };
}

function getRouteName(routes: Route[] | undefined) {
  return (route_id: number) => {
    const found = routes?.find((r) => r.id === route_id);
    return found?.short_name ?? 'undefined route';
  };
}
