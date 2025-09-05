import type {
  Action,
  CreateFoodPayload,
  Flavor,
  Food,
  Route,
  Temperature,
  Type,
} from '@/lib/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from './ui/multi-select';
import { match } from 'ts-pattern';
import { Button } from './ui/button';
import { useForm, type SubmitHandler } from 'react-hook-form';

export function FoodForm({
  mode,
  routes,
  types,
  flavors,
  temperatures,
  actions,
  onCancel,
  onSubmit,
}: {
  mode:
    | { type: 'create'; food: CreateFoodPayload }
    | { type: 'update'; food: Food };
  routes: Route[];
  flavors: Flavor[];
  types: Type[];
  actions: Action[];
  temperatures: Temperature[];
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const form = useForm<CreateFoodPayload>({
    defaultValues: {
      ...mode.food,
    },
  });
  const onHandleSubmit: SubmitHandler<CreateFoodPayload> = (data) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onHandleSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          disabled={mode.type === 'update'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={mode.type === 'update'}
                  className="w-full"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type_id"
          disabled={mode.type === 'update'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {types?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature_id"
          disabled={mode.type === 'update'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {temperatures?.map((temperature) => (
                    <SelectItem
                      key={temperature.id}
                      value={temperature.id.toString()}
                    >
                      {temperature.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="food_route_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Routes</FormLabel>
              <MultiSelect
                onValuesChange={field.onChange}
                values={field.value.map((id) => id.toString())}
              >
                <FormControl>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select routes..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {routes?.map((route) => (
                      <MultiSelectItem
                        key={route.id}
                        value={route.id.toString()}
                      >
                        {route.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="food_action_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Actions</FormLabel>
              <MultiSelect
                onValuesChange={field.onChange}
                values={field.value.map((id) => id.toString())}
              >
                <FormControl>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select actions..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {actions?.map((action) => (
                      <MultiSelectItem
                        key={action.id}
                        value={action.id.toString()}
                      >
                        {action.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="food_flavor_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Flavors</FormLabel>
              <MultiSelect
                onValuesChange={field.onChange}
                values={field.value.map((id) => id.toString())}
              >
                <FormControl>
                  <MultiSelectTrigger className="w-full">
                    <MultiSelectValue placeholder="Select flavors..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {flavors?.map((flavor) => (
                      <MultiSelectItem
                        key={flavor.id}
                        value={flavor.id.toString()}
                      >
                        {flavor.name}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {match(mode.type)
              .with('create', () => 'Create')
              .with('update', () => 'Save')
              .exhaustive()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
