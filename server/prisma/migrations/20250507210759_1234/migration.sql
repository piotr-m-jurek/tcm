-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_food" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type_id" INTEGER,
    "temperature_id" INTEGER,
    CONSTRAINT "food_temperature_id_fkey" FOREIGN KEY ("temperature_id") REFERENCES "temperature" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "food_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
INSERT INTO "new_food" ("id", "name", "temperature_id", "type_id") SELECT "id", "name", "temperature_id", "type_id" FROM "food";
DROP TABLE "food";
ALTER TABLE "new_food" RENAME TO "food";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
