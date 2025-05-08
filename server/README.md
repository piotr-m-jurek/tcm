# tcm

## TODO:

- [ ] Migrate to Prisma

  - [x] Write seeding the db in prisma
  - [x] update migrations to get the three one-to-many connections

- [ ] update data via Admin Panel
- [ ] After configuring all the data (in admin panel) backup and update migration files

- [ ] Legend for different elements

  - [ ] floating button, next to the button with filters

- [ ] (v2) offline access
- [ ] (v2) authentication
- [ ] Makefile with scripts for:
  - purge db and migrations
  - setup fresh db with all the data

## In progress:

## Done

- [ ] seed data script
- [x] backup data script
- [x] user path to user view
- [x] admin path for admin view
- [x] connect db with drizzle
- [x] prepare initial seeds

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
