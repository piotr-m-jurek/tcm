import { assertNever } from '../shared/assertNever';
import { cn } from '../shared/cn';
import { Children } from './types';

export function Button({
  onClick,
  children,
  variant = 'solid',
  type,
  align = 'left',
}: {
  onClick?: VoidFunction;
  children: Children;
  variant?: 'solid' | 'bordered';
  align?: 'left' | 'center' | 'right';
  type: HTMLButtonElement['type'];
}) {
  const layout = 'flex flex-row';
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-right',
  } satisfies Record<typeof align, string>;
  switch (variant) {
    case 'solid':
      return (
        <button
          class={cn(
            layout,
            alignments[align],
            'rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500'
          )}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      );
    case 'bordered':
      return (
        <button
          class={cn(
            layout,
            alignments[align],
            'rounded border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500'
          )}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      );
    default:
      assertNever(variant);
      return null;
  }
}
