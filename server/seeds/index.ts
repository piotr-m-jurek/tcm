import { parse } from '@std/csv';

function trimRowValues(row: string[]) {
  return row.map((v) => v.trim());
}

/**
 * @throws number parsing error
 */
function getNumber(rawId: string): number {
  const id = parseInt(rawId);

  if (!Number.isInteger(id)) {
    throw new Error(`error parsing row ${id}. id is not a number`);
  }
  return id;
}

async function prepareCSV<Type>(
  filename: string,
  cb: (row: string[], index: number) => Type
): Promise<Type[]> {
  const rawRoutes = await Bun.file(filename).text();
  const [, ...data] = parse(rawRoutes);

  return data.map(trimRowValues).map(cb);
}
export const actions = await prepareCSV('./accion.csv', (row) => {
  const [rawId, name] = row;
  const id = getNumber(rawId);
  return { id, name };
});

export const foods = await prepareCSV('./alimento.csv', (row) => {
  const [rawId, rawName, rawType, rawTemperature] = row;
  return {
    id: getNumber(rawId),
    name: rawName,
    type: getNumber(rawType),
    temperature: getNumber(rawTemperature),
  };
});

export const routes = await prepareCSV('./ruta.csv', (row) => {
  const [rawId, shortName, name] = row;
  const id = getNumber(rawId);
  return { id, name: name.trim(), shortName: shortName.trim() };
});

export const flavors = await prepareCSV('./sabor.csv', (row) => {
  const [rawId, name, symbol] = row;
  return {
    id: getNumber(rawId),
    name,
    symbol,
  };
});

export const temperatures = await prepareCSV('./temperaturas.csv', (row) => {
  const [rawId, name, symbol] = row;
  return {
    id: getNumber(rawId),
    name,
    symbol,
  };
});

export const types = await prepareCSV('./tipo.csv', (row) => {
  const [rawId, name] = row;
  return {
    id: getNumber(rawId),
    name,
  };
});

export const foodRoutes = await prepareCSV('./alimento-rutas.csv', (row) => {
  const [rawId, foodId, routeId] = row;
  return {
    id: getNumber(rawId),
    foodId: +foodId,
    routeId: +routeId,
  };
});

export const foodActions = await prepareCSV(
  './alimento-acciones.csv',
  (row) => {
    const [rawId, foodId, actionId] = row;
    return {
      id: getNumber(rawId),
      foodId: +foodId,
      actionId: +actionId,
    };
  }
);

export const foodFlavors = await prepareCSV('./alimento-sabores.csv', (row) => {
  const [rawId, foodId, flavorId] = row;
  return {
    id: getNumber(rawId),
    foodId: +foodId,
    flavorId: +flavorId,
  };
});
