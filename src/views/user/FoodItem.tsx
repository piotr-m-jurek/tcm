import { html } from 'hono/html';
import { UserItem } from '../../db/mappers';

const displayFlavor = (flavor: UserItem['flavors'][number]) =>
  `${flavor.name} (${flavor.symbol})`.trim();

const displayRoute = (route: UserItem['routes'][number]) =>
  html`${route.name} (${route.shortName})`;

const displayAction = (route: UserItem['actions'][number]) =>
  `${route.name}`.trim();

export function FoodItem({ item }: { item: UserItem }) {
  if (item.food.id === 1) {
    console.log(JSON.stringify(item, null, 2));
  }
  const type = item.type ?? 'unknown type';
  const name = item.food.name;
  const temperature = item.temperature ?? 'unknown temperature';
  const flavor = item.flavors.map(displayFlavor).join(', ');
  const affects = item.routes.map(displayRoute).join(', ');
  const energeticEffects = item.actions.map(displayAction).join(', ');
  return (
    <div className="max-w-md w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-mono font-semibold text-gray-800">
          Food Item Card
        </h2>
      </div>
      <div className="p-4 font-mono">
        <div className="mb-2">
          <span className="font-bold">Name:</span> {name}
        </div>
        <div className="mb-2">
          <span className="font-bold">Type:</span> {type}
        </div>
        <div className="mb-2">
          <span className="font-bold">Temperature:</span> {temperature}
        </div>
        <div className="mb-2">
          <span className="font-bold">Flavor:</span> {flavor}
        </div>
        <div className="mb-2">
          <span className="font-bold">Affects:</span> {affects}
        </div>
        <div className="mb-2">
          <span className="font-bold">Energetic Effects:</span>{' '}
          {energeticEffects}
        </div>
      </div>
    </div>
  );
}
