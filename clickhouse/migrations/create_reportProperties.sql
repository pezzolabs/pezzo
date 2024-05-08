create table if not exists default.reportProperties on cluster hacluster
as default.reportProperties_local
  engine = Distributed('{cluster}', 'default', 'reportProperties_local', rand());
create table if not exists default.reportProperties_local on cluster hacluster
(
  id       String default generateUUIDv4(),
  reportId String,
  key      String,
  value    String
)
  engine = MergeTree ORDER BY tuple()
        SETTINGS index_granularity = 8192;

