import { CodegenConfig } from "@graphql-codegen/cli";

const GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === "true";

const schema = GITHUB_ACTIONS ? "../../apps/server/src/schema.graphql" : "http://localhost:3000/graphql";

const config: CodegenConfig = {
  schema,
  documents: ["**/*.{ts,tsx}", "../**/*.{ts,tsx}", "../../apps/**/*.{ts,tsx}"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/@generated/graphql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
