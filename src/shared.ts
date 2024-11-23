import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const routeConstants = {
  root: {
    itemFormData: { routes: 'routes', flavors: 'flavors', actions: 'actions' },
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertNever = (_value: never): void => undefined;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
