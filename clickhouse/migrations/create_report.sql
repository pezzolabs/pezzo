create table if not exists default.reports on cluster hacluster
as default.reports_local
  engine = Distributed('{cluster}', 'default', 'reports_local', rand());
CREATE TABLE default.reports_local on cluster hacluster
(
  `id` String,
  `timestamp` DateTime,
  `environment` String,
  `organizationId` String,
  `projectId` String,
  `promptTokens` Float64,
  `completionTokens` Float64,
  `totalTokens` Float64,
  `promptCost` Float64,
  `completionCost` Float64,
  `totalCost` Float64,
  `duration` UInt32,
  `type` String,
  `client` String,
  `clientVersion` String,
  `model` String,
  `provider` String,
  `modelAuthor` String,
  `requestTimestamp` DateTime,
  `requestBody` String,
  `isError` Bool,
  `responseStatusCode` UInt32,
  `responseTimestamp` DateTime,
  `responseBody` String,
  `cacheEnabled` Bool,
  `cacheHit` Bool
)
  ENGINE = ReplicatedMergeTree()
  ORDER BY tuple()
  SETTINGS index_granularity = 8192
