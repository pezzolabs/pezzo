-- Create table for knex migrations
create table if not exists default.knex_migrations on cluster hacluster
as default.knex_migrations_local
  engine = Distributed('{cluster}', 'default', 'knex_migrations_local', rand());
create table if not exists default.knex_migrations_local on cluster hacluster
(
  id             UUID default generateUUIDv4(),
  name           String,
  batch          Int32,
  migration_time DateTime
)
  engine = MergeTree ORDER BY tuple()
        SETTINGS index_granularity = 8192;


-- Create table for knex migrations lock
create table if not exists default.knex_migrations_lock on cluster hacluster
as default.knex_migrations_lock_local
  engine = Distributed('{cluster}', 'default', 'knex_migrations_lock_local', rand());
create table if not exists default.knex_migrations_lock_local on cluster hacluster
(
  `index` UUID default generateUUIDv4(),
  is_locked Int32
)
  engine = MergeTree ORDER BY tuple()
        SETTINGS index_granularity = 8192;
