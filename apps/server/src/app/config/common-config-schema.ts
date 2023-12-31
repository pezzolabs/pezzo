import Joi from "joi";

const commonConfigSchema = {
  PORT: Joi.number().default(3000),
  PEZZO_CLOUD: Joi.boolean().default(false),
  PINO_PRETTIFY: Joi.boolean().default(false),
  DATABASE_URL: Joi.string().required(),
  SUPERTOKENS_CONNECTION_URI: Joi.string().required(),
  SUPERTOKENS_API_KEY: Joi.string().optional(),
  SUPERTOKENS_API_DOMAIN: Joi.string().default("http://localhost:3000"),
  SUPERTOKENS_WEBSITE_DOMAIN: Joi.string().default("http://localhost:4200"),
  CLICKHOUSE_HOST: Joi.string().default("localhost"),
  CLICKHOUSE_PORT: Joi.string().default("8123"),
  CLICKHOUSE_USER: Joi.string().default("default"),
  CLICKHOUSE_PASSWORD: Joi.string().default("default"),
  CLICKHOUSE_PROTOCOL: Joi.string().default("http"),
  REDIS_URL: Joi.string().required(),
  REDIS_TLS_ENABLED: Joi.boolean().default(false),
  KMS_REGION: Joi.string().default("us-east-1"),
  KMS_LOCAL: Joi.boolean().default(true),
  KMS_LOCAL_ENDPOINT: Joi.string().default("http://localhost:9981"),
  KMS_KEY_ARN: Joi.string().default(
    "arn:aws:kms:us-east-1:111122223333:key/demo-master-key"
  ),
};

const cloudConfigSchema = {
  SENDGRID_API_KEY: Joi.string().required(),
  SEGMENT_KEY: Joi.string().required(),
  GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
};

const isCloud = process.env.PEZZO_CLOUD === "true";

export const getConfigSchema = () =>
  Joi.object({
    ...commonConfigSchema,
    ...(isCloud ? cloudConfigSchema : {}),
  });
