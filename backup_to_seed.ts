import { readdir } from 'node:fs/promises';

const mapping: Record<string, string> = {
  'food-actions.csv': 'alimento-acciones.csv',
  'food-routes.csv': 'alimento-rutas.csv',
  'food-flavors.csv': 'alimento-sabores.csv',
};

async function run() {
  const directory = './backup';
  const backupDirectory = await readdir(directory);
  backupDirectory.forEach((filename) => {
    if (!mapping?.[filename]) {
      return;
    }
    const file = Bun.file(`${directory}/${filename}`);
    Bun.write(`./seeds/${mapping[filename]}`, file);
  });
}

await run();
