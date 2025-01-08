import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

import {
  actions,
  foods,
  types,
  flavors,
  temperatures,
  routes,
  foodRoutes,
  foodActions,
  foodFlavors,
} from '../seeds';

async function main() {
  actions.forEach((action) =>
    client.action.upsert({
      where: { id: action.id },
      update: {},
      create: { name: action.name, id: action.id },
    })
  );

  foods.forEach((food) =>
    client.food.upsert({
      where: { id: food.id },
      update: {},
      create: {
        id: food.id,
        name: food.name,
        temperature_id: food.temperature,
        type_id: food.type,
      },
    })
  );

  types.forEach((food) =>
    client.type.upsert({ where: { id: food.id }, update: {}, create: food })
  );

  flavors.forEach((flavor) =>
    client.flavor.upsert({
      where: { id: flavor.id },
      update: {},
      create: {
        id: flavor.id,
        name: flavor.name,
      },
    })
  );

  temperatures.forEach((temperature) =>
    client.temperature.upsert({
      where: { id: temperature.id },
      update: {},
      create: {
        id: temperature.id,
        name: temperature.name,
      },
    })
  );

  routes.forEach((route) =>
    client.route.upsert({
      where: { id: route.id },
      update: {},
      create: {
        id: route.id,
        name: route.name,
        short_name: route.shortName,
      },
    })
  );

  foodRoutes.forEach((foodRoute) =>
    client.food_routes.upsert({
      where: { id: foodRoute.id },
      update: {},
      create: foodRoute,
    })
  );

  foodActions.forEach((foodAction) =>
    client.food_actions.upsert({
      where: { id: foodAction.id },
      update: {},
      create: foodAction,
    })
  );

  foodFlavors.forEach((foodFlavor) =>
    client.food_flavors.upsert({
      where: { id: foodFlavor.id },
      update: {},
      create: foodFlavor,
    })
  );
}

main();
