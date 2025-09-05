import type { Flavor, Temperature, Type, Route, Action } from './types';

import { useQuery } from 'react-query';
import { fetchData } from './request';

export function useGetIngredients() {
  const routesQuery = useQuery({
    queryKey: ['routes'],
    queryFn: () => fetchData<Route[]>('routes'),
  });

  const typesQuery = useQuery({
    queryKey: ['types'],
    queryFn: () => fetchData<Type[]>('types'),
  });

  const temperaturesQuery = useQuery({
    queryKey: ['temperatures'],
    queryFn: () => fetchData<Temperature[]>('temperatures'),
  });

  const actionsQuery = useQuery({
    queryKey: ['actions'],
    queryFn: () => fetchData<Action[]>('actions'),
  });

  const flavorsQuery = useQuery({
    queryKey: ['flavors'],
    queryFn: () => fetchData<Flavor[]>('flavors'),
  });

  return {
    isLoading:
      routesQuery.isLoading ||
      typesQuery.isLoading ||
      temperaturesQuery.isLoading ||
      actionsQuery.isLoading ||
      flavorsQuery.isLoading,

    isError:
      routesQuery.isError ||
      typesQuery.isError ||
      temperaturesQuery.isError ||
      actionsQuery.isError ||
      flavorsQuery.isError,

    data: {
      routes: routesQuery.data,
      types: typesQuery.data,
      temperatures: temperaturesQuery.data,
      actions: actionsQuery.data,
      flavors: flavorsQuery.data,
    },
  };
}
