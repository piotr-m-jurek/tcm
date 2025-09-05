import { useSearchParams } from 'react-router';
import { useState } from 'react';
import type { useGetIngredients } from '@/lib/useGetIngredients';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from './ui/multi-select';
import {
  useForm,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';
import { match } from 'ts-pattern';

export const getFiltersObject = (params: URLSearchParams) => {
  const type = params.get('type') ?? undefined;
  const temperature = params.get('temperature') ?? undefined;
  const routeIds = params.get('routeIds') ?? undefined;
  const actionIds = params.get('actionIds') ?? undefined;
  const flavorIds = params.get('flavorIds') ?? undefined;
  return { type, temperature, routeIds, actionIds, flavorIds };
};

type Filters = {
  type: string[];
  temperature: string[];
  routeIds: string[];
  actionIds: string[];
  flavorIds: string[];
};

function parseParams(params: URLSearchParams): Filters {
  return {
    type: params.get('type')?.split(',') ?? [],
    temperature: params.get('temperature')?.split(',') ?? [],
    routeIds: params.get('routeIds')?.split(',') ?? [],
    actionIds: params.get('actionIds')?.split(',') ?? [],
    flavorIds: params.get('flavorIds')?.split(',') ?? [],
  };
}

function serializeParams(filters: Filters): URLSearchParams {
  const newParams = new URLSearchParams();

  Object.entries(filters)
    .filter(([_, value]) => value.length > 0)
    .forEach(([key, value]) => {
      if (value.length === 0) {
        return;
      }
      newParams.set(key, value.join(','));
    });

  console.log('new params', newParams);
  return newParams;
}

export const Filters = ({
  data: { types, temperatures, routes, actions, flavors },
}: {
  data: ReturnType<typeof useGetIngredients>['data'];
}) => {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const defaultValues = parseParams(
    new URLSearchParams(window.location.search)
  );
  console.log('default values', defaultValues);
  const form = useForm<Filters>({
    defaultValues: defaultValues,
  });

  const onSubmit = (data: Filters) =>
    setParams(serializeParams(data), { replace: true });

  return (
    <>
      <div
        className="cursor-pointer flex items-center justify-center gap-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        {match(open)
          .with(true, () => <ChevronUpIcon />)
          .with(false, () => <ChevronDownIcon />)
          .exhaustive()}
      </div>
      <div
        className={`w-full sm:justify-between sticky top-0 bg-white overflow-hidden ${
          open ? 'h-auto' : 'h-0'
        }`}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row gap-2"
          >
            <FilterMultiSelect
              form={form}
              name="type"
              label="Type"
              data={types ?? []}
              onChange={form.handleSubmit(onSubmit)}
            />
            <FilterMultiSelect
              form={form}
              name="temperature"
              label="Temperature"
              data={temperatures ?? []}
              onChange={form.handleSubmit(onSubmit)}
            />
            <FilterMultiSelect
              form={form}
              name="routeIds"
              label="Routes"
              data={routes ?? []}
              onChange={form.handleSubmit(onSubmit)}
            />
            <FilterMultiSelect
              form={form}
              name="actionIds"
              label="Actions"
              data={actions ?? []}
              onChange={form.handleSubmit(onSubmit)}
            />
            <FilterMultiSelect
              form={form}
              name="flavorIds"
              label="Flavors"
              data={flavors ?? []}
              onChange={form.handleSubmit(onSubmit)}
            />
          </form>
        </Form>
      </div>
    </>
  );
};

function FilterMultiSelect<
  FormValues extends FieldValues,
  T extends { id: number; name: string }
>({
  form,
  name,
  label,
  data,
  onChange,
}: {
  form: UseFormReturn<FormValues>;
  name: Path<FormValues>;
  label: string;
  data: T[];
  onChange: () => void;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            onValuesChange={(values) => {
              field.onChange(values);
              onChange();
            }}
            defaultValues={field.value}
          >
            <FormControl>
              <MultiSelectTrigger>
                <MultiSelectValue placeholder={`Select ${label}...`} />
              </MultiSelectTrigger>
            </FormControl>

            <MultiSelectContent>
              <MultiSelectGroup>
                {data?.map((item) => (
                  <MultiSelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </MultiSelectItem>
                ))}
              </MultiSelectGroup>
            </MultiSelectContent>
          </MultiSelect>
        </FormItem>
      )}
    />
  );
}
