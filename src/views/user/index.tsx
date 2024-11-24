import { UserItem } from '../../db/mappers';

export function UserView({ items }: { items: UserItem[] }) {
  return (
    <div class="container mx-auto px-4 py-8">
      {/* <!-- Search Bar --> */}
      <div class="mb-6">
        <input
          type="text"
          placeholder="Search foods..."
          class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* <!-- Filter Options --> */}
      <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* <!-- Category Filter --> */}
        <details>
          <summary>Category</summary>
          <select
            id="category"
            multiple
            class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="grains">Grains</option>
            <option value="protein">Protein</option>
            <option value="dairy">Dairy</option>
          </select>
        </details>

        {/* <!-- Dietary Restrictions Filter --> */}
        <details>
          <summary>Dietary Restrictions</summary>
          <select
            id="dietary"
            multiple
            class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="lactose-free">Lactose-free</option>
            <option value="nut-free">Nut-free</option>
          </select>
        </details>

        {/* <!-- Nutrient Content Filter --> */}
        <details>
          <summary>Nutrient Content</summary>
          <select
            id="nutrient"
            multiple
            class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="high-protein">High Protein</option>
            <option value="low-fat">Low Fat</option>
            <option value="high-fiber">High Fiber</option>
            <option value="low-carb">Low Carb</option>
            <option value="vitamin-rich">Vitamin Rich</option>
          </select>
        </details>

        {/* <!-- Preparation Time Filter --> */}
        <details>
          <summary>Preparation Time</summary>
          <select
            id="prep-time"
            multiple
            class="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="quick">Quick (0-15 min)</option>
            <option value="medium">Medium (15-30 min)</option>
            <option value="long">Long (30+ min)</option>
          </select>
        </details>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* <!-- Food Item 1 --> */}
        {items.map((item) => (
          <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-2">{item.food.name}</h2>
            <p class="text-gray-600 mb-2">Type: {item.type?.name}</p>
            <ul class="text-sm text-gray-700">
              <li>Temperature: {item.temperature?.name}</li>
              <li>Flavors: {item.flavors.map((f) => f.name).join(', ')}</li>
              <li>Routes: {item.routes.map((r) => r.name).join(', ')}</li>
              <li>Actions: {item.actions.map((a) => a.name).join(', ')}</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
