import { CodegenConfig } from "@graphql-codegen/cli";

const OFFLINE =
  process.env.OFFLINE === "true" || process.env.GITHUB_ACTIONS === "true";

const schema = OFFLINE
  ? "./apps/server/schema.graphql"
  : "http://localhost:3000/graphql";

const config: CodegenConfig = {
  schema,
  documents: ["./apps/console/src/app/graphql/definitions/**/*"],
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
  },
};

export default config;
