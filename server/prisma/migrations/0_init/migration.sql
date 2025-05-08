-- CreateTable
CREATE TABLE "action" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "flavor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "symbol" TEXT
);

-- CreateTable
CREATE TABLE "food" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type_id" INTEGER,
    "temperature_id" INTEGER,
    CONSTRAINT "food_temperature_id_fkey" FOREIGN KEY ("temperature_id") REFERENCES "temperature" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "food_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "route" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "temperature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "symbol" TEXT
);

-- CreateTable
CREATE TABLE "type" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "food-actions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "food_id" INTEGER,
    "action_id" INTEGER,
    CONSTRAINT "food-actions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "action" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "food-actions_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "food-flavors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "food_id" INTEGER,
    "flavor_id" INTEGER,
    CONSTRAINT "food-flavors_flavor_id_fkey" FOREIGN KEY ("flavor_id") REFERENCES "flavor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "food-flavors_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "food-routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_id" INTEGER,
    "food_id" INTEGER,
    CONSTRAINT "food-routes_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "route" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "food-routes_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "food" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "action_name_unique" ON "action"("name");

-- CreateIndex
CREATE UNIQUE INDEX "flavor_name_unique" ON "flavor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "flavor_symbol_unique" ON "flavor"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "route_name_unique" ON "route"("name");

-- CreateIndex
CREATE UNIQUE INDEX "route_short_name_unique" ON "route"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "temperature_name_unique" ON "temperature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "temperature_symbol_unique" ON "temperature"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "type_name_unique" ON "type"("name");

