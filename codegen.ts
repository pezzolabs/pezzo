import { CodegenConfig } from "@graphql-codegen/cli";

const OFFLINE =
  process.env.OFFLINE === "true" || process.env.GITHUB_ACTIONS === "true";

const schema = OFFLINE
  ? "./apps/server/src/schema.graphql"
  : "http://localhost:3000/graphql";

const config: CodegenConfig = {
  schema,
  documents: ["./libs/**/*.{ts,tsx}", "./apps/**/*.{ts,tsx}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./apps/server/src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
    "./apps/console/src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
    "./libs/integrations/src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
