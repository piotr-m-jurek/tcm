import { routes } from '../..';
import { Children } from '../../components/types';
import { cn } from '../../shared/cn';
import { SearchBar } from './SearchBar';

function ExtendedSearch() {
  function Wrapper({ children }: { children: Children }) {
    return (
      <div
        class={cn(
          'has-[.group:checked]:translate-y-0 translate-y-[82%]',
          'flex flex-col gap-3 overflow-auto',
          'bg-amber-50 p-4',
          'fixed left-0 right-0 w-full h-full transform transition-transform duration-300'
        )}
      >
        {children}
      </div>
    );
  }

  function Trigger() {
    return (
      <label class="flex justify-center w-full absolute -mt-6">
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
