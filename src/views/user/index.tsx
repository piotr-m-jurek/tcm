import { Children } from '../../components/types';
import { UserItem } from '../../db/mappers';
import { cn } from '../../shared/cn';
import { FoodItem } from './FoodItem';
import { SearchBar } from './SearchBar';

function ExtendedSearch() {
  function Wrapper({ children }: { children: Children }) {
    return (
      <div
        x-bind:class='open ? "translate-y-0" :"translate-y-[82%]"'
        class={cn(
          'flex flex-col gap-3',
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
      <div class="w-full flex justify-center" x-on:click="open = !open">
        <i data-lucide="chevrons-up-down" />
      </div>
    );
  }

  return (
    <>
      <Wrapper>
        <div class="flex justify-center w-full">
          <Trigger />
        </div>
        <SearchBar />
      </Wrapper>
    </>
  );
}

export function UserView({ items }: { items: UserItem[] }) {
  function Wrapper({ children }: { children: Children }) {
    return (
      <div
        x-data="{ open: false }"
        class="relative bg-slate-100 container mx-auto px-4 py-8 m-1"
      >
        {children}
      </div>
    );
  }

  function ChildrenWrapper({ children }: { children: Children }) {
    return (
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    );
  }

  return (
    <Wrapper>
      <ExtendedSearch />
      <ChildrenWrapper>
        {items.map((item) => (
          <FoodItem item={item} />
        ))}
      </ChildrenWrapper>
    </Wrapper>
  );
}
