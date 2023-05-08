import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
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
