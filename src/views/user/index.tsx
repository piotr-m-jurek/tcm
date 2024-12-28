import { Style } from 'hono/css';
import { Children } from '../../components/types';
import { UserItem } from '../../db/mappers';
import { cn } from '../../shared/cn';
import { state } from '../../shared/state';
import { FoodItem } from './FoodItem';
import { SearchBar } from './SearchBar';
import { graphPaper } from './customCSS';
import { routes } from '../..';

function ExtendedSearch() {
  function Wrapper({ children }: { children: Children }) {
    return (
      <div
        x-bind:class={`${state.advancedSearch} ? "translate-y-0" :"translate-y-[82%]"`}
        class={cn(
          'has-[.group:checked]:translate-y-0 translate-y-[82%]',
          'flex flex-col gap-3 overflow-auto',
          'bg-gray-200 p-4',
          'fixed left-0 right-0 w-full h-full transform transition-transform duration-300'
        )}
      >
        {children}
      </div>
    );
  }

  function Trigger() {
    return (
      <label class="flex justify-center w-full">
        <input class="group" type="checkbox" hidden />
        <i data-lucide="chevrons-up-down" />
      </label>
    );
  }

  return (
    <Wrapper>
      <Trigger />
      <SearchBar />
    </Wrapper>
  );
}

export function UserView() {
  function Wrapper({ children }: { children: Children }) {
    return (
      <div class="relative container mx-auto px-4 py-8 m-1">{children}</div>
    );
  }

  return (
    <div class="flex flex-col w-full">
      <Wrapper>
        <ExtendedSearch />
        <div
          hx-post={routes.userView}
          hx-trigger="load"
          class="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div> Loading ... </div>
        </div>
      </Wrapper>
    </div>
  );
}
