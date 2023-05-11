import { CodegenConfig } from "@graphql-codegen/cli";

const OFFLINE =
  process.env.OFFLINE === "true" || process.env.GITHUB_ACTIONS === "true";

const schema = OFFLINE
  ? "../../apps/server/src/schema.graphql"
  : "http://localhost:3000/graphql";

const config: CodegenConfig = {
  schema,
  documents: ["**/*.{ts,tsx}", "../**/*.{ts,tsx}", "../../apps/**/*.{ts,tsx}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
    "../client/src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
