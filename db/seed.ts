import 'dotenv/config';
import * as schema from './schema.ts';
import { parse } from '@std/csv';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database(process.env.DB_FILE_NAME);
const db = drizzle(sqlite);

const trimRowValues = (row: string[]) => row.map((v) => v.trim());

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

await db.insert(schema.action).values(
  await prepareCSV('./seeds/accion.csv', (row) => {
    const [rawId, name] = row;
    const id = getNumber(rawId);
    return { id, name };
  })
);

await db.insert(schema.foodList).values(
  await prepareCSV('./seeds/alimento.csv', (row) => {
    const [rawId, rawName, rawType, rawTemperature] = row;
    return {
      id: getNumber(rawId),
      name: rawName,
      type: getNumber(rawType),
      temperature: getNumber(rawTemperature),
    };
  })
);

await db.insert(schema.route).values(
  await prepareCSV('./seeds/ruta.csv', (row) => {
    const [rawId, shortName, name] = row;
    const id = getNumber(rawId);
    return { id, name: name.trim(), shortName: shortName.trim() };
  })
);

await db.insert(schema.flavor).values(
  await prepareCSV('./seeds/sabor.csv', (row) => {
    const [rawId, name, symbol] = row;
    return {
      id: getNumber(rawId),
      name,
      symbol,
    };
  })
);

await db.insert(schema.temperature).values(
  await prepareCSV('./seeds/temperaturas.csv', (row) => {
    const [rawId, name, symbol] = row;
    return {
      id: getNumber(rawId),
      name,
      symbol,
    };
  })
);

await db.insert(schema.type).values(
  await prepareCSV('./seeds/tipo.csv', (row) => {
    const [rawId, name] = row;
    return {
      id: getNumber(rawId),
      name,
    };
  })
);
