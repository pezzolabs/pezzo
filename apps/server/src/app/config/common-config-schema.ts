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
  OPENSEARCH_URL: Joi.string().required(),
  OPENSEARCH_AUTH: Joi.string().valid("insecure", "aws").default("insecure"),
  TESTER_OPENAI_API_KEY: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  REDIS_TLS_ENABLED: Joi.boolean().default(false),
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
