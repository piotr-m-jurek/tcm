import { Children, JSX } from 'hono/jsx';

import type { Children as TypeChildren } from './types';

export function Select({
  children,
  name,
}: {
  children: TypeChildren;
  name: JSX.IntrinsicElements['select']['name'];
}) {
  return (
    <select
      multiple
      name={name}
      class="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm h-contain"
      size={Children.count(Array.isArray(children) ? children : [children])}
    >
      {children}
    </select>
  );
}
export function Option({
  children,
  value,
  name,
}: {
  children: TypeChildren;
  value: JSX.IntrinsicElements['option']['value'];
  name: JSX.IntrinsicElements['option']['name'];
}) {
  return (
    <option name={name} class="p-1" value={value}>
      {children}
    </option>
  );
}
