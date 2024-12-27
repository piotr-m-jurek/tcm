import { UserItem } from "../../db/mappers";

export function FoodItem({ item }: { item: UserItem; }) {
    return (
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
    );
}

